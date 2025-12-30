"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { Message, LearningPlan, LearningProgressItem, LearningSettings } from "@/types";
import { parseNotes } from "@/lib/parse-notes";
import { getNotes, savePlan, getPlan, saveMessages, getMessages, updateSceneProgress, getSettings } from "@/lib/storage";
import { generateOpeningMessage } from "@/lib/prompts";
import { generateId } from "@/lib/utils";
import { TodoPanel } from "@/components/TodoPanel";
import { ChatInterface } from "@/components/ChatInterface";
import { ChatInput } from "@/components/ChatInput";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [settings, setSettings] = useState<LearningSettings>({
    enableTranslation: true,
    englishLevel: 3,
  });

  const currentScene = plan?.scenes[currentSceneIndex];

  // 处理工具调用返回的进度更新
  const handleProgressUpdate = useCallback((progressData: LearningProgressItem[]) => {
    if (!plan) return;

    const updatedScenes = plan.scenes.map((scene) => {
      const progressItem = progressData.find((p) => p.scene === scene.name);
      if (progressItem) {
        return {
          ...scene,
          completed: progressItem.status === "completed",
          roundCount: progressItem.status === "completed" ? 5 : scene.roundCount,
        };
      }
      return scene;
    });

    // 找到当前进行中的场景
    const inProgressIndex = progressData.findIndex((p) => p.status === "in_progress");
    const newCurrentIndex = inProgressIndex >= 0 
      ? plan.scenes.findIndex((s) => s.name === progressData[inProgressIndex].scene)
      : currentSceneIndex;

    // 检查是否所有场景都完成了
    const allDone = progressData.every((p) => p.status === "completed");

    const updatedPlan: LearningPlan = {
      ...plan,
      scenes: updatedScenes,
      currentSceneIndex: newCurrentIndex >= 0 ? newCurrentIndex : currentSceneIndex,
    };

    setPlan(updatedPlan);
    savePlan(updatedPlan);

    if (newCurrentIndex !== currentSceneIndex && newCurrentIndex >= 0) {
      setCurrentSceneIndex(newCurrentIndex);
      setRoundCount(0);
    }

    if (allDone) {
      setAllCompleted(true);
    }
  }, [plan, currentSceneIndex]);

  // AI Chat hook
  const {
    messages: aiMessages,
    isLoading,
    append,
    setMessages: setAiMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      scene: currentScene,
      roundCount,
      allScenes: plan?.scenes || [],
      settings,
    },
    onToolCall: async ({ toolCall }) => {
      // 处理工具调用
      if (toolCall.toolName === "update_progress") {
        const args = toolCall.args as { progress: LearningProgressItem[] };
        if (args.progress) {
          handleProgressUpdate(args.progress);
        }
        return args.progress;
      }
    },
    onFinish: (message) => {
      // 只保存有内容的消息
      if (message.content) {
        const newMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: message.content,
          timestamp: new Date().toISOString(),
        };
        setLocalMessages((prev) => {
          const updated = [...prev, newMessage];
          saveMessages(updated);
          return updated;
        });

        // 增加轮次计数
        const newRoundCount = roundCount + 1;
        setRoundCount(newRoundCount);
      }
    },
  });

  // 初始化
  useEffect(() => {
    const notes = getNotes();
    if (!notes) {
      router.push("/");
      return;
    }

    // 加载用户设置
    const savedSettings = getSettings();
    setSettings(savedSettings);

    // 尝试获取已保存的计划
    let existingPlan = getPlan();
    
    if (!existingPlan) {
      // 解析笔记生成新计划
      existingPlan = parseNotes(notes);
      savePlan(existingPlan);
    }

    setPlan(existingPlan);
    setCurrentSceneIndex(existingPlan.currentSceneIndex);

    // 获取已保存的消息
    const savedMessages = getMessages();
    if (savedMessages.length > 0) {
      setLocalMessages(savedMessages);
      // 计算当前轮次
      const assistantMessages = savedMessages.filter((m) => m.role === "assistant");
      setRoundCount(assistantMessages.length % 5);
    }

    setIsInitialized(true);
  }, [router]);

  // 发送开场白
  useEffect(() => {
    if (isInitialized && plan && localMessages.length === 0 && currentScene) {
      const openingMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: generateOpeningMessage(currentScene),
        timestamp: new Date().toISOString(),
      };
      setLocalMessages([openingMessage]);
      saveMessages([openingMessage]);

      // 触发 AI 发送第一个问题
      setTimeout(() => {
        append({
          role: "user",
          content: "请开始提问",
        });
      }, 500);
    }
  }, [isInitialized, plan, currentScene, localMessages.length, append]);

  // 更新场景进度（同步到 localStorage）
  useEffect(() => {
    if (plan && currentSceneIndex >= 0) {
      updateSceneProgress(currentSceneIndex, roundCount, roundCount >= 5);
    }
  }, [plan, currentSceneIndex, roundCount]);

  // 处理用户发送消息
  const handleSendMessage = (content: string) => {
    // 添加用户消息到本地
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setLocalMessages((prev) => {
      const updated = [...prev, userMessage];
      saveMessages(updated);
      return updated;
    });

    // 发送给 AI
    append({
      role: "user",
      content,
    });
  };

  // 重新开始
  const handleRestart = () => {
    localStorage.removeItem("english-learning-plan");
    localStorage.removeItem("english-chat-messages");
    localStorage.removeItem("english-chat-state");
    router.push("/");
  };

  // 获取流式内容
  const streamingContent = aiMessages.length > 0 && isLoading
    ? aiMessages[aiMessages.length - 1]?.content
    : undefined;

  if (!isInitialized || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">返回</span>
          </button>
          <h1 className="font-semibold">英语学习对话</h1>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">重新开始</span>
          </button>
        </div>
      </header>

      {/* Todo Panel */}
      <TodoPanel
        scenes={plan.scenes}
        currentSceneIndex={currentSceneIndex}
      />

      {/* Chat Interface */}
      <ChatInterface
        messages={localMessages}
        isLoading={isLoading}
        streamingContent={streamingContent}
      />

      {/* Chat Input */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isLoading || allCompleted}
        placeholder={
          allCompleted
            ? "所有场景已完成！"
            : `回答关于"${currentScene?.name || ""}"的问题...`
        }
      />
    </div>
  );
}


"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { Message, LearningPlan, Scene } from "@/types";
import { parseNotes } from "@/lib/parse-notes";
import { getNotes, savePlan, getPlan, saveMessages, getMessages, updateSceneProgress } from "@/lib/storage";
import { generateOpeningMessage, generateSceneTransitionMessage, generateCompletionMessage } from "@/lib/prompts";
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

  const currentScene = plan?.scenes[currentSceneIndex];

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
    },
    onFinish: (message) => {
      // 保存 AI 回复到本地消息
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

      // 检查是否需要切换场景
      if (newRoundCount >= 5 && plan) {
        handleSceneComplete();
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

  // 处理场景完成
  const handleSceneComplete = useCallback(() => {
    if (!plan) return;

    // 更新场景状态
    const updatedScenes = [...plan.scenes];
    updatedScenes[currentSceneIndex].completed = true;
    updatedScenes[currentSceneIndex].roundCount = 5;

    // 检查是否还有下一个场景
    const nextSceneIndex = currentSceneIndex + 1;
    
    if (nextSceneIndex < updatedScenes.length) {
      // 切换到下一个场景
      const updatedPlan: LearningPlan = {
        ...plan,
        scenes: updatedScenes,
        currentSceneIndex: nextSceneIndex,
      };
      setPlan(updatedPlan);
      savePlan(updatedPlan);
      setCurrentSceneIndex(nextSceneIndex);
      setRoundCount(0);

      // 添加场景切换消息
      const transitionMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: generateSceneTransitionMessage(
          plan.scenes[currentSceneIndex],
          plan.scenes[nextSceneIndex]
        ),
        timestamp: new Date().toISOString(),
      };
      setLocalMessages((prev) => {
        const updated = [...prev, transitionMessage];
        saveMessages(updated);
        return updated;
      });

      // 清空 AI 消息并开始新场景
      setAiMessages([]);
      setTimeout(() => {
        append({
          role: "user",
          content: "请开始新场景的提问",
        });
      }, 1000);
    } else {
      // 所有场景完成
      setAllCompleted(true);
      const completionMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: generateCompletionMessage(),
        timestamp: new Date().toISOString(),
      };
      setLocalMessages((prev) => {
        const updated = [...prev, completionMessage];
        saveMessages(updated);
        return updated;
      });

      // 更新最终计划状态
      const finalPlan: LearningPlan = {
        ...plan,
        scenes: updatedScenes,
      };
      savePlan(finalPlan);
      setPlan(finalPlan);
    }
  }, [plan, currentSceneIndex, append, setAiMessages]);

  // 更新场景进度
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


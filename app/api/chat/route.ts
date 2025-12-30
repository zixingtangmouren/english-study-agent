import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { generateSystemPrompt } from "@/lib/prompts";
import { Scene, LearningProgressItem, LearningSettings } from "@/types";

// 创建 DeepSeek 客户端（兼容 OpenAI API）
function getDeepSeekClient() {
  return createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseURL: "https://api.deepseek.com",
  });
}

// 定义学习进度管理工具
const updateProgressTool = tool({
  description:
    "更新学习进度。当完成一个场景的对话练习（达到3-5轮）或需要切换到下一个场景时调用此工具。",
  parameters: z.object({
    progress: z
      .array(
        z.object({
          scene: z.string().describe("场景名称"),
          status: z
            .enum(["pending", "in_progress", "completed"])
            .describe(
              "学习状态：pending-未开始，in_progress-进行中，completed-已完成"
            ),
          content: z.string().describe("该场景的学习内容简述"),
        })
      )
      .describe("所有场景的学习进度列表"),
  }),
  execute: async ({ progress }): Promise<LearningProgressItem[]> => {
    // 这个工具的执行结果会被发送到前端
    return progress;
  },
});

export async function POST(request: Request) {
  try {
    const { messages, scene, roundCount, allScenes, settings } =
      await request.json();

    if (!scene) {
      return new Response("Missing scene data", { status: 400 });
    }

    // 检查 API Key 是否配置
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return new Response(
        JSON.stringify({
          error: "请在 .env.local 文件中配置 DEEPSEEK_API_KEY",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const sceneData = scene as Scene;
    const scenesData = (allScenes as Scene[]) || [];
    const settingsData = settings as LearningSettings | undefined;
    const systemPrompt = generateSystemPrompt(
      sceneData,
      roundCount || 0,
      scenesData,
      settingsData
    );

    const deepseek = getDeepSeekClient();

    const result = await streamText({
      model: deepseek("deepseek-chat"),
      system: systemPrompt,
      messages,
      tools: {
        update_progress: updateProgressTool,
      },
      maxSteps: 2, // 允许工具调用后继续生成回复
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    return new Response(
      JSON.stringify({ error: `调用 AI 服务失败: ${errorMessage}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { generateSystemPrompt } from "@/lib/prompts";
import { Scene } from "@/types";

// 创建 DeepSeek 客户端（兼容 OpenAI API）
// 注意：baseURL 不需要包含 /chat/completions，SDK 会自动添加
function getDeepSeekClient() {
  return createOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    baseURL: "https://api.deepseek.com",
  });
}

export async function POST(request: Request) {
  try {
    const { messages, scene, roundCount } = await request.json();

    if (!scene) {
      return new Response("Missing scene data", { status: 400 });
    }

    // 检查 API Key 是否配置
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return new Response(
        JSON.stringify({ error: "请在 .env.local 文件中配置 DEEPSEEK_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const sceneData = scene as Scene;
    const systemPrompt = generateSystemPrompt(sceneData, roundCount || 0);

    const deepseek = getDeepSeekClient();
    
    const result = await streamText({
      model: deepseek("deepseek-chat"),
      system: systemPrompt,
      messages,
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


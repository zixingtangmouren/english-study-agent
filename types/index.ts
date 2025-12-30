// 单词类型
export interface Word {
  english: string;
  chinese: string;
}

// 语法类型
export interface Grammar {
  english: string;
  chinese: string;
}

// 场景类型
export interface Scene {
  id: string;
  name: string;
  words: Word[];
  grammar: Grammar[];
  completed: boolean;
  roundCount: number;
}

// 学习计划类型
export interface LearningPlan {
  scenes: Scene[];
  currentSceneIndex: number;
  createdAt: string;
}

// 消息角色
export type MessageRole = "user" | "assistant" | "system";

// 消息类型
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

// 对话状态
export interface ChatState {
  messages: Message[];
  currentSceneIndex: number;
  roundCount: number;
  isLoading: boolean;
}

// API 响应类型
export interface ParseNotesResponse {
  success: boolean;
  plan?: LearningPlan;
  error?: string;
}

// 场景完成状态
export interface SceneProgress {
  sceneId: string;
  completed: boolean;
  roundCount: number;
}

// 学习进度项（用于工具调用）
export type LearningStatus = "pending" | "in_progress" | "completed";

export interface LearningProgressItem {
  scene: string;
  status: LearningStatus;
  content: string;
}

// 工具调用结果
export interface ToolCallResult {
  type: "update_progress";
  data: LearningProgressItem[];
}

// 英语等级
export type EnglishLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// 用户学习设置
export interface LearningSettings {
  enableTranslation: boolean;
  englishLevel: EnglishLevel;
}

// 等级描述
export const ENGLISH_LEVEL_INFO: Record<EnglishLevel, { stage: string; description: string }> = {
  1: { stage: "基础阶段", description: "小学水平" },
  2: { stage: "基础阶段", description: "小学水平" },
  3: { stage: "基础阶段", description: "初中水平" },
  4: { stage: "提高阶段", description: "高中水平" },
  5: { stage: "提高阶段", description: "大学水平" },
  6: { stage: "提高阶段", description: "大学水平" },
  7: { stage: "熟练阶段", description: "英语专业水平" },
  8: { stage: "熟练阶段", description: "高端外语人才" },
  9: { stage: "熟练阶段", description: "外语专家" },
};


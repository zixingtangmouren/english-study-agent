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


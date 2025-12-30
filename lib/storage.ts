import { LearningPlan, Message, ChatState, LearningSettings } from "@/types";

const STORAGE_KEYS = {
  NOTES: "english-notes",
  PLAN: "english-learning-plan",
  MESSAGES: "english-chat-messages",
  CHAT_STATE: "english-chat-state",
  SETTINGS: "english-learning-settings",
} as const;

// 默认设置
const DEFAULT_SETTINGS: LearningSettings = {
  enableTranslation: true,
  englishLevel: 3, // 初中水平
};

/**
 * 保存英语笔记
 */
export function saveNotes(notes: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.NOTES, notes);
  }
}

/**
 * 获取英语笔记
 */
export function getNotes(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEYS.NOTES);
  }
  return null;
}

/**
 * 保存学习计划
 */
export function savePlan(plan: LearningPlan): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
  }
}

/**
 * 获取学习计划
 */
export function getPlan(): LearningPlan | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.PLAN);
    if (data) {
      try {
        return JSON.parse(data) as LearningPlan;
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * 保存聊天消息
 */
export function saveMessages(messages: Message[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }
}

/**
 * 获取聊天消息
 */
export function getMessages(): Message[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (data) {
      try {
        return JSON.parse(data) as Message[];
      } catch {
        return [];
      }
    }
  }
  return [];
}

/**
 * 保存聊天状态
 */
export function saveChatState(state: Partial<ChatState>): void {
  if (typeof window !== "undefined") {
    const existing = getChatState();
    const updated = { ...existing, ...state };
    localStorage.setItem(STORAGE_KEYS.CHAT_STATE, JSON.stringify(updated));
  }
}

/**
 * 获取聊天状态
 */
export function getChatState(): ChatState {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT_STATE);
    if (data) {
      try {
        return JSON.parse(data) as ChatState;
      } catch {
        // fall through
      }
    }
  }
  return {
    messages: [],
    currentSceneIndex: 0,
    roundCount: 0,
    isLoading: false,
  };
}

/**
 * 更新场景进度
 */
export function updateSceneProgress(sceneIndex: number, roundCount: number, completed: boolean): void {
  const plan = getPlan();
  if (plan && plan.scenes[sceneIndex]) {
    plan.scenes[sceneIndex].roundCount = roundCount;
    plan.scenes[sceneIndex].completed = completed;
    plan.currentSceneIndex = sceneIndex;
    savePlan(plan);
  }
}

/**
 * 保存学习设置
 */
export function saveSettings(settings: LearningSettings): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
}

/**
 * 获取学习设置
 */
export function getSettings(): LearningSettings {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      try {
        return JSON.parse(data) as LearningSettings;
      } catch {
        // fall through
      }
    }
  }
  return DEFAULT_SETTINGS;
}

/**
 * 清除所有学习数据
 */
export function clearAllData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.PLAN);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.CHAT_STATE);
    // 保留设置，不清除
  }
}


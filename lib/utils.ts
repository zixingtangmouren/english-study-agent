import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 获取 API 路径（包含 basePath）
 * 与 next.config.mjs 中的 basePath 保持一致
 */
export function getApiPath(path: string): string {
  // basePath 与 next.config.mjs 中的配置保持一致
  const basePath = "/english-agent";
  // 确保 path 以 / 开头
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // 移除 basePath 末尾的 /（如果有）
  const basePathNormalized = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  return `${basePathNormalized}${normalizedPath}`;
}


"use client";

import { Message } from "@/types";
import { cn, formatTimestamp } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary" : "bg-accent"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-accent-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card border border-border text-card-foreground rounded-tl-sm"
          )}
        >
          <div className={cn(
            "prose prose-sm max-w-none",
            isUser ? "prose-invert" : "prose-neutral dark:prose-invert",
            // 自定义 Markdown 样式
            "[&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
            "[&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5",
            "[&_strong]:font-semibold",
            "[&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm",
            "[&_pre]:bg-black/10 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:overflow-x-auto",
            "[&_blockquote]:border-l-2 [&_blockquote]:border-current [&_blockquote]:pl-3 [&_blockquote]:italic",
            "[&_h1]:text-lg [&_h1]:font-bold [&_h1]:my-2",
            "[&_h2]:text-base [&_h2]:font-bold [&_h2]:my-2",
            "[&_h3]:text-sm [&_h3]:font-bold [&_h3]:my-1"
          )}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
        <span className="text-xs text-muted-foreground px-1">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex gap-3 max-w-[85%] mr-auto", className)}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
        <Bot className="w-4 h-4 text-accent-foreground" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean;
  streamingContent?: string;
}

export function ChatInterface({ messages, isLoading, streamingContent }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>对话将在这里显示...</p>
            <p className="text-sm mt-2">AI 外教正在准备问题</p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Streaming message */}
        {streamingContent && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent-foreground" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border text-card-foreground">
              <div className={cn(
                "prose prose-sm max-w-none prose-neutral dark:prose-invert",
                "[&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
                "[&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5",
                "[&_strong]:font-semibold",
                "[&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm"
              )}>
                <ReactMarkdown>{streamingContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isLoading && !streamingContent && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}


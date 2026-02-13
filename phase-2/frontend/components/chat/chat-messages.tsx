"use client";

/**
 * ChatMessages Component
 * Feature: 006-frontend-chat-ui
 *
 * Message list container with auto-scroll functionality.
 */

import { useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { TypingIndicator } from "./typing-indicator";
import { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  className?: string;
}

export function ChatMessages({
  messages,
  isLoading,
  className = "",
}: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto px-4 py-4 ${className}`}
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-bg-glass-hover flex items-center justify-center">
            <svg
              className="w-8 h-8 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Start a conversation
          </h3>
          <p className="text-sm text-text-secondary max-w-[240px]">
            Ask me to create, list, or manage your tasks using natural language.
          </p>
          <div className="mt-4 space-y-2 text-xs text-text-muted">
            <p>&quot;Create a task to buy groceries&quot;</p>
            <p>&quot;Show me my tasks&quot;</p>
            <p>&quot;Mark the groceries task as done&quot;</p>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          animate={index === messages.length - 1}
        />
      ))}

      {/* Typing indicator */}
      {isLoading && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}

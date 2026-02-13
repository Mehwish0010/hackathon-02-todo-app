"use client";

/**
 * ChatContainer Component
 * Feature: 006-frontend-chat-ui
 *
 * Glassmorphic chat panel with header, messages, and input.
 */

import { forwardRef, ReactNode } from "react";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "@/types/chat";

interface ChatContainerProps {
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  onRetry?: () => void;
  className?: string;
  children?: ReactNode;
}

export const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(
  function ChatContainer(
    {
      messages,
      inputValue,
      isLoading,
      error,
      onInputChange,
      onSubmit,
      onClose,
      onRetry,
      className = "",
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`
          flex flex-col
          w-full sm:w-96
          h-[70vh] sm:h-[500px]
          max-h-[600px]
          bg-bg-glass backdrop-blur-glass
          border border-border-glass
          rounded-glass shadow-glass-lg
          overflow-hidden
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Chat with AI assistant"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-glass bg-bg-glass/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-accent-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                AI Assistant
              </h2>
              <p className="text-xs text-text-secondary">
                {isLoading ? "Thinking..." : "Online"}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-glass-hover transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            aria-label="Close chat"
          >
            <svg
              className="w-5 h-5 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-400">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs text-red-400 hover:text-red-300 underline focus:outline-none"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <ChatMessages messages={messages} isLoading={isLoading} />

        {/* Input */}
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    );
  }
);

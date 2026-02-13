"use client";

/**
 * ChatMessage Component
 * Feature: 006-frontend-chat-ui
 *
 * Individual message bubble with user/assistant styling.
 */

import { useRef, useEffect } from "react";
import { gsap, ANIMATION_DURATION, ANIMATION_EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-animation";
import { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  animate?: boolean;
}

export function ChatMessage({ message, animate = false }: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isUser = message.role === "user";
  const isError = message.status === "error";
  const isSending = message.status === "sending";

  useEffect(() => {
    if (!animate || prefersReducedMotion || !messageRef.current) return;

    gsap.fromTo(
      messageRef.current,
      {
        opacity: 0,
        y: 10,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_DURATION.slow,
        ease: ANIMATION_EASE.out,
      }
    );
  }, [animate, prefersReducedMotion]);

  return (
    <div
      ref={messageRef}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`
          max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl
          ${
            isUser
              ? isError
                ? "bg-red-500/20 border border-red-500/40 text-text-primary"
                : "bg-accent-primary/20 border border-accent-primary/30 text-text-primary"
              : "bg-bg-glass-hover border border-border-glass text-text-primary"
          }
          ${isSending ? "opacity-70" : ""}
        `}
      >
        {/* Message content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {/* Status indicator */}
        {isUser && (
          <div className="flex items-center justify-end mt-1 space-x-1">
            {isSending && (
              <span className="text-xs text-text-muted">Sending...</span>
            )}
            {isError && (
              <span className="text-xs text-red-400">Failed to send</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

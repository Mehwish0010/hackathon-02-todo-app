"use client";

/**
 * ChatButton Component
 * Feature: 006-frontend-chat-ui
 *
 * Floating action button to toggle chat widget.
 */

import { forwardRef } from "react";

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
  className?: string;
}

export const ChatButton = forwardRef<HTMLButtonElement, ChatButtonProps>(
  function ChatButton({ onClick, isOpen, className = "" }, ref) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`
          w-14 h-14 rounded-full
          bg-accent-primary hover:bg-accent-hover
          shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:ring-offset-2 focus:ring-offset-bg-primary
          ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}
          ${className}
        `}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    );
  }
);

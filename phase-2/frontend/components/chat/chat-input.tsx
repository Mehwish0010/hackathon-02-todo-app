"use client";

/**
 * ChatInput Component
 * Feature: 006-frontend-chat-ui
 *
 * Message input field with validation and submit functionality.
 */

import { useRef, useCallback, KeyboardEvent, ChangeEvent } from "react";
import { MAX_MESSAGE_LENGTH } from "@/types/chat";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  disabled = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isOverLimit = value.length > MAX_MESSAGE_LENGTH;
  const isEmpty = value.trim().length === 0;
  const canSubmit = !isEmpty && !isOverLimit && !isLoading && !disabled;

  /**
   * Handle input change with character limit feedback.
   */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  /**
   * Handle key press for Enter submission.
   * Shift+Enter creates a new line.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSubmit) {
          // Debounce rapid submissions
          if (submitTimeoutRef.current) {
            clearTimeout(submitTimeoutRef.current);
          }
          submitTimeoutRef.current = setTimeout(() => {
            onSubmit();
            submitTimeoutRef.current = null;
          }, 100);
        }
      }
    },
    [canSubmit, onSubmit]
  );

  /**
   * Handle submit button click.
   */
  const handleSubmit = useCallback(() => {
    if (canSubmit) {
      // Debounce rapid submissions
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
      submitTimeoutRef.current = setTimeout(() => {
        onSubmit();
        submitTimeoutRef.current = null;
      }, 100);
    }
  }, [canSubmit, onSubmit]);

  /**
   * Focus the input field.
   */
  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Expose focus method
  if (typeof window !== "undefined") {
    (window as unknown as { chatInputFocus?: () => void }).chatInputFocus = focus;
  }

  return (
    <div className="border-t border-border-glass bg-bg-glass/50 p-3">
      <div className="flex items-end space-x-2">
        {/* Input field */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className={`
              w-full resize-none rounded-xl px-4 py-2.5
              bg-bg-elevated border
              ${isOverLimit ? "border-red-500/50" : "border-border-glass"}
              text-text-primary placeholder:text-text-muted
              focus:outline-none focus:ring-2
              ${isOverLimit ? "focus:ring-red-500/30" : "focus:ring-accent-primary/30"}
              focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
              text-sm
              max-h-32 overflow-y-auto
            `}
            aria-label="Type your message"
            aria-describedby={isOverLimit ? "char-limit-error" : undefined}
            style={{
              minHeight: "44px",
              height: "auto",
            }}
            onInput={(e) => {
              // Auto-resize textarea
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />

          {/* Character count */}
          {value.length > MAX_MESSAGE_LENGTH * 0.8 && (
            <div
              id="char-limit-error"
              className={`absolute bottom-1 right-3 text-xs ${
                isOverLimit ? "text-red-400" : "text-text-muted"
              }`}
            >
              {value.length}/{MAX_MESSAGE_LENGTH}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            flex-shrink-0 p-2.5 rounded-xl
            ${
              canSubmit
                ? "bg-accent-primary hover:bg-accent-hover text-white"
                : "bg-bg-elevated text-text-muted cursor-not-allowed"
            }
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent-primary/50
          `}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Error message for character limit */}
      {isOverLimit && (
        <p className="mt-1 text-xs text-red-400">
          Message is too long (max {MAX_MESSAGE_LENGTH} characters)
        </p>
      )}
    </div>
  );
}

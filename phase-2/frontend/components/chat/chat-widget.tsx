"use client";

/**
 * ChatWidget Component
 * Feature: 006-frontend-chat-ui
 *
 * Main chat widget with floating button and expandable chat container.
 * Includes GSAP animations for open/close transitions.
 */

import { useRef, useEffect, useCallback } from "react";
import { gsap, ANIMATION_DURATION, ANIMATION_EASE } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-animation";
import { useChat } from "@/hooks/use-chat";
import { ChatButton } from "./chat-button";
import { ChatContainer } from "./chat-container";

interface ChatWidgetProps {
  className?: string;
}

export function ChatWidget({ className = "" }: ChatWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const {
    messages,
    inputValue,
    isLoading,
    error,
    isOpen,
    historyLoaded,
    setInputValue,
    sendMessage,
    loadHistory,
    toggleOpen,
    setOpen,
    clearError,
    retryLastMessage,
  } = useChat();

  /**
   * Load history when chat opens for the first time.
   */
  useEffect(() => {
    if (isOpen && !historyLoaded) {
      loadHistory();
    }
  }, [isOpen, historyLoaded, loadHistory]);

  /**
   * Animate chat container on open/close.
   */
  useEffect(() => {
    if (!chatContainerRef.current || prefersReducedMotion) {
      // Without animation, just show/hide
      if (chatContainerRef.current) {
        chatContainerRef.current.style.display = isOpen ? "flex" : "none";
      }
      return;
    }

    if (isOpen) {
      // Show and animate in
      chatContainerRef.current.style.display = "flex";
      gsap.fromTo(
        chatContainerRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: ANIMATION_DURATION.slow,
          ease: ANIMATION_EASE.out,
        }
      );
    } else {
      // Animate out and hide
      gsap.to(chatContainerRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: ANIMATION_DURATION.fast,
        ease: ANIMATION_EASE.in,
        onComplete: () => {
          if (chatContainerRef.current) {
            chatContainerRef.current.style.display = "none";
          }
        },
      });
    }
  }, [isOpen, prefersReducedMotion]);

  /**
   * Handle keyboard events for accessibility.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setOpen(false);
      }
    },
    [isOpen, setOpen]
  );

  /**
   * Add global keyboard listener.
   */
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * Focus input when chat opens.
   */
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow animation to start
      const timeout = setTimeout(() => {
        const focusFn = (
          window as unknown as { chatInputFocus?: () => void }
        ).chatInputFocus;
        if (focusFn) {
          focusFn();
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  /**
   * Handle close button click.
   */
  const handleClose = useCallback(() => {
    clearError();
    setOpen(false);
  }, [clearError, setOpen]);

  /**
   * Handle retry.
   */
  const handleRetry = useCallback(() => {
    clearError();
    retryLastMessage();
  }, [clearError, retryLastMessage]);

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-6 right-6 z-50 ${className}`}
    >
      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="absolute bottom-16 right-0 sm:bottom-0 sm:right-16"
        style={{ display: "none" }}
      >
        <ChatContainer
          messages={messages}
          inputValue={inputValue}
          isLoading={isLoading}
          error={error}
          onInputChange={setInputValue}
          onSubmit={sendMessage}
          onClose={handleClose}
          onRetry={handleRetry}
        />
      </div>

      {/* Floating Button */}
      <ChatButton onClick={toggleOpen} isOpen={isOpen} />
    </div>
  );
}

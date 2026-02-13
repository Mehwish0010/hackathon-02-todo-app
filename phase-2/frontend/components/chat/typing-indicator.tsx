"use client";

/**
 * TypingIndicator Component
 * Feature: 006-frontend-chat-ui
 *
 * Animated typing indicator shown when AI is processing.
 */

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-animation";

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className = "" }: TypingIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    // Animate dots in a wave pattern
    const dots = dotsRef.current.filter(Boolean);

    const animation = gsap.to(dots, {
      y: -4,
      duration: 0.4,
      ease: "power2.inOut",
      stagger: {
        each: 0.15,
        repeat: -1,
        yoyo: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, [prefersReducedMotion]);

  const setDotRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) dotsRef.current[index] = el;
  };

  return (
    <div
      ref={containerRef}
      className={`flex items-center space-x-1 px-4 py-3 ${className}`}
      role="status"
      aria-label="AI is typing"
    >
      <div className="flex items-center space-x-1.5 bg-bg-glass-hover rounded-2xl px-4 py-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            ref={setDotRef(index)}
            className="w-2 h-2 bg-text-secondary rounded-full"
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="sr-only">AI is typing a response</span>
    </div>
  );
}

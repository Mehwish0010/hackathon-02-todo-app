"use client";

/**
 * Input Component with Glassmorphism
 * Feature: 004-frontend-ui-redesign
 *
 * A styled input component with glassmorphism effects,
 * focus animations, and error states.
 */

import { forwardRef, InputHTMLAttributes, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-animation";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, onFocus, onBlur, ...props }, ref) => {
    const inputId = id || props.name;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (!prefersReducedMotion && containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 1.01,
          duration: 0.15,
          ease: "power2.out",
        });
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (!prefersReducedMotion && containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 1,
          duration: 0.15,
          ease: "power2.out",
        });
      }
      onBlur?.(e);
    };

    return (
      <div ref={containerRef} className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={`
              block text-sm font-medium mb-2
              transition-colors duration-fast
              ${isFocused ? "text-accent" : "text-text-secondary"}
            `}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-bg-glass backdrop-blur-glass
            border rounded-lg
            text-text-primary placeholder:text-text-muted
            transition-all duration-normal
            focus:outline-none
            ${
              error
                ? "border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                : "border-border-glass hover:border-border-glass-hover focus:border-accent focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)]"
            }
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {hint && !error && (
          <p className="mt-2 text-sm text-text-muted">{hint}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-error animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/**
 * Textarea Component with Glassmorphism
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, onFocus, onBlur, ...props }, ref) => {
    const inputId = id || props.name;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (!prefersReducedMotion && containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 1.01,
          duration: 0.15,
          ease: "power2.out",
        });
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      if (!prefersReducedMotion && containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 1,
          duration: 0.15,
          ease: "power2.out",
        });
      }
      onBlur?.(e);
    };

    return (
      <div ref={containerRef} className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={`
              block text-sm font-medium mb-2
              transition-colors duration-fast
              ${isFocused ? "text-accent" : "text-text-secondary"}
            `}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-bg-glass backdrop-blur-glass
            border rounded-lg
            text-text-primary placeholder:text-text-muted
            transition-all duration-normal
            focus:outline-none
            resize-none
            ${
              error
                ? "border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                : "border-border-glass hover:border-border-glass-hover focus:border-accent focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)]"
            }
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {hint && !error && (
          <p className="mt-2 text-sm text-text-muted">{hint}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-error animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

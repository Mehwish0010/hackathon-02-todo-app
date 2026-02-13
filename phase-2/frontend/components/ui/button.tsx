"use client";

/**
 * Button Component with Glassmorphism
 * Feature: 004-frontend-ui-redesign
 *
 * A versatile button component with glassmorphism styling,
 * GSAP hover animations, and multiple variants.
 */

import { ButtonHTMLAttributes, forwardRef, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-animation";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Size classes
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    // Variant classes with glassmorphism
    const variantClasses = {
      primary: `
        bg-gradient-to-r from-accent to-accent-hover
        text-text-primary font-medium
        border border-white/10
        shadow-accent-glow
        hover:shadow-accent-glow-lg
      `,
      secondary: `
        bg-bg-glass backdrop-blur-glass
        text-text-primary font-medium
        border border-border-glass
        hover:bg-bg-glass-hover hover:border-border-glass-hover
      `,
      outline: `
        bg-transparent
        text-text-primary font-medium
        border border-border-glass
        hover:bg-bg-glass hover:border-border-glass-hover
      `,
      danger: `
        bg-gradient-to-r from-error to-red-600
        text-text-primary font-medium
        border border-white/10
        shadow-[0_0_20px_rgba(239,68,68,0.3)]
        hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]
      `,
      ghost: `
        bg-transparent
        text-text-secondary
        hover:text-text-primary hover:bg-bg-glass
      `,
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!prefersReducedMotion && buttonRef.current && !disabled && !loading) {
        gsap.to(buttonRef.current, {
          scale: 1.02,
          duration: 0.15,
          ease: "power2.out",
        });
      }
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!prefersReducedMotion && buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.15,
          ease: "power2.out",
        });
      }
      onMouseLeave?.(e);
    };

    return (
      <button
        ref={(node) => {
          // Handle both refs
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center
          rounded-lg
          font-medium
          transition-all duration-fast
          focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
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
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

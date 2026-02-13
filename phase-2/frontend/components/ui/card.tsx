"use client";

/**
 * Card Component with Glassmorphism
 * Feature: 004-frontend-ui-redesign
 *
 * A glassmorphism card component with optional hover effects
 * and GSAP animations.
 */

import { ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-animation";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  elevated?: boolean;
}

export function Card({
  children,
  className = "",
  hoverable = false,
  elevated = false,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = () => {
    if (!prefersReducedMotion && hoverable && cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        scale: 1.01,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion && hoverable && cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        bg-bg-glass backdrop-blur-glass
        border border-border-glass
        rounded-glass
        ${elevated ? "shadow-glass-lg" : "shadow-glass"}
        ${hoverable ? "cursor-pointer transition-colors hover:bg-bg-glass-hover hover:border-border-glass-hover" : ""}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div
      className={`
        px-5 py-4
        border-b border-border-glass
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3
      className={`
        text-lg font-semibold
        text-text-primary
        ${className}
      `}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p
      className={`
        text-sm text-text-secondary
        mt-1
        ${className}
      `}
    >
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`px-5 py-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={`
        px-5 py-4
        border-t border-border-glass
        ${className}
      `}
    >
      {children}
    </div>
  );
}

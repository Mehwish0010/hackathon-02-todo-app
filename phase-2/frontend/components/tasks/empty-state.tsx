"use client";

/**
 * Empty State Component with Glassmorphism and Animation
 * Feature: 004-frontend-ui-redesign
 */

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useGSAP, gsap } from "@/lib/gsap";

interface EmptyStateProps {
  onCreateClick?: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      // Animate icon with a subtle float
      gsap.to(".empty-icon", {
        y: -5,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Stagger in content
      gsap.from(".empty-content > *", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="text-center py-16 px-4">
      <div className="empty-content">
        {/* Animated icon */}
        <div className="empty-icon w-20 h-20 mx-auto mb-6 rounded-2xl bg-bg-glass border border-border-glass flex items-center justify-center">
          <svg
            className="w-10 h-10 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          No tasks yet
        </h3>

        {/* Description */}
        <p className="text-sm text-text-secondary max-w-xs mx-auto">
          Get started by creating your first task. Stay organized and boost your productivity.
        </p>

        {/* CTA Button */}
        {onCreateClick && (
          <div className="mt-8">
            <Button variant="primary" onClick={onCreateClick}>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create your first task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

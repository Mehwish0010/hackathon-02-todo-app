"use client";

/**
 * Modal Component with Glassmorphism
 * Feature: 004-frontend-ui-redesign
 *
 * A modal dialog with glassmorphism styling and GSAP
 * entrance/exit animations.
 */

import { ReactNode, useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-animation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [shouldRender, setShouldRender] = useState(isOpen);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  // Handle animation on open/close
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Wait for render then animate in
      requestAnimationFrame(() => {
        if (prefersReducedMotion) return;

        if (backdropRef.current) {
          gsap.fromTo(
            backdropRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: "power2.out" }
          );
        }

        if (contentRef.current) {
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, scale: 0.95, y: 20 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.3,
              ease: "power3.out",
              delay: 0.1,
            }
          );
        }
      });
    } else if (shouldRender) {
      // Animate out then unmount
      if (prefersReducedMotion) {
        setShouldRender(false);
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => setShouldRender(false),
      });

      if (contentRef.current) {
        tl.to(contentRef.current, {
          opacity: 0,
          scale: 0.95,
          y: -10,
          duration: 0.2,
          ease: "power2.in",
        });
      }

      if (backdropRef.current) {
        tl.to(
          backdropRef.current,
          { opacity: 0, duration: 0.15, ease: "power2.in" },
          "-=0.1"
        );
      }
    }
  }, [isOpen, prefersReducedMotion, shouldRender]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className="flex min-h-full items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          className={`
            relative w-full ${sizeClasses[size]}
            bg-bg-secondary/95 backdrop-blur-glass-lg
            border border-border-glass
            rounded-2xl
            shadow-glass-lg
            transform
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border-glass">
            <div className="flex items-center justify-between">
              <h3
                id="modal-title"
                className="text-lg font-semibold text-text-primary"
              >
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="
                  p-1 rounded-lg
                  text-text-muted hover:text-text-primary
                  hover:bg-bg-glass
                  transition-colors duration-fast
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                "
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
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
          </div>

          {/* Content */}
          <div className="px-6 py-5">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-border-glass flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

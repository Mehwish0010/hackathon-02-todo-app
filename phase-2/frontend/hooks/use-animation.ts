"use client";

/**
 * Animation Hooks for GSAP
 * Feature: 004-frontend-ui-redesign
 *
 * These hooks provide a React-friendly interface to GSAP animations
 * with automatic cleanup and reduced motion support.
 */

import { useRef, useCallback, useEffect, useState } from "react";
import { gsap, useGSAP, ANIMATION_DURATION, ANIMATION_EASE, STAGGER_CONFIG } from "@/lib/gsap";

/**
 * Check if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for fade-in animation on mount
 */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>(
  options: {
    delay?: number;
    duration?: number;
    y?: number;
  } = {}
) {
  const ref = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion) return;

      gsap.from(ref.current, {
        opacity: 0,
        y: options.y ?? 20,
        duration: options.duration ?? ANIMATION_DURATION.slow,
        delay: options.delay ?? 0,
        ease: ANIMATION_EASE.out,
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion] }
  );

  return ref;
}

/**
 * Hook for staggered list animation
 */
export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
  selector: string,
  options: {
    stagger?: number;
    delay?: number;
    duration?: number;
  } = {}
) {
  const containerRef = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!containerRef.current || prefersReducedMotion) return;

      gsap.from(selector, {
        opacity: 0,
        y: 20,
        duration: options.duration ?? ANIMATION_DURATION.slow,
        stagger: options.stagger ?? STAGGER_CONFIG.normal,
        delay: options.delay ?? 0,
        ease: ANIMATION_EASE.out,
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return containerRef;
}

/**
 * Hook for entrance/exit animations (useful for conditional rendering)
 */
export function useEntranceAnimation<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  const animateIn = useCallback(
    (onComplete?: () => void) => {
      if (!ref.current || prefersReducedMotion) {
        onComplete?.();
        return;
      }

      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: ANIMATION_DURATION.slow,
          ease: ANIMATION_EASE.out,
          onComplete,
        }
      );
    },
    [prefersReducedMotion]
  );

  const animateOut = useCallback(
    (onComplete?: () => void) => {
      if (!ref.current || prefersReducedMotion) {
        onComplete?.();
        return;
      }

      gsap.to(ref.current, {
        opacity: 0,
        y: -10,
        scale: 0.98,
        duration: ANIMATION_DURATION.normal,
        ease: ANIMATION_EASE.in,
        onComplete,
      });
    },
    [prefersReducedMotion]
  );

  return { ref, animateIn, animateOut };
}

/**
 * Hook for modal animations
 */
export function useModalAnimation<T extends HTMLElement = HTMLDivElement>() {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  const animateIn = useCallback(() => {
    if (prefersReducedMotion) return;

    const tl = gsap.timeline();

    if (backdropRef.current) {
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.out }
      );
    }

    if (contentRef.current) {
      tl.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: ANIMATION_DURATION.slower,
          ease: ANIMATION_EASE.out,
        },
        "-=0.15"
      );
    }
  }, [prefersReducedMotion]);

  const animateOut = useCallback(
    (onComplete?: () => void) => {
      if (prefersReducedMotion) {
        onComplete?.();
        return;
      }

      const tl = gsap.timeline({ onComplete });

      if (contentRef.current) {
        tl.to(contentRef.current, {
          opacity: 0,
          scale: 0.95,
          y: -10,
          duration: ANIMATION_DURATION.normal,
          ease: ANIMATION_EASE.in,
        });
      }

      if (backdropRef.current) {
        tl.to(
          backdropRef.current,
          { opacity: 0, duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.in },
          "-=0.1"
        );
      }
    },
    [prefersReducedMotion]
  );

  return { backdropRef, contentRef, animateIn, animateOut };
}

/**
 * Hook for hover animations (scale + glow)
 */
export function useHoverAnimation<T extends HTMLElement = HTMLDivElement>(
  options: {
    scale?: number;
    duration?: number;
  } = {}
) {
  const ref = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  const onMouseEnter = useCallback(() => {
    if (!ref.current || prefersReducedMotion) return;

    gsap.to(ref.current, {
      scale: options.scale ?? 1.02,
      duration: options.duration ?? ANIMATION_DURATION.fast,
      ease: ANIMATION_EASE.out,
    });
  }, [options.scale, options.duration, prefersReducedMotion]);

  const onMouseLeave = useCallback(() => {
    if (!ref.current || prefersReducedMotion) return;

    gsap.to(ref.current, {
      scale: 1,
      duration: options.duration ?? ANIMATION_DURATION.fast,
      ease: ANIMATION_EASE.out,
    });
  }, [options.duration, prefersReducedMotion]);

  return { ref, onMouseEnter, onMouseLeave };
}

/**
 * Hook for task completion animation
 */
export function useCompletionAnimation<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const prefersReducedMotion = useReducedMotion();

  const animateComplete = useCallback(() => {
    if (!ref.current || prefersReducedMotion) return;

    gsap.to(ref.current, {
      opacity: 0.6,
      duration: ANIMATION_DURATION.normal,
      ease: ANIMATION_EASE.out,
    });
  }, [prefersReducedMotion]);

  const animateIncomplete = useCallback(() => {
    if (!ref.current || prefersReducedMotion) return;

    gsap.to(ref.current, {
      opacity: 1,
      duration: ANIMATION_DURATION.normal,
      ease: ANIMATION_EASE.out,
    });
  }, [prefersReducedMotion]);

  return { ref, animateComplete, animateIncomplete };
}

/**
 * Utility to create GSAP animation for dynamic elements
 */
export function animateElement(
  element: HTMLElement | null,
  animation: "fadeIn" | "fadeOut" | "scaleIn" | "scaleOut",
  onComplete?: () => void
) {
  if (!element) {
    onComplete?.();
    return;
  }

  const animations = {
    fadeIn: { opacity: 1, y: 0, duration: ANIMATION_DURATION.slow, ease: ANIMATION_EASE.out },
    fadeOut: { opacity: 0, y: -10, duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.in },
    scaleIn: { opacity: 1, scale: 1, duration: ANIMATION_DURATION.slower, ease: ANIMATION_EASE.out },
    scaleOut: { opacity: 0, scale: 0.95, duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.in },
  };

  gsap.to(element, { ...animations[animation], onComplete });
}

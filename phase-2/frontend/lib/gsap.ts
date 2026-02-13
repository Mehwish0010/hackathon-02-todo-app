/**
 * GSAP Configuration and Registration
 * Feature: 004-frontend-ui-redesign
 *
 * This file initializes GSAP and registers the React plugin.
 * Import this file once in the application to set up GSAP globally.
 */

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Register the useGSAP hook with GSAP
gsap.registerPlugin(useGSAP);

// Configure GSAP defaults for consistent animations
gsap.defaults({
  ease: "power2.out",
  duration: 0.3,
});

// Export configured instances
export { gsap, useGSAP };

// Animation timing constants (in seconds for GSAP)
export const ANIMATION_DURATION = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.4,
  slowest: 0.5,
} as const;

// GSAP easing presets
export const ANIMATION_EASE = {
  out: "power2.out",
  in: "power2.in",
  inOut: "power2.inOut",
  snap: "power3.out",
  smooth: "power1.out",
  bounce: "back.out(1.7)",
} as const;

// Animation presets for common effects
export const ANIMATION_PRESETS = {
  fadeIn: {
    opacity: 0,
    duration: ANIMATION_DURATION.slow,
    ease: ANIMATION_EASE.out,
  },
  fadeInUp: {
    opacity: 0,
    y: 20,
    duration: ANIMATION_DURATION.slow,
    ease: ANIMATION_EASE.out,
  },
  fadeInDown: {
    opacity: 0,
    y: -20,
    duration: ANIMATION_DURATION.slow,
    ease: ANIMATION_EASE.out,
  },
  scaleIn: {
    opacity: 0,
    scale: 0.95,
    duration: ANIMATION_DURATION.slower,
    ease: ANIMATION_EASE.out,
  },
  slideInRight: {
    opacity: 0,
    x: 20,
    duration: ANIMATION_DURATION.slow,
    ease: ANIMATION_EASE.out,
  },
  slideInLeft: {
    opacity: 0,
    x: -20,
    duration: ANIMATION_DURATION.slow,
    ease: ANIMATION_EASE.out,
  },
} as const;

// Stagger configuration for list animations
export const STAGGER_CONFIG = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
} as const;

"use client";

/**
 * Background Orbs Component
 * Feature: 004-frontend-ui-redesign
 *
 * Animated gradient orbs that create depth and visual interest
 * behind glassmorphism elements.
 */

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import gsap from "gsap";

interface BackgroundOrbsProps {
  className?: string;
}

export function BackgroundOrbs({ className = "" }: BackgroundOrbsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      // Animate orb 1 - slow floating movement
      gsap.to(".orb-1", {
        x: 50,
        y: -30,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Animate orb 2 - different pattern
      gsap.to(".orb-2", {
        x: -40,
        y: 40,
        duration: 10,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Animate orb 3 - subtle movement
      gsap.to(".orb-3", {
        x: 30,
        y: 20,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Primary accent orb - top right */}
      <div
        className="orb-1 absolute w-[600px] h-[600px] rounded-full"
        style={{
          top: "-10%",
          right: "-5%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Secondary orb - bottom left */}
      <div
        className="orb-2 absolute w-[500px] h-[500px] rounded-full"
        style={{
          bottom: "-10%",
          left: "-10%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Tertiary orb - center */}
      <div
        className="orb-3 absolute w-[400px] h-[400px] rounded-full"
        style={{
          top: "40%",
          left: "30%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Subtle noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

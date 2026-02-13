"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) return;

      // Animate hero content
      gsap.from(".hero-title", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.from(".hero-description", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.3,
        ease: "power2.out",
      });

      gsap.from(".hero-buttons", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.4,
        ease: "power2.out",
      });

      // Stagger animate feature cards
      gsap.from(".feature-card", {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.6,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="text-center max-w-3xl">
        {/* Hero Title */}
        <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight">
          <span className="bg-gradient-to-r from-white via-white to-text-secondary bg-clip-text">
            Todo App
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle mt-6 text-xl sm:text-2xl text-text-secondary font-light">
          A secure, multi-user task management application
        </p>

        {/* Description */}
        <p className="hero-description mt-3 text-sm text-text-muted">
          Built with Next.js, FastAPI, Better Auth, and JWT authentication
        </p>

        {/* CTA Buttons */}
        <div className="hero-buttons mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signin">
            <Button variant="primary" size="lg" className="w-full sm:w-auto min-w-[160px]">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[160px]">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card hoverable className="feature-card">
            <CardContent className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Secure Auth</h3>
              <p className="text-sm text-text-secondary">
                JWT-based authentication with Better Auth
              </p>
            </CardContent>
          </Card>

          <Card hoverable className="feature-card">
            <CardContent className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">User Isolation</h3>
              <p className="text-sm text-text-secondary">
                Each user only sees their own tasks
              </p>
            </CardContent>
          </Card>

          <Card hoverable className="feature-card">
            <CardContent className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Fast API</h3>
              <p className="text-sm text-text-secondary">
                Python FastAPI backend with token verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-xs text-text-muted">
          Built for the Hackathon with modern web technologies
        </p>
      </div>
    </div>
  );
}

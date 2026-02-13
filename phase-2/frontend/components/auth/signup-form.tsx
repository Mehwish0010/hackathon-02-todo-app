"use client";

/**
 * Sign Up Form with Glassmorphism
 * Feature: 004-frontend-ui-redesign
 */

import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth-client";
import { useGSAP, gsap } from "@/lib/gsap";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Entrance animation
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion || !formRef.current) return;

      gsap.from(".form-field", {
        opacity: 0,
        y: 15,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: formRef }
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        email: email.toLowerCase().trim(),
        password,
        name: name.trim(),
      });

      if (result.error) {
        if (result.error.message?.includes("already")) {
          setErrors({ email: "Email already in use" });
        } else {
          setErrors({ general: result.error.message || "Signup failed" });
        }
        return;
      }

      // Signup successful, redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {errors.general && (
        <div className="form-field rounded-xl bg-error/10 border border-error/20 p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-error flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        </div>
      )}

      <div className="form-field">
        <Input
          label="Name (optional)"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          autoComplete="name"
        />
      </div>

      <div className="form-field">
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="form-field">
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="form-field pt-2">
        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>
      </div>
    </form>
  );
}

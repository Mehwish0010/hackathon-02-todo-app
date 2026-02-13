/**
 * Sign Up Page with Glassmorphism
 * Feature: 004-frontend-ui-redesign
 */

import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { Card, CardContent } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
          <svg
            className="w-8 h-8 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Create an account</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Start managing your tasks today
        </p>
      </div>

      {/* Form Card */}
      <Card elevated className="animate-scale-in">
        <CardContent className="py-8 px-6 sm:px-8">
          <SignupForm />

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-accent hover:text-accent-hover transition-colors duration-fast"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

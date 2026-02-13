/**
 * Sign In Page with Glassmorphism
 * Feature: 004-frontend-ui-redesign
 */

import Link from "next/link";
import { SigninForm } from "@/components/auth/signin-form";
import { Card, CardContent } from "@/components/ui/card";

export default function SigninPage() {
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
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Welcome back</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Sign in to access your tasks
        </p>
      </div>

      {/* Form Card */}
      <Card elevated className="animate-scale-in">
        <CardContent className="py-8 px-6 sm:px-8">
          <SigninForm />

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-accent hover:text-accent-hover transition-colors duration-fast"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

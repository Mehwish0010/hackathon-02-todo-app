"use client";

/**
 * Protected Layout with Glassmorphism Navigation
 * Feature: 004-frontend-ui-redesign
 * Updated: 006-frontend-chat-ui - Added ChatWidget
 */

import { useSession } from "@/lib/auth-client";
import { SignoutButton } from "@/components/auth/signout-button";
import { ChatWidget } from "@/components/chat/chat-widget";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-border-glass border-t-accent animate-spin" />
          <span className="text-sm text-text-secondary">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Glassmorphism Navigation */}
      <nav className="sticky top-0 z-40 bg-bg-glass/80 backdrop-blur-glass border-b border-border-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-text-primary">
                Todo App
              </span>
            </div>

            {/* User Info & Sign Out */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-accent">
                    {session.user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-text-secondary">
                  {session.user.email}
                </span>
              </div>
              <SignoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}

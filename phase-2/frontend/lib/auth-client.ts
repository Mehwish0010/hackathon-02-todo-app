"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    onError: (error) => {
      console.error("Auth client error:", error);
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Get JWT token for API calls using custom endpoint
export async function getToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/token", {
      credentials: "include",
    });
    if (!response.ok) {
      console.error("Token fetch failed:", response.status);
      return null;
    }
    const data = await response.json();
    return data.token || null;
  } catch (err) {
    console.error("Failed to get token:", err);
    return null;
  }
}

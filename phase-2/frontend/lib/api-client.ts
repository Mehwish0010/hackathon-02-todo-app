"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiClientOptions extends RequestInit {
  token?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Get the current JWT token from Better Auth session.
 * This should be called from a component that has access to the auth context.
 */
export async function getToken(): Promise<string | null> {
  // Token retrieval will be handled by the calling component
  // using the useSession hook from auth-client
  return null;
}

/**
 * API client with automatic JWT token injection and error handling.
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<ApiResponse<T>> {
  const { token, headers: customHeaders, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  // Add Authorization header if token is provided
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 - redirect to signin
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
      return {
        error: "Unauthorized. Please sign in.",
        status: 401,
      };
    }

    // Handle other error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.detail || errorData.error || `Error: ${response.status}`,
        status: response.status,
      };
    }

    // Parse successful response
    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    // Handle network errors
    return {
      error: "Network error. Please check your connection and try again.",
      status: 0,
    };
  }
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: <T>(endpoint: string, token?: string) =>
    apiClient<T>(endpoint, { method: "GET", token }),

  post: <T>(endpoint: string, body: unknown, token?: string) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      token,
    }),

  put: <T>(endpoint: string, body: unknown, token?: string) =>
    apiClient<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      token,
    }),

  patch: <T>(endpoint: string, body: unknown, token?: string) =>
    apiClient<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      token,
    }),

  delete: <T>(endpoint: string, token?: string) =>
    apiClient<T>(endpoint, { method: "DELETE", token }),
};

"use client";

/**
 * useChat Hook
 * Feature: 006-frontend-chat-ui
 *
 * Custom hook for chat state management and API integration.
 */

import { useState, useCallback, useRef } from "react";
import { useSession, getToken } from "@/lib/auth-client";
import { api } from "@/lib/api-client";
import {
  ChatMessage,
  ChatApiResponse,
  ConversationHistoryResponse,
  MAX_MESSAGE_LENGTH,
  transformApiMessage,
  generateTempId,
} from "@/types/chat";

interface UseChatReturn {
  // State
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  isOpen: boolean;
  historyLoaded: boolean;

  // Actions
  setInputValue: (value: string) => void;
  sendMessage: () => Promise<void>;
  loadHistory: () => Promise<void>;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  clearError: () => void;
  retryLastMessage: () => Promise<void>;
}

export function useChat(): UseChatReturn {
  const { data: session } = useSession();

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  // Refs for tracking
  const lastFailedMessage = useRef<string | null>(null);
  const isSubmitting = useRef(false);

  /**
   * Load conversation history from the backend.
   */
  const loadHistory = useCallback(async () => {
    if (historyLoaded || !session) return;

    try {
      console.log("[Chat] Loading history, getting token...");
      const token = await getToken();
      console.log("[Chat] Token received:", token ? "yes" : "no");

      if (!token) {
        setError("Please sign in to use the chat.");
        return;
      }

      console.log("[Chat] Fetching history from API...");
      const response = await api.get<ConversationHistoryResponse>(
        "/api/chat/history?limit=50",
        token
      );
      console.log("[Chat] API response:", response);

      if (response.error) {
        console.error("Failed to load history:", response.error);
        // Don't show error for history load failure - just start fresh
        setHistoryLoaded(true);
        return;
      }

      if (response.data) {
        const transformedMessages = response.data.messages.map(transformApiMessage);
        setMessages(transformedMessages);
        if (response.data.conversation_id) {
          setConversationId(response.data.conversation_id);
        }
      }
      setHistoryLoaded(true);
    } catch (err) {
      console.error("Error loading history:", err);
      setHistoryLoaded(true);
    }
  }, [historyLoaded, session]);

  /**
   * Send a message to the AI agent.
   */
  const sendMessage = useCallback(async () => {
    const trimmedMessage = inputValue.trim();

    // Validation
    if (!trimmedMessage) {
      return;
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setError(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters)`);
      return;
    }

    // Prevent duplicate submissions
    if (isSubmitting.current) {
      return;
    }

    if (!session) {
      setError("Please sign in to use the chat.");
      return;
    }

    isSubmitting.current = true;
    setError(null);

    // Create optimistic user message
    const tempId = generateTempId();
    const userMessage: ChatMessage = {
      id: tempId,
      role: "user",
      content: trimmedMessage,
      createdAt: new Date(),
      status: "sending",
    };

    // Add optimistic message and clear input
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await api.post<ChatApiResponse>(
        "/api/chat",
        { message: trimmedMessage },
        token
      );

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        // Update user message status
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, status: "sent" as const } : msg
          )
        );

        // Add assistant response
        const assistantMessage: ChatMessage = {
          id: generateTempId(),
          role: "assistant",
          content: response.data.message,
          createdAt: new Date(),
          status: "sent",
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update conversation ID
        if (response.data.conversation_id) {
          setConversationId(response.data.conversation_id);
        }

        lastFailedMessage.current = null;
      }
    } catch (err) {
      // Update user message status to error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "error" as const } : msg
        )
      );

      lastFailedMessage.current = trimmedMessage;

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  }, [inputValue, session]);

  /**
   * Retry the last failed message.
   */
  const retryLastMessage = useCallback(async () => {
    if (!lastFailedMessage.current) return;

    // Remove the failed message from the list
    setMessages((prev) => prev.filter((msg) => msg.status !== "error"));

    // Set the input and resend
    setInputValue(lastFailedMessage.current);

    // Small delay to allow state update
    setTimeout(() => {
      const trimmedMessage = lastFailedMessage.current;
      if (!trimmedMessage) return;

      // Manually trigger send with the failed message
      (async () => {
        if (isSubmitting.current) return;
        isSubmitting.current = true;
        setError(null);

        const tempId = generateTempId();
        const userMessage: ChatMessage = {
          id: tempId,
          role: "user",
          content: trimmedMessage,
          createdAt: new Date(),
          status: "sending",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
          const token = await getToken();
          if (!token) throw new Error("Authentication required");

          const response = await api.post<ChatApiResponse>(
            "/api/chat",
            { message: trimmedMessage },
            token
          );

          if (response.error) throw new Error(response.error);

          if (response.data) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === tempId ? { ...msg, status: "sent" as const } : msg
              )
            );

            const assistantMessage: ChatMessage = {
              id: generateTempId(),
              role: "assistant",
              content: response.data.message,
              createdAt: new Date(),
              status: "sent",
            };
            setMessages((prev) => [...prev, assistantMessage]);

            if (response.data.conversation_id) {
              setConversationId(response.data.conversation_id);
            }

            lastFailedMessage.current = null;
          }
        } catch (err) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempId ? { ...msg, status: "error" as const } : msg
            )
          );
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.";
          setError(errorMessage);
        } finally {
          setIsLoading(false);
          isSubmitting.current = false;
        }
      })();
    }, 100);
  }, []);

  /**
   * Toggle chat open/close state.
   */
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Set chat open state directly.
   */
  const setOpen = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  /**
   * Clear the current error.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    messages,
    inputValue,
    isLoading,
    error,
    conversationId,
    isOpen,
    historyLoaded,

    // Actions
    setInputValue,
    sendMessage,
    loadHistory,
    toggleOpen,
    setOpen,
    clearError,
    retryLastMessage,
  };
}

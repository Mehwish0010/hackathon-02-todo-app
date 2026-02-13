/**
 * Chat Types
 * Feature: 006-frontend-chat-ui
 *
 * TypeScript type definitions for the AI chatbot interface.
 */

/**
 * Represents a single message in the chat UI.
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  status?: "sending" | "sent" | "error";
}

/**
 * Represents the current state of the chat widget.
 */
export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  historyLoaded: boolean;
}

/**
 * Request payload for POST /api/chat.
 */
export interface ChatApiRequest {
  message: string;
}

/**
 * Response payload from POST /api/chat.
 */
export interface ChatApiResponse {
  message: string;
  conversation_id: string;
}

/**
 * Single message item from conversation history API.
 */
export interface MessageItem {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

/**
 * Response payload from GET /api/chat/history.
 */
export interface ConversationHistoryResponse {
  conversation_id: string;
  messages: MessageItem[];
}

/**
 * Chat action types for state management.
 */
export type ChatAction =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; updates: Partial<ChatMessage> } }
  | { type: "SET_MESSAGES"; payload: ChatMessage[] }
  | { type: "SET_CONVERSATION_ID"; payload: string }
  | { type: "SET_HISTORY_LOADED"; payload: boolean }
  | { type: "CLEAR_ERROR" };

/**
 * Maximum message length (matches backend validation).
 */
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Transforms API message to ChatMessage format.
 */
export function transformApiMessage(apiMessage: MessageItem): ChatMessage {
  return {
    id: apiMessage.id,
    role: apiMessage.role as "user" | "assistant",
    content: apiMessage.content,
    createdAt: new Date(apiMessage.created_at),
    status: "sent",
  };
}

/**
 * Generates a temporary ID for optimistic updates.
 */
export function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

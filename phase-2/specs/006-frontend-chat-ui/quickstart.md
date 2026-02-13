# Quickstart: AI Chatbot Interface

**Feature Branch**: `006-frontend-chat-ui`
**Phase**: Phase III-B

## Prerequisites

- Phase III-A backend running on http://localhost:8000
- Frontend running on http://localhost:3000
- User authenticated via Better Auth

## File Structure

```
frontend/
├── components/
│   └── chat/
│       ├── chat-widget.tsx      # Main floating chat widget
│       ├── chat-button.tsx      # Floating trigger button
│       ├── chat-container.tsx   # Glassmorphic chat panel
│       ├── chat-messages.tsx    # Message list component
│       ├── chat-message.tsx     # Individual message bubble
│       ├── chat-input.tsx       # Message input with submit
│       └── typing-indicator.tsx # AI typing indicator
├── hooks/
│   └── use-chat.ts              # Chat state management hook
└── types/
    └── chat.ts                  # TypeScript type definitions
```

## Component Hierarchy

```
ChatWidget
├── ChatButton (floating FAB when closed)
└── ChatContainer (panel when open)
    ├── ChatHeader
    ├── ChatMessages
    │   └── ChatMessage (repeated)
    │       └── TypingIndicator (when loading)
    └── ChatInput
```

## Quick Implementation Steps

### 1. Create Chat Types

```typescript
// frontend/types/chat.ts
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  status?: "sending" | "sent" | "error";
}
```

### 2. Create Chat Hook

```typescript
// frontend/hooks/use-chat.ts
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // ... API integration with api-client.ts
}
```

### 3. Create Chat Widget

```typescript
// frontend/components/chat/chat-widget.tsx
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  // ... GSAP animation on open/close
}
```

### 4. Add to Layout

```typescript
// frontend/app/(protected)/layout.tsx
import { ChatWidget } from "@/components/chat/chat-widget";

export default function ProtectedLayout({ children }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
```

## API Usage

```typescript
// Send message
const response = await api.post<ChatResponse>(
  "/api/chat",
  { message: "Create a task" },
  token
);

// Load history
const history = await api.get<ConversationHistory>(
  "/api/chat/history?limit=50",
  token
);
```

## Styling Classes

Use existing glassmorphism classes:
- `bg-bg-glass` - Glass background
- `backdrop-blur-glass` - Blur effect
- `border-border-glass` - Glass border
- `rounded-glass` - Rounded corners
- `shadow-glass-lg` - Elevated shadow

## GSAP Animation Example

```typescript
import { gsap, ANIMATION_DURATION, ANIMATION_EASE } from "@/lib/gsap";

// Open animation
gsap.fromTo(
  containerRef.current,
  { opacity: 0, y: 20, scale: 0.95 },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: ANIMATION_DURATION.slow,
    ease: ANIMATION_EASE.out,
  }
);
```

## Testing Checklist

- [ ] Chat button visible on dashboard
- [ ] Click opens glassmorphic chat panel
- [ ] Can type and send messages
- [ ] AI responses display correctly
- [ ] Typing indicator shows during processing
- [ ] Error states handled gracefully
- [ ] Responsive on mobile (375px)
- [ ] History loads on open
- [ ] Auto-scroll to newest messages

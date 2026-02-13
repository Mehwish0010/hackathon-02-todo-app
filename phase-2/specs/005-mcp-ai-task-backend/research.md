# Research: MCP-Based AI Task Management Backend

**Feature**: 005-mcp-ai-task-backend
**Date**: 2026-02-10
**Purpose**: Resolve technical unknowns and document integration patterns

## 1. OpenAI Agents SDK Integration

### Decision
Use the `openai-agents` Python package with function calling for MCP tool integration.

### Rationale
- Official SDK with active development
- Native support for function/tool calling
- Clean abstraction for agent definition and execution
- Compatible with GPT-4o model family

### Alternatives Considered
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| LangChain | Rich ecosystem | Heavy, complex | Over-engineered for our needs |
| Direct OpenAI API | Simple | Manual tool handling | More boilerplate |
| Anthropic Claude | Strong reasoning | Different SDK | Constitution mandates OpenAI |

### Implementation Pattern
```python
from openai import OpenAI
from agents import Agent, Runner

# Define agent with tools
agent = Agent(
    name="TaskManager",
    instructions="You help users manage their todo tasks...",
    tools=[create_task, list_tasks, update_task, complete_task, delete_task]
)

# Run agent (stateless per request)
result = Runner.run_sync(agent, messages=conversation_history)
```

## 2. MCP SDK Integration

### Decision
Use the official MCP Python SDK (`mcp`) for tool definition and server setup.

### Rationale
- Official implementation ensures compatibility
- Standardized tool definition format
- Supports in-process server mode (no separate process needed)

### Alternatives Considered
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| Custom tool format | Full control | Non-standard | MCP SDK mandated by constitution |
| Separate MCP process | Isolation | Latency, complexity | Overkill for single backend |

### Implementation Pattern
```python
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("task-mcp-server")

@server.tool()
async def create_task(user_id: str, title: str, description: str = None) -> str:
    """Create a new task for the user."""
    # Direct DB operation
    task = Task(title=title, description=description, user_id=user_id)
    # ... save to DB
    return f"Created task: {task.title}"
```

## 3. Agent + MCP Tool Bridge

### Decision
Register MCP tools as OpenAI function calls via wrapper functions.

### Rationale
- OpenAI Agents SDK expects functions with specific signatures
- MCP tools need to be adapted to that format
- Wrapper functions handle the translation

### Implementation Pattern
```python
def make_openai_tool(mcp_tool):
    """Convert MCP tool to OpenAI function format."""
    async def wrapper(**kwargs):
        return await mcp_tool(**kwargs)

    wrapper.__name__ = mcp_tool.__name__
    wrapper.__doc__ = mcp_tool.__doc__
    return wrapper

# Register wrapped tools with agent
tools = [make_openai_tool(t) for t in mcp_server.tools]
```

## 4. Conversation Persistence

### Decision
Single conversation per user, messages stored in `message` table with foreign key to `conversation`.

### Rationale
- Simpler than session-based model
- User always sees full history
- Easy to load context for agent

### Schema Design
```sql
-- conversation table
id: UUID PRIMARY KEY
user_id: VARCHAR NOT NULL (indexed)
created_at: TIMESTAMP
updated_at: TIMESTAMP

-- message table
id: UUID PRIMARY KEY
conversation_id: UUID FOREIGN KEY
role: VARCHAR (user|assistant)
content: TEXT
created_at: TIMESTAMP
```

## 5. Stateless Request Flow

### Decision
Each chat request creates fresh agent instance, loads conversation from DB, processes, saves.

### Rationale
- Constitution requires stateless chat endpoints
- No in-memory state between requests
- DB is single source of truth

### Flow
```
1. Request arrives at POST /api/chat
2. Validate JWT, extract user_id
3. Get or create conversation for user_id
4. Load all messages for conversation (ordered by timestamp)
5. Create agent instance with tools
6. Run agent with: system prompt + message history + new user message
7. Agent reasons, potentially calls tools
8. Save user message + assistant response to DB
9. Return assistant response
```

## 6. Dependencies to Add

### New Python Packages
```
openai>=1.12.0           # OpenAI API client
openai-agents>=0.1.0     # Agents SDK (if available) OR use openai directly
mcp>=0.1.0               # Official MCP SDK
```

### Environment Variables
```
OPENAI_API_KEY=sk-...    # OpenAI API key for agent
```

## 7. Error Handling

### Decision
- Tool errors return error message string (not exceptions)
- Agent interprets error and responds appropriately
- Network/DB errors bubble up as 500

### Rationale
- Agent should handle tool failures gracefully
- User gets helpful error messages via AI response
- Critical failures (DB down) are system errors

## 8. Logging Strategy

### Decision
Log at these points:
1. Chat request received (user_id, message preview)
2. Agent tool calls (tool name, parameters - excluding sensitive data)
3. Tool results (success/failure, brief summary)
4. Response sent (message preview)

### Rationale
- Enables debugging of agent reasoning
- Supports judging criteria "agent reasoning visible in logs"
- Privacy-conscious (no full message content in logs)

## Unresolved Questions

None. All technical decisions resolved.

## References

- [OpenAI Agents SDK Documentation](https://platform.openai.com/docs/agents)
- [MCP Specification](https://modelcontextprotocol.io)
- [FastAPI Async Patterns](https://fastapi.tiangolo.com/async/)

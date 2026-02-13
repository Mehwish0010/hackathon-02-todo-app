"""Task management agent using OpenAI API with function calling."""

import json
import logging
from typing import List, Dict, Any, Optional
from openai import OpenAI

from app.core.config import settings
from app.agent.prompts import TASK_AGENT_SYSTEM_PROMPT
from app.mcp.server import mcp_server, get_tools_for_agent

logger = logging.getLogger(__name__)


class TaskAgent:
    """AI agent for task management using OpenAI function calling."""

    def __init__(self, user_id: str):
        """
        Initialize the agent with user context.

        Args:
            user_id: User ID from JWT token (injected into all tool calls)
        """
        self.user_id = user_id
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL

    async def process_message(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]],
    ) -> str:
        """
        Process a user message and return the agent's response.

        Args:
            user_message: The user's natural language message
            conversation_history: Previous messages in the conversation

        Returns:
            Agent's response as a string
        """
        # Build messages for the API call
        messages = [
            {"role": "system", "content": TASK_AGENT_SYSTEM_PROMPT},
        ]

        # Add conversation history
        for msg in conversation_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"],
            })

        # Add current user message
        messages.append({"role": "user", "content": user_message})

        # Get available tools
        tools = get_tools_for_agent()

        logger.info(f"Processing message for user {self.user_id}: {user_message[:50]}...")

        try:
            # Call OpenAI API with function calling
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools if tools else None,
                tool_choice="auto" if tools else None,
            )

            assistant_message = response.choices[0].message

            # Handle tool calls if any
            if assistant_message.tool_calls:
                # Process each tool call
                tool_results = []
                for tool_call in assistant_message.tool_calls:
                    tool_name = tool_call.function.name
                    tool_args = json.loads(tool_call.function.arguments)

                    logger.info(f"Agent calling tool: {tool_name} with args: {tool_args}")

                    # Inject user_id into tool arguments (security: never trust agent)
                    tool_args["user_id"] = self.user_id

                    # Call the tool
                    result = await mcp_server.call_tool(tool_name, tool_args)

                    logger.info(f"Tool {tool_name} result: {result[:100]}...")

                    tool_results.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "content": result,
                    })

                # Add assistant message with tool calls
                messages.append({
                    "role": "assistant",
                    "content": assistant_message.content,
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments,
                            },
                        }
                        for tc in assistant_message.tool_calls
                    ],
                })

                # Add tool results
                messages.extend(tool_results)

                # Get final response after tool execution
                final_response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                )

                return final_response.choices[0].message.content or "Done."

            # No tool calls, return direct response
            return assistant_message.content or "I'm not sure how to help with that."

        except Exception as e:
            logger.error(f"Agent error: {e}")
            return f"I encountered an error processing your request. Please try again."


async def run_agent(
    user_id: str,
    message: str,
    conversation_history: List[Dict[str, str]],
) -> str:
    """
    Convenience function to run the agent.

    Args:
        user_id: User ID from JWT
        message: User's message
        conversation_history: Previous messages

    Returns:
        Agent's response
    """
    agent = TaskAgent(user_id)
    return await agent.process_message(message, conversation_history)

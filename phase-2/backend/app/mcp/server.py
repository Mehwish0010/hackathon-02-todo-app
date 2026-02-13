"""MCP Server for task management tools.

This module provides an in-process MCP server that exposes task management
tools for the AI agent. All tools are stateless and operate directly on
the database.
"""

from typing import List, Callable, Dict, Any
import logging

logger = logging.getLogger(__name__)


class MCPToolRegistry:
    """Registry for MCP tools that can be used by the AI agent."""

    def __init__(self):
        """Initialize the tool registry."""
        self._tools: Dict[str, Callable] = {}
        self._tool_schemas: Dict[str, Dict[str, Any]] = {}

    def register_tool(
        self,
        name: str,
        func: Callable,
        description: str,
        parameters: Dict[str, Any],
    ) -> None:
        """
        Register a tool with the MCP server.

        Args:
            name: Tool name
            func: Tool function
            description: Tool description for the agent
            parameters: JSON schema for tool parameters
        """
        self._tools[name] = func
        self._tool_schemas[name] = {
            "type": "function",
            "function": {
                "name": name,
                "description": description,
                "parameters": parameters,
            },
        }
        logger.info(f"Registered MCP tool: {name}")

    def get_tool(self, name: str) -> Callable:
        """Get a tool by name."""
        return self._tools.get(name)

    def get_all_tools(self) -> Dict[str, Callable]:
        """Get all registered tools."""
        return self._tools.copy()

    def get_tool_schemas(self) -> List[Dict[str, Any]]:
        """Get OpenAI-compatible tool schemas for all registered tools."""
        return list(self._tool_schemas.values())

    async def call_tool(
        self,
        name: str,
        arguments: Dict[str, Any],
    ) -> str:
        """
        Call a tool by name with the given arguments.

        Args:
            name: Tool name
            arguments: Tool arguments

        Returns:
            Tool result as string
        """
        tool = self._tools.get(name)
        if not tool:
            return f"Error: Tool '{name}' not found"

        try:
            result = await tool(**arguments)
            logger.info(f"Tool '{name}' executed successfully")
            return result
        except Exception as e:
            logger.error(f"Tool '{name}' failed: {e}")
            return f"Error: {str(e)}"


# Global MCP server instance
mcp_server = MCPToolRegistry()


def get_tools_for_agent() -> List[Dict[str, Any]]:
    """
    Get tool schemas formatted for OpenAI function calling.

    Returns:
        List of tool schemas in OpenAI format
    """
    return mcp_server.get_tool_schemas()


def register_mcp_tool(
    name: str,
    description: str,
    parameters: Dict[str, Any],
):
    """
    Decorator to register a function as an MCP tool.

    Args:
        name: Tool name
        description: Tool description
        parameters: JSON schema for parameters
    """
    def decorator(func: Callable) -> Callable:
        mcp_server.register_tool(name, func, description, parameters)
        return func
    return decorator

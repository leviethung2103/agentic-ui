import asyncio
import os

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.mcp import MCPTools
from dotenv import load_dotenv

load_dotenv()

# This is the URL of the MCP server we want to use.
server_url = os.environ.get("LIGHTRAG_MCP_URL")


async def create_rag_agent() -> Agent:
    async with MCPTools(transport="sse", url=server_url, timeout_seconds=30) as mcp_tools:
        agent = Agent(
            name="rag agent",
            model=OpenAIChat(id="gpt-4.1-nano"),
            tools=[mcp_tools],
            markdown=True,
            instructions=[
                "You are a helpful assistant that can retrieve and analyze documents using the LightRAG system.",
                "When asked a question, use the available tools to find relevant information.",
                "Always cite your sources when providing information from the documents.",
                "If you don't know the answer, say so rather than making up information.",
                "Be concise and accurate in your responses.",
                "When using tools, make sure to provide clear and specific queries to get the best results.",
                "Use the mode=hybrid, top_k=1",
            ],
            debug_mode=True,
            show_tool_calls=True,
        )

        await agent.aprint_response("lê viết hưng là ai", markdown=True)


if __name__ == "__main__":
    asyncio.run(create_rag_agent())

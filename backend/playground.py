import asyncio
import os

import nest_asyncio
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.playground import Playground
from agno.playground.settings import PlaygroundSettings
from agno.storage.sqlite import SqliteStorage
from agno.tools.mcp import MCPTools
from dotenv import load_dotenv

from agents.code_agent import code_agent
from agents.finance_agent import finance_agent
from agents.image_agent import image_agent
from agents.weather_agent import weather_agent
from agents.web_agent import web_agent
from agents.youtube_agent import youtube_agent

load_dotenv()

# Allow nested event loops
nest_asyncio.apply()

agent_storage: str = "storage/rag_agent.db"
# This is the URL of the MCP server we want to use.
server_url = os.environ.get("LIGHTRAG_MCP_URL")

# Custom CORS settings
cors_origins = os.environ.get("CORS_ORIGINS", "").split(",")
cors_origins = [origin.strip() for origin in cors_origins if origin.strip()]
settings = PlaygroundSettings(cors_origin_list=cors_origins)

# Get server configuration from environment variables
server_host = os.environ.get("SERVER_HOST", "0.0.0.0")
server_port = int(os.environ.get("SERVER_PORT", "7777"))

# Custom CORS settings
settings = PlaygroundSettings(cors_origin_list=cors_origins)


async def run_server() -> None:
    """Run the GitHub agent server."""
    async with MCPTools(transport="sse", url=server_url, timeout_seconds=30) as mcp_tools:
        rag_agent = Agent(
            name="rag agent",
            model=OpenAIChat(id="gpt-4.1-nano"),
            tools=[mcp_tools],
            storage=SqliteStorage(table_name="rag_agent", db_file=agent_storage),
            markdown=True,
            instructions=[
                "You are a helpful assistant that can retrieve and analyze documents using the LightRAG system.",
                "When asked a question, use the available tools to find relevant information.",
                "If you don't know the answer, say so rather than making up information.",
                "Be concise and accurate in your responses.",
                "When using tools, make sure to provide clear and specific queries to get the best results.",
                "Use the mode=hybrid, top_k=1",
                "Always include sources or references at the end of your answer in markdown format.",
                "If your answer includes an image, always embed it using Markdown image syntax: ![alt text](image_url). Do not just include the URL as a link.",
            ],
            debug_mode=True,
            show_tool_calls=True,
        )

        playground = Playground(
            agents=[rag_agent, finance_agent, weather_agent, web_agent, youtube_agent, image_agent, code_agent],
            settings=settings,
        )
        app = playground.get_app()

        # Serve the app while keeping the MCPTools context manager alive
        playground.serve(app, host=server_host, port=server_port)


if __name__ == "__main__":
    asyncio.run(run_server())

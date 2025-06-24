import asyncio
import os
from textwrap import dedent

import nest_asyncio
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.models.openrouter import OpenRouter
from agno.playground import Playground
from agno.playground.settings import PlaygroundSettings
from agno.storage.sqlite import SqliteStorage
from agno.tools.jina import JinaReaderTools
from agno.tools.mcp import MCPTools
from dotenv import load_dotenv

from agents.chat_agent import chat_agent
from agents.code_agent import code_agent
from agents.finance_agent import finance_agent
from agents.image_agent import image_agent
from agents.jira_agent import jira_agent
from agents.ollama_agent import ollama_agent
from agents.web_agent import web_agent
from agents.youtube_agent import youtube_agent

# from phoenix.otel import register


load_dotenv(override=True)

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

# Configure the Phoenix tracer
# tracer_provider = register(
#     project_name="default",  # Default is 'default'
#     auto_instrument=True,  # Automatically use the installed OpenInference instrumentation
# )


async def run_server() -> None:
    """Run the GitHub agent server."""
    async with MCPTools(transport="sse", url=server_url, timeout_seconds=30) as mcp_tools:
        rag_agent = Agent(
            name="rag agent",
            model=OpenAIChat(id="gpt-4.1-nano", max_completion_tokens=500),
            tools=[mcp_tools],
            description="You are a helpful assistant that can retrieve and analyze documents using the LightRAG system.",
            storage=SqliteStorage(table_name="rag_agent", db_file=agent_storage),
            markdown=True,
            instructions=dedent(
                """\
                Search your knowledge before answering the question.
                Use the mode=hybrid, top_k=1
                
                Remember:
                    - Always include sources or references at the end of your answer in markdown format.
            """
            ),
            add_datetime_to_instructions=True,
            add_history_to_messages=True,
            num_history_runs=3,
            debug_mode=True,
            show_tool_calls=True,
        )

        playground = Playground(
            agents=[chat_agent, rag_agent, web_agent, ollama_agent, jira_agent],
            settings=settings,
            monitoring=False,  # turn off monitoring
        )
        app = playground.get_app()

        # Serve the app while keeping the MCPTools context manager alive
        playground.serve(app, host=server_host, port=server_port)


if __name__ == "__main__":
    asyncio.run(run_server())

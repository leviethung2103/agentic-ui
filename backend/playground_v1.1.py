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
from agno.team.team import Team
from agno.tools.jina import JinaReaderTools
from agno.tools.mcp import MCPTools
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from phoenix.otel import register

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
tracer_provider = register(
    project_name="default",  # Default is 'default'
    auto_instrument=True,  # Automatically use the installed OpenInference instrumentation
)


english_agent = Agent(
    name="English Agent",
    role="You only answer in English",
    model=OpenAIChat(id="gpt-4.1-nano"),
)
chinese_agent = Agent(
    name="Chinese Agent",
    role="You only answer in Chinese",
    model=OpenAIChat(id="gpt-4.1-nano"),
)
french_agent = Agent(
    name="French Agent",
    role="You can only answer in French",
    model=OpenAIChat(id="gpt-4.1-nano"),
)


multi_language_team = Team(
    name="Multi Language Team",
    mode="route",
    model=OpenAIChat("gpt-4.1-nano"),
    members=[english_agent, chinese_agent, french_agent],
    show_tool_calls=True,
    markdown=True,
    description="You are a language router that directs questions to the appropriate language agent.",
    instructions=[
        "Identify the language of the user's question and direct it to the appropriate language agent.",
        "If the user asks in a language whose agent is not a team member, respond in English with:",
        "'I can only answer in the following languages: English, Chinese, French. Please ask your question in one of these languages.'",
        "Always check the language of the user's input before routing to an agent.",
        "For unsupported languages like Italian, respond in English with the above message.",
    ],
    show_members_responses=True,
)

playground = Playground(
    teams=[multi_language_team],
    settings=settings,
)

app = playground.get_app()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.buddyai.online", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    playground.serve(app, host=server_host, port=server_port)

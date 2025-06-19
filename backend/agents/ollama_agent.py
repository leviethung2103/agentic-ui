import os

from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.storage.postgres import PostgresStorage
from agno.tools.arxiv import ArxivTools
from agno.tools.duckduckgo import DuckDuckGoTools
from dotenv import load_dotenv

load_dotenv(override=True)

db_url = (
    f"postgresql+psycopg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)

model = "gemma3:4b"
model = "llama3.2"
model = "qwen3:4b"

ollama_agent = Agent(
    name="Ollama Agent",
    agent_id="ollama_agent",
    model=Ollama(id=model),
    tools=[ArxivTools(), DuckDuckGoTools()],
    instructions=["Always use tables to display data"],
    storage=PostgresStorage(table_name="ollama_agent", db_url=db_url),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
    show_tool_calls=True,
    debug_mode=True,  # add the debug in order to send the traces to Phoenix
)

# Llama3.2 model can thinking and use the tools

if __name__ == "__main__":
    paper_agent.print_response("Search arxiv for Reinformcement learning paper", show_full_reasoning=True)

    # use the async
    # import asyncio
    # asyncio.run(paper_agent.aprint_response("Search arxiv for Reinformcement learning paper"))

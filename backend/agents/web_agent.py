import os

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.jina import JinaReaderTools
from agno.tools.tavily import TavilyTools
from dotenv import load_dotenv

load_dotenv(override=True)

agent_storage: str = "storage/web_agent.db"

model = OpenAIChat(
    id="gpt-4.1-nano",
    max_completion_tokens=200,
    max_retries=3,
    timeout=30.0,
)

web_agent = Agent(
    name="Web Agent",
    agent_id="web_agent",
    model=model,
    tools=[TavilyTools(), DuckDuckGoTools(), JinaReaderTools(api_key=os.getenv("JINA_API_KEY"))],
    instructions=["Always include sources"],
    # Store the agent sessions in a sqlite database
    storage=SqliteStorage(table_name="web_agent", db_file=agent_storage),
    # Adds the current date and time to the instructions
    add_datetime_to_instructions=True,
    # Adds the history of the conversation to the messages
    add_history_to_messages=True,
    # Number of history responses to add to the messages
    num_history_responses=5,
    # Adds markdown formatting to the messages
    markdown=True,
    debug_mode=True,  # add the debug in order to send the traces to Phoenix
)

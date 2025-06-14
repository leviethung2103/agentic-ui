from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from agno.tools.tavily import TavilyTools
from dotenv import load_dotenv

load_dotenv()

agent_storage: str = "storage/web_agent.db"

web_agent = Agent(
    name="Web Agent",
    model=OpenAIChat(id="gpt-4.1-nano"),
    tools=[TavilyTools()],
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

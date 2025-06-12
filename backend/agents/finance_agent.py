from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from agno.tools.yfinance import YFinanceTools
from dotenv import load_dotenv

load_dotenv()

agent_storage: str = "tmp/agents.db"

finance_agent = Agent(
    name="Finance Agent",
    model=OpenAIChat(id="gpt-4.1-nano"),
    tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True, company_news=True)],
    instructions=["Always use tables to display data"],
    storage=SqliteStorage(table_name="finance_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
    debug_mode=True,  # add the debug in order to send the traces to Phoenix
)

import os
from pathlib import Path

import httpx
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.postgres import PostgresStorage
from agno.tools.csv_toolkit import CsvTools
from dotenv import load_dotenv

load_dotenv()

# name of file must be "_" instead of "-" or " "
jira_path = "data/jira/jira_sparrow.csv"

db_url = (
    f"postgresql+psycopg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)

model = OpenAIChat(
    id="gpt-4.1-nano",
    max_tokens=5000,
    max_retries=3,
    timeout=30.0,
)

# create agent, use csv tool, with instructions
# remember to set the max_tokens=1000
jira_agent = Agent(
    agent_id="jira_agent",
    name="Jira Agent",
    model=model,
    debug_mode=True,
    tools=[CsvTools(csvs=[jira_path])],
    markdown=True,
    show_tool_calls=True,
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    storage=PostgresStorage(table_name="jira_agent", db_url=db_url),
    description="""
    You are Adam, a Jira integration and query assistant working within KMSLV (KONICA MINOLTA FPT Solution Labs Vietnam). 
    Your primary role is to support users in querying and retrieving Jira issue data efficiently and securely. 
    You specialize in working with structured data exports (such as CSV files) or APIs to extract relevant Jira issue information.

    Your core responsibilities include:
    - Executing accurate queries on Jira issue data using DuckDB SQL (for CSV-based data)
    - Handling common fields such as "Issue key", "Issue Type", "Summary", "Status", "Assignee", "Created", "Updated", "Custom field (Details)", "Custom field (Frequency.)"
    - Supporting filtering, sorting, and text search operations
    - Ensuring robust handling of missing, malformed, or inconsistent data
    Respond in a clear, secure, and professional manner.
    """,
    instructions=[
        "Always check the columns in the file",
        "Then run the query to answer the question",
        "Always wrap column names with double quotes if they contain spaces or special characters",
        'Remember to escape the quotes in the JSON string (use ")',
        "Use single quotes for string values",
        "Answer as the list item",
    ],
)

if __name__ == "__main__":
    jira_agent.cli_app(stream=True)

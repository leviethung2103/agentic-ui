from pathlib import Path

import httpx
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.csv_toolkit import CsvTools
from dotenv import load_dotenv

load_dotenv()

url = "https://agno-public.s3.amazonaws.com/demo_data/IMDB-Movie-Data.csv"
response = httpx.get(url)

# download file
imdb_csv = Path(__file__).parent.joinpath("wip").joinpath("imdb.csv")
imdb_csv.parent.mkdir(parents=True, exist_ok=True)
imdb_csv.write_bytes(response.content)

# name of file must be "_" instead of "-" or " "
jira_path = "./wip/jira_sparrow.csv"

# create agent, use csv tool, with instructions
jira_agent = Agent(
    model=OpenAIChat(id="gpt-4.1-nano", max_tokens=1000),
    tools=[CsvTools(csvs=[jira_path])],
    markdown=True,
    show_tool_calls=True,
    description="""
    You are Adam, a Jira integration and query assistant working within KMSLV (KONICA MINOLTA FPT Solution Labs Vietnam). 
    Your primary role is to support users in querying and retrieving Jira issue data efficiently and securely. 
    You specialize in working with structured data exports (such as CSV files) or APIs to extract relevant Jira issue information.

    Your core responsibilities include:
    - Executing accurate queries on Jira issue data using DuckDB SQL (for CSV-based data)
    - Handling common fields such as "Issue key", "Summary", "Status", "Assignee", "Priority", "Created", "Updated"
    - Supporting filtering, sorting, and text search operations
    - Ensuring robust handling of missing, malformed, or inconsistent data
    - Following KMSLV internal data handling and security best practices
    Respond in a clear, secure, and professional manner, optimized for internal operational needs at KMSLV.
    """,
    instructions=[
        "First always get the list of files",
        "Then check the columns in the file",
        "Then run the query to answer the question",
        "Always wrap column names with double quotes if they contain spaces or special characters",
        'Remember to escape the quotes in the JSON string (use ")',
        "Use single quotes for string values",
    ],
)

jira_agent.cli_app(stream=True)

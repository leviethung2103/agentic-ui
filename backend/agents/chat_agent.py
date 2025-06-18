import os

from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.models.openai import OpenAIChat
from agno.models.openrouter import OpenRouter
from agno.storage.postgres import PostgresStorage
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.reasoning import ReasoningTools
from dotenv import load_dotenv

load_dotenv(override=True)

db_url = (
    f"postgresql+psycopg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)

# open router
model_name = "mistralai/devstral-small-2505:free"
chat_agent = Agent(
    name="Chat Agent",
    agent_id="chat_agent",
    model=OpenRouter(id=model_name, api_key=os.getenv("OPENROUTER_API_KEY")),
    tools=[],
    instructions=["Always include sources"],
    # Store the agent sessions in a sqlite database
    storage=PostgresStorage(table_name="chat_agent", db_url=db_url),
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

# Ollama
# model_name = 'deepseek-r1:1.5b' # cannot support tool calling
# model_name = 'qwen3:1.7b'

# chat_agent = Agent(
#     name="Chat Agent",
#     agent_id="chat_agent",
#     model=Ollama(id=model_name),
#     tools=[DuckDuckGoTools(), ReasoningTools(add_instructions=True)],
#     instructions=["Always include sources"],
#     # Store the agent sessions in a sqlite database
#     storage=PostgresStorage(table_name="chat_agent", db_url=db_url),
#     # Adds the current date and time to the instructions
#     add_datetime_to_instructions=True,
#     # Adds the history of the conversation to the messages
#     add_history_to_messages=True,
#     # Number of history responses to add to the messages
#     num_history_responses=5,
#     # Adds markdown formatting to the messages
#     markdown=True,

#     # Enable reasoning
#     reasoning=True,
#     reasoning_min_steps=1,
#     reasoning_max_steps=5,

#     # Enable streaming of intermediate steps
#     stream=True,
#     stream_intermediate_steps=True,
#     debug_mode=True,  # add the debug in order to send the traces to Phoenix
# )


# model_name = 'gpt-4.1-nano'

# chat_agent = Agent(
#     name="Chat Agent",
#     agent_id="chat_agent",
#     model=OpenRouter(id=model_name, api_key=os.getenv("OPENROUTER_API_KEY")),
#     # model=OpenAIChat(id=model_name),
#     tools=[DuckDuckGoTools(), ReasoningTools(add_instructions=True)],
#     instructions=["Always include sources"],
#     # Store the agent sessions in a sqlite database
#     storage=PostgresStorage(table_name="chat_agent", db_url=db_url),
#     # Adds the current date and time to the instructions
#     add_datetime_to_instructions=True,
#     # Adds the history of the conversation to the messages
#     add_history_to_messages=True,
#     # Number of history responses to add to the messages
#     num_history_responses=5,
#     # Adds markdown formatting to the messages
#     markdown=True,

#     # Enable reasoning
#     reasoning=True,
#     reasoning_min_steps=1,
#     reasoning_max_steps=5,

#     # Enable streaming of intermediate steps
#     stream=True,
#     stream_intermediate_steps=True,
#     debug_mode=True,  # add the debug in order to send the traces to Phoenix
# )

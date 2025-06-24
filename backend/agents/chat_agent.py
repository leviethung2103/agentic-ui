import os

from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.models.openai import OpenAIChat
from agno.models.openrouter import OpenRouter
from agno.storage.postgres import PostgresStorage
from agno.tools.arxiv import ArxivTools
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.reasoning import ReasoningTools
from dotenv import load_dotenv
from sqlalchemy import true

load_dotenv(override=True)

db_url = (
    f"postgresql+psycopg://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)

# open router
# ort_model_name = "mistralai/devstral-small-2505:free"
# ort_model_name = "microsoft/phi-4-reasoning:free" # reasoning model -> OK ->
# ort_model_name = "deepseek/deepseek-r1-0528-qwen3-8b:free" # streaming , generate respone tot hon microsoft phi4
# ort_model_name = "deepseek/deepseek-r1-0528:free"  # has the stremaing, gegenerate respone tot hon microsoft phi4
# ort_model_name = "qwen/qwen3-30b-a3b-04-28:free"  # has the stremaing,, generate short reponse than deepseek, trả lời bị ngắt quãng, => không tốt
# ort_model_name = "qwen/qwen3-32b-04-28:free" # has the stremaing, generate short answer than deepseek, trả lời bị ngắt quãng => không tốt
# ort_model_name = "deepseek/deepseek-chat-v3-0324:free"
ort_model_name = "google/gemma-3-27b-it:free"

ollama_model_name = "llama3.2-8k"
# ollama_model_name = "qwen3:1.7b-8k"
# ollama_model_name = "gemma3:4b-8k" # does not support tool, only vision


# llama3.2 can use with tool and streaming normally
# deepseek-r1 : does not support tool calling
# qwen3 with ollama:  can call tool, streaming

chat_agent = Agent(
    name="Chat Agent",
    agent_id="chat_agent",
    model=OpenRouter(id=ort_model_name, api_key=os.getenv("OPENROUTER_API_KEY")),
    # model=Ollama(id=ollama_model_name),
    # tools=[DuckDuckGoTools(), ArxivTools()],
    description="You are a helpful, friendly, and knowledgeable assistant named Max. Keep responses clear, concise, and conversational. You can answer questions, provide explanations, help with writing, brainstorm ideas, and carry out simple tasks through text",
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

if __name__ == "__main__":
    # chat_agent.print_response("What is the capital of France?", stream_intermediate_steps=True)
    # chat_agent.print_response("What is the capital of France?", stream=True)
    # chat_agent.print_response("theo quy định mới thì Việt nam có bao nhiêu tỉnh thành phố", stream=True)
    # chat_agent.print_response("so sánh giá hiện tại của bitcoin và eth", stream=True)
    # chat_agent.print_response("so sánh giá hiện tại của bitcoin và eth", stream=True)
    chat_agent.print_response("vnexpress gộp tỉnh", stream=True)

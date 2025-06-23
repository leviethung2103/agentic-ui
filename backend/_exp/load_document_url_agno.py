from agno.agent import Agent
from agno.embedder.ollama import OllamaEmbedder
from agno.embedder.openai import OpenAIEmbedder
from agno.knowledge.url import UrlKnowledge
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from agno.vectordb.lancedb import LanceDb, SearchType

# pip install tantivy

# Load Agno documentation in a knowledge base
# You can also use `https://docs.agno.com/llms-full.txt` for the full documentation
# knowledge = UrlKnowledge(
#     urls=["https://docs.agno.com/introduction.md"],
#     vector_db=LanceDb(
#         uri="tmp/lancedb",
#         table_name="agno_docs",
#         search_type=SearchType.hybrid,
#         # Use OpenAI for embeddings
#         embedder=OpenAIEmbedder(id="text-embedding-3-small", dimensions=1536),
#     ),
# )

knowledge_ollama = UrlKnowledge(
    urls=["https://docs.agno.com/introduction.md"],
    vector_db=LanceDb(
        uri="tmp/lancedb_ollama",
        table_name="agno_docs_ollama",
        search_type=SearchType.hybrid,
        # Use Ollama for embeddings
        embedder=OllamaEmbedder(id="nomic-embed-text:latest", dimensions=768),
    ),
)


# # Store agent sessions in a SQLite database
# storage = SqliteStorage(table_name="agent_sessions", db_file="tmp/agent.db")

# agent = Agent(
#     name="Agno Assist",
#     model=Claude(id="claude-sonnet-4-20250514"),
#     instructions=[
#         "Search your knowledge before answering the question.",
#         "Only include the output in your response. No other text.",
#     ],
#     knowledge=knowledge,
#     storage=storage,
#     add_datetime_to_instructions=True,
#     # Add the chat history to the messages
#     add_history_to_messages=True,
#     # Number of history runs
#     num_history_runs=3,
#     markdown=True,
# )

agent = Agent(
    name="Agno Assist",
    model=OpenAIChat(id="gpt-4.1-nano"),
    instructions=[
        "Search your knowledge before answering the question.",
        "Only include the output in your response. No other text.",
    ],
    knowledge=knowledge_ollama,
    add_datetime_to_instructions=True,
    # Add the chat history to the messages
    add_history_to_messages=True,
    # Number of history runs
    num_history_runs=3,
    markdown=True,
)


# load the knowledge base, comment out after first run
agent.knowledge.load(recreate=False)
agent.print_response("What is Agno?", stream=True)


# if __name__ == "__main__":
# Load the knowledge base, comment out after first run
# Set recreate to True to recreate the knowledge base if needed
# agent.knowledge.load(recreate=False)
# agent.print_response("What is Agno?", stream=True)

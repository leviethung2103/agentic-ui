"""
How to run this file:
1. Run: `python rag_agent_built_in_tool.py` to run the agent
"""
import asyncio
import os

from agno.agent import Agent
from agno.knowledge.light_rag import LightRagKnowledgeBase, lightrag_retriever
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from dotenv import load_dotenv

load_dotenv()

tmp_dir = "tmp/"
os.makedirs(tmp_dir, exist_ok=True)

# Create a knowledge base, loaded with documents from a URL
knowledge_base = LightRagKnowledgeBase(
    lightrag_server_url=os.environ.get("LIGHTRAG_MCP_URL"),
    path=tmp_dir,  # Load documents from a local directory
    # urls=["https://docs.agno.com/introduction/agents.md"],  # Load documents from a URL
)

agent_storage: str = "storage/rag_agents.db"


# Create an agent with the knowledge base and the retriever
rag_agent = Agent(
    name="RAG Agent",
    model=OpenAIChat(id="gpt-4.1-nano"),
    # Agentic RAG is enabled by default when `knowledge` is provided to the Agent.
    knowledge=knowledge_base,
    retriever=lightrag_retriever,
    # search_knowledge=True gives the Agent the ability to search on demand
    # search_knowledge is True by default
    search_knowledge=True,
    storage=SqliteStorage(table_name="rag_agent", db_file=agent_storage),
    instructions=[
        "Include sources in your response.",
        "Always search your knowledge before answering the question.",
        "Use the async_search method to search the knowledge base.",
    ],
    markdown=True,
    debug_mode=True,
)


asyncio.run(rag_agent.aprint_response("Lê viết hưng là ai"))

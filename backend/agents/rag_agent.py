from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from dotenv import load_dotenv
import httpx
import os
from typing import Optional, Dict, Any, List

load_dotenv()

class LightRAGTools:
    def __init__(self, base_url: str = None, api_key: str = None):
        self.base_url = base_url or os.getenv("LIGHTRAG_API_URL", "http://localhost:8000")
        self.api_key = api_key or os.getenv("LIGHTRAG_API_KEY", "")
        self.headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}

    async def query_documents(self, query: str, top_k: int = 5) -> Dict[str, Any]:
        """
        Query documents from LightRAG MCP server
        
        Args:
            query: The search query
            top_k: Number of results to return
            
        Returns:
            Dict containing the query results
        """
        url = f"{self.base_url}/query"
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    json={
                        "query": query,
                        "top_k": top_k,
                        "mode": "hybrid"
                    },
                    headers=self.headers,
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            return {"status": "error", "message": str(e)}

agent_storage: str = "tmp/agents.db"

# Initialize LightRAG tools
lightrag_tools = LightRAGTools()

# Create RAG Agent
rag_agent = Agent(
    name="RAG Agent",
    model=OpenAIChat(id="gpt-4.1-nano"),  # Using GPT-4 for better RAG performance
    tools=[lightrag_tools.query_documents],
    instructions=[
        "You are a helpful assistant that can retrieve and analyze documents using the LightRAG system.",
        "When asked a question, use the query_documents tool to find relevant information.",
        "Always cite your sources when providing information from the documents.",
        "If you don't know the answer, say so rather than making up information.",
    ],
    storage=SqliteStorage(table_name="rag_agent", db_file=agent_storage),
    add_datetime_to_instructions=True,
    add_history_to_messages=True,
    num_history_responses=5,
    markdown=True,
    debug_mode=True,
)

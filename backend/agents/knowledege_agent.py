from agno.agent import AgentKnowledge
from agno.embedder.ollama import OllamaEmbedder
from agno.vectordb.pgvector import PgVector

embeddings = OllamaEmbedder(id="nomic-embed-text:latest").get_embedding("The quick brown fox jumps over the lazy dog.")
print(embeddings)

# Print the embeddings and their dimensions
print(f"Embeddings: {embeddings[:5]}")
print(f"Dimensions: {len(embeddings)}")

# Use an embedder in a knowledge base
knowledge_base = AgentKnowledge(
    vector_db=PgVector(
        db_url="postgresql+psycopg://ai:ai@localhost:5532/ai",
        table_name="ollama_embeddings",
        embedder=OllamaEmbedder(),
    ),
    # 2 references are added to the prompt
    num_documents=2,
)

# Add information to the knowledge base
knowledge_base.load_text("The sky is blue")

# knowledge_base.add_documents(["The quick brown fox jumps over the lazy dog."])

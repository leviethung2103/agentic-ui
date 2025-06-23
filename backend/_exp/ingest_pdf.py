import os
import shutil
from pickle import load

from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

# pip install langchain-community
# pip install langchain-huggingface
# pip install transformers sentence-transformers
# pip install chromadb
# load and process pdf

# model downloaded ~ 500MB

embedding_model_name = "sentence-transformers/all-mpnet-base-v2"


def load_and_process_pdfs(data_dir: str):
    """Load PDFs from directory and split into chunks."""
    loader = DirectoryLoader(data_dir, glob="**/*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()

    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    return chunks


def create_vector_store(chunks, persist_directory: str):
    """Create and persist Chroma vector store."""
    # Clear existing vector store if it exists
    if os.path.exists(persist_directory):
        print(f"Clearing existing vector store at {persist_directory}")
        shutil.rmtree(persist_directory)

    # Initialize HuggingFace embeddings
    embeddings = HuggingFaceEmbeddings(model_name=embedding_model_name, model_kwargs={"device": "cpu"})

    # Create and persist Chroma vector store
    print("Creating new vector store...")
    vectordb = Chroma.from_documents(documents=chunks, embedding=embeddings, persist_directory=persist_directory)
    return vectordb


def main():
    # Define directories
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    db_dir = os.path.join(os.path.dirname(__file__), "chroma_db")

    # Process PDFs
    print("Loading and processing PDFs...")
    chunks = load_and_process_pdfs(data_dir)
    print(f"Created {len(chunks)} chunks from PDFs")

    # Create vector store
    print("Creating vector store...")
    vectordb = create_vector_store(chunks, db_dir)
    print(f"Vector store created and persisted at {db_dir}")


def test_query(query: str, vectordb, k: int = 3):
    """
    Test a query against the vector store and return relevant documents.

    Args:
        query: The query string to search for
        vectordb: The Chroma vector store instance
        k: Number of results to return

    Returns:
        List of relevant document chunks
    """
    # Perform similarity search
    docs = vectordb.similarity_search(query, k=k)

    print(f"\nQuery: {query}")
    print("-" * 80)
    for i, doc in enumerate(docs, 1):
        print(f"\nDocument {i} (Score: {doc.metadata.get('score', 'N/A')}):")
        print("-" * 40)
        print(f"Source: {doc.metadata.get('source', 'Unknown')}")
        print(f"Page: {doc.metadata.get('page', 'N/A')}")
        print("\nContent:")
        print(doc.page_content)
        print()

    return docs


if __name__ == "__main__":
    # main()
    # Daefine directories
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    db_dir = os.path.join(os.path.dirname(__file__), "chroma_db")

    if os.path.exists(db_dir):
        # Load existing vector store
        embeddings = HuggingFaceEmbeddings(model_name=embedding_model_name, model_kwargs={"device": "cpu"})
        vectordb = Chroma(persist_directory=db_dir, embedding_function=embeddings)
        print("Vector store loaded successfully")
    else:
        # Process PDFs and create new vector store
        print("Loading and processing PDFs...")
        chunks = load_and_process_pdfs(data_dir)
        print(f"Created {len(chunks)} chunks from PDFs")

        print("Creating vector store...")
        vectordb = create_vector_store(chunks, db_dir)
        print(f"Vector store created and persisted at {db_dir}")

    while True:
        query = input("User: ") or "exit"
        if query == "exit":
            break
        test_query(query, vectordb)

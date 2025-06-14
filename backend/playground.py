import os

from agno.playground import Playground, serve_playground_app
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from phoenix.otel import register

from agents.finance_agent import finance_agent
from agents.weather_agent import weather_agent
from agents.web_agent import web_agent
from agents.youtube_agent import youtube_agent
from agents.rag_agent import rag_agent

load_dotenv()

# Set environment variables for Arize Phoenix
os.environ["PHOENIX_CLIENT_HEADERS"] = f"api_key={os.getenv('ARIZE_PHOENIX_API_KEY')}"
os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "https://app.phoenix.arize.com"
os.environ["ARIZE_PHOENIX_API_KEY"] = os.getenv("ARIZE_PHOENIX_API_KEY")

# Configure the Phoenix tracer
tracer_provider = register(
    project_name="default",  # Default is 'default'
    auto_instrument=True,  # Automatically use the installed OpenInference instrumentation
)


app = Playground(agents=[web_agent, finance_agent, weather_agent, youtube_agent, rag_agent]).get_app()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.buddyai.online", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    serve_playground_app(
        "playground:app", host="0.0.0.0", port=7777, reload=True
    ) 
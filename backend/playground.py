import os

from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from phoenix.otel import register
from serve_playground_app import serve_playground_app

from agents.finance_agent import finance_agent
from agents.weather_agent import weather_agent
from agents.web_agent import web_agent
from agents.youtube_agent import youtube_agent
from playground import Playground

load_dotenv()

agent_storage: str = "tmp/agents.db"

# Set environment variables for Arize Phoenix
os.environ["PHOENIX_CLIENT_HEADERS"] = f"api_key={os.getenv('ARIZE_PHOENIX_API_KEY')}"
os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "https://app.phoenix.arize.com"
os.environ["ARIZE_PHOENIX_API_KEY"] = os.getenv("ARIZE_PHOENIX_API_KEY")

# Configure the Phoenix tracer
tracer_provider = register(
    project_name="default",  # Default is 'default'
    # project_name="agno-stock-price-agent",  # Default is 'default'
    auto_instrument=True,  # Automatically use the installed OpenInference instrumentation
)

# TavilyTools(
#         search=True,                    # Enable search functionality
#         max_tokens=500,                # Increase max tokens for more detailed results
#         search_depth="basic",        # Use advanced search for comprehensive results
#         format="markdown"               # Format results as markdown
#     )


app = Playground(agents=[web_agent, finance_agent, weather_agent, youtube_agent]).get_app()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.buddyai.online"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    serve_playground_app(
        "playground:app", host="0.0.0.0", port=7777, reload=True
    )  # reload=True is only for development
    # serve_playground_app("playground:app")

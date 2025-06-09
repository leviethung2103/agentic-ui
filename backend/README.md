# Agent UI Backend

This is the backend service for the Agent UI application, providing API endpoints for AI agent interactions.

## Prerequisites

- Python 3.9 or higher
- Conda (recommended) or pip
- Git

## Setup Instructions

### 1. Clone the repository (if you haven't already)
```bash
git clone <repository-url>
cd agent-ui/backend
```

### 2. Create and activate Conda environment
```bash
# Create a new conda environment
conda create -n agentic python=3.9

# Activate the environment
conda activate agentic

# To deactivate the environment when done
# conda deactivate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Set up environment variables
Create a `.env` file in the backend directory with the required environment variables:
```bash
# Example .env file
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./sql_app.db
```

### 5. Run the application
```bash
uvicorn playground:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── playground.py      # Main FastAPI application
├── requirements.txt   # Python dependencies
└── README.md         # This file
```

## Development

- Format code: `black .`
- Check code style: `flake8`
- Run tests: `pytest`

## License

[Add your license information here]
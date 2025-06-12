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
uvicorn playground:app --host 0.0.0.0 --port 7777 --reload
```

## Docker Setup

### 1. Build the Docker image

```bash
docker build -t agent-ui-backend .
```

### 2. Run the Docker container

```bash
docker run -p 7777:7777 --env-file .env agent-ui-backend
```

### 3. Environment Variables

Create a `.env` file with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key  # If using web search
ARIZE_PHOENIX_API_KEY=your_phoenix_key  # For observability
```

### 4. Docker Compose (Optional)

For a more complex setup with multiple services, you can use Docker Compose. Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - '7777:7777'
    env_file:
      - .env
    volumes:
      - .:/app
    restart: unless-stopped
```

Then run:

```bash
docker-compose up --build
```

## Development

### Running with Docker in Development Mode

To enable auto-reload during development:

```bash
docker run -p 7777:7777 --env-file .env -v $(pwd):/app agent-ui-backend
```

### Accessing the Application

Once running, the application will be available at:

- API: `http://localhost:7777`
- Playground UI: `http://localhost:3000` (if frontend is running)

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

### Development Setup

1. **Prerequisites**

   - Python 3.8+
   - pip (Python package manager)

2. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Code Formatting**
   This project uses automated code formatting with pre-commit hooks. To set it up:

   ```bash
   # Install pre-commit
   pip install pre-commit

   # Install git hooks
   pre-commit install
   ```

   The pre-commit hooks will automatically format your code and check for style issues before each commit.

   To manually run the formatters:

   ```bash
   # Run all formatters
   pre-commit run --all-files

   # Run specific formatter (e.g., black)
   pre-commit run black --all-files
   ```

### Development Tools

- **Black**: Code formatter
- **isort**: Import sorter
- **Flake8**: Linter

### Configuration

- Line length: 120 characters
- Uses Black's code style with custom configurations
- Pre-commit hooks for automated formatting

### Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run the formatters before committing
4. Submit a pull request

## License

[Add your license information here]

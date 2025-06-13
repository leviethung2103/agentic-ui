# Use Python 3.10 slim image as base
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=8000 \
    LIGHTRAG_API_URL=http://host.docker.internal:9621

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Install the package in development mode
RUN pip install -e .

# Copy .env.example to .env if it doesn't exist
RUN if [ ! -f .env ] && [ -f .env.example ]; then \
        cp .env.example .env; \
    fi

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["python", "src/lightrag_mcp/main.py"]

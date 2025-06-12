# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.7.1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_CREATE=false \
    PATH="$POETRY_HOME/bin:$PATH"

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -


# Set the working directory in the container
WORKDIR /app

# Copy only the requirements files first to leverage Docker cache
COPY requirements*.txt ./

# Install dependencies
RUN pip install --upgrade pip && \
    if [ -f requirements.txt ]; then pip install -r requirements.txt; fi && \
    if [ -f requirements-dev.txt ]; then pip install -r requirements-dev.txt; fi

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 7777

# Command to run the application using Uvicorn
CMD ["uvicorn", "playground:app", "--host", "0.0.0.0", "--port", "7777", "--reload"]

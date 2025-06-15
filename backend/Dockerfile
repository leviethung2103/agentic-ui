# -------- Stage 1: Builder --------
    FROM python:3.11-slim as builder

    # Set environment variables
    ENV PYTHONDONTWRITEBYTECODE=1 \
        PYTHONUNBUFFERED=1
    
    # Install system build tools
    RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        && rm -rf /var/lib/apt/lists/*
    
    # Set working directory
    WORKDIR /app
    
    # Install pip and dependencies
    COPY requirements.txt .
    RUN pip install --upgrade pip \
        && pip install --prefix=/install -r requirements.txt
    
    # Copy application code
    COPY . .
    
    # -------- Stage 2: Runtime --------
    FROM python:3.11-slim
    
    # Set environment variables
    ENV PYTHONDONTWRITEBYTECODE=1 \
        PYTHONUNBUFFERED=1
    
    # Set working directory
    WORKDIR /app
    
    # Copy installed site-packages from builder
    COPY --from=builder /install /usr/local
    
    # Copy application code (again for cleanliness)
    COPY --from=builder /app /app
    
    # Expose the application port
    EXPOSE 7777
    
    # Run the app
    CMD ["uvicorn", "playground:app", "--host", "0.0.0.0", "--port", "7777"]
    
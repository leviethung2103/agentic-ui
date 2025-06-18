# Agentic Platform Deployment

This directory contains the deployment configuration for the Agentic Platform, including the Qdrant vector database service.

## Services

### Qdrant Vector Database

Qdrant is a vector similarity search engine and database used for storing and retrieving vector embeddings.

- **Dashboard URL**: http://localhost:6333/dashboard
- **REST API**: http://localhost:6333
- **gRPC API**: localhost:6334
- **Storage**: Persistent volume at `./qdrant_storage`

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Start all services:
   ```bash
   docker-compose up -d
   ```

2. Access the Qdrant dashboard at http://localhost:6333/dashboard

3. To stop the services:
   ```bash
   docker-compose down
   ```

## Configuration

### Environment Variables

#### Qdrant

- `QDRANT_ALLOW_RECOVERY_MODE`: Set to `true` to allow recovery mode (default: `true`)

### Volumes

- `qdrant_storage`: Persistent storage for Qdrant data

## Connecting to Qdrant from Services

Use the following connection details to connect to Qdrant from other services:

- Host: `qdrant` (when using Docker Compose networking)
- Port: `6333` (REST API) or `6334` (gRPC)
- URL: `http://qdrant:6333`

## Troubleshooting

### View Logs

```bash
docker-compose logs -f qdrant
```

### Reset Qdrant Data

To completely reset the Qdrant database (this will delete all data):

```bash
docker-compose down -v
docker-compose up -d
```

## Security Considerations

- The default configuration is for development only
- For production, consider:
  - Enabling authentication
  - Setting up TLS/SSL
  - Configuring proper network isolation
  - Setting up backup strategies for persistent data

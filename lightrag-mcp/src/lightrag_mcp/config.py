"""
Configuration module for LightRAG MCP server.
Uses python-dotenv to load environment variables from .env file.
"""

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

# Load environment variables from .env file
# env_path = Path(__file__).parent.parent.parent.parent / '.env'
# print('env_path', env_path)
load_dotenv(override=True)
# load_dotenv(dotenv_path=env_path, override=True)


def get_env_variable(name: str, default: Optional[str] = None) -> str:
    """Get environment variable or return default/raise error."""
    value = os.getenv(name, default)
    if value is None:
        raise ValueError(f"Environment variable {name} is not set and no default provided")
    return value


# Server configuration with environment variable fallbacks
LIGHTRAG_API_HOST = get_env_variable("LIGHTRAG_API_HOST", "160.187.240.79")
LIGHTRAG_API_PORT = int(get_env_variable("LIGHTRAG_API_PORT", "9621"))
LIGHTRAG_API_KEY = get_env_variable("LIGHTRAG_API_KEY", "")

# Construct base URL
LIGHTRAG_API_BASE_URL = os.getenv("LIGHTRAG_API_BASE_URL", f"http://{LIGHTRAG_API_HOST}:{LIGHTRAG_API_PORT}")

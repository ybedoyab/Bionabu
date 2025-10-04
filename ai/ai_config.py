"""
Configuration module for the Space Biology AI processing system.
Contains all configuration settings and constants.
"""

import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables from root .env file
root_env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
ai_env_path = os.path.join(os.path.dirname(__file__), '.env')

# Try root .env first, then fallback to ai/.env
if os.path.exists(root_env_path):
    load_dotenv(root_env_path)
elif os.path.exists(ai_env_path):
    load_dotenv(ai_env_path)

class Config:
    """Main configuration class for the AI processing system."""
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    OPENAI_MAX_TOKENS: int = 4000
    OPENAI_TEMPERATURE: float = 0.1
    
    # Data Processing Configuration
    MAX_CONCURRENT_REQUESTS: int = int(os.getenv("MAX_CONCURRENT_REQUESTS", "5"))
    REQUEST_DELAY: float = float(os.getenv("REQUEST_DELAY", "1.0"))
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "1000"))
    
    # File Paths (with fallback to ai/ subdirectories)
    DATA_DIR: str = os.getenv("DATA_DIR", os.path.join(os.path.dirname(__file__), "data"))
    OUTPUT_DIR: str = os.getenv("OUTPUT_DIR", os.path.join(os.path.dirname(__file__), "output"))
    CACHE_DIR: str = os.getenv("CACHE_DIR", os.path.join(os.path.dirname(__file__), "cache"))
    CSV_FILE: str = "SB_publication_PMC.csv"
    
    # Processing Settings
    MAX_ARTICLES_TO_PROCESS: Optional[int] = None  # Set to None for all articles
    BATCH_SIZE: int = 10
    
    # OpenAI Prompts
    ORGANISM_EXTRACTION_PROMPT = """
    Analyze the following scientific article title and extract information about organisms mentioned.
    Return a JSON object with the following structure:
    {{
        "organisms": ["organism1", "organism2"],
        "organism_types": ["mammal", "plant", "bacteria", "etc"],
        "study_subjects": ["cells", "tissues", "organs", "etc"],
        "environment": "space/microgravity/earth"
    }}
    
    Article Title: {title}
    """
    
    ARTICLE_SUMMARY_PROMPT = """
    Provide a comprehensive summary of this scientific article about space biology research.
    Include the following sections:
    1. Research Objective
    2. Methodology
    3. Key Findings
    4. Implications for Space Exploration
    5. Organisms Studied
    6. Environmental Conditions
    
    Article Title: {title}
    Article Content: {content}
    
    Format the response in clear, structured sections.
    """
    
    KNOWLEDGE_GRAPH_PROMPT = """
    Analyze this space biology research and identify key relationships and connections.
    Return a JSON object with:
    {{
        "key_concepts": ["concept1", "concept2"],
        "biological_processes": ["process1", "process2"],
        "space_effects": ["effect1", "effect2"],
        "research_gaps": ["gap1", "gap2"],
        "connections": [
            {{"from": "concept1", "to": "concept2", "relationship": "affects"}}
        ]
    }}
    
    Article: {title}
    Content: {content}
    """

# Validate configuration
def validate_config() -> bool:
    """Validate that all required configuration is present."""
    if not Config.OPENAI_API_KEY:
        print("ERROR: OPENAI_API_KEY environment variable is required")
        return False
    
    if not os.path.exists(Config.DATA_DIR):
        print(f"ERROR: Data directory {Config.DATA_DIR} does not exist")
        return False
    
    return True

# Create necessary directories
def setup_directories():
    """Create necessary directories if they don't exist."""
    os.makedirs(Config.OUTPUT_DIR, exist_ok=True)
    os.makedirs(Config.CACHE_DIR, exist_ok=True)

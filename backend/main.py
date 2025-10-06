"""
Main FastAPI application for the NASA Space Biology AI Backend.
"""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import time
import logging
from typing import List

from config import settings, validate_settings
from models import (
    ResearchQueryRequest, ArticleSelectionRequest, ChatRequest,
    RecommendationsResponse, SummariesResponse, ChatResponse,
    ErrorResponse, StatusResponse, HealthResponse
)
from ai_service import get_ai_service, initialize_ai_service

# Configure logging
logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL))
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered research assistant for NASA Space Biology publications",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware - comprehensive configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",  # Vite default port
        "https://bionabu.web.app",
        "https://bionabu.firebaseapp.com",
        "https://bionabu-ai-backend-spelnuireq-uc.a.run.app",
        "https://bionabu-data-backend-spelnuireq-uc.a.run.app",
        "*"  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
    ],
    expose_headers=[
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods", 
        "Access-Control-Allow-Headers",
        "Content-Type",
        "Authorization"
    ],
    max_age=86400,  # Cache preflight for 24 hours
)

# Custom middleware to ensure CORS headers are always present
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    """Add CORS headers to all responses."""
    response = await call_next(request)
    
    # Add CORS headers to all responses
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Accept-Language, Content-Language, Content-Type, Authorization, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Max-Age"] = "86400"
    
    return response

# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error_code="INTERNAL_SERVER_ERROR",
            message="An internal server error occurred",
            details={"error": str(exc)}
        ).dict()
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    logger.info("Starting NASA Space Biology AI API...")
    
    # Validate settings
    if not validate_settings():
        logger.error("Settings validation failed")
        raise Exception("Invalid configuration")
    
    # Initialize AI service
    if not initialize_ai_service():
        logger.error("AI service initialization failed")
        raise Exception("Failed to initialize AI service")
    
    logger.info("API startup completed successfully")

# Handle preflight OPTIONS requests
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    """Handle preflight OPTIONS requests for CORS."""
    return JSONResponse(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH",
            "Access-Control-Allow-Headers": "Accept, Accept-Language, Content-Language, Content-Type, Authorization, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers",
            "Access-Control-Max-Age": "86400",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Simple health check endpoint."""
    return HealthResponse()

# CORS test endpoint
@app.get("/cors-test")
async def cors_test():
    """Test endpoint to verify CORS configuration."""
    return {
        "message": "CORS is working!",
        "timestamp": time.time(),
        "cors_headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Origin"
        }
    }

# System status endpoint
@app.get(f"{settings.API_V1_STR}/research/status", response_model=StatusResponse)
async def get_status():
    """Get system status and available articles count."""
    try:
        ai_service = get_ai_service()
        status = ai_service.get_status()
        
        return StatusResponse(
            status="operational" if status["service_healthy"] else "degraded",
            articles_available=status["articles_available"],
            openai_configured=status["openai_configured"]
        )
    except Exception as e:
        logger.error(f"Error getting status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error retrieving system status"
        )

# Get articles list for debugging
@app.get(f"{settings.API_V1_STR}/research/articles")
async def get_articles_list(limit: int = 10):
    """Get list of available articles for debugging."""
    try:
        ai_service = get_ai_service()
        articles = ai_service.get_articles_list(limit)
        
        return {
            "articles": articles,
            "count": len(articles),
            "total_available": ai_service.get_status()["articles_available"]
        }
    except Exception as e:
        logger.error(f"Error getting articles list: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error retrieving articles list"
        )

# Step 1: Get article recommendations
@app.post(f"{settings.API_V1_STR}/research/recommendations", response_model=RecommendationsResponse)
async def get_recommendations(request: ResearchQueryRequest):
    """
    Step 1: Get article recommendations for a research query.
    
    This endpoint analyzes the research query and returns the most relevant articles
    from the NASA Space Biology database with relevance scores and reasoning.
    """
    try:
        ai_service = get_ai_service()
        
        # Validate that articles are available
        if ai_service.get_status()["articles_available"] == 0:
            raise HTTPException(
                status_code=503,
                detail="No analyzed articles available. Please run analysis first."
            )
        
        # Get recommendations
        response = ai_service.get_recommendations(
            request.research_query,
            request.top_k
        )
        
        logger.info(f"Generated {len(response['recommendations'])} recommendations")
        
        return RecommendationsResponse(**response)
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting recommendations: {str(e)}"
        )

# Step 2: Get summaries and suggested questions
@app.post(f"{settings.API_V1_STR}/research/summaries", response_model=SummariesResponse)
async def get_summaries(request: ArticleSelectionRequest):
    """
    Step 2: Get summaries and suggested questions for selected articles.
    
    This endpoint generates detailed summaries of the selected articles and
    creates relevant research questions that the user can explore further.
    """
    try:
        ai_service = get_ai_service()
        
        # Generate summaries and questions
        response = ai_service.get_summaries_and_questions(
            request.selected_articles,
            request.research_query
        )
        
        logger.info(f"Generated summaries")
        
        return SummariesResponse(**response)
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error generating summaries: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating summaries: {str(e)}"
        )

# Step 3: Interactive chat
@app.post(f"{settings.API_V1_STR}/research/chat", response_model=ChatResponse)
async def chat_with_articles(request: ChatRequest):
    """
    Step 3: Interactive chat with selected articles.
    
    This endpoint processes user questions about the selected articles and
    provides AI-powered responses with follow-up questions for continued exploration.
    """
    try:
        ai_service = get_ai_service()
        
        # Process chat
        response = ai_service.chat_with_articles(
            request.user_question,
            request.selected_articles,
            request.research_query,
            request.chat_history
        )
        
        logger.info(f"Processed chat question")
        
        return ChatResponse(**response)
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat: {str(e)}"
        )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "NASA Space Biology AI API",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
        "status": f"{settings.API_V1_STR}/research/status"
    }

if __name__ == "__main__":
    import uvicorn
    
    print("Starting NASA Space Biology AI API...")
    print("Make sure you have:")
    print("1. OpenAI API key configured in .env")
    print("2. Analyzed articles available")
    print("3. All dependencies installed")
    
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True,
        log_level=settings.LOG_LEVEL.lower()
    )

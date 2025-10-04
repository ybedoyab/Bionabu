"""
Pydantic models for the NASA Space Biology API.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

# Request Models

class ResearchQueryRequest(BaseModel):
    """Request model for research query."""
    research_query: str = Field(..., description="Research query or topic", min_length=1, max_length=500)
    top_k: int = Field(default=5, description="Number of recommendations to return", ge=1, le=20)

class ArticleSelectionRequest(BaseModel):
    """Request model for article selection."""
    selected_articles: List[Dict[str, Any]] = Field(..., description="Selected article recommendations")
    research_query: str = Field(..., description="Original research query", min_length=1)

class ChatRequest(BaseModel):
    """Request model for chat interaction."""
    user_question: str = Field(..., description="User's question", min_length=1, max_length=1000)
    selected_articles: List[Dict[str, Any]] = Field(..., description="Selected articles for context")
    research_query: str = Field(..., description="Original research query")
    chat_history: Optional[List[Dict[str, Any]]] = Field(default=[], description="Previous chat messages")

# Response Models

class ArticleRecommendation(BaseModel):
    """Article recommendation model."""
    id: str = Field(..., description="Unique recommendation ID")
    title: str = Field(..., description="Article title")
    relevance_score: float = Field(..., description="Relevance score (0-10)", ge=0, le=10)
    relevance_reasons: List[str] = Field(..., description="Reasons for relevance")
    research_applications: List[str] = Field(..., description="Research applications")
    url: str = Field(..., description="Article URL")
    organisms: List[str] = Field(default=[], description="Organisms mentioned")
    key_concepts: List[str] = Field(default=[], description="Key concepts")
    selected: bool = Field(default=False, description="Whether this article is selected")

class RecommendationsResponse(BaseModel):
    """Response model for article recommendations."""
    status: str = Field(default="success", description="Response status")
    step: str = Field(default="recommendations", description="Current step")
    research_query: str = Field(..., description="Research query")
    recommendations: List[ArticleRecommendation] = Field(..., description="Article recommendations")
    metadata: Dict[str, Any] = Field(..., description="Response metadata")

class ArticleSummary(BaseModel):
    """Article summary model."""
    article_id: str = Field(..., description="Article ID")
    title: str = Field(..., description="Article title")
    summary: str = Field(..., description="Article summary")
    url: str = Field(..., description="Article URL")
    relevance_score: float = Field(..., description="Relevance score")
    organisms: List[str] = Field(default=[], description="Organisms mentioned")
    key_concepts: List[str] = Field(default=[], description="Key concepts")

class SuggestedQuestion(BaseModel):
    """Suggested question model."""
    id: str = Field(..., description="Question ID")
    question: str = Field(..., description="Question text")
    type: str = Field(..., description="Question type (methodological, conceptual, etc.)")
    focus: str = Field(..., description="What this question explores")
    article_id: Optional[str] = Field(default=None, description="Related article ID")
    article_title: Optional[str] = Field(default=None, description="Related article title")

class ResearchInsights(BaseModel):
    """Research insights model."""
    overall_insights: str = Field(..., description="Overall research insights")
    articles_analyzed: int = Field(..., description="Number of articles analyzed")
    research_query: str = Field(..., description="Research query")

class SummariesResponse(BaseModel):
    """Response model for summaries and questions."""
    status: str = Field(default="success", description="Response status")
    step: str = Field(default="summaries_and_questions", description="Current step")
    research_query: str = Field(..., description="Research query")
    article_summaries: List[ArticleSummary] = Field(..., description="Article summaries")
    suggested_questions: List[SuggestedQuestion] = Field(..., description="Suggested questions")
    research_insights: ResearchInsights = Field(..., description="Research insights")
    metadata: Dict[str, Any] = Field(..., description="Response metadata")

class ChatMessage(BaseModel):
    """Chat message model."""
    id: str = Field(..., description="Message ID")
    type: str = Field(..., description="Message type (user/assistant)")
    content: str = Field(..., description="Message content")
    timestamp: float = Field(..., description="Message timestamp")
    follow_up_questions: Optional[List[Dict[str, Any]]] = Field(default=[], description="Follow-up questions")

class FollowUpQuestion(BaseModel):
    """Follow-up question model."""
    id: str = Field(..., description="Question ID")
    question: str = Field(..., description="Question text")
    type: str = Field(..., description="Question type")

class ChatResponse(BaseModel):
    """Response model for chat interaction."""
    status: str = Field(default="success", description="Response status")
    step: str = Field(default="chat", description="Current step")
    research_query: str = Field(..., description="Research query")
    chat_history: List[ChatMessage] = Field(..., description="Chat history")
    follow_up_questions: List[FollowUpQuestion] = Field(default=[], description="Follow-up questions")
    metadata: Dict[str, Any] = Field(..., description="Response metadata")

class ErrorResponse(BaseModel):
    """Error response model."""
    status: str = Field(default="error", description="Response status")
    error_code: str = Field(..., description="Error code")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Error details")
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp(), description="Error timestamp")

class StatusResponse(BaseModel):
    """System status response model."""
    status: str = Field(..., description="System status")
    articles_available: int = Field(..., description="Number of available articles")
    openai_configured: bool = Field(..., description="Whether OpenAI is configured")
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp(), description="Response timestamp")

class HealthResponse(BaseModel):
    """Health check response model."""
    status: str = Field(default="healthy", description="Health status")
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp(), description="Response timestamp")

# 🚀 NASA Space Biology AI Research Assistant

An AI-powered research assistant for NASA Space Biology publications that helps scientists discover, explore, and interact with space biology research through an intelligent conversational interface.

## 🎯 Overview

This system provides a complete research workflow for space biology scientists:

1. **Research Query** → AI recommends relevant articles
2. **Article Selection** → Get detailed summaries and research questions  
3. **Interactive Chat** → Ask questions and explore research topics

## 🏗️ Architecture

```
Bionabu/
├── .env                  # 🎯 Centralized configuration
├── env.example           # Configuration template
├── ai/                   # 🤖 AI module (Python)
│   ├── main.py          # CLI interface
│   ├── research_flow.py # Research workflow
│   ├── openai_client.py # OpenAI integration
│   ├── data_processor.py# Data processing
│   └── output/          # Analyzed articles
├── backend/              # ⚡ FastAPI backend
│   ├── main.py          # API server
│   ├── ai_service.py    # AI integration
│   ├── models.py        # Data models
│   └── config.py        # Configuration
├── frontend/             # ⚛️ React frontend
│   ├── src/             # React components
│   ├── package.json     # Dependencies
│   └── public/          # Static assets
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** with pip
- **Node.js 16+** with npm
- **OpenAI API Key** (get from [OpenAI Platform](https://platform.openai.com/api-keys))

### 1. Setup Configuration
```bash
# Clone and configure
git clone <repository>
cd Bionabu

# Setup environment (ONE TIME ONLY)
cp env.example .env
# Edit .env and add your OpenAI API key
```

### 2. Prepare AI Data
```bash
cd ai
pip install -r requirements.txt
python main.py analyze
```

### 3. Start Backend
```bash
cd ../backend
pip install -r requirements.txt
python main.py
```

### 4. Start Frontend
```bash
cd ../frontend
npm install
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🎯 Features

### Research Workflow
- **Intelligent Recommendations**: AI-powered article suggestions with relevance scoring
- **Interactive Selection**: Click to select articles with visual feedback
- **Detailed Summaries**: AI-generated summaries with key insights
- **Suggested Questions**: Pre-generated research questions for exploration
- **Conversational Chat**: Interactive Q&A about selected articles

### User Interface
- **Modern Design**: Clean, responsive interface with Tailwind CSS
- **Real-time Updates**: Live chat with typing indicators
- **Loading States**: Visual feedback during AI processing
- **Error Handling**: User-friendly error messages and recovery

### Technical Features
- **Centralized Configuration**: Single `.env` file for all settings
- **Modular Architecture**: Separate AI, backend, and frontend modules
- **API-First Design**: RESTful API with comprehensive documentation
- **Production Ready**: Scalable, secure, and maintainable codebase

## 🔧 Configuration

### Environment Variables
All configuration is centralized in the root `.env` file:

```bash
# =============================================================================
# AI MODULE CONFIGURATION
# =============================================================================
OPENAI_API_KEY=your_openai_api_key_here    # REQUIRED
OPENAI_MODEL=gpt-3.5-turbo
MAX_CONCURRENT_REQUESTS=5
REQUEST_DELAY=1.0

# =============================================================================
# BACKEND API CONFIGURATION  
# =============================================================================
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO

# =============================================================================
# FRONTEND CONFIGURATION
# =============================================================================
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

### Production Settings
```bash
# AI Module Production
OPENAI_MODEL=gpt-4
MAX_CONCURRENT_REQUESTS=3
REQUEST_DELAY=2.0

# Backend Production
LOG_LEVEL=WARNING
CORS_ORIGINS=https://yourdomain.com

# Frontend Production
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
REACT_APP_API_BASE_URL=https://your-api-domain.com
```

## 📊 API Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /api/v1/research/status` - System status
- `GET /api/v1/research/articles` - List available articles

### Research Flow
1. `POST /api/v1/research/recommendations` - Get article recommendations
2. `POST /api/v1/research/summaries` - Get summaries and questions
3. `POST /api/v1/research/chat` - Interactive chat

### Example Usage
```bash
# Get recommendations
curl -X POST "http://localhost:8000/api/v1/research/recommendations" \
  -H "Content-Type: application/json" \
  -d '{"research_query": "microbiology in space", "top_k": 5}'

# Get summaries
curl -X POST "http://localhost:8000/api/v1/research/summaries" \
  -H "Content-Type: application/json" \
  -d '{"research_query": "microbiology in space", "selected_articles": [...]}'

# Chat with articles
curl -X POST "http://localhost:8000/api/v1/research/chat" \
  -H "Content-Type: application/json" \
  -d '{"user_question": "What are the main challenges?", "research_query": "...", "selected_articles": [...], "chat_history": []}'
```

## 🎨 Frontend Components

### Core Components
- **Header**: System status and navigation
- **ResearchQuery**: Initial research input with examples
- **ArticleRecommendations**: Interactive article selection
- **ArticleSummaries**: Detailed summaries and questions
- **ChatInterface**: Real-time conversational interface

### State Management
- **ResearchContext**: Global state for research flow
- **Reducer Pattern**: Predictable state updates
- **API Integration**: Seamless backend communication

## 🔍 Development

### Project Structure
```
src/
├── components/           # React components
│   ├── Header.js        # App header
│   ├── ResearchQuery.js # Query input
│   ├── ArticleRecommendations.js # Article selection
│   ├── ArticleSummaries.js # Summaries display
│   ├── ChatInterface.js # Chat interface
│   ├── LoadingSpinner.js # Loading states
│   └── ErrorAlert.js   # Error handling
├── context/
│   └── ResearchContext.js # Global state
├── services/
│   └── api.js          # API communication
├── App.js              # Main application
└── index.js            # Entry point
```

### Available Scripts
```bash
# Development
npm start              # Start development server
npm build              # Build for production
npm test               # Run tests

# Backend
python main.py         # Start API server
python -m uvicorn main:app --reload # Development mode

# AI Module
python main.py analyze # Analyze articles
python main.py process # Process raw data
```

## 🚀 Deployment

### Backend Deployment
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy the 'build' folder to your hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Frontend Dockerfile  
FROM node:16-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build
CMD ["npm", "start"]
```

## 🔒 Security

### Best Practices
- **API Key Protection**: OpenAI API key stored server-side only
- **Input Validation**: All inputs validated with Pydantic
- **CORS Configuration**: Proper cross-origin settings
- **Error Handling**: No sensitive data in error messages
- **Rate Limiting**: Built-in API rate limiting

### Production Security
- **HTTPS**: Use SSL certificates in production
- **Environment Variables**: Secure configuration management
- **Access Control**: Implement authentication as needed
- **Monitoring**: Set up logging and monitoring

## 📈 Performance

### Optimization Features
- **Caching**: Analyzed articles cached for fast access
- **Async Processing**: Non-blocking AI operations
- **Rate Limiting**: Respect OpenAI API limits
- **Code Splitting**: Optimized frontend bundle

### Performance Metrics
- **Recommendations**: ~30-60 seconds for 5 articles
- **Summaries**: ~10-20 seconds per article
- **Chat**: ~5-15 seconds per response
- **Frontend**: Fast initial load with code splitting

## 🐛 Troubleshooting

### Common Issues

1. **"No analyzed articles available"**
   ```bash
   cd ai
   python main.py analyze
   ```

2. **"OpenAI API key not configured"**
   - Check `.env` file exists in root directory
   - Verify `OPENAI_API_KEY` is set correctly

3. **"Backend connection failed"**
   - Ensure backend is running on port 8000
   - Check firewall settings
   - Verify CORS configuration

4. **"Frontend build errors"**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode
```bash
# Enable debug logging
REACT_APP_DEBUG=true npm start
LOG_LEVEL=DEBUG python main.py
```

## 📚 Documentation

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Code Documentation
- **Inline Comments**: Comprehensive code documentation
- **Type Hints**: Python type annotations
- **PropTypes**: React component prop validation

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration
- **React**: Functional components with hooks
- **CSS**: Tailwind CSS utility classes

## 📄 License

This project is developed for the NASA Space Apps Challenge 2025.

## 🎉 Acknowledgments

- **NASA Space Biology**: For providing the research data
- **OpenAI**: For providing the AI capabilities
- **FastAPI**: For the excellent Python web framework
- **React**: For the powerful frontend framework
- **Tailwind CSS**: For the utility-first CSS framework

---

**Happy Researching! 🚀🔬**
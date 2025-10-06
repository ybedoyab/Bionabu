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
├── .env                    # 🎯 Centralized configuration
├── env.example             # Configuration template
├── cloudbuild.yaml         # Google Cloud Build pipeline
├── deploy.ps1             # Deployment automation script
├── docker-compose.yml     # Local development containers
├── ai/                    # 🤖 AI Processing Module (Python)
│   ├── main.py           # CLI interface & data processing
│   ├── research_flow.py  # Research workflow logic
│   ├── openai_client.py  # OpenAI integration
│   ├── data_processor.py # Data processing utilities
│   ├── research_cli.py   # Command-line interface
│   ├── data/             # Raw NASA publication data
│   └── output/           # Processed & analyzed articles
├── backend/               # ⚡ AI Backend API (FastAPI)
│   ├── main.py           # API server
│   ├── ai_service.py     # AI integration service
│   ├── models.py         # Pydantic data models
│   ├── config.py         # Configuration management
│   └── requirements.txt  # Python dependencies
├── data/                  # 📊 Data Backend API (FastAPI)
│   ├── app.py            # Data API server
│   ├── requirements.txt  # Python dependencies
│   ├── scripts/          # Data processing scripts
│   └── data/             # Processed datasets
└── frontend/              # ⚛️ React Frontend (Vite + TypeScript)
    ├── src/              # React components & services
    ├── package.json      # Node.js dependencies
    ├── firebase.json     # Firebase hosting config
    └── public/           # Static assets
```

## 🛠️ Tech Stack

### Backend Services
- **AI Backend**: FastAPI + OpenAI GPT + Python 3.12
- **Data Backend**: FastAPI + Gemini AI + Python 3.12
- **AI Processing**: OpenAI API, LangChain, Pandas, NumPy

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + DaisyUI
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Infrastructure & Deployment
- **Containerization**: Docker + Docker Compose
- **Cloud Platform**: Google Cloud Platform
- **CI/CD**: Google Cloud Build
- **Hosting**: Google Cloud Run + Firebase Hosting
- **Storage**: Google Cloud Storage

## 🚀 Quick Start

### Prerequisites
- **Python 3.12+** with pip
- **Node.js 20+** with npm
- **Docker** (optional, for containerized development)
- **API Keys**: OpenAI API Key, Gemini API Key

### 1. Setup Configuration
```bash
# Clone and configure
git clone <repository>
cd Bionabu

# Setup environment (ONE TIME ONLY)
cp env.example .env
# Edit .env with your API keys (see env.example for all variables)
```

### 2. Local Development

#### Option A: Docker Development (Recommended)
```bash
# Start all services with Docker Compose
docker-compose up --build

# Access services:
# Frontend: http://localhost:3000
# AI Backend API: http://localhost:8000
# Data Backend API: http://localhost:8081
```

#### Option B: Manual Development
```bash
# Prepare AI data
cd ai
pip install -r requirements.txt
python main.py analyze

# Start AI Backend
cd ../backend
pip install -r requirements.txt
python main.py

# Start Data Backend (new terminal)
cd ../data
pip install -r requirements.txt
python app.py

# Start Frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **AI Backend API**: http://localhost:8000/docs
- **Data Backend API**: http://localhost:8081/docs
- **Health Checks**: 
  - AI Backend: http://localhost:8000/health
  - Data Backend: http://localhost:8081/getAll

## 🎯 Features

### Research Workflow
- **Intelligent Recommendations**: AI-powered article suggestions with relevance scoring
- **Interactive Selection**: Click to select articles with visual feedback
- **Detailed Summaries**: AI-generated summaries with key insights
- **Suggested Questions**: Pre-generated research questions for exploration
- **Conversational Chat**: Interactive Q&A about selected articles

### User Interface
- **Modern Design**: Clean, responsive interface with Tailwind CSS
- **Category Search**: Quick access buttons for Humans, Plants, Microbiology, Radiation, Technology, Mice, and Space research
- **Real-time Updates**: Live chat with typing indicators
- **Loading States**: Visual feedback during AI processing
- **Error Handling**: User-friendly error messages and recovery

### Technical Features
- **Dual Backend Architecture**: Separate AI and Data APIs for optimal performance
- **Centralized Configuration**: Single `.env` file for all settings
- **Modular Architecture**: Separate AI, backend, and frontend modules
- **API-First Design**: RESTful APIs with comprehensive documentation
- **Production Ready**: Scalable, secure, and maintainable codebase

## 🔧 Configuration

### Environment Variables
All configuration is centralized in the root `.env` file. See `env.example` for a complete list of available variables including:

- **AI Module**: OpenAI API configuration, processing settings
- **Backend APIs**: Host/port configuration, CORS settings
- **Frontend**: API endpoints, feature flags, UI settings
- **Deployment**: Firebase tokens, logging levels

## 📊 API Architecture

### AI Backend API (`/api/v1/`)
- `GET /health` - Health check
- `GET /research/status` - System status
- `POST /research/recommendations` - Get article recommendations
- `POST /research/summaries` - Get summaries and questions
- `POST /research/chat` - Interactive chat

### Data Backend API (`/api/v1/`)
- `GET /getAll` - Get all processed data
- `GET /search` - Search with AI assistance
- `GET /searchsinia` - Search without AI
- `POST /stats/query-images` - Query relevant images

## 🚀 Deployment

### Google Cloud Platform Deployment
```bash
# One-command deployment
.\deploy.ps1 -ProjectId "your-project" -Region "us-central1"

# This will:
# 1. Build Docker images for both backends
# 2. Deploy to Google Cloud Run
# 3. Build and deploy frontend to Firebase Hosting
# 4. Configure all environment variables and CORS
```

### Docker Deployment
```bash
# Production deployment with Docker
docker-compose -f docker-compose.prod.yml up -d

# Or build individual services
docker build -f backend/Dockerfile.prod -t ai-backend .
docker build -f data/Dockerfile.prod -t data-backend .
```

## 🔍 Development

### Project Structure
```
src/
├── components/           # React components
│   ├── layout/          # Layout components (Navbar, Footer, etc.)
│   ├── search/          # Search-related components
│   └── common/          # Shared components
├── context/             # React context for state management
├── pages/               # Page components (Home, SearchPage)
├── services/            # API communication layer
└── assets/              # Static assets
```

### Available Scripts
```bash
# Frontend Development
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Backend Development
python main.py           # Start AI backend server
python app.py            # Start data backend server
python -m uvicorn main:app --reload # Development mode

# AI Module
python main.py analyze   # Analyze articles
python main.py process   # Process raw data
```

## 🔒 Security & Performance

### Security Features
- **API Key Protection**: All API keys stored server-side only
- **Input Validation**: All inputs validated with Pydantic
- **CORS Configuration**: Proper cross-origin settings
- **Rate Limiting**: Built-in API rate limiting
- **Error Handling**: No sensitive data in error messages

### Performance Optimizations
- **Dual API Architecture**: Separated AI and data processing for better scaling
- **Caching**: Analyzed articles cached for fast access
- **Async Processing**: Non-blocking AI operations
- **Code Splitting**: Optimized frontend bundle with Vite
- **Container Optimization**: Multi-stage Docker builds

## 🐛 Troubleshooting

### Common Issues

1. **"No analyzed articles available"**
   ```bash
   cd ai && python main.py analyze
   ```

2. **"API key not configured"**
   - Check `.env` file exists and contains required keys
   - Verify API keys are valid and have proper permissions

3. **"CORS policy error"**
   - Ensure `CORS_ORIGINS` includes your frontend URL
   - For production, use deployed URLs in configuration

4. **"Docker build failures"**
   ```bash
   docker system prune -f  # Clean Docker cache
   docker-compose down -v  # Remove volumes
   docker-compose up --build  # Rebuild
   ```

## 📚 Documentation

### API Documentation
- **AI Backend Swagger**: `http://localhost:8000/docs`
- **Data Backend Swagger**: `http://localhost:8081/docs`
- **API Health Checks**: Available at `/health` endpoints

### Code Documentation
- **Inline Comments**: Comprehensive code documentation
- **Type Hints**: Python type annotations throughout
- **TypeScript**: Full type safety in frontend
- **Component Documentation**: React components with proper prop types

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Set up local development environment
4. Make your changes
5. Test with both Docker and manual setups
6. Submit a pull request

### Code Style
- **Python**: Follow PEP 8 guidelines
- **TypeScript/React**: Use ESLint configuration
- **Docker**: Follow multi-stage build patterns
- **API Design**: RESTful principles with proper HTTP status codes

## 📄 License

This project is developed for the NASA Space Apps Challenge 2025.

## 🎉 Acknowledgments

- **NASA Space Biology**: For providing the research data
- **OpenAI**: For providing the AI capabilities
- **Google Gemini**: For additional AI processing
- **FastAPI**: For the excellent Python web framework
- **React + Vite**: For the modern frontend stack
- **Tailwind CSS**: For the utility-first CSS framework
- **Google Cloud Platform**: For the deployment infrastructure

---

**Happy Researching! 🚀🔬**
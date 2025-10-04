import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 120000, // 2 minutes timeout for AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Service Functions
export const apiService = {
  // Health and Status
  async getHealth() {
    const response = await api.get('/health', { baseURL: API_BASE_URL });
    return response.data;
  },

  async getStatus() {
    const response = await api.get('/research/status');
    return response.data;
  },

  async getArticlesList(limit = 10) {
    const response = await api.get(`/research/articles?limit=${limit}`);
    return response.data;
  },

  // Research Flow - Step 1: Get Recommendations
  async getRecommendations(researchQuery, topK = 5) {
    const response = await api.post('/research/recommendations', {
      research_query: researchQuery,
      top_k: topK,
    });
    return response.data;
  },

  // Research Flow - Step 2: Get Summaries and Questions
  async getSummaries(selectedArticles, researchQuery) {
    const response = await api.post('/research/summaries', {
      selected_articles: selectedArticles,
      research_query: researchQuery,
    });
    return response.data;
  },

  // Research Flow - Step 3: Chat with Articles
  async chatWithArticles(userQuestion, selectedArticles, researchQuery, chatHistory = []) {
    const response = await api.post('/research/chat', {
      user_question: userQuestion,
      selected_articles: selectedArticles,
      research_query: researchQuery,
      chat_history: chatHistory,
    });
    return response.data;
  },
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return `Bad Request: ${data.message || 'Invalid input'}`;
      case 404:
        return 'API endpoint not found';
      case 500:
        return `Server Error: ${data.message || 'Internal server error'}`;
      case 503:
        return `Service Unavailable: ${data.message || 'AI service not ready'}`;
      default:
        return `API Error (${status}): ${data.message || 'Unknown error'}`;
    }
  } else if (error.request) {
    // Network error
    return 'Network Error: Unable to connect to the server. Please check your connection.';
  } else {
    // Other error
    return `Error: ${error.message}`;
  }
};

// Loading states utility
export const createLoadingState = () => ({
  isLoading: false,
  error: null,
  data: null,
});

export const setLoading = (state) => ({
  ...state,
  isLoading: true,
  error: null,
});

export const setSuccess = (state, data) => ({
  ...state,
  isLoading: false,
  error: null,
  data,
});

export const setError = (state, error) => ({
  ...state,
  isLoading: false,
  error,
  data: null,
});

export default api;

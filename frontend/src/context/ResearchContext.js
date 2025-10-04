import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/api';

// Initial state
const initialState = {
  // Current step in the research flow
  currentStep: 'research-query', // 'research-query' | 'recommendations' | 'summaries' | 'chat'
  
  // Research query
  researchQuery: '',
  
  // Step 1: Recommendations
  recommendations: [],
  selectedArticles: [],
  
  // Step 2: Summaries
  summaries: null,
  suggestedQuestions: [],
  
  // Step 3: Chat
  chatHistory: [],
  followUpQuestions: [],
  
  // UI state
  isLoading: false,
  error: null,
  
  // System status
  systemStatus: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SYSTEM_STATUS: 'SET_SYSTEM_STATUS',
  
  SET_RESEARCH_QUERY: 'SET_RESEARCH_QUERY',
  
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  SELECT_ARTICLE: 'SELECT_ARTICLE',
  DESELECT_ARTICLE: 'DESELECT_ARTICLE',
  CLEAR_SELECTIONS: 'CLEAR_SELECTIONS',
  
  SET_SUMMARIES: 'SET_SUMMARIES',
  SET_SUGGESTED_QUESTIONS: 'SET_SUGGESTED_QUESTIONS',
  
  ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
  SET_CHAT_HISTORY: 'SET_CHAT_HISTORY',
  SET_FOLLOW_UP_QUESTIONS: 'SET_FOLLOW_UP_QUESTIONS',
  
  NEXT_STEP: 'NEXT_STEP',
  RESET_RESEARCH: 'RESET_RESEARCH',
};

// Reducer
const researchReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload, error: null };
      
    case ActionTypes.SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };
      
    case ActionTypes.SET_SYSTEM_STATUS:
      return { ...state, systemStatus: action.payload };
      
    case ActionTypes.SET_RESEARCH_QUERY:
      return { ...state, researchQuery: action.payload };
      
    case ActionTypes.SET_RECOMMENDATIONS:
      return { 
        ...state, 
        recommendations: action.payload,
        currentStep: 'recommendations',
        isLoading: false,
        error: null
      };
      
    case ActionTypes.SELECT_ARTICLE:
      const articleId = action.payload;
      const updatedRecommendations = state.recommendations.map(rec => 
        rec.id === articleId ? { ...rec, selected: true } : rec
      );
      const updatedSelectedArticles = [
        ...state.selectedArticles,
        ...state.recommendations.filter(rec => rec.id === articleId)
      ];
      
      return {
        ...state,
        recommendations: updatedRecommendations,
        selectedArticles: updatedSelectedArticles,
      };
      
    case ActionTypes.DESELECT_ARTICLE:
      const deselectedId = action.payload;
      const deselectedRecommendations = state.recommendations.map(rec => 
        rec.id === deselectedId ? { ...rec, selected: false } : rec
      );
      const deselectedArticles = state.selectedArticles.filter(rec => rec.id !== deselectedId);
      
      return {
        ...state,
        recommendations: deselectedRecommendations,
        selectedArticles: deselectedArticles,
      };
      
    case ActionTypes.CLEAR_SELECTIONS:
      const clearedRecommendations = state.recommendations.map(rec => ({ ...rec, selected: false }));
      return {
        ...state,
        recommendations: clearedRecommendations,
        selectedArticles: [],
      };
      
    case ActionTypes.SET_SUMMARIES:
      return { 
        ...state, 
        summaries: action.payload,
        currentStep: 'summaries',
        isLoading: false,
        error: null
      };
      
    case ActionTypes.SET_SUGGESTED_QUESTIONS:
      return { ...state, suggestedQuestions: action.payload };
      
    case ActionTypes.ADD_CHAT_MESSAGE:
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
      };
      
    case ActionTypes.SET_CHAT_HISTORY:
      return { ...state, chatHistory: action.payload };
      
    case ActionTypes.SET_FOLLOW_UP_QUESTIONS:
      return { ...state, followUpQuestions: action.payload };
      
    case ActionTypes.NEXT_STEP:
      return { ...state, currentStep: action.payload };
      
    case ActionTypes.RESET_RESEARCH:
      return {
        ...initialState,
        systemStatus: state.systemStatus,
      };
      
    default:
      return state;
  }
};

// Context
const ResearchContext = createContext();

// Provider component
export const ResearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(researchReducer, initialState);

  // Load system status on mount
  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        const status = await apiService.getStatus();
        dispatch({ type: ActionTypes.SET_SYSTEM_STATUS, payload: status });
      } catch (error) {
        console.error('Failed to load system status:', error);
      }
    };

    loadSystemStatus();
  }, []);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    
    setResearchQuery: (query) => dispatch({ type: ActionTypes.SET_RESEARCH_QUERY, payload: query }),
    
    getRecommendations: async (query, topK = 5) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.SET_RESEARCH_QUERY, payload: query });
      try {
        const response = await apiService.getRecommendations(query, topK);
        dispatch({ type: ActionTypes.SET_RECOMMENDATIONS, payload: response.recommendations });
        return response;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },
    
    selectArticle: (articleId) => dispatch({ type: ActionTypes.SELECT_ARTICLE, payload: articleId }),
    deselectArticle: (articleId) => dispatch({ type: ActionTypes.DESELECT_ARTICLE, payload: articleId }),
    clearSelections: () => dispatch({ type: ActionTypes.CLEAR_SELECTIONS }),
    
    getSummaries: async (selectedArticles, researchQuery) => {
      if (!researchQuery || researchQuery.trim().length === 0) {
        const error = new Error('Research query is required');
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      try {
        const response = await apiService.getSummaries(selectedArticles, researchQuery);
        dispatch({ type: ActionTypes.SET_SUMMARIES, payload: response });
        dispatch({ type: ActionTypes.SET_SUGGESTED_QUESTIONS, payload: response.suggested_questions });
        return response;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },
    
    sendChatMessage: async (userQuestion, selectedArticles, researchQuery, chatHistory) => {
      try {
        const response = await apiService.chatWithArticles(
          userQuestion, 
          selectedArticles, 
          researchQuery, 
          chatHistory
        );
        
        dispatch({ type: ActionTypes.SET_CHAT_HISTORY, payload: response.chat_history });
        dispatch({ type: ActionTypes.SET_FOLLOW_UP_QUESTIONS, payload: response.follow_up_questions });
        dispatch({ type: ActionTypes.NEXT_STEP, payload: 'chat' });
        
        return response;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        throw error;
      }
    },
    
    selectSuggestedQuestion: (question) => {
      dispatch({ type: ActionTypes.SET_RESEARCH_QUERY, payload: question });
    },
    
    nextStep: (step) => dispatch({ type: ActionTypes.NEXT_STEP, payload: step }),
    resetResearch: () => dispatch({ type: ActionTypes.RESET_RESEARCH }),
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <ResearchContext.Provider value={value}>
      {children}
    </ResearchContext.Provider>
  );
};

// Hook to use the context
export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};

export default ResearchContext;

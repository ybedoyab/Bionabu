import React from 'react';
import { ResearchProvider, useResearch } from './context/ResearchContext';
import Header from './components/Header';
import ResearchQuery from './components/ResearchQuery';
import ArticleRecommendations from './components/ArticleRecommendations';
import ArticleSummaries from './components/ArticleSummaries';
import ChatInterface from './components/ChatInterface';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import { handleApiError } from './services/api';

// Main App Content Component
const AppContent = () => {
  const {
    currentStep,
    researchQuery,
    recommendations,
    selectedArticles,
    summaries,
    suggestedQuestions,
    chatHistory,
    followUpQuestions,
    systemStatus,
    isLoading,
    error,
    getRecommendations,
    selectArticle,
    deselectArticle,
    getSummaries,
    sendChatMessage,
    selectSuggestedQuestion,
    nextStep,
    resetResearch,
    setError,
  } = useResearch();

  // Handle getting recommendations
  const handleGetRecommendations = async (query) => {
    try {
      await getRecommendations(query);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Handle getting summaries
  const handleGetSummaries = async (articles, query) => {
    try {
      await getSummaries(articles, query);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Handle sending chat message
  const handleSendMessage = async (message) => {
    try {
      await sendChatMessage(message, selectedArticles, researchQuery, chatHistory);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Handle selecting suggested question
  const handleSelectQuestion = (question) => {
    selectSuggestedQuestion(question);
    nextStep('chat');
  };

  // Handle starting chat
  const handleStartChat = () => {
    nextStep('chat');
  };

  // Handle error dismissal
  const handleDismissError = () => {
    setError(null);
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'research-query':
        return (
          <ResearchQuery
            onGetRecommendations={handleGetRecommendations}
            isLoading={isLoading}
          />
        );

      case 'recommendations':
        return (
          <ArticleRecommendations
            recommendations={recommendations}
            onSelectArticle={selectArticle}
            onDeselectArticle={deselectArticle}
            onGetSummaries={handleGetSummaries}
            selectedArticles={selectedArticles}
            researchQuery={researchQuery}
            isLoading={isLoading}
          />
        );

      case 'summaries':
        return (
          <ArticleSummaries
            summaries={summaries}
            suggestedQuestions={suggestedQuestions}
            onSelectQuestion={handleSelectQuestion}
            onStartChat={handleStartChat}
            researchQuery={researchQuery}
          />
        );

      case 'chat':
        return (
          <ChatInterface
            chatHistory={chatHistory}
            followUpQuestions={followUpQuestions}
            onSendMessage={handleSendMessage}
            selectedArticles={selectedArticles}
            researchQuery={researchQuery}
            isLoading={isLoading}
          />
        );

      default:
        return (
          <ResearchQuery
            onGetRecommendations={handleGetRecommendations}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onReset={resetResearch} 
        systemStatus={systemStatus}
      />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Alert */}
          <ErrorAlert error={error} onDismiss={handleDismissError} />
          
          {/* Loading Spinner */}
          {isLoading && (
            <LoadingSpinner 
              message={
                currentStep === 'research-query' ? "Finding relevant articles..." :
                currentStep === 'recommendations' ? "Generating summaries..." :
                currentStep === 'chat' ? "Processing your question..." :
                "Loading..."
              }
            />
          )}
          
          {/* Main Content */}
          {!isLoading && renderCurrentStep()}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              NASA Space Biology AI Research Assistant
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Powered by OpenAI GPT and NASA Space Biology publications
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App Component with Provider
const App = () => {
  return (
    <ResearchProvider>
      <AppContent />
    </ResearchProvider>
  );
};

export default App;

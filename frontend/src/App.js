import React from 'react';
import { ResearchProvider, useResearch } from './context/ResearchContext';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/layout/HeroSection';
import Footer from './components/layout/Footer';
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

  // Handle category selection from HeroSection
  const handleCategorySelect = (query) => {
    handleGetRecommendations(query);
  };

  // Handle going back to home
  const handleGoHome = () => {
    resetResearch();
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
          <div className="min-h-screen flex flex-col relative">
            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <HeroSection 
                onSearch={handleGetRecommendations}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="min-h-screen bg-base-100">
            <Navbar showHomeButton={true} onHomeClick={handleGoHome} />
            <main className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ArticleRecommendations
                  recommendations={recommendations}
                  onSelectArticle={selectArticle}
                  onDeselectArticle={deselectArticle}
                  onGetSummaries={handleGetSummaries}
                  selectedArticles={selectedArticles}
                  researchQuery={researchQuery}
                  isLoading={isLoading}
                />
              </div>
            </main>
          </div>
        );

      case 'summaries':
        return (
          <div className="min-h-screen bg-base-100">
            <Navbar showHomeButton={true} onHomeClick={handleGoHome} />
            <main className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ArticleSummaries
                  summaries={summaries}
                  suggestedQuestions={suggestedQuestions}
                  onSelectQuestion={handleSelectQuestion}
                  onStartChat={handleStartChat}
                  researchQuery={researchQuery}
                />
              </div>
            </main>
          </div>
        );

      case 'chat':
        return (
          <div className="min-h-screen bg-base-100">
            <Navbar showHomeButton={true} onHomeClick={handleGoHome} />
            <main className="py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ChatInterface
                  chatHistory={chatHistory}
                  followUpQuestions={followUpQuestions}
                  onSendMessage={handleSendMessage}
                  selectedArticles={selectedArticles}
                  researchQuery={researchQuery}
                  isLoading={isLoading}
                />
              </div>
            </main>
          </div>
        );

      default:
        return (
          <div className="min-h-screen flex flex-col relative">
            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <HeroSection 
                onSearch={handleGetRecommendations}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Error Alert - Global */}
      <ErrorAlert error={error} onDismiss={handleDismissError} />
      
      {/* Loading Spinner - Global */}
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

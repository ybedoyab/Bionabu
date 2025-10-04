import React from 'react';
import { ExternalLink, CheckCircle, Circle, Star, Users, Tag } from 'lucide-react';

const ArticleRecommendations = ({ 
  recommendations, 
  onSelectArticle, 
  onDeselectArticle, 
  onGetSummaries,
  selectedArticles,
  researchQuery,
  isLoading 
}) => {
  const handleArticleToggle = (article) => {
    if (article.selected) {
      onDeselectArticle(article.id);
    } else {
      onSelectArticle(article.id);
    }
  };

  const handleContinue = () => {
    if (selectedArticles.length > 0) {
      onGetSummaries(selectedArticles, researchQuery);
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Recommended Articles
        </h2>
        <p className="text-gray-600">
          Select one or more articles to get detailed summaries and research questions.
          <span className="font-medium text-primary-600">
            {selectedArticles.length} selected
          </span>
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {recommendations.map((article) => (
          <div
            key={article.id}
            className={`recommendation-card ${article.selected ? 'selected' : ''}`}
            onClick={() => handleArticleToggle(article)}
          >
            {/* Selection Indicator */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {article.selected ? (
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-primary-500" />
                )}
                <span className="text-sm font-medium text-gray-600">
                  {article.selected ? 'Selected' : 'Click to select'}
                </span>
              </div>
              
              {/* Relevance Score */}
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-gray-700">
                  {article.relevance_score}/10
                </span>
              </div>
            </div>

            {/* Article Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
              {article.title}
            </h3>

            {/* Relevance Reasons */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Why it's relevant:</h4>
              <ul className="space-y-1">
                {article.relevance_reasons.slice(0, 2).map((reason, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Research Applications */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Research applications:</h4>
              <div className="flex flex-wrap gap-2">
                {article.research_applications.slice(0, 3).map((app, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                {article.organisms.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{article.organisms.slice(0, 2).join(', ')}</span>
                  </div>
                )}
                
                {article.key_concepts.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Tag className="w-4 h-4" />
                    <span>{article.key_concepts.slice(0, 2).join(', ')}</span>
                  </div>
                )}
              </div>
              
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={selectedArticles.length === 0 || isLoading}
          className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner mr-2" />
              Generating Summaries...
            </>
          ) : (
            `Continue with ${selectedArticles.length} Article${selectedArticles.length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </div>
  );
};

export default ArticleRecommendations;

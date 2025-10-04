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
        <div className="alert alert-info max-w-md mx-auto">
          <div className="text-base-content">
            No recommendations available for your search query.
            <br />
            <span className="text-sm">Try searching for different terms related to space biology.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-base-content mb-4 font-geist">
          Recommended Articles
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-base-content/70">
            Select one or more articles to get detailed summaries and research questions.
          </p>
          <div className="badge badge-primary badge-lg">
            {selectedArticles.length} selected
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {recommendations.map((article, index) => (
          <div
            key={article.id}
            className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
              article.selected ? 'border-primary shadow-primary/20' : 'border-base-300 hover:border-primary/50'
            }`}
            onClick={() => handleArticleToggle(article)}
          >
            <div className="card-body">
              {/* Article Number and Selection Indicator */}
              <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {/* Article Number */}
                <div className="badge badge-primary badge-lg">
                  {index + 1}
                </div>
                
                {/* Selection Indicator */}
                <div className="flex items-center space-x-2">
                  {article.selected ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-base-content/40" />
                  )}
                  <span className="text-sm font-medium text-base-content/70">
                    {article.selected ? 'Selected' : 'Click to select'}
                  </span>
                </div>
              </div>
              
              {/* Relevance Score */}
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-warning fill-current" />
                <span className="text-sm font-semibold text-base-content">
                  {article.relevance_score}/10
                </span>
              </div>
            </div>

              {/* Article Title */}
              <h3 className="card-title text-lg font-semibold text-base-content mb-3 line-clamp-2">
                {article.title}
              </h3>

              {/* Relevance Reasons */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-base-content mb-2">Why it's relevant:</h4>
                <ul className="space-y-1">
                  {article.relevance_reasons.slice(0, 2).map((reason, index) => (
                    <li key={index} className="text-sm text-base-content/70 flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Research Applications */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-base-content mb-2">Research applications:</h4>
                <div className="flex flex-wrap gap-2">
                  {article.research_applications.slice(0, 3).map((app, index) => (
                    <span
                      key={index}
                      className="badge badge-outline badge-sm"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-base-content/60">
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
                  className="flex items-center space-x-1 text-primary hover:text-primary/80"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={selectedArticles.length === 0 || isLoading}
          className="btn btn-primary btn-lg"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
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

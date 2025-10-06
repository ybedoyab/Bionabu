import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, CheckCircle, Circle, Star, Users, Tag, FileText } from 'lucide-react';
import { type Article } from '../../services/api';

interface ArticleRecommendationsProps {
  recommendations: Article[];
  onSelectArticle: (articleId: string) => void;
  onDeselectArticle: (articleId: string) => void;
  onGetSummaries: (articles: Article[], query: string) => void;
  selectedArticles: Article[];
  researchQuery: string;
  isLoading: boolean;
}

const ArticleRecommendations: React.FC<ArticleRecommendationsProps> = ({ 
  recommendations, 
  onSelectArticle, 
  onDeselectArticle, 
  onGetSummaries,
  selectedArticles,
  researchQuery,
  isLoading 
}) => {
  const handleArticleToggle = (article: Article) => {
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
        <motion.div 
          className="alert alert-info max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FileText className="w-6 h-6" />
          <div className="text-base-content">
            <h3 className="font-semibold">No recommendations available</h3>
            <p className="text-sm mt-1">
              Try searching for different terms related to space biology.
            </p>
          </div>
        </motion.div>
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
        </div>
      </div>


      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {recommendations.map((article, index) => (
          <motion.div
            key={article.id}
            className={`card shadow-lg border-2 transition-all duration-300 cursor-pointer ${
              article.selected 
                ? 'border-primary bg-primary/5 shadow-primary/20' 
                : 'border-base-300 hover:border-primary/50 hover:shadow-xl'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleArticleToggle(article)}
          >
            <div className="card-body p-6">
              {/* Article Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Article Number */}
                  <div className="badge badge-primary badge-lg font-bold">
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

              {/* Organisms and Key Concepts */}
              <div className="flex items-center gap-4 mb-3 text-sm text-base-content/70">
                {article.organisms.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{article.organisms.slice(0, 2).join(', ')}</span>
                  </div>
                )}
                
                {article.key_concepts.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{article.key_concepts.slice(0, 2).join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Relevance Reasons */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-primary mb-2">Why this is relevant:</h4>
                <div className="flex flex-wrap gap-2">
                  {article.relevance_reasons.slice(0, 3).map((reason, reasonIndex) => (
                    <span 
                      key={reasonIndex}
                      className="badge badge-outline badge-primary badge-sm"
                    >
                      {reason}
                    </span>
                  ))}
                  {article.relevance_reasons.length > 3 && (
                    <span className="badge badge-outline badge-ghost badge-sm">
                      +{article.relevance_reasons.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* External Link Button */}
              <div className="card-actions justify-end">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="btn btn-ghost btn-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Article
                </a>
              </div>
            </div>
          </motion.div>
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

import React, { useState } from 'react';
import { Search, Send, Sparkles } from 'lucide-react';

const ResearchQuery = ({ onGetRecommendations, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onGetRecommendations(query.trim());
    }
  };

  const exampleQueries = [
    "microbiology research in space",
    "effects of microgravity on plant growth",
    "space radiation impact on DNA",
    "behavioral changes in animals in space",
    "immune system response in space environment"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Discover Space Biology Research
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Describe your research interests and let AI find the most relevant NASA Space Biology publications for you.
        </p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you researching? (e.g., 'microbiology in space', 'plant growth in microgravity')"
              className="input-field pl-12 pr-4"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                <span>Finding Articles...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Find Relevant Articles</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Example Queries */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Example Research Topics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm text-gray-700"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchQuery;

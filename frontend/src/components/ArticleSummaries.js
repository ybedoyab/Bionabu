import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, MessageCircle, Users, Tag, ArrowRight, Target, Lightbulb, Search, Wrench, Rocket } from 'lucide-react';

// Component to format research insights with proper structure
const FormattedInsights = ({ insights }) => {
  const parseInsights = (text) => {
    const sections = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentSection = null;
    let currentSubsection = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Main sections (numbered)
      if (/^\d+\.\s*\*\*/.test(trimmed)) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          title: trimmed.replace(/^\d+\.\s*\*\*|\*\*$/, ''),
          subsections: [],
          icon: getIconForSection(trimmed)
        };
      }
      // Subsections (dash with bold)
      else if (/^-\s*\*\*/.test(trimmed)) {
        if (currentSubsection && currentSection) currentSection.subsections.push(currentSubsection);
        currentSubsection = {
          title: trimmed.replace(/^-\s*\*\*|\*\*:?$/, ''),
          content: []
        };
      }
      // Content lines
      else if (trimmed && !/^[*\-]\s*$/.test(trimmed)) {
        if (currentSubsection) {
          currentSubsection.content.push(trimmed.replace(/^[*\-]\s*/, ''));
        }
      }
    }
    
    // Add the last sections
    if (currentSubsection && currentSection) currentSection.subsections.push(currentSubsection);
    if (currentSection) sections.push(currentSection);
    
    return sections;
  };
  
  const getIconForSection = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('theme') || titleLower.includes('key')) return <Target className="w-4 h-4" />;
    if (titleLower.includes('gap') || titleLower.includes('identified')) return <Search className="w-4 h-4" />;
    if (titleLower.includes('direction') || titleLower.includes('potential')) return <ArrowRight className="w-4 h-4" />;
    if (titleLower.includes('method') || titleLower.includes('consideration')) return <Wrench className="w-4 h-4" />;
    if (titleLower.includes('application') || titleLower.includes('practical')) return <Rocket className="w-4 h-4" />;
    return <Lightbulb className="w-4 h-4" />;
  };
  
  const sections = parseInsights(insights);
  
  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="border-l-4 border-primary-300 pl-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 bg-primary-100 rounded-full text-primary-600">
              {section.icon}
            </div>
            <h4 className="font-semibold text-primary-900 text-lg">
              {section.title}
            </h4>
          </div>
          
          <div className="space-y-3">
            {section.subsections.map((subsection, subIndex) => (
              <div key={subIndex} className="bg-white/50 rounded-lg p-3">
                <h5 className="font-medium text-primary-800 mb-2">
                  {subsection.title}
                </h5>
                <div className="space-y-1">
                  {subsection.content.map((content, contentIndex) => (
                    <p key={contentIndex} className="text-primary-700 text-sm leading-relaxed">
                      {content}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ArticleSummaries = ({ 
  summaries, 
  suggestedQuestions, 
  onSelectQuestion,
  onStartChat,
  researchQuery 
}) => {
  const [expandedSummaries, setExpandedSummaries] = useState({});

  const toggleSummary = (articleId) => {
    setExpandedSummaries(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }));
  };

  const handleQuestionClick = (question) => {
    onSelectQuestion(question.question);
  };

  const handleStartChat = () => {
    onStartChat();
  };

  if (!summaries || !summaries.article_summaries) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No summaries available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Article Summaries & Research Questions
        </h2>
        <p className="text-gray-600">
          Based on your research query: <span className="font-medium text-primary-600">"{researchQuery}"</span>
        </p>
      </div>

      {/* Research Insights */}
      {summaries.research_insights && (
        <div className="card mb-8 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">💡</span>
            </div>
            <h3 className="text-xl font-bold text-primary-900">
              Research Insights
            </h3>
          </div>
          <div className="text-primary-800 leading-relaxed">
            <FormattedInsights insights={summaries.research_insights.overall_insights} />
          </div>
        </div>
      )}

      {/* Article Summaries */}
      <div className="space-y-6 mb-8">
        {summaries.article_summaries.map((summary) => (
          <div key={summary.article_id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {summary.title}
                </h3>
                
                {/* Metadata */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  {summary.organisms.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{summary.organisms.join(', ')}</span>
                    </div>
                  )}
                  
                  {summary.key_concepts.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4" />
                      <span>{summary.key_concepts.slice(0, 3).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <a
                  href={summary.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Article</span>
                </a>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Summary</h4>
                <button
                  onClick={() => toggleSummary(summary.article_id)}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                >
                  <span>{expandedSummaries[summary.article_id] ? 'Show less' : 'Show more'}</span>
                  {expandedSummaries[summary.article_id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
                {expandedSummaries[summary.article_id] ? (
                  <p>{summary.summary}</p>
                ) : (
                  <p>
                    {summary.summary.length > 200 
                      ? `${summary.summary.substring(0, 200)}...` 
                      : summary.summary
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Questions */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <MessageCircle className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Suggested Research Questions
          </h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Click on any question to start a conversation, or ask your own question below.
        </p>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {suggestedQuestions.map((question) => (
            <button
              key={question.id}
              onClick={() => handleQuestionClick(question)}
              className="question-button group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {question.type}
                </span>
                <span className="text-xs text-gray-400">
                  {question.article_title && question.article_title.length > 30
                    ? `${question.article_title.substring(0, 30)}...`
                    : question.article_title
                  }
                </span>
              </div>
              
              <p className="text-gray-900 font-medium mb-2 group-hover:text-primary-700">
                {question.question}
              </p>
              
              <p className="text-sm text-gray-600">
                {question.focus}
              </p>
            </button>
          ))}
        </div>

        {/* Start Chat Button */}
        <div className="flex justify-center pt-4 border-t border-gray-200">
          <button
            onClick={handleStartChat}
            className="btn-primary px-8 py-3 flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Start Interactive Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleSummaries;

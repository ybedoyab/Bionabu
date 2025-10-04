import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

const ChatInterface = ({ 
  chatHistory, 
  followUpQuestions, 
  onSendMessage,
  selectedArticles,
  researchQuery,
  isLoading 
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      setIsTyping(true);
      onSendMessage(message.trim());
      setMessage('');
      // Reset typing indicator after a delay
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleQuestionClick = (question) => {
    setIsTyping(true);
    onSendMessage(question);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Interactive Chat
            </h2>
            <p className="text-sm text-gray-600">
              Ask questions about your selected articles
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MessageCircle className="w-4 h-4" />
            <span>{selectedArticles.length} articles loaded</span>
          </div>
        </div>
      </div>

      {/* Article Context Summary */}
      {selectedArticles.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📚</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">
                Research Context Available
              </h4>
              <div className="space-y-1">
                <p className="text-sm text-blue-800">
                  <strong>Research Topic:</strong> {researchQuery}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Articles Loaded:</strong> {selectedArticles.map(article => article.title).join(', ')}
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  You can ask questions about the methodology, findings, implications, or any specific aspects of these research papers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start the Conversation
            </h3>
            <p className="text-gray-600 mb-4">
              Ask any questions about the selected articles or your research topic.
            </p>
            
            {/* Quick Start Suggestions */}
            {selectedArticles.length > 0 && (
              <div className="max-w-md mx-auto">
                <p className="text-sm text-gray-500 mb-3">Try asking:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleQuestionClick("What are the main findings of these studies?")}
                    className="block w-full text-left text-sm text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition-colors"
                  >
                    What are the main findings of these studies?
                  </button>
                  <button
                    onClick={() => handleQuestionClick("How do these studies relate to each other?")}
                    className="block w-full text-left text-sm text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition-colors"
                  >
                    How do these studies relate to each other?
                  </button>
                  <button
                    onClick={() => handleQuestionClick("What are the practical applications of this research?")}
                    className="block w-full text-left text-sm text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition-colors"
                  >
                    What are the practical applications of this research?
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    msg.type === 'user' 
                      ? 'chat-bubble-user' 
                      : 'chat-bubble-ai'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-xs opacity-75 mt-2">
                    {formatTimestamp(msg.timestamp)}
                  </p>
                  
                  {/* Follow-up questions for AI messages */}
                  {msg.follow_up_questions && msg.follow_up_questions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-2">
                        Suggested follow-ups:
                      </p>
                      <div className="space-y-1">
                        {msg.follow_up_questions.slice(0, 2).map((q, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuestionClick(q.question)}
                            className="block w-full text-left text-xs text-primary-600 hover:text-primary-700 py-1"
                          >
                            {q.question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="chat-bubble-ai">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Follow-up Questions */}
      {followUpQuestions && followUpQuestions.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Suggested Questions:
          </h4>
          <div className="flex flex-wrap gap-2">
            {followUpQuestions.slice(0, 4).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question.question)}
                className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors duration-200"
              >
                {question.question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question about the articles or your research..."
              className="input-field"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        
        <div className="mt-2 text-xs text-gray-500">
          Based on: <span className="font-medium">{researchQuery}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

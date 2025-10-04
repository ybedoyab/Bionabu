import React from 'react';
import { Brain, RefreshCw } from 'lucide-react';

const Header = ({ onReset, systemStatus }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                NASA Space Biology AI
              </h1>
              <p className="text-sm text-gray-500">
                Research Assistant
              </p>
            </div>
          </div>

          {/* System Status */}
          <div className="flex items-center space-x-4">
            {systemStatus && (
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus.articles_available > 0 
                    ? 'bg-success-500' 
                    : 'bg-accent-500'
                }`} />
                <span className="text-gray-600">
                  {systemStatus.articles_available} articles available
                </span>
              </div>
            )}
            
            {/* Reset Button */}
            <button
              onClick={onReset}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">New Research</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

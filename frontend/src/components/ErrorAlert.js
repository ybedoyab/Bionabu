import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-accent-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-accent-800">
            Error
          </h3>
          <div className="mt-2 text-sm text-accent-700">
            <p>{error}</p>
          </div>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex bg-accent-50 rounded-md p-1.5 text-accent-500 hover:bg-accent-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-accent-50 focus:ring-accent-600"
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;

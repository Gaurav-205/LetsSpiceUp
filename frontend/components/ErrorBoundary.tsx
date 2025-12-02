'use client';

import React, { Component, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for monitoring (in production, this could be sent to error tracking service)
    logger.error('Error caught by boundary', error);
    logger.debug('Error info', errorInfo);
    
    // In production, you could send this to an error tracking service like Sentry
    // Example:
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { contexts: { react: errorInfo } });
    // }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
          <div className="text-center px-4">
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
              Something went wrong
            </h1>
            <p className="mb-6" style={{ color: '#FFFFFF', opacity: 0.8 }}>
              We&apos;re sorry, but something unexpected happened. Please try reloading the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left max-w-2xl mx-auto">
                <summary className="cursor-pointer mb-2" style={{ color: '#BFFF00' }}>
                  Error Details (Development Only)
                </summary>
                <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto" style={{ color: '#FFFFFF' }}>
                  {this.state.error.toString()}
                  {this.state.error.stack && `\n\n${this.state.error.stack}`}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
                className="px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                style={{ 
                  backgroundColor: '#8A2BE2', 
                  color: '#FFFFFF',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#BFFF00';
                  e.currentTarget.style.color = '#0A0A0A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#8A2BE2';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
            >
              Reload Page
            </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="px-6 py-2 rounded-lg font-semibold border-2 transition-all duration-300"
                style={{ 
                  borderColor: '#8A2BE2', 
                  color: '#FFFFFF',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#8A2BE2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


'use client';

import React from 'react';

// import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    resetError: () => void;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Send error to console (Sentry disabled)
    console.error('Error caught by Error Boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default error UI
      return <ErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  const handleReportFeedback = () => {
    // Feedback disabled since Sentry is not configured
    alert('Error reporting is currently disabled. Please check the console for error details.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">Something went wrong</h1>

        <p className="mb-6 text-muted-foreground">
          We apologize for the inconvenience. Please try refreshing the page.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Error Details (Development)
            </summary>
            <pre className="mt-2 max-h-32 overflow-auto rounded bg-muted p-3 text-xs">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={resetError} variant="default" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>

          <Button onClick={handleReportFeedback} variant="secondary">
            Report Issue
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook for manual error reporting (disabled)
export function useErrorReporting() {
  const reportError = React.useCallback((error: Error, context?: Record<string, unknown>) => {
    console.error('Error reporting disabled:', error, context);
  }, []);

  const reportMessage = React.useCallback(
    (
      message: string,
      level: 'info' | 'warning' | 'error' = 'info',
      context?: Record<string, unknown>
    ) => {
      console.log(`[${level.toUpperCase()}] ${message}`, context);
    },
    []
  );

  return { reportError, reportMessage };
}

export default ErrorBoundary;

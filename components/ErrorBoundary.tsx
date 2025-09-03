'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-[--space-md] bg-surface rounded-[--radius-md] shadow-card">
          <h2 className="text-heading mb-[--space-sm] text-red-500">Something went wrong</h2>
          <p className="text-muted mb-[--space-md]">
            An error occurred while rendering this component.
          </p>
          <details className="text-sm text-muted">
            <summary>Error details</summary>
            <pre className="mt-[--space-sm] p-[--space-sm] bg-bg rounded-[--radius-sm] overflow-auto">
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            className="mt-[--space-md] px-[--space-md] py-[--space-sm] bg-primary text-bg rounded-[--radius-sm]"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


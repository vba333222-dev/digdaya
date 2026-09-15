import { Component, ReactNode, ErrorInfo } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  reset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

// React error boundaries can only be implemented as class components —
// there is no hook equivalent of getDerivedStateFromError / componentDidCatch.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Hook this up to your logging/monitoring service if you have one.
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(_prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    if (this.state.hasError && !prevState.hasError) {
      this.props.reset?.();
    }
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.fallback}</>;
    }
    return <>{this.props.children}</>;
  }
}

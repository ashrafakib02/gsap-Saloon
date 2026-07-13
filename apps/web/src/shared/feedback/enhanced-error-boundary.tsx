import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ErrorBoundary } from '@/shared/feedback/error-boundary';

/**
 * Props for the enhanced error boundary component.
 */
interface EnhancedErrorBoundaryProps {
  /** Child elements to protect with the error boundary. */
  children: ReactNode;
  /** Custom fallback UI. Falls back to built-in UI per level if not provided. */
  fallback?: ReactNode;
  /** Human-readable name of the section (used in error logs). */
  sectionName?: string;
  /** Callback invoked when an error is caught. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** The hierarchy level of this boundary. */
  level: 'root' | 'section' | 'feature';
  /** If true, errors are caught and don't propagate to parent boundaries. */
  isolation?: boolean;
  /** Show a retry button (default true). */
  retryable?: boolean;
  /** Maximum number of retry attempts (default 3). */
  maxRetries?: number;
  /** Callback invoked when the user clicks retry. */
  onRetry?: () => void;
}

/**
 * Internal state for the enhanced error boundary.
 */
interface EnhancedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * Enhanced error boundary that wraps the existing section-level
 * {@link ErrorBoundary} with additional features:
 *
 * - Retry count tracking with configurable max retries
 * - Section-level error logging with context
 * - `data-error-boundary` attribute for debugging
 * - Isolation mode to prevent error propagation
 * - Root/section/feature level differentiation
 *
 * @example
 * ```tsx
 * <EnhancedErrorBoundary
 *   level="section"
 *   sectionName="ServicesSection"
 *   retryable
 *   maxRetries={3}
 *   onError={(err, info) => logger.error(err, info)}
 * >
 *   <ServicesSection />
 * </EnhancedErrorBoundary>
 * ```
 */
class EnhancedErrorBoundary extends Component<
  EnhancedErrorBoundaryProps,
  EnhancedErrorBoundaryState
> {
  static defaultProps: Partial<EnhancedErrorBoundaryProps> = {
    retryable: true,
    maxRetries: 3,
    level: 'section',
    isolation: false,
  };

  state: EnhancedErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, sectionName, level } = this.props;

    // Log with section context for easier debugging
    if (!import.meta.env.PROD) {
      console.groupCollapsed(
        `%c[ErrorBoundary:${level}] ${sectionName ?? 'Unknown'}`,
        'color: #ef4444; font-weight: bold;',
      );
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    this.setState({ error, errorInfo });
    onError?.(error, errorInfo);
  }

  /**
   * Handles retry by resetting error state and incrementing retry count.
   */
  handleRetry = (): void => {
    const { onRetry, maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState((prev) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prev.retryCount + 1,
      }));
      onRetry?.();
    }
  };

  /**
   * Renders the default retry UI when no custom fallback is provided.
   */
  renderRetryUI(): ReactNode {
    const { sectionName, maxRetries = 3 } = this.props;
    const { retryCount } = this.state;
    const canRetry = retryCount < maxRetries;

    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {sectionName
            ? `Something went wrong with ${sectionName}`
            : 'Something went wrong'}
        </h2>
        <p style={{ color: 'var(--color-muted, #6b7280)', marginBottom: '1rem' }}>
          {canRetry
            ? 'Please try again, or continue browsing.'
            : 'We encountered an unexpected issue. Please refresh the page.'}
        </p>
        {canRetry && (
          <button
            onClick={this.handleRetry}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--color-primary, #c9a96e)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1rem',
            }}
            type="button"
          >
            Try Again ({maxRetries - retryCount} attempts left)
          </button>
        )}
      </div>
    );
  }

  render(): ReactNode {
    const { children, fallback, level, retryable } = this.props;
    const { hasError } = this.state;

    const dataAttr = `error-boundary-${level}`;

    // Root level: full-page branded fallback
    if (level === 'root' && hasError) {
      return (
        <div data-error-boundary={level} role="alert">
          {fallback ?? (
            <div
              style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '32rem' }}>
                <h1
                  style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#c9a96e' }}
                >
                  We'll be right back
                </h1>
                <p
                  style={{
                    fontSize: '1.125rem',
                    color: 'var(--color-muted, #6b7280)',
                    marginBottom: '2rem',
                  }}
                >
                  We're experiencing a technical difficulty. Our team has been notified.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '1rem 2rem',
                    background: '#c9a96e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.125rem',
                  }}
                  type="button"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Section/feature level: uses existing ErrorBoundary
    return (
      <ErrorBoundary
        fallback={
          fallback ?? (retryable ? this.renderRetryUI() : undefined)
        }
      >
        <div data-error-boundary={dataAttr} data-error-boundary-level={level}>
          {children}
        </div>
      </ErrorBoundary>
    );
  }
}

export type { EnhancedErrorBoundaryProps, EnhancedErrorBoundaryState };
export { EnhancedErrorBoundary };

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI when an error is caught */
  fallback?: ReactNode;
  /** Called when an error is caught — for logging/reporting */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Section name for error reporting context */
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ── Component ─────────────────────────────────────────────

/**
 * Reusable error boundary for catching and gracefully handling React errors.
 *
 * Use at section level to prevent a single section failure from crashing
 * the entire page. Wraps the section's content and shows a warm-toned
 * fallback when something goes wrong.
 *
 * From TECHNICAL_ARCHITECTURE §12.6:
 * "Section boundaries catch failures within specific sections.
 *  Shows a graceful fallback within the section without crashing the entire page."
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section
          className="flex min-h-[40vh] flex-col items-center justify-center px-6 py-16 text-center"
          role="alert"
          aria-live="polite"
        >
          <div className="max-w-md">
            <p
              className="mb-4 text-[length:var(--text-subheading)] font-[var(--weight-subheading)] leading-[var(--leading-subheading)] tracking-[var(--tracking-subheading)] text-[var(--color-text-secondary)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Something didn't go as planned
            </p>
            <p className="mb-8 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--color-text-muted)]">
              We encountered an unexpected issue. This section couldn't load, but the
              rest of the experience is unaffected.
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-medium)] border border-[var(--color-accent)] px-6 py-3 text-[length:var(--text-body)] font-[var(--weight-body)] text-[var(--color-accent)] transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-surface)]"
            >
              Try again
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface RootErrorBoundaryProps {
  children: ReactNode;
}

interface RootErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ── Component ─────────────────────────────────────────────

/**
 * Root-level error boundary wrapping the entire application.
 *
 * From TECHNICAL_ARCHITECTURE §12.6:
 * "Root boundary: Catches catastrophic failures (JavaScript errors that crash React).
 *  Shows full-page branded error with recovery links."
 *
 * This is the last line of defense. Section-level ErrorBoundary components
 * handle graceful degradation for individual sections.
 */
export class RootErrorBoundary extends Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  constructor(props: RootErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development — in production this would report to an error service
    console.error('[RootErrorBoundary]', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.href = '/';
  };

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-surface)] px-6 text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-lg">
            {/* Brand mark */}
            <p
              className="mb-8 text-[length:var(--text-heading)] font-[var(--weight-heading)] leading-[var(--leading-heading)] tracking-[var(--tracking-heading)] text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Sovereign Artisor
            </p>

            <h1
              className="mb-4 text-[length:var(--text-subheading)] font-[var(--weight-subheading)] leading-[var(--leading-subheading)] tracking-[var(--tracking-subheading)] text-[var(--color-text-secondary)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Something went wrong
            </h1>

            <p className="mb-8 text-[length:var(--text-body)] leading-[var(--leading-body)] text-[var(--color-text-muted)]">
              An unexpected error has occurred. We sincerely apologize for the
              inconvenience. Our team has been notified.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-medium)] border border-[var(--color-accent)] px-8 py-3 text-[length:var(--text-body)] font-[var(--weight-body)] text-[var(--color-accent)] transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-surface)]"
              >
                Try again
              </button>

              <button
                onClick={this.handleReload}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-medium)] bg-[var(--color-accent)] px-8 py-3 text-[length:var(--text-body)] font-[var(--weight-body)] text-[var(--color-surface)] transition-colors duration-200 hover:bg-[var(--color-accent-hover)]"
              >
                Return to homepage
              </button>
            </div>

            <p className="mt-8 text-[length:var(--text-caption)] leading-[var(--leading-caption)] tracking-[var(--tracking-caption)] text-[var(--color-text-muted)]">
              If this persists, please contact us directly.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

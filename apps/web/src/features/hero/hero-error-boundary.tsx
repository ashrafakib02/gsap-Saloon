/**
 * HeroErrorBoundary — Error Boundary for the Hero Section
 *
 * From TECHNICAL_ARCHITECTURE §13.3:
 * "Section boundary: Catches section-level failures. Shows branded
 *  section fallback. Other sections continue unaffected."
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "The visitor must feel — before reading a single word — that this
 *  is not like every other salon website they have seen today."
 *
 * If the hero crashes, the fallback must STILL communicate the brand.
 * A white screen or generic error page is unacceptable.
 *
 * Architecture:
 * - Class component (React requirement for error boundaries)
 * - Wraps the entire hero section
 * - Shows a warm, branded fallback on error
 * - Provides retry mechanism
 * - Logs errors to monitoring infrastructure
 * - Does NOT show technical details to the user
 */

import { Component } from 'react';
import type { ErrorInfo } from 'react';
import type { HeroErrorBoundaryProps } from './hero.types';

// ── State ─────────────────────────────────────────────────

interface HeroErrorState {
  hasError: boolean;
  error: Error | null;
}

// ── Component ─────────────────────────────────────────────

/**
 * Error boundary that wraps the hero section.
 *
 * From TECHNICAL_ARCHITECTURE §13.3:
 * "Error boundaries do NOT replace the page. They contain the failure
 *  to a single section. The rest of the page continues to function."
 *
 * Design decisions:
 * 1. Fallback is a warm, atmospheric composition — NOT a technical error
 * 2. Retry button uses the brand's Primary CTA style
 * 3. The fallback still communicates warmth, luxury, and consideration
 * 4. Error details are logged internally but never shown to the user
 * 5. The fallback is visually consistent with the hero's warm palette
 */
export class HeroErrorBoundary extends Component<
  HeroErrorBoundaryProps,
  HeroErrorState
> {
  constructor(props: HeroErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): HeroErrorState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    /* Log to monitoring infrastructure (Phase 13.4) */
    if (typeof window !== 'undefined' && window.console) {
      console.error('[Hero ErrorBoundary]', error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section
          className="hero-error-fallback flex min-h-[100svh] items-center justify-center"
          role="alert"
          aria-label="The hero section encountered an issue"
          style={{
            backgroundColor: 'var(--color-surface)',
            /* Warm atmospheric gradient — the brand's visual signature
             * even in error state. This IS the fallback design. */
            background: `
              radial-gradient(
                ellipse 80% 60% at 50% 45%,
                color-mix(in srgb, var(--color-accent) 10%, var(--color-surface)) 0%,
                var(--color-surface) 70%
              )
            `,
          }}
        >
          <div
            className="flex flex-col items-center text-center"
            style={{
              maxWidth: 'var(--spacing-public)',
              padding: 'var(--spacing-formal)',
            }}
          >
            {/* Brand name — still communicates identity in error state */}
            <h1
              style={{
                fontFamily: 'var(--font-family-serif)',
                fontSize: 'var(--type-size-heading)',
                lineHeight: 'var(--type-leading-heading)',
                fontWeight: 500,
                color: 'var(--color-text)',
              }}
            >
              The Sovereign Artisor
            </h1>

            {/* Warm, non-technical message */}
            <p
              style={{
                fontFamily: 'var(--font-family-sans)',
                fontSize: 'var(--type-size-body)',
                lineHeight: 'var(--type-leading-body)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-social)',
              }}
            >
              Something didn't load as expected.
              <br />
              We invite you to try again.
            </p>

            {/* Retry button — Primary CTA style */}
            <button
              onClick={this.handleRetry}
              type="button"
              style={{
                marginTop: 'var(--spacing-personal)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '48px',
                padding: '14px 36px',
                fontFamily: 'var(--font-family-sans)',
                fontSize: 'var(--type-size-body)',
                fontWeight: 500,
                color: 'var(--color-surface)',
                backgroundColor: 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--radius-small)',
                cursor: 'pointer',
              }}
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

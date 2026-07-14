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
 * - All copy from hero.copy.ts — zero hardcoded text
 */

import { Component, createRef } from 'react';
import type { ErrorInfo } from 'react';
import { HERO_COPY_EN } from './hero.copy';
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
    /**
     * Phase 4.6: Ref for the retry button to enable focus management.
     * From TECHNICAL_ARCHITECTURE §16.4:
     * "Focus management: After dynamic content changes, focus
     *  moves to the new content."
     */
    this.retryButtonRef = createRef<HTMLButtonElement>();
  }

  retryButtonRef: React.RefObject<HTMLButtonElement>;

  /**
   * Phase 4.6: Focus the retry button when error state is entered.
   * From VISUAL_RULES AC4:
   * "Focus indicators are visible and high-contrast."
   *
   * When the error boundary catches an error, focus moves to the
   * retry button so keyboard users can immediately retry without
   * having to Tab through the page.
   */
  componentDidUpdate(
    _prevProps: HeroErrorBoundaryProps,
    prevState: HeroErrorState,
  ): void {
    if (this.state.hasError && !prevState.hasError) {
      /* Error just occurred — focus the retry button after render */
      requestAnimationFrame(() => {
        this.retryButtonRef.current?.focus();
      });
    }
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
      const copy = HERO_COPY_EN;

      return (
        <section
          className="hero-error-fallback flex min-h-[100svh] items-center justify-center"
          role="alert"
          aria-label={copy.state.errorAriaLabel}
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
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-display)',
                lineHeight: 'var(--leading-display)',
                fontWeight: 500,
                color: 'var(--color-text)',
              }}
            >
              {copy.state.errorBrandName}
            </h1>

            {/* Warm, non-technical message */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--leading-body)',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--spacing-social)',
                whiteSpace: 'pre-line',
              }}
            >
              {copy.state.errorMessage}
            </p>

            {/* Retry button — Primary CTA style
             * Phase 4.6: Receives ref for focus management (AC4).
             * Focus moves here when error boundary catches an error. */}
            <button
              ref={this.retryButtonRef}
              onClick={this.handleRetry}
              type="button"
              className="hero-cta hero-cta--primary"
              style={{
                marginTop: 'var(--spacing-personal)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '48px',
                padding: '14px 36px',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-body)',
                fontWeight: 500,
                color: 'var(--color-surface)',
                backgroundColor: 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--radius-small)',
                cursor: 'pointer',
              }}
            >
              {copy.state.errorRetryLabel}
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

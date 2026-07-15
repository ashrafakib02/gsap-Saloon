/**
 * ThreeErrorBoundary — Isolates 3D Rendering Failures
 *
 * From TECHNICAL_ARCHITECTURE §9.1:
 * "The 3D layer is progressive enhancement. A renderer failure, a lost WebGL
 *  context, or an unsupported device must never take down the page — the
 *  experience degrades to the 2D fallback, silently."
 *
 * This boundary wraps the R3F Canvas. It catches:
 *   - Renderer construction failures (context creation throwing)
 *   - Errors thrown during scene render
 *   - Errors surfaced from a WebGL context-loss handler
 *
 * On error it renders the provided fallback (never a technical error screen)
 * and offers a single recovery attempt. It logs to the console for diagnostics
 * but shows the user only the branded fallback.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

// ── Props & State ──────────────────────────────────────────

interface ThreeErrorBoundaryProps {
  /** The 3D subtree to guard (typically the Canvas). */
  readonly children: ReactNode;
  /** Content rendered in place of the 3D layer when it fails. */
  readonly fallback: ReactNode;
  /** Optional hook for external monitoring (Phase 13.4). */
  readonly onError?: (error: Error, info: ErrorInfo) => void;
}

interface ThreeErrorBoundaryState {
  readonly hasError: boolean;
}

// ── Component ──────────────────────────────────────────────

/**
 * Error boundary dedicated to the 3D layer.
 *
 * Kept separate from the section-level boundaries so a 3D failure degrades to
 * the 2D fallback *in place* without collapsing the surrounding section.
 */
export class ThreeErrorBoundary extends Component<
  ThreeErrorBoundaryProps,
  ThreeErrorBoundaryState
> {
  constructor(props: ThreeErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ThreeErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      /* Diagnostics only — the user never sees this. */
      console.error('[ThreeErrorBoundary] 3D layer failed:', error, info);
    }
    this.props.onError?.(error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

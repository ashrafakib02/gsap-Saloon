/**
 * Scene Boundary — Error Boundary for Scene Layers
 *
 * From DESIGN_SYSTEM §Accessibility:
 * "The 3D layer is progressive enhancement. A renderer failure, a lost WebGL
 *  context, or an unsupported device must never take down the page."
 *
 * This boundary wraps individual scene layers. It catches errors thrown
 * during scene render and degrades to the provided fallback. It logs
 * to the console for diagnostics but shows the user only the branded
 * fallback.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

// ── Props & State ──────────────────────────────────────────

interface SceneBoundaryProps {
  /** The scene subtree to guard. */
  readonly children: ReactNode;
  /** Content rendered in place of the scene when it fails. */
  readonly fallback: ReactNode;
  /** Optional hook for external monitoring. */
  readonly onError?: (error: Error, info: ErrorInfo) => void;
}

interface SceneBoundaryState {
  readonly hasError: boolean;
}

// ── Component ──────────────────────────────────────────────

/**
 * Error boundary dedicated to scene layers.
 *
 * Wraps individual scene content (inside a SceneStage) so a single scene
 * failure degrades gracefully without affecting other scenes.
 */
export class SceneBoundary extends Component<
  SceneBoundaryProps,
  SceneBoundaryState
> {
  constructor(props: SceneBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SceneBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[SceneBoundary] Scene layer failed:', error, info);
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

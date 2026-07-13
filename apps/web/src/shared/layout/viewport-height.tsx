import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface ViewportHeightProps {
  children: ReactNode;
  /**
   * Height mode:
   * - 'full': 100vh — fills the entire viewport
   * - 'screen': 100svh — small viewport height (excludes mobile browser chrome)
   * - 'dynamic': 100dvh — dynamic viewport height (responds to browser chrome changes)
   */
  mode?: 'full' | 'screen' | 'dynamic';
  /** Minimum height instead of fixed height */
  minHeight?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Viewport height utility for full-screen sections.
 *
 * From DESIGN_SYSTEM §7 (Breakpoints):
 * "Mobile is a different context — a different physical relationship
 *  between the user and the screen."
 *
 * Mobile browsers hide/show URL bars, changing the effective viewport.
 * Using svh/dvh instead of vh ensures accurate full-screen layouts.
 *
 * Fallback: vh for browsers that don't support svh/dvh.
 */
const HEIGHT_MAP = {
  full: '100vh',
  screen: '100svh',
  dynamic: '100dvh',
} as const;

export function ViewportHeight({
  children,
  mode = 'full',
  minHeight = false,
  className = '',
}: ViewportHeightProps) {
  const height = minHeight ? `min(${HEIGHT_MAP[mode]}, 100vh)` : HEIGHT_MAP[mode];

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ height, minHeight: minHeight ? height : undefined }}
    >
      {children}
    </div>
  );
}

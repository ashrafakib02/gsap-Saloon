/**
 * Branded loading indicator — a warm gold pulse that matches the salon's aesthetic.
 *
 * From TECHNICAL_ARCHITECTURE §13.2:
 * "No loading spinners. Ever. If content can appear in <300ms, show nothing.
 *  If it takes longer, use a branded indicator that matches the warm aesthetic."
 *
 * From DESIGN_SYSTEM §1:
 * "P3: Restraint as Confidence. Generous whitespace, limited color, typographic
 *  discipline, and minimal motion communicate that the brand knows exactly what it is."
 */

// ── Types ─────────────────────────────────────────────────

interface LoadingIndicatorProps {
  /** Whether to render as full-viewport (for route transitions) or inline */
  fullViewport?: boolean;
  /** Optional label for screen readers */
  label?: string;
}

// ── Component ─────────────────────────────────────────────

export function LoadingIndicator({ fullViewport = false, label = 'Loading' }: LoadingIndicatorProps) {
  const content = (
    <div className="flex flex-col items-center gap-4" role="status" aria-label={label}>
      {/* Warm gold pulse — three dots with staggered animation */}
      <div className="flex items-center gap-2">
        <span
          className="block h-2 w-2 rounded-full bg-[var(--color-accent)]"
          style={{ animation: 'warm-pulse 1.4s ease-in-out infinite' }}
          aria-hidden="true"
        />
        <span
          className="block h-2 w-2 rounded-full bg-[var(--color-accent)]"
          style={{ animation: 'warm-pulse 1.4s ease-in-out 0.2s infinite' }}
          aria-hidden="true"
        />
        <span
          className="block h-2 w-2 rounded-full bg-[var(--color-accent)]"
          style={{ animation: 'warm-pulse 1.4s ease-in-out 0.4s infinite' }}
          aria-hidden="true"
        />
      </div>

      {/* Screen reader only — visually hidden */}
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullViewport) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

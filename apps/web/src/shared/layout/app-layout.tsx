import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Root application layout wrapper.
 *
 * Provides the outermost semantic structure for every page:
 *   <header> → top-level site navigation
 *   <main>   → primary content
 *   <footer> → site-wide footer information
 *
 * From DESIGN_SYSTEM §6 (Grid):
 * "Every layout on every page derives from a consistent, invisible architecture."
 *
 * From VISUAL_RULES S5:
 * "Content never touches the viewport edge."
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden bg-[var(--color-surface)] text-[var(--color-text)]"
      style={{ fontFeatureSettings: '"kern" 1, "liga" 1' }}
    >
      {children}
    </div>
  );
}

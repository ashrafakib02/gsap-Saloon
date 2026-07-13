import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';
import { RootErrorBoundary } from './error-boundary';
import { LoadingIndicator } from '@/shared/feedback/loading-indicator';
import { SeoHead } from '@/shared/layout/seo-head';
import { Navigation } from '@/features/navigation';
import { useScrollManager } from '@/shared/hooks/ui/use-scroll-manager';
import { useWebVitals } from '@/shared/hooks/performance/use-web-vitals';
import { usePerformanceMonitor } from '@/shared/hooks/performance/use-performance-monitor';

// ── Root Component ────────────────────────────────────────

/**
 * The root layout of the entire application.
 *
 * From PROJECT_BLUEPRINT:
 * "Root layout (providers, Lenis, GSAP init)"
 *
 * From TECHNICAL_ARCHITECTURE §12.6:
 * "Root boundary: Catches catastrophic failures. Shows full-page branded error."
 *
 * From TECHNICAL_ARCHITECTURE §16.4:
 * "Skip-to-content link is the first focusable element."
 *
 * Architecture:
 * - Providers are in main.tsx (outside the router)
 * - This layout handles route-level concerns:
 *   - SEO document head
 *   - Skip-to-content accessibility link
 *   - Scroll management (deep linking, section tracking)
 *   - Error boundary (root level)
 *   - Suspense boundary (route transitions)
 *   - Portal roots (modal, toast)
 *   - Performance monitoring
 *   - Cursor infrastructure
 */
function RootComponent() {
  // Initialize scroll management (hash deep linking, section tracking)
  useScrollManager();

  // Initialize performance monitoring (Web Vitals, long tasks)
  useWebVitals();
  usePerformanceMonitor();

  return (
    <>
      {/* SEO — manages document title and meta tags */}
      <SeoHead />

      {/* Accessibility — skip link bypasses all animated sections (WCAG 2.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:block focus:p-4 focus:text-[length:var(--text-body)] focus:text-[var(--color-surface)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)]"
      >
        Skip to content
      </a>

      {/* Global navigation — sticky, scroll-aware, responsive.
          Renders as a <header> landmark for screen reader navigation.
          From TECHNICAL_ARCHITECTURE §16.4: "Screen reader landmarks" */}
      <Navigation />

      {/* Main content area — all page content renders here.
          pt-[72px] compensates for the fixed navigation header height. */}
      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        className="min-h-screen pt-[72px] outline-none"
      >
        <RootErrorBoundary>
          <Suspense fallback={<LoadingIndicator fullViewport />}>
            <Outlet />
          </Suspense>
        </RootErrorBoundary>
      </main>

      {/* Global portal roots — modals, toasts, and overlays render here */}
      <div id="modal-root" />
      <div id="toast-root" />
    </>
  );
}

// ── Route ─────────────────────────────────────────────────

export const Route = createRootRoute({
  component: RootComponent,
});

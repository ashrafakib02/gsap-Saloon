/**
 * ScrollTrigger Registration
 *
 * ScrollTrigger-specific infrastructure providing creation, lifecycle
 * management, and query capabilities for scroll-linked animations.
 *
 * All ScrollTrigger instances created through this module inherit
 * VISUAL_RULES-compliant defaults and are tracked for bulk operations
 * (e.g., disabling all triggers during reduced-motion or page transitions).
 *
 * From DESIGN_SYSTEM §14:
 * - M1: "Scroll-Linked, Not Time-Linked. The visitor controls the speed."
 *
 * @example
 * ```ts
 * import { createScrollTrigger, disableAllScrollTriggers } from '@/shared/animation/scrolltrigger-registration';
 *
 * const st = createScrollTrigger({
 *   trigger: '.hero',
 *   start: 'top 70%',
 *   onEnter: () => console.log('Hero visible'),
 * });
 *
 * // Later, during reduced-motion or cleanup:
 * disableAllScrollTriggers();
 * ```
 */

import { getScrollTrigger } from '@/shared/animation/gsap-registration';
import { DEBOUNCE } from '@/shared/tokens/timing';

// ── Types ──────────────────────────────────────────────────

/** Configuration for creating a ScrollTrigger instance. */
export interface ScrollTriggerConfig {
  /** CSS selector or DOM element to observe. */
  trigger: string | Element;
  /** Start position (default: `'top 80%'`). */
  start?: string;
  /** End position. */
  end?: string;
  /** Whether scrub is enabled, and optionally the smoothness factor. */
  scrub?: boolean | number;
  /** Callback when the trigger enters the viewport. */
  onEnter?: () => void;
  /** Callback when the trigger leaves the viewport (scrolling down). */
  onLeave?: () => void;
  /** Callback when scrolling back up into the trigger. */
  onEnterBack?: () => void;
  /** Callback when scrolling up past the trigger. */
  onLeaveBack?: () => void;
  /** Show debug markers (dev mode only). */
  markers?: boolean;
  /** Debug name for identification and cleanup. */
  name?: string;
}

/**
 * Wrapper type for ScrollTrigger instances with our naming convention.
 * Extends the base ScrollTrigger type with an optional `name` property.
 */
export interface ScrollTriggerInstance {
  /** The underlying GSAP ScrollTrigger instance. */
  trigger: ReturnType<ReturnType<typeof getScrollTrigger>['create']>;
  /** The name assigned to this instance (if any). */
  name?: string;
  /** Whether this instance is currently active. */
  isActive: boolean;
  /** Kill this specific ScrollTrigger instance. */
  kill: () => void;
}

// ── Module State ───────────────────────────────────────────

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
/** Internal map of named ScrollTriggers for lifecycle management. */
const namedTriggers = new Map<string, ReturnType<ReturnType<typeof getScrollTrigger>['create']>>();

// ── Public API ─────────────────────────────────────────────

/**
 * Creates a ScrollTrigger instance with standard defaults.
 *
 * Default configuration:
 * - `start: 'top 80%'` — triggers when element's top reaches 80% viewport
 * - `markers` — only enabled when explicitly passed (typically in dev)
 * - `toggleActions: 'play none none reverse'` — plays forward, reverses on scroll-back
 *
 * @param config - ScrollTrigger configuration
 * @returns A managed ScrollTrigger wrapper with lifecycle methods
 */
export function createScrollTrigger(
  config: ScrollTriggerConfig,
): ScrollTriggerInstance {
  const ScrollTrigger = getScrollTrigger();

  const stConfig: Record<string, unknown> = {
    trigger: config.trigger,
    start: config.start ?? 'top 80%',
    toggleActions: 'play none none reverse',
  };

  if (config.end !== undefined) stConfig.end = config.end;
  if (config.scrub !== undefined) stConfig.scrub = config.scrub;
  if (config.onEnter !== undefined) stConfig.onEnter = config.onEnter;
  if (config.onLeave !== undefined) stConfig.onLeave = config.onLeave;
  if (config.onEnterBack !== undefined) stConfig.onEnterBack = config.onEnterBack;
  if (config.onLeaveBack !== undefined) stConfig.onLeaveBack = config.onLeaveBack;
  if (config.markers !== undefined) stConfig.markers = config.markers;

  // In development, show markers if explicitly enabled
  if (import.meta.env.DEV && config.markers) {
    stConfig.markers = true;
  }

  if (config.name) {
    stConfig.id = config.name;
  }

  const st = ScrollTrigger.create(stConfig as Parameters<typeof ScrollTrigger.create>[0]) as ScrollTriggerInstance['trigger'];

  // Track named instances for lifecycle management
  if (config.name) {
    namedTriggers.set(config.name, st);
  }

  return {
    trigger: st,
    name: config.name,
    isActive: st.isActive ?? false,
    kill: () => {
      if (config.name) {
        namedTriggers.delete(config.name);
      }
      st.kill();
    },
  };
}

/**
 * Debounced ScrollTrigger.refresh() call.
 *
 * Recalculates all ScrollTrigger positions after DOM changes.
 * Debounced to coalesce rapid successive calls.
 *
 * @see DEBOUNCE.resize — uses 150ms debounce interval
 */
export function refreshAll(): void {
  if (refreshTimeout !== null) {
    clearTimeout(refreshTimeout);
  }

  refreshTimeout = setTimeout(() => {
    const ScrollTrigger = getScrollTrigger();
    ScrollTrigger.refresh();
    refreshTimeout = null;
  }, DEBOUNCE.resize);
}

/**
 * Disables (kills) a specific named ScrollTrigger instance.
 *
 * @param name - The name used when the ScrollTrigger was created
 */
export function disableScrollTrigger(name: string): void {
  const st = namedTriggers.get(name);
  if (st) {
    st.kill();
    namedTriggers.delete(name);
  }
}

/**
 * Disables ALL named ScrollTrigger instances.
 *
 * Used when:
 * - Reduced motion is activated
 * - A page transition begins
 * - The user navigates away from a section
 *
 * After calling this, use {@link enableScrollTriggers} to restore.
 */
export function disableAllScrollTriggers(): void {
  // Kill all tracked named instances
  for (const [name, st] of namedTriggers) {
    st.kill();
    namedTriggers.delete(name);
  }

  // Also kill any untracked ScrollTrigger instances
  const ScrollTrigger = getScrollTrigger();
  const allSTs = ScrollTrigger.getAll();
  for (const st of allSTs) {
    st.kill();
  }
}

/**
 * Re-enables ScrollTriggers after a disable cycle.
 *
 * Calls ScrollTrigger.refresh() to recalculate positions, ensuring
 * triggers activate correctly when re-enabled.
 */
export function enableScrollTriggers(): void {
  refreshAll();
}

/**
 * Checks if a named ScrollTrigger exists and is currently active.
 *
 * @param name - The name used when the ScrollTrigger was created
 * @returns `true` if the trigger exists and is active, `false` otherwise
 */
export function isScrollTriggerActive(name: string): boolean {
  const st = namedTriggers.get(name);
  if (!st) return false;
  return (st as { isActive?: boolean }).isActive ?? false;
}

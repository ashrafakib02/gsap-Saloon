/**
 * Timeline Factory
 *
 * Creates GSAP timelines with consistent configuration. This module provides
 * factory functions for the two timeline patterns used across the application:
 *
 * 1. **Standard timelines** — time-linked animations (hero reveals, page transitions)
 * 2. **Scroll-linked timelines** — connected to ScrollTrigger (content reveals)
 * 3. **Stagger timelines** — sequential reveals for groups of elements
 *
 * All timelines are created with VISUAL_RULES-compliant defaults.
 * This is INFRASTRUCTURE only — no actual timeline content is defined here.
 *
 * @example
 * ```ts
 * import { createTimeline, createScrollTimeline } from '@/shared/animation/timeline-factory';
 *
 * // Standard timeline
 * const tl = createTimeline({ name: 'my-animation' });
 * tl.from('.title', { y: 30, opacity: 0 });
 * tl.to('.title', { y: 0, opacity: 1, duration: 0.6 });
 *
 * // Scroll-linked timeline
 * const scrollTl = createScrollTimeline({
 *   trigger: '.section',
 *   start: 'top 80%',
 * });
 * scrollTl.from('.content', { y: 20, opacity: 0, duration: 0.5 });
 * ```
 */

import { getGSAP, getScrollTrigger } from '@/shared/animation/gsap-registration';

// ── Types ──────────────────────────────────────────────────

/** Options for creating a standard GSAP timeline. */
export interface TimelineOptions {
  /** Debug name — also sets `data-testid` on the timeline for DevTools. */
  name?: string;
  /** Whether the timeline starts paused (default: false). */
  paused?: boolean;
  /** Whether the timeline starts reversed (default: false). */
  reversed?: boolean;
}

/** Options for creating a scroll-linked GSAP timeline. */
export interface ScrollTimelineOptions {
  /** CSS selector or DOM element to trigger the animation. */
  trigger?: string | Element;
  /** ScrollTrigger `start` position (default: `'top 80%'`). */
  start?: string;
  /** ScrollTrigger `end` position. */
  end?: string;
  /** Whether scrub is enabled, and optionally the smoothness factor. */
  scrub?: boolean | number;
  /** Debug name for the timeline and its ScrollTrigger. */
  name?: string;
}

/** Options for creating a stagger timeline. */
export interface StaggerTimelineOptions {
  /** Delay between staggered elements in seconds (default: 0.2). */
  stagger?: number;
  /** Duration of each individual element's animation in seconds (default: 0.5). */
  duration?: number;
  /** GSAP ease string (default: 'power2.out'). */
  ease?: string;
  /** GSAP stagger `from` direction (e.g., 'start', 'center', 'random'). */
  from?: string;
  /** Debug name for the timeline. */
  name?: string;
}

// ── Factory Functions ──────────────────────────────────────

/**
 * Creates a standard GSAP timeline with consistent defaults.
 *
 * Defaults enforce VISUAL_RULES:
 * - `ease: 'power2.out'` — ease-out for entry (M3)
 * - `overwrite: 'auto'` — prevents animation conflicts
 *
 * @param options - Optional configuration for the timeline
 * @returns A configured GSAP timeline ready for animation definitions
 */
export function createTimeline(
  options?: TimelineOptions,
): gsap.core.Timeline {
  const gsap = getGSAP();
  const name = options?.name;

  const timeline = gsap.timeline({
    defaults: {
      ease: 'power2.out',
      overwrite: 'auto',
    },
    paused: options?.paused ?? false,
    reversed: options?.reversed ?? false,
    ...(name ? { id: name } : {}),
  });

  return timeline;
}

/**
 * Creates a GSAP timeline connected to ScrollTrigger.
 *
 * The timeline plays as the user scrolls through the trigger element.
 * Default `start: 'top 80%'` ensures animations begin when the element
 * enters the viewport, not when it reaches the top.
 *
 * @param options - Configuration for the ScrollTrigger and timeline
 * @returns A GSAP timeline that plays in sync with scroll position
 */
export function createScrollTimeline(
  options?: ScrollTimelineOptions,
): gsap.core.Timeline {
  const gsap = getGSAP();
  const name = options?.name;

  const trigger =
    typeof options?.trigger === 'string'
      ? options.trigger
      : options?.trigger ?? 'body';

  const timeline = gsap.timeline({
    defaults: {
      ease: 'power2.out',
      overwrite: 'auto',
    },
    scrollTrigger: {
      trigger,
      start: options?.start ?? 'top 80%',
      end: options?.end,
      scrub: options?.scrub ?? false,
      toggleActions: 'play none none reverse',
      ...(name ? { id: name } : {}),
    },
    ...(name ? { id: name } : {}),
  });

  return timeline;
}

/**
 * Creates a stagger timeline for animating groups of elements.
 *
 * Each element in the target group animates sequentially with the
 * configured stagger offset. Useful for list items, card grids,
 * navigation elements, and other repeating patterns.
 *
 * @param items - GSAP target selector or element(s) to stagger
 * @param options - Stagger configuration
 * @returns A GSAP timeline with stagger built in
 */
export function createStaggerTimeline(
  items: string | Element | Element[] | NodeListOf<Element>,
  options?: StaggerTimelineOptions,
): gsap.core.Timeline {
  const gsap = getGSAP();
  const name = options?.name;

  const timeline = gsap.timeline({
    defaults: {
      ease: options?.ease ?? 'power2.out',
      overwrite: 'auto',
    },
    ...(name ? { id: name } : {}),
  });

  timeline.from(
    items,
    {
      y: 20,
      opacity: 0,
      duration: options?.duration ?? 0.5,
      stagger: options?.stagger ?? 0.2,
      ...(options?.from ? { from: options.from } : {}),
    },
  );

  return timeline;
}

/**
 * Kills a specific GSAP timeline and garbage-collects its resources.
 *
 * Always call this during cleanup to prevent memory leaks from orphaned
 * animations. The timeline reference becomes invalid after this call.
 *
 * @param timeline - The timeline to kill
 */
export function killTimeline(timeline: gsap.core.Timeline): void {
  if (!timeline) return;
  timeline.kill();
}

/**
 * Kills all GSAP timelines, optionally filtered by name pattern.
 *
 * Useful for cleanup during page transitions or when toggling
 * reduced-motion on. If no pattern is provided, ALL timelines
 * are killed.
 *
 * @param pattern - Optional name pattern to match (substring match).
 *                  If omitted, kills all timelines.
 *
 * @example
 * ```ts
 * // Kill all timelines
 * batchKill();
 *
 * // Kill only hero-related timelines
 * batchKill('hero');
 * ```
 */
export function batchKill(pattern?: string): void {
  const gsap = getGSAP();
  const ScrollTrigger = getScrollTrigger();

  if (pattern) {
    const allTimelines = gsap.globalTimeline.getChildren(true, false, true);
    for (const child of allTimelines) {
      if (
        typeof child === 'object' &&
        child !== null &&
        'vars' in child &&
        typeof (child as { vars?: { id?: string } }).vars?.id === 'string' &&
        (child as { vars: { id: string } }).vars.id.includes(pattern)
      ) {
        child.kill();
      }
    }
  } else {
    // Kill everything
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
}

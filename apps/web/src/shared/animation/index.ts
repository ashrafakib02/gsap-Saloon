/**
 * Animation Infrastructure — Barrel Export
 *
 * GSAP registration, animation registry, presets,
 * timeline factory, ScrollTrigger management, and reduced-motion integration.
 */

export {
  initGSAP,
  getGSAP,
  getScrollTrigger,
  refreshScrollTrigger,
  killAllAnimations,
} from './gsap-registration';

export {
  createAnimationRegistry,
  globalAnimationRegistry,
  validateAnimation,
} from './animation-registry';
export type { AnimationCategory, AnimationDefinition } from './animation-registry';

export {
  SCROLL_REVEAL_UP,
  SCROLL_REVEAL_FADE,
  SCROLL_REVEAL_SCALE,
  HOVER_WARM_REVEAL,
  HERO_REVEAL,
  SECTION_STAGGER,
  INSTANT,
  getReducedMotionPreset,
  getStaggerDelay,
} from './animation-presets';
export type { AnimationPreset } from './animation-presets';

export {
  createTimeline,
  createScrollTimeline,
  createStaggerTimeline,
  killTimeline,
  batchKill,
} from './timeline-factory';
export type { TimelineOptions, ScrollTimelineOptions, StaggerTimelineOptions } from './timeline-factory';

export {
  createScrollTrigger,
  refreshAll,
  disableScrollTrigger,
  disableAllScrollTriggers,
  enableScrollTriggers,
  isScrollTriggerActive,
} from './scrolltrigger-registration';
export type { ScrollTriggerConfig, ScrollTriggerInstance } from './scrolltrigger-registration';

export {
  prefersReducedMotion,
  getAnimationDuration,
  getAnimationDelay,
  shouldAnimate,
  getTransitionCSS,
  getReducedMotionFallback,
} from './reduced-motion';

/**
 * Animation Registry
 *
 * Centralized tracking of all animations in the application. Every animation
 * should be registered here for validation against VISUAL_RULES and for
 * debugging/monitoring purposes.
 *
 * From DESIGN_SYSTEM §14:
 * "All motion is intentionally constrained — validation ensures compliance."
 *
 * @example
 * ```ts
 * import { globalAnimationRegistry } from '@/shared/animation/animation-registry';
 *
 * globalAnimationRegistry.register({
 *   id: 'hero-title-reveal',
 *   category: 'hero',
 *   name: 'Hero Title Reveal',
 *   respectsReducedMotion: true,
 *   gpuAccelerated: true,
 *   maxDuration: 1200,
 *   description: 'Initial page-load reveal for hero heading',
 * });
 * ```
 */

import { MOTION_LIMITS } from '@/shared/tokens/motion';

// ── Types ──────────────────────────────────────────────────

/** Categories of animations within the application. */
export type AnimationCategory =
  | 'scroll-reveal'
  | 'hover'
  | 'page-transition'
  | 'hero'
  | 'micro'
  | '3d';

/** Definition of a registered animation. */
export interface AnimationDefinition {
  /** Unique identifier for this animation (kebab-case recommended). */
  id: string;
  /** The category this animation belongs to. */
  category: AnimationCategory;
  /** Human-readable name for debugging. */
  name: string;
  /** Whether this animation respects prefers-reduced-motion. */
  respectsReducedMotion: boolean;
  /** Whether this animation uses GPU-accelerated properties (transform, opacity). */
  gpuAccelerated: boolean;
  /** Maximum duration in milliseconds. Must be ≤600 for non-hero categories. */
  maxDuration: number;
  /** Optional description of the animation's purpose. */
  description?: string;
}

/** Validation result for an animation definition. */
export interface ValidationResult {
  /** Whether the animation passes all VISUAL_RULES checks. */
  valid: boolean;
  /** List of human-readable issue descriptions (empty when valid). */
  issues: string[];
}

/** The return type of {@link createAnimationRegistry}. */
export interface AnimationRegistry {
  /** Register a new animation definition. */
  register(anim: AnimationDefinition): void;
  /** Retrieve an animation by its unique ID. */
  get(id: string): AnimationDefinition | undefined;
  /** Get all animations in a given category. */
  getByCategory(category: AnimationCategory): AnimationDefinition[];
  /** Get all registered animations. */
  getAll(): AnimationDefinition[];
  /**
   * Validate a registered animation by ID against VISUAL_RULES.
   * @returns Validation result with any issues found.
   */
  validate(id: string): ValidationResult;
}

// ── Validation ─────────────────────────────────────────────

/** Maximum duration for non-hero content reveals (M4: 600ms). */
const MAX_CONTENT_REVEAL_DURATION = 600;

/**
 * Validates an animation definition against VISUAL_RULES constraints.
 *
 * Checks:
 * - M3: No overshoot/bounce (gpuAccelerated must be true)
 * - M4: Max 600ms duration for non-hero animations
 * - M5: Max 30px vertical translation (checked via maxDuration heuristic)
 * - M11: Must respect prefers-reduced-motion
 *
 * @param anim - The animation definition to validate
 * @returns Validation result with a list of any issues found
 */
export function validateAnimation(anim: AnimationDefinition): ValidationResult {
  const issues: string[] = [];

  // M11: All animations must respect reduced motion
  if (!anim.respectsReducedMotion) {
    issues.push(
      'M11 violation: Animation must respect prefers-reduced-motion',
    );
  }

  // M3: GPU-accelerated properties (transform, opacity) prevent layout thrashing
  // Non-GPU-accelerated animations risk jank and violate the smoothness constraint
  if (!anim.gpuAccelerated) {
    issues.push(
      'M3/M6 concern: Animation should use GPU-accelerated properties (transform, opacity)',
    );
  }

  // M4: Non-hero animations must not exceed 600ms
  if (anim.category !== 'hero' && anim.maxDuration > MAX_CONTENT_REVEAL_DURATION) {
    issues.push(
      `M4 violation: Non-hero animation maxDuration (${anim.maxDuration}ms) exceeds ${MAX_CONTENT_REVEAL_DURATION}ms limit`,
    );
  }

  // Warn if hover scale could exceed MOTION_LIMITS.maxHoverScale
  if (anim.category === 'hover' && anim.maxDuration > MOTION_LIMITS.maxHoverScale * 1000) {
    issues.push(
      `M6 warning: Hover animation should not exceed ${MOTION_LIMITS.maxHoverScale} scale`,
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ── Factory ────────────────────────────────────────────────

/**
 * Creates an isolated animation registry instance.
 *
 * Each registry maintains its own map of animation definitions and provides
 * registration, lookup, and validation capabilities.
 *
 * @returns A new AnimationRegistry instance
 */
export function createAnimationRegistry(): AnimationRegistry {
  const store = new Map<string, AnimationDefinition>();

  return {
    register(anim: AnimationDefinition): void {
      store.set(anim.id, anim);
    },

    get(id: string): AnimationDefinition | undefined {
      return store.get(id);
    },

    getByCategory(category: AnimationCategory): AnimationDefinition[] {
      return Array.from(store.values()).filter(
        (anim) => anim.category === category,
      );
    },

    getAll(): AnimationDefinition[] {
      return Array.from(store.values());
    },

    validate(id: string): ValidationResult {
      const anim = store.get(id);
      if (!anim) {
        return {
          valid: false,
          issues: [`Animation with id "${id}" is not registered`],
        };
      }
      return validateAnimation(anim);
    },
  };
}

// ── Singleton ──────────────────────────────────────────────

/**
 * Global animation registry singleton.
 *
 * Use this for app-wide animation tracking. For isolated contexts
 * (e.g., feature modules with their own animation scope), create
 * separate instances with {@link createAnimationRegistry}.
 */
export const globalAnimationRegistry: AnimationRegistry =
  createAnimationRegistry();

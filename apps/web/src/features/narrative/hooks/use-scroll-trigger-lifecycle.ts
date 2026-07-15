/**
 * useScrollTriggerLifecycle — Lifecycle Management Hook
 *
 * Manages the lifecycle of ScrollTrigger instances for a
 * specific component. Handles registration, cleanup on
 * unmount, and state transitions.
 *
 * This hook is the recommended way for components to create
 * and manage their ScrollTrigger instances. It ensures:
 *
 * - Triggers are registered on mount
 * - Triggers are killed on unmount (prevents memory leaks)
 * - Lifecycle state is tracked
 * - Reduced-motion is respected
 *
 * Phase 5.4: Infrastructure hook — no animation logic.
 *
 * @example
 * ```tsx
 * function ServiceCard() {
 *   const { register, kill, state, isActive } = useScrollTriggerLifecycle({
 *     id: 'service-card-reveal',
 *     group: 'section-reveal',
 *     trigger: '.service-card',
 *     start: 'top 80%',
 *   });
 *
 *   return (
 *     <div className={`service-card ${isActive ? 'revealed' : ''}`}>
 *       ...
 *     </div>
 *   );
 * }
 * ```
 */

import { useEffect, useRef, useCallback, useState } from 'react';

import {
  registerScrollTrigger,
  killTrigger,
  disableTrigger,
  enableTrigger,
} from '../scrolltrigger-manager';

import type { TriggerOptions, TriggerLifecycleState } from '../scrolltrigger.types';

// ── Types ──────────────────────────────────────────────────

/**
 * Options for useScrollTriggerLifecycle.
 */
export interface ScrollTriggerLifecycleOptions
  extends Omit<TriggerOptions, 'id'> {
  /** Unique trigger ID — must be stable across re-renders */
  readonly id: string;
  /** Whether to skip registration (e.g., during reduced motion) */
  readonly skip?: boolean;
}

/**
 * Return type for useScrollTriggerLifecycle.
 */
export interface UseScrollTriggerLifecycleReturn {
  /** The current lifecycle state */
  readonly state: TriggerLifecycleState;
  /** Whether the trigger is currently active */
  readonly isActive: boolean;
  /** Whether the trigger is registered but not yet active */
  readonly isRegistered: boolean;
  /** Whether the trigger has been killed */
  readonly isDestroyed: boolean;
  /** Re-register the trigger */
  readonly register: () => void;
  /** Kill the trigger */
  readonly kill: () => void;
  /** Disable the trigger (retains definition) */
  readonly disable: () => void;
  /** Re-enable a disabled trigger */
  readonly enable: () => void;
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Manages the lifecycle of a single ScrollTrigger instance.
 *
 * Registers the trigger on mount (unless `skip` is true)
 * and kills it on unmount. Tracks lifecycle state.
 *
 * From DESIGN_SYSTEM §Performance:
 * "Kill all GSAP animations on component unmount — no memory leaks."
 *
 * @param options - Trigger options including ID and lifecycle config
 * @returns Lifecycle state and control functions
 */
export function useScrollTriggerLifecycle(
  options: ScrollTriggerLifecycleOptions,
): UseScrollTriggerLifecycleReturn {
  const [state, setState] = useState<TriggerLifecycleState>('registered');
  const optionsRef = useRef(options);
  optionsRef.current = options;

  /* Register on mount, kill on unmount */
  useEffect(() => {
    if (options.skip) return;

    const trigger = registerScrollTrigger(optionsRef.current);
    if (trigger) {
      setState('active');
    }

    return () => {
      killTrigger(optionsRef.current.id);
      setState('destroyed');
    };
    /* Only re-register if skip changes */
  }, [options.id, options.skip]);

  const register = useCallback(() => {
    const trigger = registerScrollTrigger(optionsRef.current);
    if (trigger) {
      setState('active');
    }
  }, []);

  const kill = useCallback(() => {
    killTrigger(optionsRef.current.id);
    setState('destroyed');
  }, []);

  const disable = useCallback(() => {
    disableTrigger(optionsRef.current.id);
    setState('disabled');
  }, []);

  const enable = useCallback(() => {
    const trigger = enableTrigger(optionsRef.current.id);
    if (trigger) {
      setState('active');
    }
  }, []);

  return {
    state,
    isActive: state === 'active',
    isRegistered: state === 'registered',
    isDestroyed: state === 'destroyed',
    register,
    kill,
    disable,
    enable,
  };
}

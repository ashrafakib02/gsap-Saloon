/**
 * Three Event Manager — Centralized Interaction Dispatch Hub
 *
 * From TECHNICAL_ARCHITECTURE §9.6:
 * "All 3D interaction routes through a single event layer so that scroll,
 *  pointer, and gesture input stay coordinated with the narrative timeline."
 *
 * This module establishes the event architecture for the 3D layer: a typed
 * pub/sub hub keyed by interaction category. Phase 6.1 wires the hub with no
 * active listeners — later phases (camera, interactions, selection) register
 * handlers via `on` and dispatch via `emit`. It intentionally attaches no DOM
 * listeners itself; R3F's own event system and the scroll-state manager remain
 * the upstream sources that will feed this hub.
 *
 * Mirrors the shared `eventBus` pattern but is scoped to 3D and strongly typed
 * per category via {@link ThreeEventPayloadMap}.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only, no handlers fire.
 */

import type {
  ThreeEventManager,
  ThreeEventType,
  ThreeEvent,
  ThreeEventListener,
  ThreeEventUnsubscribe,
} from './three.types';

import { THREE_EVENT_TYPES } from './three.types';

/**
 * Create a fresh, isolated Three event manager.
 *
 * Each manager owns its own listener registry — one per category. Exposed as a
 * factory (in addition to the shared singleton) so scenes can create scoped
 * hubs in later phases without cross-talk.
 */
export function createThreeEventManager(): ThreeEventManager {
  /**
   * Listener registry, one Set per category. Using a Set gives O(1)
   * add/remove and natural de-duplication of the same listener reference.
   */
  const listeners = new Map<ThreeEventType, Set<ThreeEventListener>>();
  for (const type of THREE_EVENT_TYPES) {
    listeners.set(type, new Set());
  }

  function on<K extends ThreeEventType>(
    type: K,
    listener: ThreeEventListener<K>,
  ): ThreeEventUnsubscribe {
    const set = listeners.get(type);
    /* Cast: the outer map is keyed loosely; K narrows the listener at the API
       boundary, so storage as the base listener type is safe. */
    set?.add(listener as ThreeEventListener);
    return () => {
      set?.delete(listener as ThreeEventListener);
    };
  }

  function off<K extends ThreeEventType>(
    type: K,
    listener: ThreeEventListener<K>,
  ): void {
    listeners.get(type)?.delete(listener as ThreeEventListener);
  }

  function emit<K extends ThreeEventType>(event: ThreeEvent<K>): void {
    const set = listeners.get(event.type);
    if (!set || set.size === 0) return;
    /* Iterate a copy so a listener that unsubscribes during dispatch does not
       mutate the set mid-iteration. */
    for (const listener of [...set]) {
      (listener as ThreeEventListener<K>)(event);
    }
  }

  function hasListeners(type: ThreeEventType): boolean {
    const set = listeners.get(type);
    return set !== undefined && set.size > 0;
  }

  function listenerCount(type: ThreeEventType): number {
    return listeners.get(type)?.size ?? 0;
  }

  function clear(): void {
    listeners.forEach((set) => set.clear());
  }

  return Object.freeze({
    on,
    off,
    emit,
    hasListeners,
    listenerCount,
    clear,
  });
}

/**
 * The shared application-wide Three event manager singleton.
 *
 * The provider exposes this through context. Established empty in Phase 6.1.
 */
export const threeEventManager: ThreeEventManager = createThreeEventManager();

/**
 * Convenience factory for a typed {@link ThreeEvent}.
 *
 * Stamps `timestamp` with the current high-resolution time. Keeps payload
 * construction consistent across future dispatch sites.
 */
export function createThreeEvent<K extends ThreeEventType>(
  type: K,
  payload: ThreeEvent<K>['payload'],
): ThreeEvent<K> {
  return {
    type,
    payload,
    timestamp: typeof performance !== 'undefined' ? performance.now() : Date.now(),
  };
}

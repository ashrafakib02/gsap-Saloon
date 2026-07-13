/**
 * Typed publish / subscribe event bus.
 *
 * Provides a single, application-wide channel for decoupled communication
 * between features.  Every event and payload is statically typed via
 * {@link EventMap} — typos and missing payloads are caught at compile time.
 *
 * @module shared/infra/event-system
 */

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

/**
 * Registry of every event and its payload type.
 *
 * Add new events here — the compiler will enforce correctness everywhere
 * the bus is used.
 */
export interface EventMap {
  /** Fired when the UI theme changes. */
  'theme:change': { theme: 'light' | 'dark' };

  /** Fired when a GSAP / Lenis animation begins for a section. */
  'animation:start': { section: string };

  /** Fired when a GSAP / Lenis animation finishes for a section. */
  'animation:complete': { section: string };

  /** Fired when the booking modal / drawer is opened. */
  'booking:open': { source: string };

  /** Fired when the booking modal / drawer is closed. */
  'booking:close': void;

  /** Fired on every scroll event throttled to direction + position. */
  'navigation:scroll': { direction: 'up' | 'down'; scrollY: number };

  /** Fired when an error is caught by the global error boundary. */
  'error:caught': { error: Error; severity: string };

  /** Fired when a Web Vital or custom performance metric is recorded. */
  'performance:metric': { name: string; value: number };
}

/** Union of valid event keys. */
export type EventKey = keyof EventMap;

/**
 * Callback signature for a given event payload.
 *
 * @typeParam T - The payload type delivered for the event.
 */
export type EventHandler<T> = (payload: T) => void;

/* -------------------------------------------------------------------------- */
/*                            Internal store                                  */
/* -------------------------------------------------------------------------- */

/** Map from event name → set of handler functions. */
const listeners = new Map<string, Set<EventHandler<unknown>>>();

/* -------------------------------------------------------------------------- */
/*                                  API                                       */
/* -------------------------------------------------------------------------- */

/**
 * A typed, tree-shakeable event bus for the application.
 *
 * @example
 * ```ts
 * import { eventBus } from '@/shared/infra/event-system';
 *
 * // Subscribe
 * const unsub = eventBus.on('theme:change', ({ theme }) => {
 *   console.log('Theme is now', theme);
 * });
 *
 * // Publish
 * eventBus.emit('theme:change', { theme: 'dark' });
 *
 * // Cleanup
 * unsub();
 * ```
 */
export const eventBus = {
  /**
   * Subscribe to an event.
   *
   * @param event   - The event name.
   * @param handler - Callback invoked when the event fires.
   * @returns An unsubscribe function for easy cleanup.
   */
  on<K extends EventKey>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): () => void {
    let set = listeners.get(event as string);
    if (!set) {
      set = new Set();
      listeners.set(event as string, set);
    }
    set.add(handler as EventHandler<unknown>);

    return () => {
      eventBus.off(event, handler);
    };
  },

  /**
   * Remove a specific handler for an event.
   *
   * @param event   - The event name.
   * @param handler - The exact handler reference to remove.
   */
  off<K extends EventKey>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): void {
    const set = listeners.get(event as string);
    if (set) {
      set.delete(handler as EventHandler<unknown>);
      // Clean up empty sets to avoid memory leaks.
      if (set.size === 0) {
        listeners.delete(event as string);
      }
    }
  },

  /**
   * Emit an event with the given payload.
   *
   * All registered handlers for `event` are invoked synchronously in
   * registration order.
   *
   * @param event   - The event name.
   * @param payload - The data delivered to every handler.
   */
  emit<K extends EventKey>(event: K, payload: EventMap[K]): void {
    const set = listeners.get(event as string);
    if (!set) return;

    for (const handler of set) {
      try {
        (handler as EventHandler<EventMap[K]>)(payload);
      } catch (err) {
        // Prevent one broken handler from killing the rest.
        console.error(
          `[Sovereign] Event handler error on "${String(event)}":`,
          err,
        );
      }
    }
  },

  /**
   * Subscribe to an event for exactly one invocation, then auto-unsubscribe.
   *
   * @param event   - The event name.
   * @param handler - Callback invoked once.
   * @returns An unsubscribe function (in case you need to cancel early).
   */
  once<K extends EventKey>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): () => void {
    const wrappedHandler: EventHandler<EventMap[K]> = (payload) => {
      eventBus.off(event, wrappedHandler);
      handler(payload);
    };
    return eventBus.on(event, wrappedHandler);
  },

  /**
   * Remove all listeners.
   *
   * @param event - If provided, only removes listeners for that event.
   *                Otherwise removes every listener on the bus.
   */
  removeAllListeners(event?: EventKey): void {
    if (event) {
      listeners.delete(event as string);
    } else {
      listeners.clear();
    }
  },
};

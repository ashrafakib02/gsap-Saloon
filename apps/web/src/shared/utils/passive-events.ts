/**
 * Passive Event Listener Helpers
 *
 * From TECHNICAL_ARCHITECTURE §15.6:
 * "Passive event listeners: Scroll and touch events use { passive: true }"
 *
 * These helpers ensure scroll and touch events are always passive,
 * preventing layout thrashing and improving scroll performance.
 *
 * @example
 * ```ts
 * import { passiveScrollOptions, passiveTouchOptions } from '@/shared/utils/passive-events';
 * window.addEventListener('scroll', handler, passiveScrollOptions);
 * ```
 */

/**
 * Passive options object for scroll event listeners.
 * Always passive — scroll handlers cannot call preventDefault().
 */
export const passiveScrollOptions: AddEventListenerOptions = {
  passive: true,
};

/**
 * Passive options object for touch event listeners.
 * Always passive — improves scroll performance on mobile.
 */
export const passiveTouchOptions: AddEventListenerOptions = {
  passive: true,
};

/**
 * Non-passive options for events that may need preventDefault().
 * Used sparingly — only when scroll/touch prevention is required.
 *
 * From DESIGN_SYSTEM §14 Law 1:
 * "Scroll-Linked, Not Time-Linked. The visitor controls the speed."
 */
export const nonPassiveOptions: AddEventListenerOptions = {
  passive: false,
};

/**
 * A safe addEventListener wrapper that always uses passive for
 * scroll/touch events unless explicitly required.
 *
 * @param target - The EventTarget to attach to
 * @param type - The event type
 * @param handler - The event handler
 * @param nonPassive - Whether to allow preventDefault (default: false)
 */
export function addScrollListener(
  target: EventTarget,
  type: 'scroll' | 'touchstart' | 'touchmove' | 'touchend',
  handler: EventListener,
  nonPassive = false,
): () => void {
  const options = nonPassive ? nonPassiveOptions : passiveScrollOptions;
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

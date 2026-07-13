/**
 * Analytics abstraction layer.
 * Provides a unified interface for tracking events, page views, and user identification
 * across different analytics providers (dev console, Plausible, etc.).
 *
 * Replaces `@/lib/analytics.ts` with a proper provider pattern.
 *
 * @module analytics-abstraction
 */

/**
 * Represents a trackable analytics event.
 */
interface AnalyticsEvent {
  /** Event name (e.g., 'service_selected', 'booking_completed'). */
  name: string;
  /** Event category for grouping. */
  category: 'navigation' | 'booking' | 'interaction' | 'performance' | 'error';
  /** Optional additional properties for the event. */
  properties?: Record<string, string | number | boolean>;
}

/**
 * Interface that all analytics providers must implement.
 */
interface AnalyticsProvider {
  /** Track a custom event. */
  track(event: AnalyticsEvent): void;
  /** Track a page view. */
  page(path: string, title?: string): void;
  /** Identify a user with traits. */
  identify(userId: string, traits?: Record<string, string | number | boolean>): void;
}

/**
 * No-op analytics provider for SSR and testing.
 * All methods silently do nothing.
 */
const NoopAnalyticsProvider: AnalyticsProvider = {
  track(): void {
    // No-op — SSR or testing
  },
  page(): void {
    // No-op
  },
  identify(): void {
    // No-op
  },
};

/**
 * Console-based analytics provider for development.
 * Logs all events to the browser console with formatting.
 */
const ConsoleAnalyticsProvider: AnalyticsProvider = {
  track(event: AnalyticsEvent): void {
    console.log(
      `%c[analytics:track] ${event.category}/${event.name}`,
      'color: #c9a96e; font-weight: bold;',
      event.properties ?? {},
    );
  },

  page(path: string, title?: string): void {
    console.log(
      `%c[analytics:page] ${path}`,
      'color: #c9a96e; font-weight: bold;',
      title ? { title } : {},
    );
  },

  identify(userId: string, traits?: Record<string, string | number | boolean>): void {
    console.log(
      `%c[analytics:identify] ${userId}`,
      'color: #c9a96e; font-weight: bold;',
      traits ?? {},
    );
  },
};

/**
 * Creates an analytics provider appropriate for the current environment.
 *
 * - Server (SSR): NoopAnalyticsProvider
 * - Development: ConsoleAnalyticsProvider
 * - Production: Would return PlausibleProvider (Phase 10)
 *
 * @returns The appropriate analytics provider instance.
 */
function createAnalyticsProvider(): AnalyticsProvider {
  if (typeof window === 'undefined') {
    return NoopAnalyticsProvider;
  }

  if (import.meta.env.DEV) {
    return ConsoleAnalyticsProvider;
  }

  // Production: Phase 10 will integrate with Plausible or similar
  // return PlausibleAnalyticsProvider(config);
  return ConsoleAnalyticsProvider;
}

/**
 * Default analytics provider singleton.
 * Lazily initialized on first access.
 */
let _analytics: AnalyticsProvider | null = null;

const analytics: AnalyticsProvider = {
  track(event: AnalyticsEvent): void {
    _analytics ??= createAnalyticsProvider();
    _analytics.track(event);
  },
  page(path: string, title?: string): void {
    _analytics ??= createAnalyticsProvider();
    _analytics.page(path, title);
  },
  identify(userId: string, traits?: Record<string, string | number | boolean>): void {
    _analytics ??= createAnalyticsProvider();
    _analytics.identify(userId, traits);
  },
};

/**
 * Convenience wrapper to track a named event with a category.
 *
 * @example
 * ```ts
 * trackEvent('service_selected', 'booking', { serviceId: 'cut-1', price: 65 });
 * ```
 *
 * @param name - Event name.
 * @param category - Event category.
 * @param properties - Optional event properties.
 */
function trackEvent(
  name: string,
  category: AnalyticsEvent['category'],
  properties?: Record<string, string | number | boolean>,
): void {
  analytics.track({ name, category, properties });
}

/**
 * Convenience wrapper to track a page view.
 *
 * @example
 * ```ts
 * trackPageView('/services/haircut', 'Haircut Services');
 * ```
 *
 * @param path - Page path.
 * @param title - Optional page title.
 */
function trackPageView(path: string, title?: string): void {
  analytics.page(path, title);
}

export type { AnalyticsEvent, AnalyticsProvider };
export {
  NoopAnalyticsProvider,
  ConsoleAnalyticsProvider,
  createAnalyticsProvider,
  analytics,
  trackEvent,
  trackPageView,
};

/**
 * Future Integration Points — Barrel Export
 *
 * R3F bootstrap, booking types, API client,
 * analytics abstraction, and monitoring abstraction.
 */

export {
  R3F_CONFIG,
  canUseR3F,
  getR3FPixelRatio,
  getDefaultMountConfig,
} from './r3f-bootstrap';
export type { R3FMountConfig } from './r3f-bootstrap';

export type {
  BookingSlot,
  BookingRequest,
  BookingConfirmation,
  BookingState,
  ServiceOption,
  ArtisanOption,
} from './booking-types';

export {
  createApiClient,
  DEFAULT_API_CONFIG,
} from './api-client';
export type {
  ApiClientConfig,
  RequestOptions,
  ApiClientResponse,
  ApiClientError,
} from './api-client';

export {
  NoopAnalyticsProvider,
  ConsoleAnalyticsProvider,
  createAnalyticsProvider,
  analytics,
  trackEvent,
  trackPageView,
} from './analytics-abstraction';
export type { AnalyticsEvent, AnalyticsProvider } from './analytics-abstraction';

export {
  NoopMonitoringProvider,
  ConsoleMonitoringProvider,
  createMonitoringProvider,
  monitoring,
  captureError,
  captureMessage,
  addBreadcrumb,
  DEFAULT_MONITORING_CONFIG,
} from './monitoring-abstraction';
export type { MonitoringProvider, MonitoringConfig } from './monitoring-abstraction';

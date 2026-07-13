// Privacy-first analytics (Plausible/Fathom/Umami)
// No cookies, no tracking pixels, GDPR compliant

interface AnalyticsConfig {
  domain: string;
  api?: string;
}

let configured = false;

export function initAnalytics(config: AnalyticsConfig): void {
  if (configured || !config.domain) return;

  const script = document.createElement('script');
  script.defer = true;
  script.setAttribute('data-domain', config.domain);
  script.src = config.api || 'https://plausible.io/js/script.js';
  document.head.appendChild(script);

  configured = true;
}

export function trackEvent(name: string, props?: Record<string, string>): void {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(name, { props });
  }
}

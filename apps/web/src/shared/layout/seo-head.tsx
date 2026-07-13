import { useEffect } from 'react';
import { SEO_DEFAULTS, type SeoMetadata } from '@/lib/seo';

// ── Types ─────────────────────────────────────────────────

interface SeoHeadProps {
  /** Page-specific SEO overrides — provided by the route component */
  metadata?: Partial<SeoMetadata>;
}

// ── Component ─────────────────────────────────────────────

/**
 * Manages document head metadata (title, description, Open Graph) per route.
 *
 * From TECHNICAL_ARCHITECTURE §14.4:
 * "Each route sets title, meta description, OG tags, and canonical URL."
 *
 * Uses React effects to update document head on mount/prop changes.
 * Individual route components pass their metadata as props.
 *
 * Usage in a route component:
 *   <SeoHead metadata={ROUTE_SEO['/services/hair']} />
 */
export function SeoHead({ metadata }: SeoHeadProps) {
  useEffect(() => {
    const meta = { ...SEO_DEFAULTS, ...metadata };

    document.title = meta.title ?? SEO_DEFAULTS.title;

    setMetaTag('description', meta.description);
    setMetaTag('og:title', meta.title, 'property');
    setMetaTag('og:description', meta.description, 'property');
    setMetaTag('og:image', meta.ogImage, 'property');
    setMetaTag('og:url', meta.canonicalUrl, 'property');

    if (meta.noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow');
    }

    // Canonical link
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = meta.canonicalUrl ?? window.location.href;
  }, [metadata]);

  return null;
}

// ── Helpers ───────────────────────────────────────────────

function setMetaTag(name: string, content: string | undefined, attr: 'name' | 'property' = 'name'): void {
  if (!content) return;

  const selector = `meta[${attr}="${name}"]`;
  let el = document.querySelector<HTMLMetaElement>(selector);

  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
}

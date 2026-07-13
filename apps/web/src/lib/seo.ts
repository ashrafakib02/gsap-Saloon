/**
 * SEO configuration for the entire application.
 *
 * From TECHNICAL_ARCHITECTURE §14.3:
 * "Each route sets title, meta description, OG tags, and canonical URL."
 *
 * Default values are used as fallbacks. Individual routes override via
 * route staticData or the SeoHead component.
 */

// ── Types ─────────────────────────────────────────────────

export interface SeoMetadata {
  title: string;
  description: string;
  ogImage: string;
  canonicalUrl: string;
  noindex: boolean;
}

// ── Defaults ──────────────────────────────────────────────

const SITE_NAME = 'The Sovereign Artisor';
const SITE_URL = 'https://thesovereignartisor.com';

export const SEO_DEFAULTS: SeoMetadata = {
  title: `${SITE_NAME} — Luxury Salon in Marrakech`,
  description:
    'A curated salon experience in the heart of Marrakech. Hair, color, bridal, and spa services crafted by skilled artisans.',
  ogImage: `${SITE_URL}/og-default.jpg`,
  canonicalUrl: SITE_URL,
  noindex: false,
};

// ── Per-Route Metadata ────────────────────────────────────

export const ROUTE_SEO: Record<string, Partial<SeoMetadata>> = {
  '/': {
    title: `${SITE_NAME} — A Luxury Salon Experience in Marrakech`,
    description:
      'Discover a salon experience where craft meets intention. Hair, color, bridal, and spa services in the heart of Marrakech.',
  },
  '/services/hair': {
    title: `Hair Services — ${SITE_NAME}`,
    description:
      'Expert hair styling in Marrakech. From precision cuts to editorial styling, our artisans craft looks that honor your individuality.',
  },
  '/services/color': {
    title: `Color Services — ${SITE_NAME}`,
    description:
      'Bespoke hair color in Marrakech. Our color artisans create dimensional, lived-in tones that catch the light beautifully.',
  },
  '/services/bridal': {
    title: `Bridal Services — ${SITE_NAME}`,
    description:
      'Your wedding day hair, perfected. Our bridal artisans create timeless looks for your most cherished moments.',
  },
  '/services/spa': {
    title: `Spa & Wellness — ${SITE_NAME}`,
    description:
      'Escape into tranquility. Our spa treatments combine Moroccan tradition with modern wellness in Marrakech.',
  },
  '/booking/confirmation': {
    title: `Booking Confirmed — ${SITE_NAME}`,
    noindex: true,
  },
  '/404': {
    title: `Page Not Found — ${SITE_NAME}`,
    noindex: true,
  },
};

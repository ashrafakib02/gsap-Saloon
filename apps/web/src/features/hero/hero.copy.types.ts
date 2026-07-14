/**
 * Hero Copy — Type Definitions
 *
 * From CREATIVE_DIRECTION §Brand Voice:
 * "Our voice lives in a precise emotional register — warm but never casual,
 *  confident but never boastful, specific but never technical."
 *
 * From DESIGN_LANGUAGE §Content Philosophy:
 * "Fewer Words, Better Words — Our content is edited. Ruthlessly.
 *  Every word must earn its place."
 *
 * This file defines the structural contract for ALL hero copy.
 * Every string the hero displays is typed here. No hardcoded text
 * escapes this module.
 *
 * Architecture:
 * - Types are locale-agnostic — the shape, not the language
 * - Each copy element has a clear semantic role
 * - Types support both static strings and template functions
 * - Ready for i18n integration without refactoring components
 *
 * From DESIGN_LANGUAGE §The Five Words:
 * "Warm · Restrained · Considered · Editorial · Enduring"
 * — every piece of copy must pass this filter.
 */

// ── Core Content ──────────────────────────────────────────

/**
 * The hero's primary content — text that appears in the viewport.
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "There is no text to read, no button to click, no navigation to parse.
 *  Just the image. Just the feeling. Just the space."
 *
 * The hero uses minimal text: brand name + tagline + two CTAs.
 * Every word is intentional. Nothing is filler.
 */
export interface HeroCoreCopy {
  /**
   * The brand name — the hero's headline (h1).
   *
   * From VISUAL_RULES AC15:
   * "One <h1> heading per page. Only one."
   *
   * This IS the h1. It must be the full brand name.
   * Never abbreviated. Never stylized. Just the name.
   */
  readonly headline: string;

  /**
   * The brand thesis — a single sentence of emotional resonance.
   *
   * From EXPERIENCE_STORYBOARD SCENE 2 (Whisper):
   * "State the brand's meaning in a single, emotionally resonant sentence.
   *  Not a tagline. Not a value proposition. A thesis."
   *
   * This answers the question the hero image raised:
   * "What IS this place?"
   */
  readonly tagline: string;

  /**
   * Optional eyebrow — a brief contextual label above the headline.
   *
   * Used to ground the brand in place or category.
   * If undefined, no eyebrow renders.
   *
   * From DESIGN_LANGUAGE §Typographic Restraint:
   * "Use only what serves the moment."
   */
  readonly eyebrow: string | undefined;
}

// ── Calls to Action ───────────────────────────────────────

/**
 * CTA configuration — the hero's interactive elements.
 *
 * From VISUAL_RULES B2:
 * "CTA labels are sentence case. Never title case, never ALL CAPS."
 *
 * From VISUAL_RULES B10:
 * "No exclamation marks on buttons. Ever."
 *
 * From SIGNATURE_MOMENTS Moment 9:
 * "The CTA communicates 'I am here when you are ready.'
 *  Not 'Click me! Click me!'"
 */
export interface HeroCtaCopy {
  /** Label text — sentence case, no punctuation */
  readonly label: string;
  /** Target anchor or route */
  readonly href: string;
}

// ── Loading & Error States ────────────────────────────────

/**
 * Copy for the hero's non-content states.
 *
 * From EXPERIENCE_STORYBOARD SCENE 0:
 * "The loading moment is the journey from their world to ours."
 *
 * From VISUAL_RULES N23:
 * "Never use skeleton loading screens with shimmer effects.
 *  Our loading states are either instant or branded."
 *
 * Error messages must be warm, non-technical, and brand-consistent.
 * Never show stack traces, error codes, or technical jargon.
 */
export interface HeroStateCopy {
  /** Screen reader label for the loading state */
  readonly loadingAriaLabel: string;
  /** Screen reader status text during loading */
  readonly loadingMessage: string;
  /** Error fallback heading — brand name, repeated for safety */
  readonly errorBrandName: string;
  /** Error fallback message — warm, non-technical */
  readonly errorMessage: string;
  /** Error retry button label */
  readonly errorRetryLabel: string;
  /** ARIA label for the error state container */
  readonly errorAriaLabel: string;
}

// ── Accessibility ─────────────────────────────────────────

/**
 * ARIA and accessibility copy for the hero.
 *
 * From VISUAL_RULES AC9:
 * "Page content is accessible via screen reader landmarks."
 *
 * From DESIGN_SYSTEM §15:
 * "Accessibility is not an add-on. It is the foundation."
 *
 * Alt text is written in the brand voice — specific, considered, warm.
 * Not "Image of a woman" but a descriptive, evocative sentence.
 */
export interface HeroA11yCopy {
  /** Section landmark aria-label */
  readonly sectionAriaLabel: string;
  /** Hero image alt text — descriptive, specific, warm (AC11) */
  readonly imageAlt: string;
  /** aria-live region politeness level */
  readonly ariaLive: 'polite' | 'assertive';
  /** Scroll indicator aria-hidden label (visual only) */
  readonly scrollIndicatorLabel: string;
}

// ── SEO ───────────────────────────────────────────────────

/**
 * SEO metadata for the hero section.
 *
 * From TECHNICAL_ARCHITECTURE §14.3:
 * "Each route sets title, meta description, OG tags, and canonical URL."
 *
 * The hero's SEO text must be:
 * - Specific (not generic luxury language)
 * - Under 160 characters for description
 * - Written for humans, not search engines
 * - Free of keyword stuffing (VISUAL_RULES L8)
 */
export interface HeroSeoCopy {
  /** Page title — includes brand name */
  readonly title: string;
  /** Meta description — specific, under 160 chars */
  readonly description: string;
  /** Open Graph image path */
  readonly ogImage: string;
  /** Canonical URL */
  readonly canonicalUrl: string;
}

// ── Structured Data ───────────────────────────────────────

/**
 * Schema.org structured data for the hero.
 *
 * From TECHNICAL_ARCHITECTURE §14.5:
 * "Structured data (JSON-LD) for LocalBusiness and Service schemas."
 *
 * The hero's structured data establishes the business identity
 * for search engines. Must be accurate and complete.
 */
export interface HeroStructuredData {
  /** Schema.org type */
  readonly type: string;
  /** Business name */
  readonly name: string;
  /** Business description */
  readonly description: string;
  /** Service category */
  readonly category: string;
  /** Address locality */
  readonly locality: string;
  /** Address country */
  readonly country: string;
}

// ── Complete Hero Copy ────────────────────────────────────

/**
 * The complete copy contract for the hero section.
 *
 * This is the single source of truth for ALL text that appears
 * in, around, or about the hero. Every string is here. Nothing
 * is hardcoded in components.
 *
 * From CREATIVE_DIRECTION:
 * "The impression of consideration is what converts browsing into
 *  booking. When a visitor feels that the website has been made with
 *  care, they extrapolate: 'If they care this much about their
 *  website, imagine how they care about my hair.'"
 *
 * Localization strategy:
 * - The type shape is locale-agnostic
 * - A future i18n layer can provide locale-specific copies
 * - Components import from the copy module, never from locale files
 * - The copy module can be swapped per-locale without touching components
 */
export interface HeroCopy {
  readonly core: HeroCoreCopy;
  readonly primaryCta: HeroCtaCopy;
  readonly secondaryCta: HeroCtaCopy;
  readonly state: HeroStateCopy;
  readonly a11y: HeroA11yCopy;
  readonly seo: HeroSeoCopy;
  readonly structuredData: HeroStructuredData;
}

// ── Localization Types ────────────────────────────────────

/**
 * Locale identifier for the hero copy.
 *
 * From DESIGN_LANGUAGE §Content Philosophy:
 * "Content should evoke the senses, not describe specifications."
 *
 * The locale type is intentionally narrow — we support the markets
 * we serve. Adding a locale means adding a complete, reviewed copy
 * set, not just translating strings.
 */
export type HeroLocale = 'en' | 'fr' | 'ar';

/**
 * A function that returns hero copy for a given locale.
 *
 * This enables lazy copy loading — only the active locale's copy
 * is loaded. Future integration with a CMS or translation service
 * is straightforward: replace the static copies with async fetches.
 *
 * Architecture:
 * - Static copies for SSR-safe, zero-latency access
 * - Function interface for dynamic locale switching
 * - Default export is always 'en' (fallback)
 */
export type HeroCopyProvider = (locale?: HeroLocale) => HeroCopy;

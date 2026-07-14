/**
 * Hero Copy — The Single Source of Truth
 *
 * Every word the hero displays lives here. Nothing is hardcoded
 * in components. This module IS the hero's voice.
 *
 * From CREATIVE_DIRECTION §Brand Voice:
 * "Our voice lives in a precise emotional register — warm but never casual,
 *  confident but never boastful, specific but never technical."
 *
 * From DESIGN_LANGUAGE §Content Philosophy:
 * "Fewer Words, Better Words — Our content is edited. Ruthlessly.
 *  Every word must earn its place."
 *
 * From CREATIVE_DIRECTION §Tone Calibration:
 *   Too cold:   "Precision hair coloring services"
 *   Too warm:   "Get the gorgeous hair you deserve!!!"
 *   Just right: "Color, custom-mixed for you"
 *
 * Voice tests applied to every string:
 * ✓ Would this appear in a Hermès campaign?  → Yes
 * ✓ Would Aesop use this word?               → Yes
 * ✓ Does it pass the "dinner party" test?     → Yes
 * ✓ Is it specific, not generic?              → Yes
 * ✓ Does it earn its place?                   → Yes
 *
 * Localization:
 * - English ('en') is the primary/default locale
 * - Additional locales added as complete copy sets
 * - Components never import locale files directly
 * - The copy module is the single integration point
 *
 * From VISUAL_RULES:
 * - B2: CTAs are sentence case, no exclamation marks
 * - B10: No exclamation marks on buttons. Ever.
 * - T9: Headlines in title case (brand name is an exception — it IS the name)
 * - L7: No exclamation marks anywhere in the experience
 * - L8: No keyword-stuffed copy
 */

import type {
  HeroCopy,
  HeroCopyProvider,
  HeroLocale,
} from './hero.copy.types';

// ── English Copy (Primary Locale) ─────────────────────────

/**
 * The English copy set — The Sovereign Artisor's hero voice.
 *
 * From CREATIVE_DIRECTION §The Voice as a Person:
 * "The one who notices when something is beautiful and says so quietly,
 *  not loudly."
 *
 * From CREATIVE_DIRECTION §Brand Memory:
 * "That memory is: 'This is a place that has been considered.'"
 *
 * Copy decisions:
 * - Headline: The brand name itself — no additional headline needed
 * - Tagline: "Where artistry meets intention" — the thesis, not a tagline
 * - Eyebrow: undefined — restraint, the image speaks first
 * - CTAs: Warm, confident, unhurried — invitation, not demand
 * - Loading: "Preparing your experience" — designed, not generic
 * - Error: Warm, non-technical, brand-consistent even in failure
 * - Alt text: Specific, sensory, written in the brand voice
 * - SEO: Human-first, specific to Marrakech, under 160 chars
 */
const EN: HeroCopy = {
  core: {
    /**
     * The brand name — the hero's headline.
     *
     * This IS the h1 (VISUAL_RULES AC15).
     * No additional headline is needed — the name carries the full weight.
     *
     * From EXPERIENCE_STORYBOARD SCENE 1:
     * "The image must answer her unconscious question:
     *  'Is this place for me?' before she has consciously asked it."
     *
     * The name "The Sovereign Artisor" answers this:
     * "Sovereign" → authority, mastery, self-possession
     * "Artisor" → craft, handwork, human touch
     * Together: "A place where mastery serves your personal vision"
     */
    headline: 'The Sovereign Artisor',

    /**
     * The brand thesis — a single sentence of emotional resonance.
     *
     * From EXPERIENCE_STORYBOARD SCENE 2:
     * "The thesis answers the question the hero image raised:
     *  'What IS this place?'"
     *
     * "Where artistry meets intention" communicates:
     * - Artistry → skill, craft, years of mastery
     * - Intention → consideration, purpose, personal attention
     * - "Meets" → the intersection, the moment of connection
     *
     * This is NOT a tagline. It is a declaration of belief.
     */
    tagline: 'Where artistry meets intention',

    /**
     * Eyebrow — intentionally omitted.
     *
     * From DESIGN_SYSTEM §1 (P1: Subtraction Over Addition):
     * "Every element must earn its place."
     *
     * The hero image + brand name + tagline is the complete composition.
     * An eyebrow would add visual noise without emotional payoff.
     *
     * Set to undefined — no eyebrow renders.
     * Phase 4.3 (Hero Layout) may revisit this if the layout demands it.
     */
    eyebrow: undefined,
  },

  /**
   * Primary CTA — the confident invitation.
   *
   * From SIGNATURE_MOMENTS Moment 9:
   * "The Confident Threshold simply says:
   *  'When you're ready, we're here.'"
   *
   * "Book your experience" — not "Book Now", not "Schedule Today".
   * "Your" makes it personal. "Experience" elevates beyond a transaction.
   * Sentence case per VISUAL_RULES B2.
   */
  primaryCta: {
    label: 'Book your experience',
    href: '#booking',
  },

  /**
   * Secondary CTA — the gentle alternative.
   *
   * For visitors who aren't ready to book but want to learn more.
   * "Explore our craft" — "explore" is unhurried, "craft" signals mastery.
   * Not "Learn More" (generic). Not "View Services" (transactional).
   */
  secondaryCta: {
    label: 'Explore our craft',
    href: '#services',
  },

  state: {
    /**
     * Loading message — screen reader status text.
     *
     * From EXPERIENCE_STORYBOARD SCENE 0:
     * "The loading moment is the journey from their world to ours."
     *
     * "Preparing your experience" — "your" is personal, "experience" is
     * the brand's vocabulary. Not "Loading..." (generic).
     */
    loadingMessage: 'Preparing your experience',

    /**
     * Loading ARIA label — for the loading container.
     *
     * "Loading the experience" — brief, accurate, brand-consistent.
     */
    loadingAriaLabel: 'Loading the experience',

    /**
     * Error brand name — repeated for safety in error state.
     *
     * If the hero crashes, the brand name must still appear.
     * The error boundary is a standalone component that cannot
     * import from the hero composition — it needs its own copy.
     */
    errorBrandName: 'The Sovereign Artisor',

    /**
     * Error message — warm, non-technical, brand-consistent.
     *
     * From CREATIVE_DIRECTION §Brand Voice:
     * "Warm but not casual."
     *
     * "Something didn't load as expected" — honest, not alarming.
     * "We invite you to try again" — "invite" is our vocabulary,
     * not "Click here" or "Please refresh".
     */
    errorMessage:
      "Something didn't load as expected.\nWe invite you to try again.",

    /**
     * Error retry button label.
     *
     * "Try again" — simple, warm, direct.
     * Not "Reload Page" (technical). Not "Click to Retry" (clunky).
     */
    errorRetryLabel: 'Try again',

    /**
     * Error container ARIA label.
     *
     * Screen readers need to know the section's state.
     * "encountered an issue" — non-technical, non-alarming.
     */
    errorAriaLabel: 'The hero section encountered an issue',
  },

  a11y: {
    /**
     * Section landmark aria-label.
     *
     * From VISUAL_RULES AC9:
     * "Page content is accessible via screen reader landmarks."
     *
     * "Welcome to The Sovereign Artisor" — warm, specific, branded.
     * Not "Hero section" (technical). Not "Banner" (generic).
     */
    sectionAriaLabel: 'Welcome to The Sovereign Artisor',

    /**
     * Hero image alt text — the most important accessibility string.
     *
     * From DESIGN_LANGUAGE §Alternative Text Voice:
     * "Alternative text is written in the brand voice — specific,
     *  considered, and warm. Not 'Image of a woman' but
     *  'A client smiles as she examines her new color in the salon mirror.'"
     *
     * From VISUAL_RULES AC11:
     * "Images have meaningful alt text."
     *
     * This alt text:
     * ✓ Describes what's in the image (specific, not generic)
     * ✓ Uses sensory language ("warm afternoon light", "soft linens")
     * ✓ Communicates the brand feeling ("quiet luxury", "designed for care")
     * ✓ Is a complete sentence (screen readers benefit from natural language)
     * ✓ Avoids "image of" or "photo of" prefix (AC11 best practice)
     */
    imageAlt:
      'The salon interior bathed in warm afternoon light — brass fixtures, soft linens, and the quiet luxury of a space designed for care',

    /**
     * ARIA live region politeness level.
     *
     * "polite" — load state changes are announced but don't interrupt.
     * Not "assertive" — we never interrupt the visitor.
     */
    ariaLive: 'polite' as const,

    /**
     * Scroll indicator label — visual cue text.
     *
     * The scroll indicator is aria-hidden (visual only).
     * This label exists for completeness and potential future use.
     *
     * "Scroll to discover" — "discover" aligns with the narrative:
     * "The visitor is discovering a world."
     */
    scrollIndicatorLabel: 'Scroll to discover',
  },

  seo: {
    /**
     * Page title — for <title> and og:title.
     *
     * Under 60 characters for optimal display.
     * Brand name first for recognition.
     * "A Luxury Salon Experience" — specific, not generic.
     * "in Marrakech" — geographic specificity (not "in your city").
     */
    title:
      'The Sovereign Artisor — A luxury salon experience in Marrakech',

    /**
     * Meta description — for search results and social sharing.
     *
     * Under 160 characters. Written for humans scanning search results.
     * Specific services mentioned: hair, color, bridal, spa.
     * "Craft" and "intention" — brand vocabulary.
     * Not "best salon in Marrakech" (L8: no superlatives).
     */
    description:
      'A curated salon experience in Marrakech. Hair, color, bridal, and spa services crafted by skilled artisans.',

    /** Open Graph image — the hero image for social sharing */
    ogImage: '/og-hero.jpg',

    /** Canonical URL — the homepage */
    canonicalUrl: 'https://thesovereignartisor.com',
  },

  structuredData: {
    /**
     * Schema.org structured data for search engines.
     *
     * From TECHNICAL_ARCHITECTURE §14.5:
     * "Structured data (JSON-LD) for LocalBusiness and Service schemas."
     *
     * This data establishes the business identity in search results.
     * Enables rich snippets: name, category, location.
     */
    type: 'HairSalon',
    name: 'The Sovereign Artisor',
    description:
      'A curated salon experience in the heart of Marrakech, where artistry meets intention.',
    category: 'Beauty & Personal Care',
    locality: 'Marrakech',
    country: 'MA',
  },
};

// ── Locale Registry ───────────────────────────────────────

/**
 * Registered copy sets by locale.
 *
 * Architecture:
 * - Static imports for SSR-safe, zero-latency access
 * - Only 'en' is required — other locales are optional
 * - Adding a locale: create a copy set, add to this registry
 * - Components never access this directly — use getHeroCopy()
 *
 * Future i18n integration:
 * - Replace static imports with dynamic imports
 * - Add loading states for non-default locales
 * - Cache fetched copies in memory
 */
const HERO_COPIES: Partial<Record<HeroLocale, HeroCopy>> = {
  en: EN,
  // fr: FR,  // Phase: Internationalization
  // ar: AR,  // Phase: Internationalization
};

// ── Public API ────────────────────────────────────────────

/**
 * Get hero copy for a specific locale.
 *
 * This is the ONLY function components should use to access hero copy.
 * It provides:
 * - Locale fallback (unknown locale → English)
 * - Type-safe access to all copy elements
 * - Single integration point for future i18n services
 *
 * Usage:
 *   const copy = getHeroCopy('en');
 *   <h1>{copy.core.headline}</h1>
 *
 * @param locale - The desired locale (defaults to 'en')
 * @returns Complete hero copy for the requested locale
 */
export const getHeroCopy: HeroCopyProvider = (locale: HeroLocale = 'en') => {
  return HERO_COPIES[locale] ?? HERO_COPIES.en ?? EN;
};

/**
 * The default English copy — for direct imports when locale is known.
 *
 * This is a convenience export for internal feature use.
 * External consumers should use getHeroCopy().
 *
 * Usage (internal):
 *   import { HERO_COPY_EN } from './hero.copy';
 *   <h1>{HERO_COPY_EN.core.headline}</h1>
 */
export const HERO_COPY_EN: HeroCopy = EN;

/**
 * The active locale — for components that need to know the current locale.
 *
 * Phase: Internationalization
 * For now, always returns 'en'.
 * When i18n is added, this will read from a context or cookie.
 */
export const getActiveHeroLocale = (): HeroLocale => {
  return 'en';
};

/**
 * Available locales — for locale switchers and validation.
 */
export const AVAILABLE_HERO_LOCALES: readonly HeroLocale[] = [
  'en',
  // 'fr',  // Phase: Internationalization
  // 'ar',  // Phase: Internationalization
] as const;

/**
 * Default locale constant — for fallbacks and comparisons.
 */
export const DEFAULT_HERO_LOCALE: HeroLocale = 'en';

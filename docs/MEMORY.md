# MEMORY.md — Immutable Project Knowledge

> This file is permanent project memory. It captures architectural truths, design laws, and technical patterns that must persist across every session. It does not track progress. It does not document history. It is the brain of the project.

---

## 1. Project Identity

**Name:** The Sovereign Artisor
**Type:** Single-page narrative website for a luxury salon in Marrakech
**Audience:** Women 25–40, urban, digitally fluent, seeking considered self-care
**Brand Archetype:** The Sovereign Artisan
**Narrative Spine:** "A woman discovers a place that was made for her, and realizes she never wants to leave."
**Five Words:** Warm · Restrained · Considered · Editorial · Enduring
**Voice:** Confident, warm, measured. Never loud. Never urgent. Never apologetic.
**Hermès Test:** "Could Hermès use this layout with their brand?" → If yes, the composition is correct.
**Aesop Test:** "Does this feel like an Aesop store — considered materials, warm restraint?" → If yes, the atmosphere is correct.
**Dinner Party Test:** "Would this feel right at a quiet dinner party?" → If yes, the motion and interaction are correct.

---

## 2. Golden Rules

These rules override everything else. When in doubt, return here.

1. **The experience IS the architecture.** Every folder, every component, every animation serves the narrative — not the other way around.
2. **Restraint is the primary luxury signal.** Fewer elements, each considered. More space, each purposeful. The most expensive thing in design is the space you leave empty.
3. **Three colors only.** Surface (warm off-white), Text (warm charcoal), Accent (muted gold). Nothing else. Accent is used with extreme scarcity.
4. **Two typeface families only.** Serif (Cormorant Garamond) for voice. Sans (DM Sans) for function. No script, no decorative, no handwritten.
5. **Scroll-linked, not time-linked.** The visitor controls all pacing. The only exception: the hero Warm Unveiling on initial page load.
6. **Mobile-first is the default.** 80%+ of visitors encounter this brand on mobile first. Desktop is the enhancement.
7. **Never show raw errors.** Every error state matches the brand — warm tone, helpful message, clear recovery path.
8. **No loading spinners. No skeleton shimmer.** Either instant content or branded indicators.
9. **Accessibility is non-negotiable.** WCAG 2.1 AA minimum. Every interaction completable by keyboard. `prefers-reduced-motion` always respected.
10. **The codebase must survive human turnover.** A new developer must understand why every folder exists, why every state lives where it does, and why every animation works the way it does — without asking anyone.

---

## 3. Design Philosophy

**Core Principle:** The website should feel like the salon feels. Physical-digital coherence is the ultimate luxury signal.

**Composition Model:** Three-act dramatic structure across 16 scroll-driven homepage sections:
- **Prologue:** Loading → Threshold (first impression, branded loading)
- **Act I (Invitation):** Hero → Whisper → Immersion → Craft → Transformation → Intimacy
- **Act II (Experience):** Sanctuary → Artisans → Voices → Invitation
- **Act III (Commitment):** Gift → Closing

**Peak-End Rule:** The visitor's memory of the experience is shaped by the peak emotional moment (Transformation Dissolve) and the ending (Golden Return). These two moments receive the most generous design attention.

**Rhythm:** Dense sections alternate with breathing sections. No two sections of the same density appear consecutively. The sum of all animations should feel like one coherent breath.

**Photography IS the design.** Images carry more emotional weight than any headline. Every image is original — no stock, no AI-generated. Consistent warm color grading: amber midtones, warm shadows, golden highlights.

---

## 4. Technical Architecture

**Stack:** React 18 + TypeScript (strict) + Vite 6 + Tailwind CSS v4 + TanStack Router + TanStack Query + Redux Toolkit + GSAP + ScrollTrigger + Lenis + React Three Fiber + Drei + Express + Drizzle ORM + PostgreSQL + Redis + BullMQ

**Monorepo:** pnpm workspaces + Turborepo
```
apps/web/          → Frontend (React SPA)
packages/shared/   → Shared types and constants (leaf — depends on nothing)
packages/api/      → Express backend
packages/db/       → Drizzle ORM schema, migrations
docs/              → All planning and architecture documents
```

**Dependency flow is downward.** `apps/web` → `packages/shared` → nothing. No circular dependencies.

**Organization:** Hybrid — feature-first at top level, layer-first within features.
```
features/
  hero/                    → Scene 1: Threshold
  threshold/               → Prologue
  narrative-whisper/       → Brand story
  atmosphere/              → Environmental photography
  breathing-space/         → Act transitions (reusable)
  hair/                    → Craft: Hair
  transformation/          → Transformation: Color + Dissolve
  bridal/                  → Ceremony: Bridal
  spa/                     → Sanctuary: Spa
  artisans/                → Team profiles
  testimonials/            → Chorus of Proof
  booking/                 → Booking invitation + overlay
  gift/                    → Gift card
  closing/                 → Closing Image + Golden Return
  footer/                  → Footer
  navigation/              → Sticky nav, mobile menu
  shared/                  → Cross-feature narrative components
```

**Boundary Rules:**
- Features never import from other features directly — shared code goes in `shared/`
- Each feature has a single `index.ts` entry point
- Configuration is co-located with its feature
- No prop drilling beyond 2 levels — deeper state goes to Redux or context

**State Management:**
- **TanStack Query** owns ALL server state (services, artisans, testimonials, availability, gift cards)
- **Redux Toolkit** owns ALL client state (booking flow, UI toggles, feature flags)
- Never conflate server and client state. No exceptions.

**Routes:**
```
/                      → Homepage (16 sections, single page)
/services/hair         → Hair detail
/services/color        → Color detail
/services/bridal       → Bridal detail
/services/spa          → Spa detail
/booking/confirmation  → Post-booking (bookmarkable)
/404                   → Custom branded error
```

**Booking is an overlay, not a route.** It mounts as component state in Redux. Back button closes it; it does not navigate away.

---

## 5. Design System Memory

**Three-Role Color System:**
| Role | Name | Use |
|------|------|-----|
| Surface | Warm off-white | Backgrounds, cards, surfaces |
| Text | Warm charcoal (never pure black) | All text, headings, body copy |
| Accent | Muted gold | Interactive states, thin borders, micro-details — extreme scarcity |

**Accent Usage Map:** Hover states, focus rings, active navigation, primary CTA border/detail, section numbers, thin separators. Never: full backgrounds, massive headlines, decorative gradients.

**Two-Family, Six-Level Typography:**
- Serif (Cormorant Garamond): Display, Heading, Subheading — the voice
- Sans (DM Sans): Body, Caption, Micro — the function

**Type Scale Rules:** Weight decreases with size. Line-height increases as size decreases. Letter-spacing increases as size decreases. Body max 65–75 characters. Body min 16px. Headlines: title case. Body: sentence case. No ALL-CAPS for body. No letter-spacing wider than 0.15em. No underline for emphasis (italic only). Metadata/captions always sans-serif.

**Five-Tier Spacing:** Intimate → Personal → Social → Formal → Public. Section spacing uses Formal or Public. Internal component spacing uses Intimate or Personal. The gap between two elements is always proportionally larger than the internal spacing within those elements.

**Radius Scale:** None (0) → Subtle (2px) → Small (4px) → Medium (8px) → Large (16px). Cards: small or none. Buttons: small. Inputs: small. Modals: medium.

**Shadow Scale:** Warm-toned (brown-grey, never blue-grey). Low → Medium → High → Glow. Cards have no shadow. Shadows are used sparingly.

**Borders:** No decorative borders between sections. Separation via space. When borders exist: thin (1px), warm-toned, accent color only for interactive states.

**Icons:** Line-based, single-color, geometric, minimum 24×24px. Always have text labels when used for navigation. Not decorative.

**Photography Registers:** Hero 16:9 or wider. Service 4:3 or 3:2. Portrait 3:4 or 2:3. Detail 1:1. All images consistent warm grading. No over-retouching. Faces always shown. No hair-only photography without a person.

---

## 6. Coding Standards

**TypeScript:** Strict mode. No `any`. No exceptions. Explicit return types on exported functions. Interface over type for object shapes. `import type` for type-only imports. Type guards use `is` prefix.

**File Naming:** kebab-case for all files. Components: `service-card.tsx`. Hooks: `use-scroll-reveal.ts`. Types: `booking.types.ts`. Config: `hero.config.ts`. Test: `service-card.test.tsx`.

**Component Naming:** PascalCase. File name matches component name. One component per file. Named exports. Default exports only for page/route components. Singular names always.

**Variant Naming:** BEM-inspired. `Button--primary` (variant). `Button_disabled` (state modifier).

**Import Order:** External packages → Internal packages (@salon/*) → Feature imports → Shared imports → Local imports. Enforced by ESLint.

**CSS/Tailwind:** Utility-first. Mobile-first responsive prefix order: no prefix → `md:` → `lg:` → `xl:`. No inline styles except dynamic values from JavaScript (GSAP-injected transforms). Custom properties for animation timing values.

**Comments:** No comments for obvious code. "Why" comments mandatory for non-obvious decisions. No TODO without owner. No commented-out code.

**Git:** Branch naming: `type/description` (feature/, fix/, docs/, refactor/). Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`.

---

## 7. Motion Principles

**The Five Laws of Motion:**

1. **Scroll-linked, not time-linked.** The visitor controls the pace. Content does not auto-play its reveal based on a timer. The scroll is the conductor; the content is the orchestra.
2. **The only time-linked animation is the hero Warm Unveiling.** This is the sole exception — a designed threshold moment. All other animations require scroll input.
3. **Entry motions ease-out. Exit motions ease-in. State changes ease-in-out.** No elastic curves. No spring physics. No overshoot. Elements have the weight of well-made physical objects — they arrive precisely and stop precisely.
4. **Content is always visible without animation.** Scroll-triggered content exists in the DOM at full opacity. Animation is visual enhancement, not content gating.
5. **When the visitor scrolls backward, previously-revealed content remains revealed.** Animations do not reverse. The narrative is forward-moving.

**Motion Constraints:**
- Max reveal duration: 600ms (except hero 1200–1500ms and confirmation 800–1200ms)
- Max opacity translation: 30px vertical
- Max hover scale: 1.03
- Max parallax differential: 15–20%
- Elements materialize from 80% minimum opacity — never from nothing
- Maximum concurrent ScrollTrigger instances below fold: 5
- Animations consistent within component types — no per-instance variation
- If animation drops below 30fps on mobile, it is simplified or removed

**Reduced Motion:** When `prefers-reduced-motion: reduce` is active — all scroll animations instant, all hover transitions instant, all page transitions instant, Lenis disabled. The experience is complete and satisfying without any motion.

---

## 8. GSAP Principles

**Three Animation Systems, Three Domains:**
- **GSAP + ScrollTrigger:** ALL scroll-linked animations (section reveals, parallax, Transformation Dissolve, testimonial cascade)
- **Lenis:** Smooth scroll behavior (replaces native scroll, integrates with GSAP, respects reduced motion)
- **Framer Motion (limited):** Component-level micro-interactions ONLY (booking overlay slide, mobile menu, modal transitions)

**Rule:** GSAP owns scroll. Framer Motion owns mount/unmount. Never both on the same element.

**GSAP Lazy Loading:** GSAP is loaded via dynamic `import()` — code-split, not in initial bundle. Singleton pattern. Preloaded during browser idle via `requestIdleCallback`. ScrollTrigger loaded separately from GSAP core.

**Animation Hook Library:**
| Hook | Domain |
|------|--------|
| `useScrollReveal` | Fade-in on scroll entry |
| `useParallax` | Parallax depth effect |
| `useCrossDissolve` | Scroll-controlled before/after |
| `useSectionTracking` | Active section for navigation |
| `useWarmReveal` | Hero load animation |
| `useGoldenReturn` | Closing ambient animation |
| `useReducedMotion` | Motion preference detection |

**Performance Rules:**
- Only animate `transform` and `opacity` — never layout properties
- Use `will-change` sparingly — only during active animation
- Kill all GSAP animations on component unmount
- Lazy-init below-fold ScrollTrigger instances when approaching viewport
- Passive event listeners for scroll and touch
- `requestAnimationFrame` for all scroll-linked visual updates

---

## 9. 3D Principles

**Rule:** 3D is atmospheric, never the focus. The moment a visitor notices "oh, that's 3D," the 3D has failed. It should be felt, not seen.

**Priority:** P2 — the entire 3D layer is a V1 enhancement, not a V1 requirement.

**Usage:** Volumetric light rays, warm atmospheric haze, subtle particle movement. Never: interactive 3D objects, product configurators, rotatable models, CGI-rendered materials.

**Performance Gate:** Disabled when: `prefers-reduced-motion` active, viewport < 768px, device memory < 4GB, slow network connection detected.

**Integration:** React Three Fiber + Drei, loaded via `React.lazy()`. Canvas is `pointer-events: none`. Uses `frameloop="demand"`.

**Fallback:** When 3D is disabled, the experience must not feel incomplete. The photography itself provides atmosphere. The absence of volumetric light is not noticeable.

**Scenes:** `hero-atmosphere` (volumetric light through hero), `transformation-3d` (depth layers), `closing-ambient` (particle movement, glow).

---

## 10. Accessibility Principles

**Standard:** WCAG 2.1 Level AA minimum. AAA where achievable without compromising design.

**Color Contrast:** Normal text 4.5:1 minimum (we achieve 7:1+). Large text 3:1 minimum. Interactive elements 3:1 against all states.

**Focus Management:** Gold accent focus ring, 2px minimum, on `:focus-visible`. Never removed via `outline: none` without equivalent alternative. Every interactive element keyboard-accessible.

**Skip-to-Content:** First focusable element on every page. Bypasses all animated sections.

**Semantic HTML:** One `<h1>` per page. Heading levels never skip. `<main>`, `<nav>`, `<header>`, `<footer>` landmark elements. `<article>` for testimonials. `<section>` for narrative sections.

**Forms:** All fields have associated visible labels. Placeholder text is not a label. Error messages are specific and helpful — explain what went wrong and how to fix it.

**Touch Targets:** Minimum 44×44px with 8px spacing. Applies to all interactive elements at all viewport widths.

**Content Reflow:** Graceful adaptation at 200% text zoom. No horizontal scrolling. No content clipping.

**Screen Reader:** All meaningful images have descriptive alt text. Decorative images have `alt=""`. `aria-hidden="true"` on decorative elements. `aria-live` regions for dynamic content. `aria-expanded` on toggle buttons. `aria-current="page"` on active navigation.

**Motion Sensitivity:** Affects 30–40% of the population. Respecting `prefers-reduced-motion` is not optional — it is an ethical obligation.

---

## 11. Performance Principles

**Targets:**
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| Initial bundle | < 300KB gzipped |
| Total page weight | < 1MB |
| Mobile PageSpeed | 90+ |
| 3G usability | Above-fold content within 5s |

**Critical Path:**
1. HTML shell with inlined critical CSS
2. React bundle loads (code-split by route)
3. Root layout renders (providers, Lenis, analytics)
4. Homepage route mounts — above-the-fold content renders immediately
5. Hero Warm Unveiling begins (1200–1500ms)

**Image Strategy:** AVIF → WebP → JPEG via `<picture>`. Hero: `fetchpriority="high"`, `loading="eager"`, explicit `width`/`height`. Below-fold: `loading="lazy"`. Blur-up placeholders. Responsive srcset at breakpoints.

**Font Strategy:** `font-display: swap`. Self-hosted woff2. Preload critical files. Subset to Latin for V1. System font stack as fallback.

**Code Splitting:** GSAP loaded via dynamic import. 3D via React.lazy(). Below-fold sections deferred. Analytics deferred.

**CSS:** Tailwind v4 zero-runtime. Only used classes included. No layout thrashing in animations — GPU-composited properties only.

**Third-Party Scripts:** Plausible/Fathom/Umami analytics only in V1. No Google Analytics, no Facebook Pixel, no Hotjar.

---

## 12. Reusable Patterns

**React.memo:** Applied to sub-components with stable props. Prevents re-renders when parent state changes don't affect the component.

**useMemo:** Stabilizes computed objects — merged config objects, style objects, context values. Prevents consumer re-renders.

**useCallback:** Stabilizes function references — event handlers passed as props, context values.

**useDeferredLoad:** Defers non-critical component loading until browser idle via `requestIdleCallback` with `setTimeout` fallback. SSR-safe. AbortController cleanup.

**Singleton Lazy Loading:** Dynamic `import()` with module-level cached promise. Returns same instance on repeated calls. Reset on failure for retry.

**Error Boundaries:** Root (catches catastrophic React crashes) → Section (catches section-specific failures) → Feature (catches feature-specific failures). Each level has branded fallback.

**Context Value Memoization:** Always memoize context values with `useMemo` to prevent unnecessary consumer re-renders.

**AbortController Cleanup:** Cancel in-flight fetches on unmount. Prevents state updates on unmounted components.

**PerformanceObserver Cleanup:** Disconnect observers on unmount. Prevents memory leaks.

**Event Listener Cleanup:** All event listeners removed in `useEffect` cleanup functions. Passive listeners for scroll and touch.

---

## 13. Anti-Patterns

**Architecture:**
- Server data in Redux → TanStack Query owns all API data
- Feature-to-feature direct imports → Shared code in `shared/`
- Prop drilling beyond 2 levels → Use Redux or context
- Animation in UI components → GSAP/Framer Motion stay in their lanes
- Booking as a route → Booking is overlay state, not URL state
- `any` in TypeScript → Use `unknown` and type narrow

**Design:**
- Loading spinners → Branded indicators or instant content
- Skeleton shimmer → Absolute prohibition
- Text over busy photographic backgrounds
- Decorative borders between sections
- Gradients as primary design elements
- Bouncing, spring-physics, or overshooting animations
- Countdown timers or urgency tactics
- Pop-up overlays that interrupt browsing
- Auto-playing video with sound
- Scroll-jacking
- Parallax exceeding 15–20% differential
- Chatbots that auto-greet visitors
- Social media feeds embedded on the website
- Hero carousels with more than one slide
- Pricing hidden behind "contact us"
- Onboarding tutorials or walkthrough overlays
- Confetti or celebration animations on booking confirmation
- Faux materials (faux marble, faux wood grain)

**Motion:**
- Time-linked scroll animations
- Animations that reverse on scroll-back
- Animations exceeding 600ms (except hero and confirmation)
- Translation exceeding 30px
- Hover scale exceeding 1.03
- Animations without `prefers-reduced-motion` support
- Animations that block content interaction
- Animations that drop below 30fps on mobile

**Content:**
- Exclamation marks in brand copy
- Superlatives without evidence ("best," "top-rated," "world-class")
- Discount language ("affordable," "budget," "deal," "save")
- Generic or vague testimonials
- Non-original photography

---

## 14. Future Implementation Rules

**V2 Additions:** TipTap CMS integration, admin dashboard (`/admin` route), email/SMS confirmations via BullMQ, authentication middleware, French/Arabic i18n.

**V3 Additions:** AI style recommendations, virtual try-on (WebRTC), chat-based booking, multi-location support.

**Preparation in V1:** Content typed with interfaces that accept CMS-sourced data. API endpoints designed for CRUD, not just Read. BullMQ installed for future jobs. TipTap installed for future admin editing.

**API Versioning:** `/api/v1/` prefix. New versions for breaking changes. V1 remains operational during V2 migration.

**Database Migrations:** Drizzle-generated, version-controlled, forward and rollback capable. No schema-breaking changes without migration scripts.

**Component Versioning:** New version created alongside old (e.g., `ServiceCardV2.tsx`). Consumers migrate incrementally. Old version removed when no consumers remain.

**Image Optimization Pipeline:** Originals in `assets/images/`. Build process generates AVIF (80% quality), WebP (85%), JPEG (80% fallback) at 640px, 1024px, 1920px, 2560px widths. Responsive srcset served to browser.

**Font Metric Adjustment:** Phase 11.7 applies `size-adjust` for metric alignment between custom fonts and system fallbacks — reduces CLS from `font-display: swap`.

---

## 15. Session Checklist

Before writing any code in this project, verify:

- [ ] TypeScript strict mode compliance — no `any`, no type assertions without justification
- [ ] Design system tokens used — no magic numbers, no unapproved colors
- [ ] Mobile-first responsive — base styles are mobile, `md:`, `lg:`, `xl:` add enhancements
- [ ] Accessibility — keyboard navigable, screen reader friendly, focus visible, touch targets 44×44px
- [ ] `prefers-reduced-motion` respected — all animation hooks check this
- [ ] GSAP animations killed on unmount — no memory leaks
- [ ] Only `transform` and `opacity` animated — no layout thrashing
- [ ] Error states implemented — warm, helpful, with recovery paths
- [ ] No loading spinners, no skeleton shimmer
- [ ] Server state in TanStack Query, client state in Redux — never conflated
- [ ] Features don't import from other features — shared code in `shared/`
- [ ] Context values memoized with `useMemo`
- [ ] Event listeners cleaned up in `useEffect` return
- [ ] Comment explains non-obvious "why" — no comments for obvious "what"
- [ ] File naming: kebab-case. Component naming: PascalCase. Singular names always.

---

*This document is immutable project memory. It is updated only when permanent architectural or design decisions change. It does not track progress, implementation history, or temporary state.*

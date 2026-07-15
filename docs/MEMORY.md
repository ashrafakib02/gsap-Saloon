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

## 16. Narrative Architecture (Phase 5.1)

**System:** Scroll-linked narrative registry with 16 homepage sections, following a three-act dramatic structure.

**Sections (scroll order):** threshold(0) → hero(1) → whisper(2) → atmosphere(3) → breathing-space-arrival(4) → hair(5) → transformation(6) → bridal(7) → spa(8) → artisans(9) → testimonials(10) → breathing-space-commitment(11) → booking(12) → gift(13) → closing(14) → footer(15)

**Architecture Pattern:** `narrative.types.ts` (12 unions, 6 interfaces) → `narrative.constants.ts` (centralized IDs, groups, orders) → `narrative.config.ts` (immutable singleton registry via `createNarrativeRegistry()` factory) → `narrative-context-internal.ts` + `narrative-context.tsx` (React context + provider) → 3 hooks (useNarrative, useNarrativeRegistry, useNarrativeOrder)

**Key Types:** SectionId, SectionCategory (act-one/two/three/structural/transitional), NarrativeStage (prologue/act-one/two/three/epilogue), SectionImportance (peak/signature/standard/structural), ThemeVariant (warm/deep/light/rich), AnimationKey (8 presets for Phase 9), PreloadKey (7 bundles for Phase 11), ScrollParticipation (scroll-linked/trigger-only/fixed/none)

**Registry API:** get(id), getAll(), getByCategory(), getByStage(), getEnabled(), getNarrativeParticipants(), count(), has(id), getPreloadOrder() — all O(1) via Map indices

**Hooks:** Pure data access only — zero effects, zero listeners, zero side effects. useNarrativeOrder uses useCallback for stable function references.

**Import Pattern:** `import { NARRATIVE_REGISTRY, useNarrative, SECTION_IDS, type SectionId } from '@/features/narrative'`

**Future Phase Hooks (populated, not implemented):** animationKey (Phase 9), preloadKey (Phase 11), AnimationRegistration, PreloadRegistration

**Files Created:** narrative.types.ts, narrative.constants.ts, narrative.config.ts, narrative-context-internal.ts, narrative-context.tsx, hooks/use-narrative.ts, hooks/use-narrative-registry.ts, hooks/use-narrative-order.ts, hooks/index.ts, index.ts

### 17. Phase 5.2 — Section Transitions

**System:** Transition architecture modeling section-to-section relationships with emotional moods, pacing, boundaries, and future phase hooks.

**Transition Model:** 15 section-to-section transitions (one for each consecutive pair in the 16-section scroll order). Each transition has: id (from→to), type (10 types), direction, speed, mood (7 moods), priority, trigger, enabled flag, entry/exit boundaries, act/chapter/breathing flags, and future phase keys (animationKey, cameraKey, preloadKey, soundKey, analyticsKey).

**Transition Types:** fade, dissolve, reveal, parallax-reveal, word-reveal, portrait-stagger, text-cascade, warm-reveal, instant, none

**Breathing Spaces:** 2 first-class breathing space configurations (breathing-space-arrival, breathing-space-commitment) with purpose, entry/exit strategies, mood, and reduced motion behavior. Breathing spaces are architectural pauses between acts.

**Architecture Pattern:** `narrative-transitions.types.ts` (10 union types, 6 interfaces) → `narrative-transitions.constants.ts` (re-exports + 7 description records) → `narrative-transitions.config.ts` (immutable singleton `TRANSITION_REGISTRY` via `createTransitionRegistry()` factory) → 4 hooks

**Registry API:** get(id), getBetween(from, to), getEntry(sectionId), getExit(sectionId), getAll(), getByType(), getByMood(), getByPriority(), getEnabled(), getActTransitions(), getSequence(), getDefinition(from, to), getBreathingSpaces(), getBreathingSpace(sectionId), count(), has(id) — O(1) lookups via Map indices

**Hooks (all pure data, zero side effects):**
- `useSectionTransition(from, to)` — transition data between two sections
- `useEntryTransition(sectionId)` / `useExitTransition(sectionId)` — transition entering/exiting a section
- `useTransitionRegistry()` — global registry access
- `useTransitionsByType/mood/priority()` — filtered queries
- `useEnabledTransitions()` / `useActTransitions()` — pre-filtered collections
- `useTransitionSequence()` — full ordered sequence with count/isEmpty
- `useTransitionDefinition(from, to)` — metadata + boundary config

**Import Pattern:** `import { TRANSITION_REGISTRY, useSectionTransition, TRANSITION_TYPES, type TransitionMetadata } from '@/features/narrative'`

**Reduced Motion Strategies:** none (complete removal), simplified (reduced duration), instant (content appears immediately)

**Future Phase Hooks (populated, not implemented):** animationKey (Phase 9), cameraKey (Phase 6), preloadKey (Phase 11), soundKey (future audio), analyticsKey (analytics)

**Files Created:** narrative-transitions.types.ts, narrative-transitions.constants.ts, narrative-transitions.config.ts, hooks/use-section-transition.ts, hooks/use-transition-registry.ts, hooks/use-transition-metadata.ts, hooks/use-transition-sequence.ts

**Files Modified:** hooks/index.ts (added 7 transition hook exports), index.ts (added transition hooks, registry, constants, and types exports)

**Key Pattern:** React context split — narrative-context-internal.ts (context + hook, no JSX) + narrative-context.tsx (provider only, has JSX) for react-refresh compliance. This same split pattern should be used for the transition provider in Phase 9.

---

### 18. Phase 5.3 — Scroll Timeline

**System:** Cinematic editing timeline model mapping the narrative structure into parallel tracks with scroll-linked segments, keyframes, cues, and markers. Pure data architecture — no animation code.

**Timeline Model:** 11 parallel tracks (narrative, UI, camera, lighting, environment, 3D, particle, audio, analytics, accessibility, preload). Each track contains segments mapping scroll ranges (normalized 0–1) to sections. Segments contain keyframes (property values at positions with interpolation) and cues (discrete events). Markers are semantic reference points scattered across the scroll range (60+ markers: section-start/center/end, act-start/end, breathing-point, preload-point, camera-cue, analytics-cue).

**Tracks:** Narrative (auto-generated 16 segments), UI (content entrance animations), camera (parallax/focus), lighting (ambient shifts), environment (background atmosphere), 3D (Three.js scene changes), particle (ambient particles), audio (sound transitions), analytics (view tracking), accessibility (landmark announcements), preload (asset loading triggers).

**Synchronization Modes:** global-progress, narrative-locked, marker-locked, independent, threshold-triggered.

**Progress Model:** Static `INITIAL_PROGRESS` (overall:0, direction:'forward', isScrolling:false). Phase 9 (Scroll Engine) will provide live updates. Hooks like useActiveSegments and useSectionProgress work against any progress value.

**Architecture Pattern:** `narrative-timeline.types.ts` (10 unions, 13+ interfaces) → `narrative-timeline.constants.ts` (re-exports + 12 description records + default IDs) → `narrative-timeline.config.ts` (factory `createTimelineRegistry()`, singleton `TIMELINE_REGISTRY`) → 5 hook files (15 hooks total)

**Registry API:** getTrack(type), getTracks(), getEnabledTracks(), getTracksByPriority(), getSegment(id), getSegmentsForTrack(type), getSegmentsForSection(sectionId), getSegmentsInRange(range), getMarker(id), getMarkers(), getMarkersByType(type), getMarkersForSection(sectionId), getGroup(id), getGroups(), getProgress(), getMetadata(), countSegments(), countMarkers(), hasTrack(type), hasMarker(id) — O(1) Map-indexed lookups

**Hooks (all pure data, zero side effects):**
- `useTimeline()` — full timeline definition, tracks, markers, groups, metadata, counts
- `useTimelineRegistry()` — raw registry access
- `useAllTimelineTracks()` / `useEnabledTimelineTracks()` / `useTimelineTrack(type)` / `useTimelineTracksByPriority()` — track queries
- `useTimelineSegments(trackType)` / `useTimelineSegmentsForSection(sectionId)` — segment queries
- `useAllTimelineMarkers()` / `useTimelineMarkersByType()` / `useTimelineMarkersForSection()` / `useTimelineMarker(id)` — marker queries
- `useTimelineProgress()` / `useActiveSegments(progress)` / `useSectionProgress(sectionId, overallProgress)` — progress queries

**Keyframe Pattern:** Per-section opacity (0→1 or 0.85→1 for hero) and translateY (30px→0) keyframes with linear interpolation, distributed into parent segments via `attachDataToSegments()`.

**Cue Pattern:** Analytics cues (`section-view`), preload cues (`preload-section-assets`), accessibility cues (`section-entered`) generated per section and distributed into segments.

**Import Pattern:** `import { TIMELINE_REGISTRY, useTimeline, useTimelineProgress, TIMELINE_TRACK_TYPES, type TimelineTrack, type TimelineProgress } from '@/features/narrative'`

**Future Phase Hooks (populated, not implemented):** Live scroll progress (Phase 9), camera animation (Phase 6), 3D scene changes (Phase 8), particle effects (Phase 8), audio transitions, analytics tracking.

**Files Created:** narrative-timeline.types.ts, narrative-timeline.constants.ts, narrative-timeline.config.ts, hooks/use-timeline.ts, hooks/use-timeline-registry.ts, hooks/use-timeline-tracks.ts, hooks/use-timeline-markers.ts, hooks/use-timeline-progress.ts

**Files Modified:** hooks/index.ts (added 15 timeline hook exports), index.ts (added timeline hooks, TIMELINE_REGISTRY, timeline constants, timeline types exports)

## 19. Phase 5.4 — ScrollTrigger Management Infrastructure

**Location:** `apps/web/src/features/narrative/scrolltrigger.*.ts` + `hooks/use-scroll-trigger*.ts`

**Architecture:** Singleton ScrollTrigger manager with module-level state (definitions Map, states Map, instances Map). Integrates with existing GSAP layer via `getScrollTrigger()` from `@/shared/animation/gsap-registration` — zero GSAP duplication, no direct gsap/ScrollTrigger imports in manager.

**Lifecycle:** `registered` → `active` → `disabled` → `destroyed`. All transitions tracked in states Map. killAll() destroys all instances and clears all maps.

**Breakpoint System:** 5 breakpoints (all/mobile/tablet/desktop/wide). Auto-detected from window.matchMedia on init. Per-breakpoint configs: enabled, markers, maxActiveTriggers, reducedMotionBehavior. updateBreakpoint() re-evaluates all registered triggers.

**Reduced Motion:** Three behaviors — `skip` (don't create), `instant` (create with no animation), `simplify` (create with reduced complexity). handleReducedMotionChange() bulk-disables/enables all triggers.

**Refresh Batching:** Debounced refresh (200ms default from timing.ts DEBOUNCE.resize). refreshBatched() queues refreshes and executes after debounce. refreshCount/lastRefreshAt tracked.

**Debug Mode:** Optional, off by default, auto-enabled in dev (import.meta.env.DEV). Exposes getDebugInfo() with full registry snapshot. logDebugInfo() throttled at 100ms to console.

**Registry:** getRegistry() returns 14 query methods — get, all, active, destroyed, byGroup, byPriority, byState, byBreakpoint, countByState, count, has, hasActive, getByGroup, getByPriority.

**Hooks (5):**
- `useScrollTriggers()` — full management API, 25+ stabilized properties (register, kill, killAll, disable, enable, pause, resume, refresh, registry, debug, state queries)
- `useScrollTriggerRegistry()` — read-only queries (get, all, active, byGroup, byPriority, count)
- `useScrollTriggerLifecycle(opts)` — component-level: registers on mount, kills on unmount, tracks state, accepts `skip` option
- `useScrollTriggerRefresh(opts)` — debounced/batched refresh with configurable debounceMs, cleanup on unmount
- `useReducedMotionTrigger()` — matchMedia listener, SSR-safe, notifies manager on change

**Default Trigger Definitions (8):** sectionReveal (top 80%), parallax (scrubbed, low priority), textReveal (top 80%), imageReveal (top 85%), heroSection (top top, critical), breathingSpace (top center, low), closingSection (top 70%, critical), analyticsEntry (top 75%, low). All have `reducedMotionBehavior: 'skip'` except hero/closing (`'instant'`).

**Import Pattern:** `import { registerScrollTrigger, useScrollTriggerLifecycle, useScrollTriggers, TRIGGER_GROUPS, type TriggerDefinition } from '@/features/narrative'`

**Files Created:** scrolltrigger.types.ts, scrolltrigger.constants.ts, scrolltrigger-manager.ts, hooks/use-scroll-triggers.ts, hooks/use-scroll-trigger-registry.ts, hooks/use-scroll-trigger-lifecycle.ts, hooks/use-scroll-trigger-refresh.ts, hooks/use-reduced-motion-trigger.ts

**Files Modified:** hooks/index.ts (added 5 hook exports + 5 type exports), index.ts (added ScrollTrigger hooks, manager functions, constants, types sections)

## 20. Phase 5.5 — Centralized Scroll State

**Location:** `apps/web/src/features/narrative/scroll-state.*.ts` + `hooks/use-scroll-*.ts`

**Architecture:** Singleton scroll state manager (`scrollStateManager`) owns all runtime scroll state. Module-level mutable state with immutable snapshots. React hooks subscribe via selector-based pattern — components re-render only when their selected slice changes.

**State Model:** ScrollState interface with 30+ readonly fields covering position (scrollY, scrollX), progress (page, section, timeline), navigation (currentSectionId, previous, next), behavior (direction, isScrolling, isIdle), velocity (instantaneous, smoothed), narrative context (stage, phase, actProgress, narrativeProgress), viewport (width, height, breakpoint), input (isTouchDevice, pointerType), accessibility (isReducedMotion), transitions (isTransitioning), triggers (activeTriggerCount), debug (debugMode, timestamp, frameCount).

**Manager Pattern:**
- `requestAnimationFrame` batching — one update per frame, coalesces rapid events
- Selector-based subscriptions — `subscribeSelector<T>(selector, callback, equalityFn?)` notifies only when selected value changes
- Integrates with: NARRATIVE_REGISTRY (O(1) section lookup), TRANSITION_REGISTRY (transition state), ScrollTrigger Manager (active trigger count), prefersReducedMotion, BREAKPOINTS
- Event model: scroll (passive, capture), resize (debounced 150ms), orientationchange, visibilitychange, pointermove
- Idle detection (2s timeout from config.idleTimeout)
- Velocity smoothing (5-frame rolling average from config.velocitySampleCount)

**Event Flow:** User scroll → handleScroll() → compute velocity/direction → scheduleUpdate() → requestAnimationFrame → buildSnapshot() → notifySubscribers() → React re-renders

**Section Resolution:** `findCurrentSectionId(scrollY)` uses DOM element positions when available (`section-{id}` IDs), falls back to order-based estimation. O(1) lookup via `sectionById` Map.

**Hooks (7):**
- `useScrollState(selector?, equalityFn?)` — main hook, full state or selected slice, initializes manager on mount
- `useCurrentSection()` — enriched section navigation (current, previous, next, stage, phase, actProgress, isFirst, isLast, index)
- `useScrollProgress()` — page, section, timeline, normalized progress + scrollY
- `useScrollDirection()` — direction, isScrolling, isForward, isBackward
- `useScrollVelocity()` — velocity, smoothedVelocity, speed, isFastScrolling
- `useScrollBreakpoint()` — breakpoint, viewportWidth/Height, isDesktop/Tablet/Mobile/Wide, isTouchDevice, pointerType, isReducedMotion
- `useScrollPhase()` — section, sectionId, stage, phase, actProgress, narrativeProgress, timelineNormalizedProgress, isTransitioning, isFirst, isLast

**Selector Pattern (avoids unnecessary re-renders):**
```ts
// Custom selector — component only re-renders when pageProgress changes
const progress = useScrollState((s) => s.pageProgress);
// With equality function — fine-grained control
const dir = useScrollState(directionSelector, directionEquality);
```

**Derived Helpers (computed in snapshot):**
- `isEnteringSection` / `isLeavingSection` (from sectionProgress thresholds)
- `isFirstSection` / `isLastSection` (from section index)
- `isScrollingForward` / `isScrollingBackward` (from direction)
- `isDesktop` / `isTablet` / `isMobile` / `isWide` (from breakpoint)
- `currentActProgress` / `narrativeProgress` / `timelineNormalizedProgress`

**Import Pattern:** `import { scrollStateManager, useScrollState, useCurrentSection, useScrollProgress, SCROLL_PHASES, type ScrollState, type ScrollBreakpoint } from '@/features/narrative'`

**Name Collision Handling:** `DIRECTION_DESCRIPTIONS` and `STATE_DESCRIPTIONS` aliased as `SCROLL_DIRECTION_DESCRIPTIONS` and `SCROLL_STATE_DESCRIPTIONS` in barrel export to avoid collisions with timeline constant exports.

**Files Created:** scroll-state.types.ts, scroll-state.constants.ts, scroll-state-manager.ts, hooks/use-scroll-state.ts, hooks/use-current-section.ts, hooks/use-scroll-progress.ts, hooks/use-scroll-direction.ts, hooks/use-scroll-velocity.ts, hooks/use-scroll-breakpoint.ts, hooks/use-scroll-phase.ts

**Files Modified:** hooks/index.ts (added 7 hook exports + 7 type exports), index.ts (added ScrollState hooks, manager, constants, types sections with aliased names to avoid collisions)

---

## Progressive Reveal Architecture (Phase 5.6)

The **progressive reveal system** is the global infrastructure that determines **what should become visible and when**. It stores reveal metadata and orchestrates reveal *state* only — it runs **no animations, no GSAP timelines, no visual effects**. Future systems (GSAP, Framer Motion, React Three Fiber, Camera, Lighting, Audio, UI) subscribe to this reveal state to drive their own visual effects. It lives in `features/narrative/` and extends the existing narrative architecture rather than duplicating it.

**Reveal Model:**
- **Reveal Item** — the atomic unit; has strategy, trigger, priority, reset policy, order, delay, prerequisites, parentId, groupId, sectionId.
- **Reveal Group** — coordinates many items (cascade / stagger / synchronized group reveal). Completion is `requireAllChildren` (all) or any-child.
- **Reveal Sequence** — ordered steps, each gated on completion of the previous; supports `loop`.
- **Reveal Strategy** (metadata only, 10): `instant`, `fade`, `cascade`, `stagger`, `sequence`, `manual`, `viewport`, `timeline`, `dependency`, `group`.
- **Reveal State** (5): `pending` → `revealing` → `revealed`, plus `hidden` / `reset`.
- **Reveal Visibility** (4, viewport-relative, distinct from state): `hidden`, `entering`, `visible`, `leaving`.
- **Reveal Priority** (4): `critical` / `high` / `normal` / `low` — weight via `REVEAL_PRIORITY_ORDER` (lower reveals first), then item `order`.
- **Reveal Trigger** (6): `manual`, `viewport`, `scroll`, `timeline`, `dependency`, `immediate`.
- **Reveal Reset Policy** (5): `none` (default — Law 5, reveals are permanent), `on-exit`, `on-leave`, `always`, `manual`.
- **Reveal Dependencies** — `prerequisites` (must be revealed first) + `parentId`/`children` graph; `dependenciesMet` is derived per snapshot.

**State Model (`ProgressiveRevealSnapshot`, immutable + revision-counted):** `items`/`groups`/`sequences` (ReadonlyMaps of runtime state), `visibleItemIds`, `revealedItemIds`, `pendingItemIds`, `activeSequenceId`, `completedSequenceIds`, `overallProgress` (revealed / total), `isReducedMotion` (mirrored from scroll state), `revision`, `timestamp`.

**Manager (`progressive-reveal-manager.ts`, singleton, no React):**
- Module-level Maps: `itemDefinitions`, `groupDefinitions`, `sequenceDefinitions`, `itemStates`, `sequenceStepIndex`. Sets: `subscribers`, `selectorSubscribers`.
- Responsibilities: registration (idempotent by ID, preserves runtime state on re-register), visibility, dependency resolution, reveal ordering (priority + ordinal), rAF batching (one `rebuildSnapshot()` per frame), selector subscriptions, immutable `Object.freeze` snapshots, cleanup.
- API: `getSnapshot`, `subscribe`, `subscribeSelector`, `isInitialized`, `init`, `destroy`, `registerItem`/`Group`/`Sequence` + `unregister*`, `reveal`, `beginReveal`, `reset` (honours reset policy), `resetAll` (explicit teardown, bypasses policy), `setVisibility`, `setProgress`, `advanceSequence`, `getRegistry`, `getDependencyGraph`, `setDebugMode`. Plus `isRevealDebugMode` (barrel-aliased from `isDebugMode`).

**Lifecycle:** `init()` → ensures `scrollStateManager.init()` → seeds `reducedMotion` from `prefersReducedMotion()` → subscribes to the scroll state manager's `isReducedMotion` selector. Registration/mutation → `scheduleUpdate()` (rAF) → `rebuildSnapshot()` (recompute derived item/group/sequence aggregates + overall progress, bump `revision`, freeze) → `notifySubscribers()` (all-subscribers then selector-subscribers whose value changed). `destroy()` cancels rAF, runs cleanups, clears registries/subscribers, resets to `DEFAULT_REVEAL_SNAPSHOT`.

**Integration points (no duplicated runtime state, zero duplicate listeners):**
- **Scroll State Manager** — sole upstream for reduced-motion; reveal manager consumes its selector, never adds its own matchMedia listener. (Chain: ThemeProvider owns matchMedia → scrollStateManager mirrors it → reveal manager reads it.)
- **Narrative Registry** — `sectionId` on items/groups/sequences ties reveals to sections.
- **Reduced Motion utilities** — `prefersReducedMotion()` for the SSR-safe initial read.
- **Timeline / Transition / ScrollTrigger registries + future GSAP loader** — designed as downstream consumers of reveal state; strategies (`timeline`, `viewport`, `scroll`) are metadata those systems act on.

**Hooks (6, read-only, memoized selectors, stable refs):**
- `useProgressiveReveal(selector?, equalityFn?)` — base hook; full snapshot or selected slice; initializes manager on mount.
- `useRevealGroup(id)` — group runtime state (state, revealedCount, totalCount, progress).
- `useRevealItem(id)` — single item runtime state.
- `useRevealProgress()` — aggregates: overallProgress + revealed/pending/visible/total counts.
- `useRevealSequence(id)` — sequence runtime state (activeStepIndex, completedCount, isComplete).
- `useRevealVisibility(id)` — viewport-relative visibility (`'hidden'` fallback when unregistered).

**Accessibility:** respects `prefers-reduced-motion`; adds no hidden interactive elements; no focus traps; never alters focus order or keyboard navigation (state metadata only).

**Import Pattern:** `import { progressiveRevealManager, useProgressiveReveal, useRevealGroup, useRevealItem, useRevealProgress, useRevealSequence, useRevealVisibility, REVEAL_STRATEGIES, DEFAULT_REVEAL_CONFIG, type ProgressiveRevealSnapshot, type RevealItemOptions } from '@/features/narrative'`

**Name Collisions:** all reveal exports are `REVEAL_`-prefixed (e.g. `REVEAL_STATE_DESCRIPTIONS`), so no collision with scroll-state / timeline `STATE_DESCRIPTIONS`. Manager `isDebugMode` re-exported as `isRevealDebugMode`.

**Files Created:** progressive-reveal.types.ts, progressive-reveal.constants.ts, progressive-reveal-manager.ts, hooks/use-progressive-reveal.ts, hooks/use-reveal-group.ts, hooks/use-reveal-item.ts, hooks/use-reveal-progress.ts, hooks/use-reveal-sequence.ts, hooks/use-reveal-visibility.ts

**Files Modified:** hooks/index.ts (added 6 hook exports + 2 type exports), index.ts (added Progressive Reveal hooks, manager, constants, types sections)

---

## 21. Phase 6.1 — React Three Fiber Setup

**System:** Complete React Three Fiber infrastructure in `features/three/`. Infrastructure only — no scenes, cameras, lighting, materials, or animations.

**Provider Hierarchy:** `ReduxProvider → QueryProvider → ThemeProvider → ThreeProvider → AnimationProvider → PortalProvider → CursorContext.Provider`. ThreeProvider sits between ThemeProvider and AnimationProvider so that reduced motion state is available before GSAP/Lenis initialization.

**ThreeProvider (`three-provider.tsx`):** Subscribes to `threePerformanceManager` via `useSyncExternalStore`. Probes capabilities on mount, derives quality preset, builds renderer config. Re-probes on breakpoint crossing (mobile↔tablet, tablet↔desktop). Reads `isReducedMotion` from Redux (via `useReducedMotion`). Persists quality override to localStorage. Memoized context value prevents downstream re-renders.

**Renderer Architecture (`three-renderer.ts`):** Centralized WebGL config builder. `buildGlAttributes(config)` → typed GL attributes for R3F Canvas. `resolveCanvasSettings(renderer, quality, viewport)` → canvas settings (dpr, shadows, flat, onCreated). Adaptive DPR per quality preset: ultra(1–2), high(1–1.5), medium(1–1), low(0.75–1), minimal(0.5–0.75). `flat: true` prevents double tone-mapping. `resize: { scroll: false }` delegates scroll to Lenis.

**Quality System (`three.types.ts` + `three.constants.ts` + `three.config.ts`):** Five presets: ultra, high, medium, low, minimal. Each has frozen budgets (frame, texture, geometry, shadow, post-processing). Auto-derived from: viewport size, touch capability, reduced motion (hard floor → minimal), hardware tier, device memory, connection speed. User can override via `setQualityPreset()` which persists to localStorage.

**Performance Model (`three-performance.ts`):** Module-level singleton `threePerformanceManager`. Builds frozen `ThreePerformanceSnapshot` from capability probes: WebGL/WebGL2 support, GPU classification (discrete/integrated/mobile), device tier (high/medium/low/ultra-low), renderer name, max texture size. Subscriber pattern with `subscribe(callback)` and `getSnapshot()`.

**Event Architecture (`three-events.ts`):** Typed pub/sub event hub with 9 categories: pointer, wheel, gesture, keyboard, touch, raycast, select, hover, focus. Factory + singleton pattern (`threeEventManager`). Architecture only — no handlers registered. Events flow through R3F Canvas event source.

**Error Handling (`three-error-boundary.tsx`):** Class component error boundary wrapping the 3D layer. Catches renderer failure, context loss, WebGL unavailability. Falls back to provided content. Accessibility: `aria-hidden: true` + `pointer-events: none` on decorative 3D wrapper.

**Canvas Wrapper (`three-canvas.tsx`):** Reusable R3F Canvas wrapper. Feature gates: `isEnabled && !isReducedMotion && !forceFallback`. When disabled: renders fallback or null (no Canvas mounted, saves GPU). When enabled: wraps `<Canvas>` in `<ThreeErrorBoundary>` + `<Suspense>`. Props override frameloop and dpr per instance. Memoized component.

**Registry (`three-registry.ts`):** Generic Map-based registry for future scene/camera/light/asset registration. Follows same pattern as narrative and timeline registries.

**Hooks (6):**
- `useThree(selector?, equalityFn?)` — full context or derived slice. Selector memoized via ref-stored equality function.
- `useThreePerformance(selector?, equalityFn?)` — performance snapshot via `useSyncExternalStore`. Direct subscription to singleton.
- `useThreeRenderer()` — renderer config + derived canvas settings (gl, dpr, shadows, flat, onCreated). All memoized.
- `useThreeQuality()` — quality settings + override API. Derives: canPostProcess, canShadow, recommendedFrameloop.
- `useThreeViewport()` — live viewport detection using `useBreakpoint()` + `useWindowSize()`. Returns isMobileViewport, dimensions, aspectRatio, devicePixelRatio.
- `useThreeDevice()` — device capability access. Reads from `ThreeContextValue.performance.capabilities`. Returns tier, gpu, hasWebGL, canRender3D, etc.

**Feature Flag:** `hero_3d` (defaults to `false`). `THREE_FEATURE_FLAG` constant in `three.constants.ts`. Feature flag must be enabled for any 3D content to render.

**SSR Safety:** All capability probes gated behind `typeof window !== 'undefined'`. Default snapshots used server-side. localStorage persistence wrapped in try/catch.

**Dependencies:** `three` (v0.185.1), `@react-three/fiber` (v8, for React 18 compatibility).

**Import Pattern:** `import { ThreeCanvas, ThreeProvider, useThree, useThreeQuality, QUALITY_PRESETS, type ThreeContextValue } from '@/features/three'`

**Files Created:** hooks/use-three.ts, hooks/use-three-performance.ts, hooks/use-three-renderer.ts, hooks/use-three-quality.ts, hooks/use-three-viewport.ts, hooks/use-three-device.ts, three-canvas.tsx, index.ts

**Files Modified:** root-provider.tsx (added ThreeProvider), three.config.ts (removed unused imports), hero-3d-mount.tsx (removed unused import)

**Key Rule:** Internal singletons (`threePerformanceManager`, `threeEventManager`, `ThreeContext`) are NOT exported from barrel. Consumers access through hooks and provider only.

---

*This document is immutable project memory. It is updated only when permanent architectural or design decisions change. It does not track progress, implementation history, or temporary state.*

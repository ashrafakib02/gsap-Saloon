# ARCHITECTURE_DECISIONS.md

## Immutable Architecture Decisions — The Definitive Checklist

> "Every decision in this document is permanent until formally amended. These are the non-negotiable commitments of the technical architecture. They are derived from the approved planning documents and the DESIGN_SYSTEM_DECISIONS.md, and represent the complete, immutable truth of how this codebase is built."

---

## OVERALL ARCHITECTURE

- [ ] **Single-page narrative homepage** — The homepage is a single route (`/`) containing 16 scroll-driven sections in a three-act dramatic structure
- [ ] **Client-rendered narrative** — Homepage is a client-side React application; SSR/SSG reserved for service detail pages for SEO
- [ ] **REST API** — RESTful endpoints, not GraphQL; data relationships are simple and well-defined
- [ ] **Separation of server and client state** — TanStack Query for server state, Redux Toolkit for client state; never conflate
- [ ] **Privacy-first analytics** — Plausible, Fathom, or Umami only; no cookies, no tracking pixels, GDPR compliant
- [ ] **Dark mode prepared but not V1** — Architecture supports dark mode via Tailwind `dark:` prefix; implementation deferred to V2
- [ ] **English only in V1** — No i18n framework in V1; component structure supports future wrapping for French/Arabic (V2)
- [ ] **No SSR for homepage** — The narrative experience is client-rendered; the Warm Unveiling IS the loading experience
- [ ] **SSG or SSR for service detail pages** — SEO-critical pages use server rendering for crawlers
- [ ] **HTTPS only** — All communication over TLS; no exceptions

---

## TECHNOLOGY STACK

- [ ] **Frontend framework:** React 18 — concurrent features, Suspense, community ecosystem
- [ ] **Build tool:** Vite — fast HMR, ESM-native, minimal config
- [ ] **Language:** TypeScript — strict mode enabled, no `any`, no exceptions
- [ ] **Styling:** Tailwind CSS v4 — utility-first, design token integration, zero-runtime CSS
- [ ] **Routing:** TanStack Router — file-based, type-safe, search param validation, layout routes
- [ ] **Server state:** TanStack Query — caching, background refetch, optimistic updates, stale-while-revalidate
- [ ] **Client state:** Redux Toolkit — booking flow, UI state, animation state, feature flags
- [ ] **Rich text:** TipTap — future CMS/admin content editing (V2+ integration)
- [ ] **3D:** React Three Fiber + Drei — atmospheric 3D effects, disabled on mobile
- [ ] **Scroll animation:** GSAP + ScrollTrigger — industry-standard scroll-linked animation, pinned sections, scrub
- [ ] **Smooth scroll:** Lenis — performant smooth scrolling, GSAP-native integration
- [ ] **Micro animation:** Framer Motion (limited) — component-level transitions only where GSAP is unnecessary
- [ ] **Backend:** Express — lightweight, flexible, well-understood
- [ ] **Database:** PostgreSQL — ACID compliance, JSON support, mature ecosystem
- [ ] **ORM:** Drizzle ORM — type-safe, lightweight, SQL-like API, excellent TypeScript integration
- [ ] **Cache:** Redis — session caching, availability caching, rate limiting
- [ ] **Job queue:** BullMQ — email/SMS confirmation (V2+), background processing, retry logic

---

## FOLDER PHILOSOPHY

- [ ] **Hybrid organization** — Feature-first at the top level, layer-first within each feature
- [ ] **Narrative-aligned features** — Feature folders named after narrative sections (`hero/`, `transformation/`, `artisans/`), not technology (`sections/`, `pages/`)
- [ ] **Monorepo structure** — `apps/` for runnable applications, `packages/` for shared code, `docs/` for documentation
- [ ] **Lowercase with hyphens** — All folder names: `booking-flow/`, not `bookingFlow/`
- [ ] **Plural nouns for containers** — `features/`, `components/`, `hooks/`
- [ ] **Singular nouns for instances** — `service-card.tsx`, not `service-cards.tsx`
- [ ] **Single component per file** — File name matches component name exactly
- [ ] **Feature entry points** — Each feature has `index.ts` exporting its public API
- [ ] **No direct feature-to-feature imports** — Shared code lives in `shared/`

---

## ROUTE ORGANIZATION

- [ ] **TanStack Router file-based routing** — Routes defined by file structure under `src/app/`
- [ ] **Homepage is the application** — `/` renders all 16 narrative sections as components
- [ ] **Booking is an overlay, not a route** — Booking flow mounts/unmounts as component state, NOT via routing
- [ ] **Booking confirmation IS a route** — `/booking/confirmation` is a distinct URL for sharing and back-button safety
- [ ] **Service detail pages are separate routes** — `/services/hair`, `/services/color`, `/services/bridal`, `/services/spa`
- [ ] **Section navigation is scroll-based** — Internal links use anchor hash (`#artisans`), not separate routes
- [ ] **Back button closes booking overlay** — Does not navigate away from the homepage
- [ ] **Route loaders for prefetching** — TanStack Router loaders prefetch data before page transitions
- [ ] **Custom 404 page** — Branded error page for all unmatched routes
- [ ] **No nested booking routes** — Booking steps are component state, not URL segments

---

## COMPONENT ORGANIZATION

- [ ] **Four component categories** — Narrative, UI, Composition, Layout
- [ ] **Narrative components own their animation** — Each section component owns its signature animation
- [ ] **UI components are animation-agnostic** — `Button`, `Card`, `Input` respond to state, not animation systems
- [ ] **Composition components orchestrate** — `BookingOverlay` composes step components, orchestrates transitions
- [ ] **No prop drilling beyond 2 levels** — Deeper state goes to Redux or context
- [ ] **Component naming: PascalCase** — `ServiceCard`, `ArtisanProfile`, `BookingOverlay`
- [ ] **File naming: kebab-case** — `service-card.tsx`, `artisan-profile.tsx`
- [ ] **Variant separator: double-dash (BEM)** — `Button--primary`, `Button--ghost`
- [ ] **State modifier: single-underscore (BEM)** — `Button_disabled`, `Card_expanded`
- [ ] **Singular component names** — `ServiceCard`, not `ServiceCards`
- [ ] **Function over appearance** — `ArtisanProfile`, not `TeamMemberCard`
- [ ] **Mobile-first responsive** — Base styles are mobile; `md:`, `lg:`, `xl:` prefixes add enhancements
- [ ] **No index.ts for individual components** — Only feature-level barrel exports
- [ ] **Design system component inventory** — ServiceCard, ArtisanProfile, ClientReview, CTAButton, NavigationLink, SectionHeader, HeroSection, BookingFlow, GiftCard, Footer

---

## STATE MANAGEMENT

- [ ] **TanStack Query for ALL server data** — Services, artisans, testimonials, availability, gift cards, configuration
- [ ] **Redux Toolkit for ALL client state** — Booking flow, UI state, feature flags, scroll tracking
- [ ] **Never put server data in Redux** — No exceptions; API data lives in TanStack Query cache
- [ ] **Never put animation frame state in Redux** — GSAP internal state is not Redux's concern
- [ ] **Booking flow is a finite state machine** — 6 states (Service → Artisan → Date → Time → Contact → Confirmation) with defined transitions
- [ ] **Booking state in Redux** — Survives component re-renders, inspectable in DevTools
- [ ] **Booking selections lost on page refresh** — Session only; no localStorage persistence in V1
- [ ] **Availability caching: 30 seconds stale** — Real-time data with short cache for accuracy
- [ ] **Service/artisan caching: 5 minutes stale** — Rarely-changing data with longer cache
- [ ] **Redux slices are small** — Each slice understandable in under 30 seconds
- [ ] **Readable Redux action names** — `booking/setCurrentStep`, never `SET_S`
- [ ] **Redux DevTools enabled** — In development, full state inspection

---

## API ARCHITECTURE

- [ ] **REST endpoints** — `/api/services`, `/api/artisans`, `/api/testimonials`, `/api/availability`, `/api/bookings`, `/api/gift-cards`
- [ ] **Consistent JSON envelope** — `{ data: T, meta?: {...} }` for success; `{ error: { code, message, details? } }` for errors
- [ ] **UUID primary keys** — All database IDs are UUIDs, not auto-increment integers
- [ ] **Prices stored in cents** — Integer math avoids floating-point issues
- [ ] **Availability calculation is server-side** — Accounts for bookings, exceptions, service duration, business hours
- [ ] **Redis caching for availability** — Key: `availability:{artisanId}:{date}:{serviceId}`, invalidated on booking create/cancel
- [ ] **BullMQ for background jobs** — Booking confirmation, cache invalidation, email/SMS (V2+)
- [ ] **No authentication in V1** — Public-facing site only; admin auth added in V2
- [ ] **Rate limiting** — 100 requests/minute per IP, 10 booking attempts/hour per email
- [ ] **API versioning via URL prefix** — `/api/v1/`, `/api/v2/` when breaking changes needed
- [ ] **Shared types package** — `packages/shared` defines TypeScript interfaces used by both frontend and backend
- [ ] **Type drift is impossible** — Frontend and backend import the same type definitions

---

## ANIMATION ARCHITECTURE

- [ ] **Three animation systems, three domains** — GSAP (scroll-linked), Lenis (smooth scroll), Framer Motion (component micro-interactions)
- [ ] **GSAP owns ALL scroll animations** — Section reveals, parallax, Transformation Dissolve, testimonial cascade
- [ ] **Framer Motion NEVER handles scroll** — Only mount/unmount transitions (booking overlay, mobile menu, modal)
- [ ] **Lenis for smooth scroll** — Replaces native scroll with interpolated smooth scroll; integrates with GSAP
- [ ] **Scroll-linked, NOT time-linked** — Visitor controls all pacing through scroll position; only exception: hero Warm Unveiling
- [ ] **Animation timing centralized** — All timing values in a single configuration file, not scattered across components
- [ ] **Only animate `transform` and `opacity`** — GPU-composited properties only; never animate `width`, `height`, `top`, `left`
- [ ] **Maximum translation: 30px vertical** — No element moves more than 30 pixels
- [ ] **Maximum opacity start: 80%** — Elements materialize from warmth, never appear from nothing
- [ ] **Maximum hover scale: 1.03** — Subtle, not dramatic
- [ ] **Maximum reveal duration: 600ms** — Section entry animations are never longer
- [ ] **Parallax maximum: 15-20% differential** — Background moves at 80-85% of foreground speed
- [ ] **No bouncing, no spring physics, no overshooting** — Absolute prohibition
- [ ] **No scroll-jacking** — Lenis enhances scroll feel but never hijacks scroll direction or position
- [ ] **Kill animations on unmount** — Every component that creates GSAP animations must kill them in cleanup
- [ ] **Lazy-init below-fold animations** — ScrollTrigger instances created when approaching viewport, not on page load
- [ ] **Maximum 5 concurrent ScrollTrigger instances** — Below fold, at any time
- [ ] **`prefers-reduced-motion` respected** — All animation hooks check this; reduced motion = duration 0

---

## SIGNATURE MOMENT ARCHITECTURE

- [ ] **The Warm Unveiling** — Hero reveal: 1200-1500ms, elements materialize from 80-90% opacity, warm color temperature, the ONLY time-linked animation
- [ ] **The Transformation Dissolve** — Scroll-controlled cross-dissolve: `clip-path` animation scrubbed to scroll position, linear mapping, full viewport of scroll distance
- [ ] **The Golden Return** — Closing image: 2000-2500ms ambient animation, no scroll-linking, Peak-End Rule ending
- [ ] **Transformation Dissolve implementation** — Two images, absolutely positioned, `clip-path: inset()` animated by GSAP ScrollTrigger with `scrub: true`
- [ ] **Warm Unveiling implementation** — GSAP timeline with staggered reveals: background → text → CTA, 200ms offsets
- [ ] **Golden Return implementation** — GSAP timeline with gentle ambient animation, NOT scroll-linked
- [ ] **Signature moments are self-contained** — Each lives in its feature folder, owns its animation, is independently testable

---

## 3D ARCHITECTURE

- [ ] **3D is background, never focus** — Volumetric light, warm haze, particle effects enhance atmosphere only
- [ ] **3D is P2 priority** — Entire 3D layer is an enhancement, not a requirement
- [ ] **3D disabled on mobile** — If viewport < 768px or device memory < 4GB, 3D layer is skipped
- [ ] **3D disabled for reduced motion** — If `prefers-reduced-motion: reduce`, 3D is disabled
- [ ] **3D is lazy-loaded** — React Three Fiber imported via `React.lazy()`, not in initial bundle
- [ ] **3D canvas is `pointer-events: none`** — Never blocks content interaction
- [ ] **3D uses `frameloop="demand"`** — Only renders when something changes
- [ ] **3D has graceful fallback** — Experience is complete without 3D; absence is not noticeable
- [ ] **3D scenes are per-signature-moment** — `hero-atmosphere`, `transformation-3d`, `closing-ambient`

---

## ASSET ORGANIZATION

- [ ] **AVIF first, WebP fallback, JPEG final** — Modern formats with progressive fallback chain
- [ ] **Self-hosted fonts** — Cormorant Garamond (serif) + DM Sans (sans-serif), loaded from local files
- [ ] **`font-display: swap`** — No invisible text during font loading
- [ ] **Font preloading** — Critical font files preloaded via `<link rel="preload">`
- [ ] **Explicit image dimensions** — All `<img>` elements have `width` and `height` to prevent CLS
- [ ] **Hero image: `fetchpriority="high"`** — Browser prioritizes hero image load
- [ ] **Below-fold images: `loading="lazy"`** — Deferred loading for non-critical images
- [ ] **Blur-up placeholders** — Lightweight base64 placeholder while full image loads
- [ ] **Image format at build time** — Vite plugin or Sharp generates multiple formats and sizes
- [ ] **Responsive srcset** — Browser receives multiple size options, picks optimal
- [ ] **SVG for all icons** — Vector graphics for icons and logos; no icon fonts
- [ ] **Aspect ratios per DESIGN_SYSTEM.md** — Hero 16:9+, Service 4:3/3:2, Portrait 3:4/2:3, Detail 1:1

---

## LOADING STRATEGY

- [ ] **No loading spinners** — Ever. Branded indicators only when >300ms wait is needed
- [ ] **No skeleton shimmer** — Absolute prohibition; content appears or branded indicator shows
- [ ] **Instant content or branded indicator** — If <300ms, show nothing; if longer, warm gold pulse
- [ ] **Critical CSS inlined** — Above-fold styles in HTML `<style>` tag, no FOUC
- [ ] **Code splitting by route** — Homepage chunk loads first; service detail pages are separate chunks
- [ ] **Hero image preloaded** — `<link rel="preload">` + `fetchpriority="high"`
- [ ] **GSAP and Lenis deferred** — Loaded after critical content renders
- [ ] **3D lazy-loaded** — React Three Fiber in a separate chunk, loaded after main content
- [ ] **TanStack Query serves from cache** — Stale-while-revalidate; no loading states if data is cached
- [ ] **Warm Unveiling IS the loading experience** — 1200-1500ms reveal replaces any concept of "loading screen"
- [ ] **Progressive enhancement** — HTML shell → critical content → JavaScript hydration → below-fold content → 3D layer

---

## SEO STRATEGY

- [ ] **One `<h1>` per page** — Never skip heading levels
- [ ] **Semantic HTML** — `<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>` landmark elements
- [ ] **Meta titles and descriptions per page** — Unique `<title>` and `<meta description>` for every route
- [ ] **Open Graph tags** — Per-page OG title, description, image, URL
- [ ] **Canonical URLs** — `<link rel="canonical">` on every page
- [ ] **Structured data (JSON-LD)** — LocalBusiness on homepage, Service on detail pages
- [ ] **Local SEO (NAP consistency)** — Name, Address, Phone identical everywhere
- [ ] **Sitemap.xml** — All routes listed with correct priorities
- [ ] **robots.txt** — Allow all public pages, disallow booking confirmation
- [ ] **No index on booking confirmation** — Utility page, not content
- [ ] **Service detail pages SSR/SSG** — SEO-critical pages rendered for crawlers
- [ ] **Internal linking strategy** — Service sections link to detail pages; detail pages cross-link; footer has full site map

---

## PERFORMANCE

- [ ] **LCP < 2.5s** — Largest Contentful Paint target
- [ ] **INP < 200ms** — Interaction to Next Paint target
- [ ] **CLS < 0.1** — Cumulative Layout Shift target
- [ ] **Initial bundle < 300KB gzipped** — React 18 + routing + critical CSS
- [ ] **Total initial page weight < 1MB** — Including hero image
- [ ] **Mobile PageSpeed 90+** — Industry standard for premium sites
- [ ] **3G usability** — Above-fold content within 5 seconds on 3G
- [ ] **No third-party scripts beyond analytics** — Plausible/Fathom/Umami only in V1
- [ ] **Brotli compression** — Text assets served compressed from CDN edge
- [ ] **Content-hashed filenames** — JS and CSS get immutable cache headers (1 year)
- [ ] **CDN deployment** — Static assets from edge for low latency
- [ ] **No layout thrashing in animations** — GPU-composited properties only
- [ ] **Passive event listeners** — Scroll and touch events use `{ passive: true }`
- [ ] **Lighthouse CI** — Automated performance audits on every PR
- [ ] **Bundle analysis** — `vite-plugin-visualizer` to catch size increases
- [ ] **3D disabled on slow connections** — Detected via `navigator.connection` API

---

## ACCESSIBILITY

- [ ] **WCAG 2.1 Level AA minimum** — Non-negotiable; aim for AAA where achievable
- [ ] **Text contrast 4.5:1 minimum** — We achieve 7:1+ with warm charcoal on warm off-white
- [ ] **Gold focus ring, 2px minimum** — Always visible, never removed, on `:focus-visible`
- [ ] **Keyboard navigation for all interactive elements** — Every booking step completable via keyboard
- [ ] **Skip-to-content link** — First focusable element on every page
- [ ] **`prefers-reduced-motion`** — All animation disabled when active; content still accessible
- [ ] **No color-only communication** — Every color distinction has a secondary signal (icon, text, pattern)
- [ ] **Form labels on all fields** — `<label>` elements, never placeholder-only
- [ ] **Error messages: specific and helpful** — Explain what went wrong and how to fix it
- [ ] **Screen reader landmarks** — Header, nav, main, footer in semantic landmark elements
- [ ] **No flashing content** — More than 3 flashes per second is an absolute prohibition
- [ ] **Alt text on all meaningful images** — Descriptive and specific; decorative images get `alt=""`
- [ ] **Touch targets 44×44px minimum** — With 8px spacing between targets
- [ ] **Content reflow at 200% zoom** — No horizontal scrolling at 200% text zoom
- [ ] **Heading hierarchy never skipped** — h1 → h2 → h3 is valid; h1 → h3 is not
- [ ] **axe-core in build pipeline** — Automated accessibility audits on every PR
- [ ] **Monthly manual screen reader testing** — VoiceOver (macOS), NVDA (Windows)

---

## ERROR HANDLING

- [ ] **Four error levels** — Page-level (404/500), Section-level (API failure), Component-level (form validation), Silent (analytics)
- [ ] **Never show raw error messages** — "Error 500" → "Something went wrong. Please try again."
- [ ] **Error states match the brand** — Warm tone, warm colors (warm red-brown), editorial voice
- [ ] **Every error has a recovery path** — Retry button, homepage link, or phone number
- [ ] **Never hide errors behind spinners** — Show the error immediately with a recovery option
- [ ] **Booking errors are critical** — Every booking failure has a specific message and saved state for retry
- [ ] **Custom 404 page** — Branded, warm, with navigation links back to content
- [ ] **Root error boundary** — Catches catastrophic React crashes, shows full-page branded error
- [ ] **Section error boundaries** — Catches section-specific failures, shows graceful fallback
- [ ] **Booking overlay error boundary** — Catches booking flow failures, preserves progress
- [ ] **Backend structured errors** — `{ error: { code, message, details? } }` for all API failures
- [ ] **Availability conflict handling** — "That time was just booked. Here are the next available slots."

---

## TESTING

- [ ] **Testing pyramid** — Many unit tests (Vitest), moderate integration tests (RTL), few E2E tests (Playwright)
- [ ] **Unit test pure functions** — Date formatting, price calculation, slug generation, type guards
- [ ] **Integration test components** — Rendering with mock data, form validation, navigation, error states
- [ ] **E2E test critical paths** — Homepage load, scroll through sections, full booking flow, 404 page
- [ ] **Accessibility testing** — axe-core in build pipeline, manual keyboard and screen reader testing
- [ ] **No animation pixel testing** — Animation quality judged visually, not programmatically
- [ ] **Test files co-located** — `__tests__/` directory within feature/hook directory
- [ ] **CI/CD pipeline** — Lint → Unit → Integration → Build → Lighthouse → Axe-core → E2E
- [ ] **No tests for third-party internals** — Do not test GSAP or TanStack Query behavior
- [ ] **Booking flow tested exhaustively** — The conversion funnel is the most-tested feature

---

## FUTURE SCALABILITY

- [ ] **V2: TipTap CMS integration** — Content editing for services, artisans, testimonials
- [ ] **V2: Admin dashboard** — New route (`/admin`), authentication, booking management
- [ ] **V2: Email/SMS confirmations** — BullMQ job processor already defined
- [ ] **V2: Authentication** — Express middleware prepared for auth layer
- [ ] **V2: French/Arabic** — i18n framework wrapping existing components
- [ ] **V3: AI features** — Style recommendations, virtual try-on, chat-based booking
- [ ] **V3: Multi-location** — Data model expansion, location-based routing
- [ ] **V4+: E-commerce, Loyalty, Mobile App** — Architecture supports all
- [ ] **API versioning** — `/api/v1/` prefix; new versions for breaking changes
- [ ] **Database migrations** — Drizzle-generated, version-controlled, forward and rollback capable
- [ ] **Component versioning** — New version created alongside old; consumers migrate incrementally

---

## MONOREPO

- [ ] **pnpm workspaces** — Strict dependency resolution, efficient disk usage
- [ ] **Turborepo build orchestration** — Parallel builds, dependency-aware ordering, caching
- [ ] **Dependency flow is downward** — `apps/` → `packages/` → `packages/shared` (leaf)
- [ ] **No circular dependencies** — `packages/shared` depends on nothing
- [ ] **Shared types package** — `packages/shared` prevents frontend-backend type drift
- [ ] **Atomic changes** — Features spanning frontend and backend committed in single PRs
- [ ] **Consistent tooling** — One TypeScript config, one ESLint config, one build pipeline
- [ ] **Database as separate package** — `packages/db` with schema, migrations, seeds

---

## CODING CONVENTIONS

- [ ] **TypeScript strict mode** — `"strict": true`, no `any`, no exceptions
- [ ] **Explicit return types** — On all exported functions
- [ ] **`import type` for type-only imports** — `import type { BookingRequest }`
- [ ] **Interface over type** — For object shapes (extendable, more readable)
- [ ] **File naming: kebab-case** — `service-card.tsx`, `use-scroll-reveal.ts`
- [ ] **Component naming: PascalCase** — `ServiceCard`, `BookingOverlay`
- [ ] **Git branches: type/description** — `feature/transformation-dissolve`, `fix/booking-overlap`
- [ ] **Conventional commits** — `feat:`, `fix:`, `docs:`, `refactor:`
- [ ] **No comments for obvious code** — Rewrite if it needs explaining
- [ ] **"Why" comments mandatory** — Non-obvious decisions must explain reasoning
- [ ] **No TODO without owner** — `// TODO(author): Description`
- [ ] **No commented-out code** — It's in git history
- [ ] **User-facing errors: warm and helpful** — Brand voice maintained even in failure
- [ ] **Developer-facing errors: precise and actionable** — Include context, variables, and source
- [ ] **Import order enforced by ESLint** — External → Internal packages → Feature → Shared → Local
- [ ] **Tailwind responsive prefix order** — Mobile-first: no prefix → `md:` → `lg:` → `xl:`
- [ ] **No inline styles** — Except dynamic values from JavaScript (GSAP-injected transforms)
- [ ] **Code review checklist** — TypeScript, accessibility, responsive, performance, animation cleanup, error handling, testing, naming, design system compliance

---

## ANTI-PATTERNS (ABSOLUTE PROHIBITIONS)

### Architecture
- [ ] No server data in Redux — TanStack Query owns all API data
- [ ] No feature-to-feature direct imports — Shared code goes in `shared/`
- [ ] No prop drilling beyond 2 levels — Use Redux or context
- [ ] No animation in UI components — GSAP/ScrollTrigger/Framer Motion stay in their lanes
- [ ] No booking route — Booking is overlay state, not URL state
- [ ] No `any` in TypeScript — Use `unknown` and type narrow

### Performance
- [ ] No loading spinners — Branded indicators or instant content
- [ ] No skeleton shimmer — Absolute prohibition
- [ ] No blocking third-party scripts — Analytics deferred, nothing else in V1
- [ ] No unoptimized images — AVIF/WebP with responsive srcset, lazy loading
- [ ] No layout thrashing — GPU-composited properties only in animations

### Animation
- [ ] No scroll-jacking — Lenis enhances, never hijacks
- [ ] No time-linked scroll animations — Visitor controls all pacing
- [ ] No bouncing or spring physics — Absolute prohibition
- [ ] No animations that block content interaction
- [ ] No animations that reverse on scroll-back
- [ ] No animations exceeding 600ms (except hero and confirmation)
- [ ] No translation exceeding 30px

### Code Quality
- [ ] No `any` types — Use `unknown`
- [ ] No console.log in production — Use structured logging
- [ ] No magic numbers — All values from named constants or config files
- [ ] No premature optimization — Profile first, optimize second
- [ ] No dependency on global state for component rendering — Components must be testable in isolation

---

*This document is the immutable checklist of all architectural decisions. Every decision herein is permanent until formally amended through a documented, intentional process. No team member may override, circumvent, or "creep" any decision in this document.*

*Document prepared: July 2026*
*Source: TECHNICAL_ARCHITECTURE.md and all 17 approved planning documents*

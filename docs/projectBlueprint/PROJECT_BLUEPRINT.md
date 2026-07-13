# PROJECT_BLUEPRINT.md

## The Sovereign Artisor — Engineering Blueprint

> "This is the engineering blueprint for The Sovereign Artisor — a single-page narrative website with 16 scroll-driven sections, 4 service detail child pages, and a 6-step booking overlay. Every entry below is derived from immutable planning documents. No implementation. No pseudocode. Only the structural truth of what will be built."

---

## 1. Repository Structure

```
sovereign-artisor/
│
├── .claude/
│   └── settings.local.json
│
├── apps/
│   └── web/                                    # Primary frontend application
│       ├── public/
│       │   ├── favicon.ico
│       │   ├── favicon.svg
│       │   ├── apple-touch-icon.png
│       │   ├── robots.txt
│       │   ├── sitemap.xml
│       │   ├── og-default.jpg
│       │   └── manifest.json
│       │
│       ├── src/
│       │   ├── app/                            # Application shell, providers, router
│       │   │   ├── __root.tsx                  # Root layout (providers, Lenis, GSAP init)
│       │   │   ├── routeTree.gen.ts            # Auto-generated route tree
│       │   │   ├── index.tsx                   # Homepage — renders all 16 sections
│       │   │   ├── services/
│       │   │   │   ├── _layout.tsx             # Service detail layout (back nav, breadcrumbs)
│       │   │   │   ├── hair.tsx                # /services/hair
│       │   │   │   ├── color.tsx               # /services/color
│       │   │   │   ├── bridal.tsx              # /services/bridal
│       │   │   │   └── spa.tsx                 # /services/spa
│       │   │   ├── booking/
│       │   │   │   └── confirmation.tsx        # /booking/confirmation
│       │   │   ├── 404.tsx                     # Custom branded error page
│       │   │   ├── _layout.tsx                 # Global layout (analytics, error boundary)
│       │   │   └── providers/
│       │   │       ├── query-provider.tsx       # TanStack Query provider
│       │   │       ├── redux-provider.tsx       # Redux Toolkit provider
│       │   │       ├── animation-provider.tsx   # GSAP + Lenis initialization
│       │   │       └── root-provider.tsx        # Composes all providers
│       │   │
│       │   ├── features/                       # Feature modules (narrative-aligned)
│       │   │   ├── threshold/                  # Prologue — designed loading threshold
│       │   │   │   ├── index.ts
│       │   │   │   ├── threshold.tsx
│       │   │   │   ├── threshold.config.ts
│       │   │   │   └── threshold.types.ts
│       │   │   │
│       │   │   ├── hero/                       # Hero image + Warm Unveiling
│       │   │   │   ├── index.ts
│       │   │   │   ├── hero.tsx
│       │   │   │   ├── hero.config.ts
│       │   │   │   └── hero.types.ts
│       │   │   │
│       │   │   ├── narrative-whisper/          # Brand thesis section
│       │   │   │   ├── index.ts
│       │   │   │   ├── narrative-whisper.tsx
│       │   │   │   ├── narrative-whisper.config.ts
│       │   │   │   └── narrative-whisper.types.ts
│       │   │   │
│       │   │   ├── atmosphere/                 # Environmental photography immersion
│       │   │   │   ├── index.ts
│       │   │   │   ├── atmosphere.tsx
│       │   │   │   ├── atmosphere.config.ts
│       │   │   │   └── atmosphere.types.ts
│       │   │   │
│       │   │   ├── breathing-space/            # Act transitions (reusable)
│       │   │   │   ├── index.ts
│       │   │   │   ├── breathing-space.tsx
│       │   │   │   └── breathing-space.types.ts
│       │   │   │
│       │   │   ├── hair/                       # Craft: Hair service section
│       │   │   │   ├── index.ts
│       │   │   │   ├── hair.tsx
│       │   │   │   ├── hair.config.ts
│       │   │   │   └── hair.types.ts
│       │   │   │
│       │   │   ├── transformation/             # Transformation: Color + Dissolve
│       │   │   │   ├── index.ts
│       │   │   │   ├── transformation.tsx
│       │   │   │   ├── transformation-dissolve.tsx
│       │   │   │   ├── before-after-slider.tsx
│       │   │   │   ├── use-transformation-scroll.ts
│       │   │   │   ├── transformation.config.ts
│       │   │   │   └── transformation.types.ts
│       │   │   │
│       │   │   ├── bridal/                     # Ceremony: Bridal section
│       │   │   │   ├── index.ts
│       │   │   │   ├── bridal.tsx
│       │   │   │   ├── bridal.config.ts
│       │   │   │   └── bridal.types.ts
│       │   │   │
│       │   │   ├── spa/                        # Sanctuary: Spa section
│       │   │   │   ├── index.ts
│       │   │   │   ├── spa.tsx
│       │   │   │   ├── spa.config.ts
│       │   │   │   └── spa.types.ts
│       │   │   │
│       │   │   ├── artisans/                   # Team profiles section
│       │   │   │   ├── index.ts
│       │   │   │   ├── artisans.tsx
│       │   │   │   ├── artisan-card.tsx
│       │   │   │   └── artisans.types.ts
│       │   │   │
│       │   │   ├── testimonials/               # Chorus of Proof section
│       │   │   │   ├── index.ts
│       │   │   │   ├── testimonials.tsx
│       │   │   │   ├── testimonial-card.tsx
│       │   │   │   └── testimonials.types.ts
│       │   │   │
│       │   │   ├── booking/                    # Booking invitation + overlay
│       │   │   │   ├── index.ts
│       │   │   │   ├── booking-invitation.tsx
│       │   │   │   ├── booking-overlay.tsx
│       │   │   │   ├── booking-service-step.tsx
│       │   │   │   ├── booking-artisan-step.tsx
│       │   │   │   ├── booking-calendar-step.tsx
│       │   │   │   ├── booking-time-step.tsx
│       │   │   │   ├── booking-contact-step.tsx
│       │   │   │   ├── booking-confirmation-step.tsx
│       │   │   │   ├── booking-progress.tsx
│       │   │   │   ├── booking.config.ts
│       │   │   │   └── booking.types.ts
│       │   │   │
│       │   │   ├── gift/                       # Gift card experience
│       │   │   │   ├── index.ts
│       │   │   │   ├── gift-card.tsx
│       │   │   │   ├── gift-purchase-flow.tsx
│       │   │   │   └── gift.types.ts
│       │   │   │
│       │   │   ├── closing/                    # Closing Image + Golden Return
│       │   │   │   ├── index.ts
│       │   │   │   ├── closing.tsx
│       │   │   │   ├── closing.config.ts
│       │   │   │   └── closing.types.ts
│       │   │   │
│       │   │   ├── footer/                     # Footer
│       │   │   │   ├── index.ts
│       │   │   │   ├── footer.tsx
│       │   │   │   └── footer.types.ts
│       │   │   │
│       │   │   ├── navigation/                 # Sticky nav, mobile menu
│       │   │   │   ├── index.ts
│       │   │   │   ├── navigation.tsx
│       │   │   │   ├── mobile-menu.tsx
│       │   │   │   ├── nav-link.tsx
│       │   │   │   └── navigation.types.ts
│       │   │   │
│       │   │   ├── service-detail/             # Shared logic for /services/* pages
│       │   │   │   ├── index.ts
│       │   │   │   ├── service-page.tsx
│       │   │   │   ├── service-hero.tsx
│       │   │   │   ├── service-content.tsx
│       │   │   │   ├── service-cta.tsx
│       │   │   │   ├── service-gallery.tsx
│       │   │   │   └── service-detail.types.ts
│       │   │   │
│       │   │   └── shared/                     # Cross-feature narrative components
│       │   │       ├── index.ts
│       │   │       ├── section-header.tsx
│       │   │       ├── section-wrapper.tsx
│       │   │       ├── error-boundary-section.tsx
│       │   │       └── shared-section.types.ts
│       │   │
│       │   ├── shared/                         # Shared components, hooks, utils
│       │   │   ├── ui/                         # Reusable UI components
│       │   │   │   ├── button.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   ├── select.tsx
│       │   │   │   ├── textarea.tsx
│       │   │   │   ├── modal.tsx
│       │   │   │   ├── overlay.tsx
│       │   │   │   ├── calendar.tsx
│       │   │   │   ├── time-slot-grid.tsx
│       │   │   │   ├── accordion.tsx
│       │   │   │   ├── badge.tsx
│       │   │   │   ├── separator.tsx
│       │   │   │   ├── skeleton.tsx
│       │   │   │   ├── tooltip.tsx
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── layout/                     # Layout components
│       │   │   │   ├── section-wrapper.tsx
│       │   │   │   ├── breathing-space.tsx
│       │   │   │   ├── content-width.tsx
│       │   │   │   ├── page-wrapper.tsx
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── feedback/                   # Feedback components
│       │   │   │   ├── error-message.tsx
│       │   │   │   ├── success-message.tsx
│       │   │   │   ├── loading-indicator.tsx
│       │   │   │   ├── toast.tsx
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── hooks/                      # Custom hooks
│       │   │   │   ├── animation/
│       │   │   │   │   ├── use-scroll-reveal.ts
│       │   │   │   │   ├── use-parallax.ts
│       │   │   │   │   ├── use-cross-dissolve.ts
│       │   │   │   │   ├── use-section-tracking.ts
│       │   │   │   │   ├── use-warm-reveal.ts
│       │   │   │   │   ├── use-golden-return.ts
│       │   │   │   │   └── use-reduced-motion.ts
│       │   │   │   ├── data/
│       │   │   │   │   ├── use-services.ts
│       │   │   │   │   ├── use-service-detail.ts
│       │   │   │   │   ├── use-artisans.ts
│       │   │   │   │   ├── use-artisan-detail.ts
│       │   │   │   │   ├── use-testimonials.ts
│       │   │   │   │   ├── use-availability.ts
│       │   │   │   │   └── use-create-booking.ts
│       │   │   │   └── ui/
│       │   │   │       ├── use-booking-flow.ts
│       │   │   │       ├── use-mobile-menu.ts
│       │   │   │       ├── use-scroll-direction.ts
│       │   │   │       ├── use-media-query.ts
│       │   │   │       ├── use-click-outside.ts
│       │   │   │       └── use-keyboard-navigation.ts
│       │   │   │
│       │   │   ├── utils/                      # Utility functions
│       │   │   │   ├── format-price.ts
│       │   │   │   ├── format-date.ts
│       │   │   │   ├── format-duration.ts
│       │   │   │   ├── slug-helpers.ts
│       │   │   │   ├── validation.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   └── index.ts                    # Shared barrel export
│       │   │
│       │   ├── assets/                         # Static assets
│       │   │   ├── images/
│       │   │   │   ├── hero/
│       │   │   │   ├── atmosphere/
│       │   │   │   ├── services/
│       │   │   │   │   ├── hair/
│       │   │   │   │   ├── color/
│       │   │   │   │   ├── bridal/
│       │   │   │   │   └── spa/
│       │   │   │   ├── artisans/
│       │   │   │   ├── closing/
│       │   │   │   ├── gift/
│       │   │   │   ├── og/
│       │   │   │   └── 404/
│       │   │   ├── fonts/
│       │   │   │   ├── cormorant-garamond-*.woff2
│       │   │   │   └── dm-sans-*.woff2
│       │   │   └── icons/
│       │   │       ├── nav/
│       │   │       ├── booking/
│       │   │       ├── social/
│       │   │       ├── services/
│       │   │       └── misc/
│       │   │
│       │   ├── styles/
│       │   │   ├── global.css
│       │   │   ├── fonts.css
│       │   │   ├── tailwind.css
│       │   │   └── animations.css
│       │   │
│       │   ├── lib/
│       │   │   ├── gsap-config.ts               # GSAP plugin registration
│       │   │   ├── lenis-config.ts              # Lenis smooth scroll config
│       │   │   ├── query-client.ts              # TanStack Query client config
│       │   │   ├── redux-store.ts               # Redux Toolkit store setup
│       │   │   └── analytics.ts                 # Plausible/Fathom integration
│       │   │
│       │   └── types/
│       │       ├── global.d.ts
│       │       └── route-params.ts
│       │
│       ├── index.html
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── package.json
│       ├── .env
│       ├── .env.example
│       └── .eslintrc.cjs
│
├── packages/
│   ├── api/                                    # Express backend
│   │   ├── src/
│   │   │   ├── index.ts                        # Entry point
│   │   │   ├── routes/
│   │   │   │   ├── services.ts
│   │   │   │   ├── artisans.ts
│   │   │   │   ├── testimonials.ts
│   │   │   │   ├── availability.ts
│   │   │   │   ├── bookings.ts
│   │   │   │   ├── gift-cards.ts
│   │   │   │   └── config.ts
│   │   │   ├── middleware/
│   │   │   │   ├── cors.ts
│   │   │   │   ├── rate-limiter.ts
│   │   │   │   ├── body-parser.ts
│   │   │   │   ├── request-logger.ts
│   │   │   │   ├── error-handler.ts
│   │   │   │   └── validation.ts
│   │   │   ├── services/
│   │   │   │   ├── availability-service.ts
│   │   │   │   ├── booking-service.ts
│   │   │   │   └── gift-card-service.ts
│   │   │   ├── jobs/
│   │   │   │   ├── booking-created.ts
│   │   │   │   ├── booking-cancelled.ts
│   │   │   │   └── gift-card-purchased.ts
│   │   │   └── lib/
│   │   │       ├── redis.ts
│   │   │       ├── bullmq.ts
│   │   │       └── logger.ts
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── db/                                     # Database package
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── services.ts
│   │   │   │   ├── artisans.ts
│   │   │   │   ├── artisan-services.ts
│   │   │   │   ├── testimonials.ts
│   │   │   │   ├── bookings.ts
│   │   │   │   ├── gift-cards.ts
│   │   │   │   └── availability-exceptions.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   │       ├── services.ts
│   │   │       ├── artisans.ts
│   │   │       └── testimonials.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                                 # Shared types and constants
│       ├── src/
│       │   ├── types/
│       │   │   ├── service.ts
│       │   │   ├── artisan.ts
│       │   │   ├── testimonial.ts
│       │   │   ├── booking.ts
│       │   │   ├── availability.ts
│       │   │   ├── gift-card.ts
│       │   │   ├── api-response.ts
│       │   │   └── index.ts
│       │   └── constants/
│       │       ├── booking-steps.ts
│       │       ├── service-categories.ts
│       │       ├── animation-timing.ts
│       │       └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                                       # Project documentation
│   ├── projectBlueprint/
│   │   └── PROJECT_BLUEPRINT.md
│   ├── creativeDirection/
│   ├── designSystem/
│   ├── experienceStoryboard/
│   ├── fd&Ts/
│   ├── informationArchitecture/
│   ├── userFlows/
│   └── codebaseOrganize/
│
├── package.json                                # Root workspace config
├── turbo.json                                  # Turborepo build orchestration
├── tsconfig.base.json                          # Shared TypeScript config
├── .gitignore
├── .editorconfig
├── README.md
└── LICENSE
```

---

## 2. Application Layers

### Presentation Layer (`apps/web/src/`)

**Route Layer (`app/`)** — TanStack Router file-based routes. Root layout, homepage, service detail routes, booking confirmation, 404. Owns provider composition (Redux, TanStack Query, GSAP/Lenis). Route-level code splitting boundaries.

**Feature Layer (`features/`)** — Narrative-aligned feature modules. Each feature is a self-contained module: component, animation config, types, entry point. Features do not import from each other directly; shared code lives in `shared/`. Feature modules: `threshold`, `hero`, `narrative-whisper`, `atmosphere`, `breathing-space`, `hair`, `transformation`, `bridal`, `spa`, `artisans`, `testimonials`, `booking`, `gift`, `closing`, `footer`, `navigation`, `service-detail`, `shared`.

**Shared Layer (`shared/`)** — Cross-feature reusable code. Four sub-layers:
- `ui/` — Animation-agnostic interface primitives (Button, Card, Input, Select, Textarea, Modal, Overlay, Calendar, TimeSlotGrid, Accordion, Badge, Separator, Skeleton, Tooltip)
- `layout/` — Structural containers (SectionWrapper, BreathingSpace, ContentWidth, PageWrapper)
- `feedback/` — Error/success/loading messaging (ErrorMessage, SuccessMessage, LoadingIndicator, Toast)
- `hooks/` — Encapsulated logic in three domains: `animation/` (GSAP/ScrollTrigger hooks), `data/` (TanStack Query hooks), `ui/` (interface behavior hooks)
- `utils/` — Pure functions (format-price, format-date, format-duration, slug-helpers, validation)

**Assets Layer (`assets/`)** — Static resources. `images/` organized by narrative section (hero, atmosphere, services/hair|color|bridal|spa, artisans, closing, gift, og, 404). `fonts/` self-hosted Cormorant Garamond + DM Sans. `icons/` organized by domain (nav, booking, social, services, misc). All images served as AVIF → WebP → JPEG with responsive srcset.

**Styles Layer (`styles/`)** — Global CSS, font declarations, Tailwind entry, animation keyframes. Design tokens implemented as Tailwind theme extensions. Warm palette enforced at the CSS layer.

**Lib Layer (`lib/`)** — Third-party library configuration. GSAP plugin registration (ScrollTrigger). Lenis smooth scroll initialization. TanStack Query client factory. Redux Toolkit store factory. Analytics integration (Plausible/Fathom).

**Types Layer (`types/`)** — Shared TypeScript type declarations. Global ambient types. Route parameter types for TanStack Router.

### Core/Shared Package (`packages/shared/`)

TypeScript interfaces and constants shared between frontend and backend. Types: `service.ts`, `artisan.ts`, `testimonial.ts`, `booking.ts`, `availability.ts`, `gift-card.ts`, `api-response.ts`. Constants: `booking-steps.ts`, `service-categories.ts`, `animation-timing.ts`. This is the leaf package — depends on nothing.

### Database Package (`packages/db/`)

Drizzle ORM schema definitions, generated migrations, and seed data. Tables: `services`, `artisans`, `artisan_services` (junction), `testimonials`, `bookings`, `gift_cards`, `availability_exceptions`. All IDs are UUIDs. Prices stored in cents.

### Backend Package (`packages/api/`)

Express REST API. Route handlers for all endpoints. Middleware stack: CORS, rate limiter, body parser, request logger, error handler, validation. Business logic in service layer. Redis caching for availability. BullMQ job queue for booking confirmation/cache invalidation.

### Infrastructure Layer

**Build Orchestration:** Turborepo. Parallel package builds with dependency-aware ordering and output caching.

**Package Management:** pnpm workspaces with strict dependency resolution.

**Dependency Flow:** `apps/web` → `packages/shared` → nothing. `packages/api` → `packages/shared`, `packages/db`. `packages/db` → `packages/shared`. Dependencies flow downward. No circular dependencies.

---

## 3. Route Inventory

| # | Route | Purpose | Auth | SEO Priority | Lazy-Loaded | Animations | 3D | Data Dependencies |
|---|-------|---------|------|-------------|-------------|------------|-----|-------------------|
| 1 | `/` | Homepage — single-page narrative, 16 scroll-driven sections in three-act dramatic structure | None | Critical (brand terms, general salon queries) | Yes (route-level code split) | GSAP ScrollTrigger (section reveals, parallax, Transformation Dissolve), Lenis smooth scroll, Framer Motion (booking overlay, mobile menu) | Optional (P2, lazy-loaded) | Services, artisans, testimonials, site config |
| 2 | `/services/hair` | Hair service detail — editorial photography, sensory copy, transparent pricing, artisan connections | None | High (hair salon Marrakech keywords) | Yes (separate route chunk) | Section reveals, parallax, image hover warmth | No | Service detail (hair), artisans for hair |
| 3 | `/services/color` | Color service detail — before/after transformation, process images, client quotes | None | High (hair color Marrakech keywords) | Yes (separate route chunk) | Transformation Dissolve (scroll-linked), section reveals | No | Service detail (color), artisans for color |
| 4 | `/services/bridal` | Bridal service detail — slowest section, Morning Light mood, cinematic narrative | None | High (bridal hair Marrakech keywords) | Yes (separate route chunk) | Slowest reveal (50% standard speed), gentle parallax | No | Service detail (bridal), artisans for bridal |
| 5 | `/services/spa` | Spa service detail — sensory imagery, Evening Warmth mood, gentlest motion | None | High (spa Marrakech keywords) | Yes (separate route chunk) | Gentlest motion (imperceptible fades) | No | Service detail (spa), artisans for spa |
| 6 | `/booking/confirmation` | Post-booking state — appointment details, warm confirmation message, calendar integration | None | None (noindex) | Yes (separate route chunk) | Warm Confirmation animation (800-1200ms) | No | Booking details (from submission) |
| 7 | `/404` | Custom branded error page — warm message, navigation links, booking CTA | None | None | Yes (separate route chunk) | Minimal fade-in | No | None |
| 8 | `/#hero` | Deep link to hero section | None | Low (anchor only) | N/A (within homepage) | Warm Unveiling (1200-1500ms) | Optional | Hero image |
| 9 | `/#whisper` | Deep link to narrative whisper section | None | Low (anchor only) | N/A (within homepage) | Word-by-word reveal | No | Thesis text |
| 10 | `/#atmosphere` | Deep link to atmosphere section | None | Low (anchor only) | N/A (within homepage) | Parallax scroll, section reveals | No | Atmosphere images |
| 11 | `/#hair` | Deep link to hair service section | None | Low (anchor only) | N/A (within homepage) | Standard section reveal | No | Service data |
| 12 | `/#transformation` | Deep link to color/transformation section | None | Low (anchor only) | N/A (within homepage) | Transformation Dissolve (scroll-linked) | No | Before/after images, service data |
| 13 | `/#bridal` | Deep link to bridal section | None | Low (anchor only) | N/A (within homepage) | Slowest reveal | No | Service data |
| 14 | `/#spa` | Deep link to spa section | None | Low (anchor only) | N/A (within homepage) | Gentlest reveal | No | Service data |
| 15 | `/#artisans` | Deep link to artisans section | None | Low (anchor only) | N/A (within homepage) | Artisan Reveal (portrait → text) | No | Artisan data |
| 16 | `/#testimonials` | Deep link to testimonials section | None | Low (anchor only) | N/A (within homepage) | Staggered cascade | No | Testimonial data |
| 17 | `/#booking` | Deep link to booking invitation section | None | Low (anchor only) | N/A (within homepage) | Stillness (no animation) | No | None |

### Route Behavioral Notes

- **Homepage (`/`)**: Single route containing all 16 sections. Sections are components, not separate routes. Section navigation is scroll-based via anchor hash. TanStack Router's search params track active section for analytics.
- **Booking Overlay**: Not a route. Controlled by Redux Toolkit state. Opens/closes as component state. Back button closes overlay, does not navigate. Mounted/unmounted independently of routing.
- **Booking Confirmation (`/booking/confirmation`)**: IS a route because it represents a completed, shareable, bookmarkable action.
- **Service Detail Routes**: Use TanStack Router's `loader` function to prefetch data via TanStack Query before route transition. No loading spinner — data is preloaded. Invalid slugs redirect to 404.
- **Section Deep Links**: Hash-based (`/#artisans`). Root layout reads hash on mount and scrolls to corresponding section. Smooth scroll via Lenis.

---

## 4. Component Inventory

### Layout Components

| Component | File | Purpose |
|-----------|------|---------|
| `SectionWrapper` | `shared/layout/section-wrapper.tsx` | Wraps each narrative section with consistent padding, max-width, and semantic `<section>` element |
| `BreathingSpace` | `shared/layout/breathing-space.tsx` | Configurable viewport-height spacing between sections (40-60% standard, 100% for act breaks) |
| `ContentWidth` | `shared/layout/content-width.tsx` | Constrained content container (60-65% viewport on desktop, full-width on mobile) |
| `PageWrapper` | `shared/layout/page-wrapper.tsx` | Outermost page container for service detail pages |
| `ErrorBoundarySection` | `features/shared/error-boundary-section.tsx` | React Error Boundary wrapping individual sections, shows graceful fallback |

### Navigation Components

| Component | File | Purpose |
|-----------|------|---------|
| `Navigation` | `features/navigation/navigation.tsx` | Sticky navigation bar — scroll-aware (appears/disappears on scroll direction), holds brand mark + booking CTA |
| `NavLinks` | `features/navigation/nav-link.tsx` | Minimal navigation links (Services, Artisans, Contact) with anchor scroll behavior |
| `MobileMenu` | `features/navigation/mobile-menu.tsx` | Full-screen overlay for mobile navigation with brand typography and warm aesthetic |
| `MobileMenuToggle` | `features/navigation/mobile-menu.tsx` (sub) | Hamburger/close button with aria-expanded state |

### Hero Components

| Component | File | Purpose |
|-----------|------|---------|
| `HeroSection` | `features/hero/hero.tsx` | Full-viewport editorial hero image with Warm Unveiling animation |
| `WarmUnveiling` | `features/hero/hero.tsx` (sub) | The signature 1200-1500ms GSAP timeline reveal (80-90% opacity start, staggered background → text → CTA) |

### 3D Components

| Component | File | Purpose |
|-----------|------|---------|
| `AtmosphereCanvas` | Lazy-loaded React Three Fiber canvas | Volumetric light rays, warm atmospheric haze overlay on hero (P2 priority) |
| `HeroAtmosphere` | Lazy-loaded R3F scene | 3D atmospheric depth for hero section — volumetric light through golden haze |
| `Transformation3D` | Lazy-loaded R3F scene | Before/after as depth layers, scroll-linked (P2 priority) |
| `ClosingAmbient` | Lazy-loaded R3F scene | Warm particle movement, atmospheric glow for closing section (P2 priority) |

### Booking Components

| Component | File | Purpose |
|-----------|------|---------|
| `BookingInvitation` | `features/booking/booking-invitation.tsx` | Act III booking CTA section — "Your chair is waiting" with gold accent button |
| `BookingOverlay` | `features/booking/booking-overlay.tsx` | Slide-in overlay (40-50% desktop, full-screen mobile) orchestrating the 6-step flow |
| `BookingServiceStep` | `features/booking/booking-service-step.tsx` | Step 1: Service selection (Hair, Color, Bridal, Spa) |
| `BookingArtisanStep` | `features/booking/booking-artisan-step.tsx` | Step 2: Artisan selection with portrait gallery |
| `BookingCalendarStep` | `features/booking/booking-calendar-step.tsx` | Step 3: Date selection with real-time availability calendar |
| `BookingTimeStep` | `features/booking/booking-time-step.tsx` | Step 4: Time slot selection (morning/afternoon/evening groupings) |
| `BookingContactStep` | `features/booking/booking-contact-step.tsx` | Step 5: Contact information form (name, email, phone, notes) |
| `BookingConfirmationStep` | `features/booking/booking-confirmation-step.tsx` | Step 6: Appointment details, warm confirmation animation (800-1200ms) |
| `BookingProgress` | `features/booking/booking-progress.tsx` | Step progress indicator with aria-valuenow for screen readers |

### Gallery Components

| Component | File | Purpose |
|-----------|------|---------|
| `PortfolioGrid` | (P1, not V1 core) | Editorial portfolio grid with Warm Reveal hover effects |
| `PortfolioImage` | (P1, not V1 core) | Individual portfolio image with hover warmth interaction |
| `BeforeAfterSlider` | `features/transformation/before-after-slider.tsx` | Scroll-controlled before/after cross-dissolve for Transformation section |

### Service Components

| Component | File | Purpose |
|-----------|------|---------|
| `ServiceCard` | `shared/ui/card.tsx` (variant) | Primary service display — Hair, Color, Bridal, Spa variants |
| `ServicePage` | `features/service-detail/service-page.tsx` | Full service detail page layout |
| `ServiceHero` | `features/service-detail/service-hero.tsx` | Service-specific hero with editorial photography |
| `ServiceContent` | `features/service-detail/service-content.tsx` | Sensory copy, pricing, duration display |
| `ServiceCTA` | `features/service-detail/service-cta.tsx` | Booking CTA for service detail pages |
| `ServiceGallery` | `features/service-detail/service-gallery.tsx` | Additional images for service detail |

### Shared/Reusable Components

| Component | File | Purpose |
|-----------|------|---------|
| `SectionHeader` | `features/shared/section-header.tsx` | Section titles — numbered and unnumbered variants |
| `TestimonialCard` | `features/testimonials/testimonial-card.tsx` | Individual testimonial with attribution, star rating |
| `ArtisanCard` | `features/artisans/artisan-card.tsx` | Artisan portrait with name, title, specialty |
| `GiftCard` | `features/gift/gift-card.tsx` | Gift card display and purchase flow |

### Form Components

| Component | File | Purpose |
|-----------|------|---------|
| `Input` | `shared/ui/input.tsx` | Text input with label, error state, warm focus ring |
| `Select` | `shared/ui/select.tsx` | Dropdown select with brand styling |
| `Textarea` | `shared/ui/textarea.tsx` | Multi-line input for booking notes |
| `Calendar` | `shared/ui/calendar.tsx` | Month-view calendar with availability states (available/unavailable/selected) |
| `TimeSlotGrid` | `shared/ui/time-slot-grid.tsx` | Time slot selection grid with morning/afternoon/evening groupings |

### Button Components

| Component | File | Purpose |
|-----------|------|---------|
| `Button--primary` | `shared/ui/button.tsx` | Gold accent CTA — "Book your experience" |
| `Button--secondary` | `shared/ui/button.tsx` | Outlined variant for secondary actions |
| `Button--ghost` | `shared/ui/button.tsx` | Text-only variant for tertiary actions |

### Card Components

| Component | File | Purpose |
|-----------|------|---------|
| `Card` | `shared/ui/card.tsx` | Base card container with warm shadow, hover luminosity shift |
| `ServiceCard` | `shared/ui/card.tsx` (variant) | Service display card (Hair, Color, Bridal, Spa) |
| `ArtisanCard` | `features/artisans/artisan-card.tsx` | Artisan portrait card — NO hover state (deliberate stillness) |
| `TestimonialCard` | `features/testimonials/testimonial-card.tsx` | Testimonial with attribution |

### Typography Components

| Component | File | Purpose |
|-----------|------|---------|
| `DisplayHeading` | Inline via Tailwind config | Serif typeface at Display scale (Cormorant Garamond) |
| `SectionHeading` | Inline via Tailwind config | Serif typeface at Heading scale |
| `Subheading` | Inline via Tailwind config | Sans-serif at Subheading scale (DM Sans) |
| `BodyText` | Inline via Tailwind config | Sans-serif at Body scale |
| `Caption` | Inline via Tailwind config | Sans-serif at Caption scale |
| `MicroText` | Inline via Tailwind config | Sans-serif at Micro scale |

### Feedback Components

| Component | File | Purpose |
|-----------|------|---------|
| `ErrorMessage` | `shared/feedback/error-message.tsx` | Warm-toned error display with recovery action |
| `SuccessMessage` | `shared/feedback/success-message.tsx` | Warm-toned success confirmation |
| `LoadingIndicator` | `shared/feedback/loading-indicator.tsx` | Branded warm gold pulse (NO spinner) |
| `Toast` | `shared/feedback/toast.tsx` | Non-intrusive notification for transient states |

### Utility Components

| Component | File | Purpose |
|-----------|------|---------|
| `Modal` | `shared/ui/modal.tsx` | Accessible dialog with focus trap and keyboard management |
| `Overlay` | `shared/ui/overlay.tsx` | Backdrop overlay for modals and booking flow |
| `Accordion` | `shared/ui/accordion.tsx` | Expand/collapse for FAQ — single-expand behavior |
| `Badge` | `shared/ui/badge.tsx` | Status badges for booking states |
| `Separator` | `shared/ui/separator.tsx` | Minimal horizontal rule (warm-toned) |
| `Skeleton` | `shared/ui/skeleton.tsx` | Warm-colored loading placeholder (NOT shimmer) |
| `Tooltip` | `shared/ui/tooltip.tsx` | Contextual information on hover |

---

## 5. Feature Inventory

### P0 — Must-Have for Launch (55 features)

| ID | Feature | Category | Complexity | Dependencies |
|----|---------|----------|------------|-------------|
| F1.1 | Designed Loading Threshold | Landing | Medium | Hero image, brand mark asset |
| F1.2 | Warm Background as First Visual | Landing | Low | Color palette |
| F1.3 | Seamless Threshold-to-Hero Transition | Landing | Medium | F1.1, F2.1 (hero image) |
| F2.1 | Sticky Navigation Bar | Navigation | Medium | Booking flow, brand mark |
| F2.2 | Brand Mark in Navigation | Navigation | Low | Brand mark design asset |
| F2.4 | Mobile Navigation (Hamburger Menu) | Navigation | Medium | F2.1, animation system |
| F3.1 | Full-Viewport Hero Image | Hero | Medium | Original photography, image pipeline |
| F3.2 | Hero Image Warm Reveal | Hero | Medium | F3.1, animation system |
| F4.1 | Narrative Whisper (Thesis Section) | Storytelling | Low | Brand voice, serif typeface |
| F4.3 | Atmospheric Immersion Section | Storytelling | Medium | Original photography, scroll animation |
| F4.6 | Editorial Photography System | Storytelling | Very High | Photography production, budget |
| F6.1 | Scroll-Linked Content Reveals | Scroll | Medium | Animation rules, performance budget |
| F6.2 | Breathing Spaces Between Sections | Scroll | Low | Spacing scale |
| F6.4 | prefers-reduced-motion Support | Scroll | Low | Animation system |
| F7.1 | Hair Service Chapter | Services | Medium | Photography, service content |
| F7.2 | Color/Transformation Chapter | Services | High | Before/after photography, scroll animation |
| F7.5 | Service Breathing Spaces | Services | Low | Spacing scale |
| F8.1 | Service Pricing Display | Service Detail | Low | Pricing data |
| F10.1 | Artisan Portrait Gallery | Team | Medium | Artisan photography, artisan data |
| F11.1 | Testimonial Cascade | Testimonials | Medium | Real client testimonials, photography |
| F12.1 | Transparent Service Pricing | Pricing | Low | Pricing data |
| F13.1 | Booking CTA (Primary Button) | Booking | Low | Booking flow |
| F13.2 | Booking Flow (Multi-Step) | Booking | High | Service data, artisan data, availability |
| F13.3 | Booking Flow Slide-In Transition | Booking | Medium | F13.2, animation system |
| F13.4 | Booking Confirmation Moment | Booking | Medium | F13.2, appointment data |
| F13.5 | Booking Error Handling | Booking | Medium | F13.2, backend availability |
| F14.1 | Service Calendar Display | Calendar | High | Backend scheduling system |
| F14.2 | Date Selection Interaction | Calendar | Medium | F14.1, availability data |
| F15.1 | Real-Time Availability Data | Availability | Very High | Backend scheduling, Redis cache |
| F16.1 | Time Slot Selection | Time Slots | Medium | F14.1, F15.1, backend |
| F17.1 | Confirmation Details Display | Confirmation | Low | F13.2, appointment data |
| F17.2 | Email/SMS Confirmation | Confirmation | High | Email/SMS provider, BullMQ |
| F18.1 | Contact Information Display | Contact | Low | Business contact data |
| F19.1 | Location Display | Location | Low | Business address data |
| F21.1 | WCAG 2.1 AA Compliance | Accessibility | High | All features, testing tools |
| F21.2 | Keyboard Navigation | Accessibility | Medium | Semantic HTML, ARIA |
| F21.3 | Screen Reader Support | Accessibility | Medium | Semantic HTML, alt text |
| F21.4 | Reduced Motion Support | Accessibility | Low | CSS media query |
| F22.1 | LCP Under 2.5 Seconds | Performance | Very High | Image pipeline, CDN, fonts |
| F22.2 | CLS Under 0.1 | Performance | High | Image dimensions, font-display |
| F22.3 | Image Optimization Pipeline | Performance | High | Build pipeline, CDN |
| F22.4 | Font Loading Strategy | Performance | Medium | Font files, font-display |
| F22.5 | JavaScript Deferral | Performance | Medium | Bundling strategy |
| F23.1 | Semantic HTML Structure | SEO | Low | Development practice |
| F23.2 | Meta Tags and Open Graph | SEO | Low | Brand voice, OG image |
| F23.3 | Local SEO (NAP Consistency) | SEO | Medium | Business info, Google Business |
| F24.2 | Booking Funnel Tracking | Analytics | Medium | F13.2, analytics platform |
| F24.3 | Privacy-Respecting Analytics | Analytics | Low | Plausible/Fathom/Umami |
| F25.2 | Network Error States | Errors | Medium | F13.2 |
| F25.3 | Form Validation Errors | Errors | Low | F13.2 |
| F27.1 | Mobile-First Responsive Design | Mobile | High | All features, design system |
| F27.2 | Mobile Navigation | Mobile | Medium | Navigation structure |
| F27.3 | Mobile Touch Interactions | Mobile | Medium | All interactive features |
| F29.3 | Desktop Booking Flow | Desktop | Medium | F13.2, responsive design |

### P1 — Should-Have for Launch (30 features)

| ID | Feature | Category | Complexity | Dependencies |
|----|---------|----------|------------|-------------|
| F2.3 | Minimal Navigation Links | Navigation | Low | Section IDs, smooth scroll |
| F3.3 | Hero Image Parallax on Exit | Hero | Medium | F3.1, scroll animation |
| F4.2 | Word-by-Word Reveal Animation | Storytelling | Low | F4.1, scroll animation |
| F4.4 | Parallax Scrolling on Immersion Images | Storytelling | Medium | F4.3, scroll animation |
| F5.2 | Volumetric Light Bloom (Threshold) | 3D | Medium | F1.1, performance budget |
| F6.3 | Chapter Break Transitions | Scroll | Low | Breathing spaces |
| F7.3 | Bridal Service Chapter | Services | Medium | Bridal photography, animation overrides |
| F7.4 | Spa Service Chapter | Services | Medium | Spa photography |
| F8.2 | Service Duration Display | Service Detail | Low | Service data |
| F9.1 | Editorial Portfolio Grid | Gallery | Medium | Portfolio photography |
| F9.2 | Portfolio Image Hover (Warm Reveal) | Gallery | Low | F9.1, animation system |
| F10.2 | Artisan Reveal Animation | Team | Low | F10.1, animation system |
| F10.3 | Artisan Portrait Hover (Still Presence) | Team | Low | Interaction design rules |
| F15.2 | Availability Loading State | Availability | Low | Animation system, booking flow |
| F16.2 | Time Slot Interaction States | Time Slots | Low | Interaction design system |
| F18.2 | Click-to-Call (Mobile) | Contact | Low | F18.1 |
| F20.1 | FAQ Section | FAQ | Low | FAQ content |
| F20.2 | FAQ Expand/Collapse Interaction | FAQ | Low | F20.1, animation system |
| F22.6 | 3G Usability | Performance | High | All performance features |
| F24.1 | Page View and Scroll Tracking | Analytics | Medium | Analytics platform |
| F25.1 | 404 Page | Errors | Low | Brand design system |
| F26.1 | Booking Flow Loading States | Loading | Low | Animation system |
| F26.2 | Image Loading States | Loading | Low | Image pipeline |
| F27.4 | Mobile 3D Performance Optimization | Mobile | Medium | F5.1, performance testing |
| F28.1 | Tablet Responsive Layout | Tablet | Medium | All features, design system |
| F28.2 | Tablet Navigation | Tablet | Low | Navigation system |
| F29.1 | Desktop Responsive Layout | Desktop | Medium | All features, design system |
| F29.2 | Desktop Hover Interactions | Desktop | Low | Interaction design system |

### P2 — Nice-to-Have (4 features)

| ID | Feature | Category | Complexity | Dependencies |
|----|---------|----------|------------|-------------|
| F4.5 | Typographic Moments Between Immersion Images | Storytelling | Low | F4.3, brand vocabulary |
| F5.1 | Atmospheric 3D Depth Layer | 3D | High | WebGL, performance budget |
| F11.2 | Testimonial Staggered Cascade Animation | Testimonials | Low | F11.1, animation system |
| F19.2 | Map Integration | Location | Medium | Location data, Map API |

### P3 — Deferred to V2+ (9 features)

| ID | Feature | Category | Complexity | Dependencies |
|----|---------|----------|------------|-------------|
| F30.1 | Content Management System (TipTap) | Admin | Very High | Auth, content model |
| F30.2 | Booking Management Dashboard | Admin | Very High | Auth, booking system |
| F30.3 | Client Database | Admin | Very High | Booking, privacy compliance |
| F30.4 | Inventory/Product Management | Admin | High | E-commerce infrastructure |
| F31.1 | AI Chatbot (Multilingual) | AI | Very High | AI platform, knowledge base |
| F31.2 | AI Service Recommendation | AI | Very High | Analytics, ML |
| F31.3 | AI-Powered Virtual Try-On | AI | Very High | AI image processing |
| F31.4 | AI Content Generation | AI | High | Brand voice training |
| F31.5 | AI-Powered Scheduling Optimization | AI | Very High | Historical booking data, ML |

### Owner Assignment

| Owner Domain | Features |
|-------------|----------|
| **Frontend Architect** | All presentation layer features, animation architecture, component system, responsive design, accessibility |
| **Backend Engineer** | API endpoints, database schema, availability system, BullMQ jobs, Redis caching |
| **Design Lead** | Photography direction, typography system, color system, interaction design, brand consistency |
| **Content Lead** | Service copy, testimonials, artisan profiles, FAQ content, brand voice |
| **DevOps/Platform** | CDN deployment, CI/CD pipeline, performance monitoring, image optimization pipeline |

---

## 6. State Inventory

### Global State (Redux Toolkit)

| Slice | Key | Type | Persistence | Purpose |
|-------|-----|------|-------------|---------|
| `booking.isOpen` | `boolean` | `false` | Session | Whether the booking overlay is visible |
| `booking.currentStep` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | Session | Active booking flow step |
| `booking.selections.serviceId` | `string \| null` | `null` | Session | Selected service |
| `booking.selections.artisanId` | `string \| null` | `null` | Session | Selected artisan |
| `booking.selections.date` | `string \| null` | `null` | Session | Selected date (ISO 8601) |
| `booking.selections.timeSlot` | `string \| null` | `null` | Session | Selected time slot |
| `booking.contact.name` | `string` | `''` | Session | Client name |
| `booking.contact.email` | `string` | `''` | Session | Client email |
| `booking.contact.phone` | `string` | `''` | Session | Client phone |
| `booking.contact.notes` | `string` | `''` | Session | Special requests |
| `booking.isSubmitting` | `boolean` | `false` | Session | Submission in progress |
| `booking.error` | `string \| null` | `null` | Session | Submission error message |
| `ui.mobileMenuOpen` | `boolean` | `false` | Session | Mobile menu visibility |
| `ui.scrollSection` | `string` | `'hero'` | Session | Currently active section ID |
| `ui.isReducedMotion` | `boolean` | Computed | localStorage | User's motion preference |
| `features.threeDEnabled` | `boolean` | Computed | Session | Whether 3D layer is active |

### Server State (TanStack Query)

| Query Key | Stale Time | Cache Time | Data Source | Purpose |
|-----------|-----------|-----------|-------------|---------|
| `['services']` | 5 min | 30 min | GET /api/services | All services list |
| `['services', slug]` | 5 min | 30 min | GET /api/services/:slug | Single service detail |
| `['artisans']` | 5 min | 30 min | GET /api/artisans | All artisans list |
| `['artisans', id]` | 5 min | 30 min | GET /api/artisans/:id | Single artisan profile |
| `['testimonials']` | 5 min | 30 min | GET /api/testimonials | All testimonials |
| `['testimonials', {service: slug}]` | 5 min | 30 min | GET /api/testimonials?service=:slug | Service-specific testimonials |
| `['availability', artisanId, date]` | 30 sec | 5 min | GET /api/availability | Real-time time slots |
| `['gift-cards']` | 1 hour | 24 hours | GET /api/gift-cards | Gift card products |
| `['config']` | 1 hour | 24 hours | GET /api/config | Site configuration |

### Local State (Component-Level)

| Component | State | Type | Purpose |
|-----------|-------|------|---------|
| `Navigation` | `isVisible` | `boolean` | Scroll-direction-aware nav visibility |
| `MobileMenu` | `isAnimating` | `boolean` | Prevent double-tap during menu transition |
| `TransformationDissolve` | `scrollProgress` | `number (0-1)` | Scroll-linked clip-path progress |
| `Calendar` | `currentMonth` | `Date` | Currently displayed month |
| `Calendar` | `selectedDate` | `Date \| null` | Temporarily selected date before confirmation |
| `BookingContactStep` | `validationErrors` | `Record<string, string>` | Field-level validation state |
| `TestimonialCascade` | `activeIndex` | `number` | Currently visible testimonial in carousel variant |
| `Accordion` | `expandedId` | `string \| null` | Currently expanded FAQ item (single-expand) |
| `Image` | `loadStatus` | `'idle' \| 'loading' \| 'loaded' \| 'error'` | Progressive image loading state |

### URL State

| Parameter | Location | Type | Purpose |
|-----------|----------|------|---------|
| Hash (`#section`) | URL fragment | `string` | Section anchor for deep linking and smooth scroll |
| `?section=artisans` | Search param | `string` | Active section tracking for analytics (TanStack Router) |
| Route params (service slug) | Path param | `string` | Service detail page identification |

### Animation State

| System | State | Owner | Purpose |
|--------|-------|-------|---------|
| GSAP ScrollTrigger | Active instances | `lib/gsap-config.ts` | Track and manage active ScrollTrigger instances (max 5 below fold) |
| Lenis | Scroll position | `lib/lenis-config.ts` | Smooth scroll position, integrated with GSAP ScrollTrigger |
| GSAP Timeline | Hero reveal progress | `features/hero/` | Warm Unveiling animation state |
| GSAP Timeline | Closing animation progress | `features/closing/` | Golden Return ambient animation state |
| ScrollTrigger | Section visibility | `shared/hooks/animation/use-section-tracking.ts` | Which section is in viewport for nav highlighting |

### 3D State

| State | Owner | Purpose |
|-------|-------|---------|
| `is3DEnabled` | `lib/gsap-config.ts` (computed) | Whether to render 3D layer based on device capabilities |
| Canvas `frameloop` | React Three Fiber | Demand-based rendering — only renders when scene changes |
| `deviceMemory` | Feature detection | GPU/memory capability for 3D fallback decisions |

### Form State

| Form | State | Owner | Purpose |
|------|-------|-------|---------|
| Booking Contact | `name`, `email`, `phone`, `notes` | Redux `booking.contact` | Contact information for booking submission |
| Booking Contact | `errors` | Component local | Field-level validation errors |
| Booking Contact | `isSubmitting` | Redux `booking.isSubmitting` | Submission lock |
| Gift Card Purchase | `amount`, `recipient`, `message` | Component local | Gift card purchase form |
| Gift Card Purchase | `isProcessing` | Component local | Purchase processing state |

---

## 7. External Integrations

### Frontend Dependencies

| Package | Version | Purpose | Loading Strategy |
|---------|---------|---------|-----------------|
| `react` | 18.x | UI framework | Critical path (initial bundle) |
| `react-dom` | 18.x | DOM rendering | Critical path |
| `@tanstack/react-router` | latest | File-based routing, type-safe params | Critical path (route matching) |
| `@tanstack/react-query` | latest | Server state management, caching | Critical path |
| `@reduxjs/toolkit` | latest | Client state management (booking, UI) | Critical path |
| `react-redux` | latest | Redux React bindings | Critical path |
| `gsap` | 3.x | Scroll-linked animations, timelines | Deferred (below-fold) |
| `@gsap/react` | latest | React integration for GSAP | Deferred |
| `lenis` | latest | Smooth scroll behavior | Deferred |
| `framer-motion` | latest | Component micro-interactions (limited) | Lazy (booking overlay, mobile menu) |
| `@react-three/fiber` | latest | React Three.js renderer | Lazy (3D, P2 priority) |
| `@react-three/drei` | latest | R3F helpers and abstractions | Lazy (3D) |
| `three` | latest | 3D rendering engine | Lazy (3D) |
| `class-variance-authority` | latest | Component variant management | Critical path (small) |
| `clsx` | latest | Conditional class joining | Critical path (tiny) |
| `tailwind-merge` | latest | Tailwind class deduplication | Critical path (tiny) |
| `zod` | latest | Runtime schema validation | Critical path (form validation) |

### Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | 4.x/5.x | HTTP server and routing |
| `drizzle-orm` | latest | Type-safe ORM for PostgreSQL |
| `drizzle-kit` | latest | Migration generation and management |
| `pg` / `postgres` | latest | PostgreSQL driver |
| `ioredis` | latest | Redis client for caching |
| `bullmq` | latest | Job queue for background processing |
| `zod` | latest | Request validation |
| `cors` | latest | CORS middleware |
| `helmet` | latest | Security headers |
| `express-rate-limit` | latest | Rate limiting (100 req/min per IP) |
| `pino` | latest | Structured JSON logging |

### Build & Development Dependencies

| Package | Purpose |
|---------|---------|
| `vite` | Build tool and dev server |
| `typescript` | TypeScript compiler (strict mode) |
| `tailwindcss` | Utility-first CSS framework (v4) |
| `postcss` | CSS processing |
| `autoprefixer` | Vendor prefixing |
| `eslint` | Code linting |
| `prettier` | Code formatting |
| `vitest` | Unit and integration testing |
| `playwright` | End-to-end testing |
| `@testing-library/react` | React component testing |
| `@testing-library/jest-dom` | DOM assertion matchers |
| `axe-core` | Accessibility testing |
| `lighthouse-ci` | Performance auditing |
| `vite-plugin-visualizer` | Bundle size analysis |
| `turbo` | Monorepo build orchestration |
| `pnpm` | Package manager |

### External Services

| Service | Purpose | Priority | Loading Strategy |
|---------|---------|----------|-----------------|
| **Plausible Analytics** (or Fathom/Umami) | Privacy-respecting web analytics | P0 | `<script defer>` in head, no cookies |
| **PostgreSQL Database** | Primary data store | P0 | Direct connection via Drizzle |
| **Redis** | Caching layer (availability slots, rate limiting) | P0 | Connection pool |
| **Email Service** (V2: SendGrid/Resend) | Booking confirmation emails | P0 (V1: on-screen only), V2 | BullMQ job processor |
| **SMS Service** (V2: Twilio) | Booking confirmation SMS | P2 (V1: on-screen only), V2 | BullMQ job processor |
| **Google Business Profile** | Local SEO (NAP consistency) | P0 (external management, not API) | Manual |
| **CDN** (Vercel/Cloudflare Pages/Netlify) | Static asset serving, edge caching | P0 | Deployment target |

### APIs Consumed

| API | Endpoint | Method | Purpose |
|-----|----------|--------|---------|
| Internal | `/api/services` | GET | List all services |
| Internal | `/api/services/:slug` | GET | Single service detail |
| Internal | `/api/artisans` | GET | List all artisans |
| Internal | `/api/artisans/:id` | GET | Single artisan profile |
| Internal | `/api/artisans/:id/services` | GET | Services by artisan |
| Internal | `/api/testimonials` | GET | List testimonials |
| Internal | `/api/availability` | GET | Check time slots |
| Internal | `/api/bookings` | POST | Create a booking |
| Internal | `/api/bookings/:id` | GET | Retrieve booking |
| Internal | `/api/bookings/:id/cancel` | POST | Cancel a booking |
| Internal | `/api/gift-cards` | GET | List gift card products |
| Internal | `/api/gift-cards/purchase` | POST | Purchase a gift card |
| Internal | `/api/config` | GET | Site configuration |

---

## 8. Build Order

### Phase 0: Foundation (Week 1-2)

| # | Task | Deliverables |
|---|------|-------------|
| 0.1 | Initialize pnpm monorepo with Turborepo | Root `package.json`, `turbo.json`, `tsconfig.base.json`, workspace config |
| 0.2 | Scaffold `packages/shared` | Type definitions (Service, Artisan, Testimonial, Booking, Availability, GiftCard, ApiResponse), constants |
| 0.3 | Scaffold `packages/db` | Drizzle schema (7 tables), migrations config, seed data structure |
| 0.4 | Scaffold `packages/api` | Express server, middleware stack, health check endpoint, Docker config |
| 0.5 | Scaffold `apps/web` | Vite + React 18 + TypeScript, Tailwind CSS v4, TanStack Router (file-based), entry HTML |
| 0.6 | Configure shared tooling | ESLint, Prettier, tsconfig presets, Git hooks (husky + lint-staged) |
| 0.7 | Set up CI/CD pipeline | Lint → Type check → Unit test → Build → Deploy (staging) |
| 0.8 | Configure environment variables | `.env.example` for all packages, database connection strings, Redis URL |

### Phase 1: Backend Core (Week 3-4)

| # | Task | Deliverables |
|---|------|-------------|
| 1.1 | PostgreSQL database setup | Database creation, connection pool, Drizzle config |
| 1.2 | Run initial migrations | All 7 tables created and seeded with sample data |
| 1.3 | Service API endpoints | `GET /api/services`, `GET /api/services/:slug` |
| 1.4 | Artisan API endpoints | `GET /api/artisans`, `GET /api/artisans/:id`, `GET /api/artisans/:id/services` |
| 1.5 | Testimonial API endpoints | `GET /api/testimonials` with pagination and service filter |
| 1.6 | Configuration API | `GET /api/config` (hours, contact, address) |
| 1.7 | Availability calculation service | Server-side slot calculation (accounts for bookings, exceptions, duration, hours) |
| 1.8 | Redis caching layer | Cache availability slots, invalidate on booking create/cancel |
| 1.9 | Availability API endpoint | `GET /api/availability` with Redis caching |
| 1.10 | Booking API endpoints | `POST /api/bookings`, `GET /api/bookings/:id`, `POST /api/bookings/:id/cancel` |
| 1.11 | BullMQ job queue setup | `booking.created`, `booking.cancelled`, `gift-card.purchased` job processors |
| 1.12 | Gift card API endpoints | `GET /api/gift-cards`, `POST /api/gift-cards/purchase` |
| 1.13 | Rate limiting middleware | 100 req/min per IP, 10 bookings/hour per email |
| 1.14 | Error handling middleware | Structured error responses (`{ error: { code, message, details? } }`) |

### Phase 2: Frontend Foundation (Week 4-5)

| # | Task | Deliverables |
|---|------|-------------|
| 2.1 | TanStack Router configuration | Root layout, route tree, file-based routing |
| 2.2 | Provider composition | Redux Provider, TanStack Query Provider, Animation Provider |
| 2.3 | Global styles and design tokens | Tailwind theme (warm palette, typography scale, spacing scale, shadows, radius) |
| 2.4 | Font loading strategy | Self-hosted Cormorant Garamond + DM Sans, `font-display: swap`, preloading |
| 2.5 | GSAP + ScrollTrigger setup | Plugin registration, Lenis integration, `useReducedMotion` hook |
| 2.6 | Redux store configuration | `booking` slice, `ui` slice, `features` slice |
| 2.7 | TanStack Query client configuration | Default stale time, retry logic, error handlers |
| 2.8 | Analytics integration | Plausible/Fathom script, page view tracking |

### Phase 3: Shared Components (Week 5-6)

| # | Task | Deliverables |
|---|------|-------------|
| 3.1 | Button component | Three variants (primary/secondary/ghost), all states (default/hover/focus/active/disabled/loading) |
| 3.2 | Card component | Base card with warm shadow, hover luminosity shift |
| 3.3 | Input/Select/Textarea components | With labels, error states, warm focus ring |
| 3.4 | Modal and Overlay components | Focus trap, keyboard management, Framer Motion transitions |
| 3.5 | Layout components | SectionWrapper, BreathingSpace, ContentWidth, PageWrapper |
| 3.6 | Feedback components | ErrorMessage, SuccessMessage, LoadingIndicator (warm gold pulse) |
| 3.7 | Accordion component | Single-expand behavior, smooth animation |
| 3.8 | Calendar component | Month view, availability states, date selection |
| 3.9 | TimeSlotGrid component | Morning/afternoon/evening groupings, selection states |
| 3.10 | Custom hook: `useScrollReveal` | Scroll-triggered fade-in with configurable threshold, direction, once behavior |
| 3.11 | Custom hook: `useParallax` | Parallax depth effect (80% scroll speed, 15-20% differential max) |
| 3.12 | Custom hook: `useReducedMotion` | Detect `prefers-reduced-motion`, update on change |
| 3.13 | Custom hook: `useSectionTracking` | Track active section for navigation highlighting |
| 3.14 | Custom hook: `useMobileMenu` | Mobile menu toggle with focus management |
| 3.15 | Custom hook: `useScrollDirection` | Detect scroll up/down for sticky navigation |
| 3.16 | Custom hook: `useBookingFlow` | Booking state machine actions (next, back, select, reset) |
| 3.17 | Data hooks | `useServices`, `useServiceDetail`, `useArtisans`, `useTestimonials`, `useAvailability`, `useCreateBooking` |

### Phase 4: Navigation and Shell (Week 6-7)

| # | Task | Deliverables |
|---|------|-------------|
| 4.1 | Root layout (`__root.tsx`) | Providers, Lenis initialization, GSAP setup, skip-to-content link |
| 4.2 | Sticky Navigation component | Scroll-aware visibility, brand mark, nav links, booking CTA |
| 4.3 | Mobile Navigation component | Full-screen overlay, hamburger toggle, focus trap, aria-expanded |
| 4.4 | Footer component | Contact info, hours, address, social links, legal notices |
| 4.5 | Scroll-to-section behavior | Hash-based smooth scroll via Lenis |
| 4.6 | Deep linking support | Read hash on mount, scroll to corresponding section |

### Phase 5: Homepage Narrative Sections (Week 7-10)

| # | Task | Deliverables |
|---|------|-------------|
| 5.1 | Threshold feature | Designed loading threshold — warm background → atmospheric element → hero dissolve |
| 5.2 | Hero feature | Full-viewport hero image + Warm Unveiling GSAP timeline (1200-1500ms) |
| 5.3 | Narrative Whisper feature | Thesis headline + supporting line, word-by-word reveal animation |
| 5.4 | Atmosphere feature | 2-4 full-bleed editorial images, scroll-linked parallax, typographic moments |
| 5.5 | Breathing Space component | Configurable viewport-height spacing between sections and acts |
| 5.6 | Homepage composition | Assemble all 16 sections in three-act order: Prologue → Act I → Breathing → Act II → Long Breathing → Act III → Footer |
| 5.7 | Section reveal system | `useScrollReveal` applied to all narrative sections |
| 5.8 | Section tracking integration | Active section updates Redux → Navigation highlights |

### Phase 6: Service Sections (Week 10-11)

| # | Task | Deliverables |
|---|------|-------------|
| 6.1 | Hair service section | Editorial photography, sensory copy, pricing display, artisan connection |
| 6.2 | Transformation/Color section | Before/after images, scroll-controlled Transformation Dissolve (`clip-path` + ScrollTrigger scrub) |
| 6.3 | Bridal service section | Slowest reveal animations (50% speed), Morning Light mood, ceremonial tone |
| 6.4 | Spa service section | Gentlest motion, Evening Warmth mood, sensory imagery |
| 6.5 | Service breathing spaces | 40-60% viewport spacing between service chapters |

### Phase 7: Artisans and Testimonials (Week 11-12)

| # | Task | Deliverables |
|---|------|-------------|
| 7.1 | Artisan portrait gallery | Large editorial portraits, name/title/specialty, no hover state |
| 7.2 | Artisan reveal animation | Portrait fade-in → 200ms delay → specialty text |
| 7.3 | Testimonial cascade | 4-6 named testimonials, staggered scroll-linked cascade, emotional arc ordering |
| 7.4 | Testimonial card component | Attribution, star rating, real client photography |

### Phase 8: Booking Flow (Week 12-14)

| # | Task | Deliverables |
|---|------|-------------|
| 8.1 | Booking invitation section | Act III CTA — "Your chair is waiting" + gold accent button |
| 8.2 | Booking overlay shell | Slide-in panel (40-50% desktop, full-screen mobile), Framer Motion transitions |
| 8.3 | Booking progress indicator | Step progress bar with aria-valuenow |
| 8.4 | Step 1: Service selection | Service cards with brand imagery |
| 8.5 | Step 2: Artisan selection | Artisan portraits with selection state |
| 8.6 | Step 3: Date selection | Calendar component with real-time availability integration |
| 8.7 | Step 4: Time slot selection | Time slot grid with availability states |
| 8.8 | Step 5: Contact form | Name, email, phone, notes — with validation |
| 8.9 | Step 6: Confirmation | Appointment details, Warm Confirmation animation (800-1200ms) |
| 8.10 | Booking submission flow | Redux dispatch → TanStack Query mutation → API call → cache invalidation → success state |
| 8.11 | Booking error handling | Network errors, validation errors, availability conflicts — all with recovery paths |
| 8.12 | Booking confirmation route | `/booking/confirmation` page with appointment details |
| 8.13 | Back button behavior | Closes booking overlay, does not navigate away |

### Phase 9: Service Detail Pages (Week 14-15)

| # | Task | Deliverables |
|---|------|-------------|
| 9.1 | Service detail layout | Back navigation, breadcrumbs, consistent page structure |
| 9.2 | `/services/hair` page | Hero, sensory copy, pricing, gallery, artisan connections, booking CTA |
| 9.3 | `/services/color` page | Transformation imagery, process images, client quotes, pricing |
| 9.4 | `/services/bridal` page | Cinematic narrative, package details, emotional storytelling |
| 9.5 | `/services/spa` page | Sensory imagery, treatment menu, wellness focus |
| 9.6 | Route loaders | TanStack Router loaders prefetching data before route transitions |
| 9.7 | 404 page | Branded error page with warm message and navigation links |

### Phase 10: Gift Card Feature (Week 15-16)

| # | Task | Deliverables |
|---|------|-------------|
| 10.1 | Gift card section | "Gift an experience" section within Act III |
| 10.2 | Gift card purchase flow | Amount selection, recipient details, purchase confirmation |
| 10.3 | Gift card API integration | `POST /api/gift-cards/purchase` with BullMQ job |

### Phase 11: Performance Optimization (Week 16-17)

| # | Task | Deliverables |
|---|------|-------------|
| 11.1 | Image optimization pipeline | AVIF → WebP → JPEG generation, responsive srcset, blur placeholders |
| 11.2 | Hero image preloading | `<link rel="preload">`, `fetchpriority="high"`, explicit dimensions |
| 11.3 | Code splitting | Route-level splitting, below-fold deferred loading, 3D lazy loading |
| 11.4 | Critical CSS extraction | Above-fold styles inlined in HTML |
| 11.5 | Bundle optimization | Tree shaking verification, `vite-plugin-visualizer` analysis |
| 11.6 | Font optimization | Subset fonts, preload critical files, `font-display: swap` |
| 11.7 | Performance audit | Lighthouse CI integration, Core Web Vitals verification (LCP < 2.5s, INP < 200ms, CLS < 0.1) |

### Phase 12: Accessibility Audit (Week 17-18)

| # | Task | Deliverables |
|---|------|-------------|
| 12.1 | axe-core integration | Automated accessibility checks in CI/CD |
| 12.2 | Keyboard navigation audit | Full booking flow completable via keyboard |
| 12.3 | Screen reader testing | VoiceOver (macOS), NVDA (Windows) — all sections, all flows |
| 12.4 | Color contrast verification | All text/background combinations meet 4.5:1 minimum |
| 12.5 | Reduced motion testing | All animations disabled, content fully accessible |
| 12.6 | Focus management audit | Focus trap in booking overlay, focus restoration on close |
| 12.7 | Touch target audit | All interactive elements 44×44px minimum |

### Phase 13: Testing (Week 18-19)

| # | Task | Deliverables |
|---|------|-------------|
| 13.1 | Unit tests (Vitest) | Pure functions, custom hooks, Redux reducers/selectors |
| 13.2 | Integration tests (RTL) | Component rendering, booking flow steps, form validation, error states |
| 13.3 | E2E tests (Playwright) | Homepage load, scroll through sections, full booking flow, 404, mobile menu |
| 13.4 | API tests | All endpoints, error cases, rate limiting, validation |
| 13.5 | Performance tests | Lighthouse CI thresholds, bundle size budgets |

### Phase 14: Deployment (Week 19-20)

| # | Task | Deliverables |
|---|------|-------------|
| 14.1 | Production database setup | PostgreSQL provisioning, migrations, seed data |
| 14.2 | Redis provisioning | Production Redis instance for caching |
| 14.3 | Frontend deployment | Vercel/Cloudflare Pages/Netlify — static assets, edge CDN |
| 14.4 | Backend deployment | Railway/Render/Fly.io — Express server, BullMQ workers |
| 14.5 | DNS and SSL | Domain configuration, TLS certificates |
| 14.6 | CDN configuration | Brotli compression, cache headers (immutable for JS/CSS/fonts, 1 month for images) |
| 14.7 | Monitoring setup | Error tracking, uptime monitoring, Core Web Vitals tracking |
| 14.8 | SEO validation | Sitemap.xml, robots.txt, meta tags, structured data, local SEO audit |
| 14.9 | Production smoke test | Full booking flow, all routes, performance verification |

### Phase 15: 3D Enhancement (Week 20-21, P2)

| # | Task | Deliverables |
|---|------|-------------|
| 15.1 | 3D performance gate | Device detection, memory check, viewport check, reduced motion check |
| 15.2 | Hero atmosphere scene | Volumetric light rays, warm atmospheric haze |
| 15.3 | Closing ambient scene | Warm particle movement, atmospheric glow |
| 15.4 | 3D lazy loading | React Three Fiber in separate chunk, `Suspense` with null fallback |
| 15.5 | 3D fallback verification | Experience is complete and beautiful without 3D |

### Phase 16: Pre-Launch Polish (Week 21-22)

| # | Task | Deliverables |
|---|------|-------------|
| 16.1 | Cross-browser testing | Chrome, Safari, Firefox, Edge — desktop and mobile |
| 16.2 | Device testing | iOS Safari, Android Chrome, iPad, desktop |
| 16.3 | Content review | All copy, images, pricing, contact information verified |
| 16.4 | Analytics verification | Event tracking, funnel tracking, scroll depth working |
| 16.5 | Legal compliance | Privacy policy, terms, cookie notice (minimal) |
| 16.6 | Final performance audit | Lighthouse 90+ on mobile, all Core Web Vitals passing |
| 16.7 | Final accessibility audit | WCAG 2.1 AA confirmed, all testing complete |

---

*This blueprint is derived from all 17 approved planning documents. Every entry is traceable to its source document. No feature, component, or architectural decision has been invented — only organized and structured for engineering execution.*

*Document prepared: July 2026*
*Source: TECHNICAL_ARCHITECTURE.md, ARCHITECTURE_DECISIONS.md, PRODUCT_VISION.md, FEATURE_DEFINITION.md, INFORMATION_ARCHITECTURE.md, USER_FLOWS.md, DESIGN_SYSTEM.md, DESIGN_SYSTEM_DECISIONS.md, EXPERIENCE_STORYBOARD.md, SCROLL_STORY.md, EMOTIONAL_TIMELINE.md, INTERACTION_TIMELINE.md, SIGNATURE_MOMENTS.md, SECTION_PURPOSE.md, CREATIVE_DIRECTION.md, COMPETITOR_RESEARCH.md, MOODBOARD.md, DESIGN_LANGUAGE.md, VISUAL_RULES.md*

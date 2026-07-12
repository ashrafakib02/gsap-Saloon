# TECHNICAL_ARCHITECTURE.md

> "Every architectural decision exists to protect one thing: the visitor's emotional journey. The codebase is not the product — the experience is. Every folder, every abstraction, every pattern exists so that a developer can change a timing value, swap a photograph, or add a service without accidentally breaking the Transformation Dissolve."

---

## Table of Contents

1. [Overall Architecture](#1-overall-architecture)
2. [Folder Philosophy](#2-folder-philosophy)
3. [Feature-First vs Layer-First Reasoning](#3-feature-first-vs-layer-first-reasoning)
4. [Route Organization](#4-route-organization)
5. [Component Organization](#5-component-organization)
6. [State Management Philosophy](#6-state-management-philosophy)
7. [API Architecture](#7-api-architecture)
8. [Animation Architecture](#8-animation-architecture)
9. [3D Architecture](#9-3d-architecture)
10. [Asset Organization](#10-asset-organization)
11. [Hooks Philosophy](#11-hooks-philosophy)
12. [Error Handling Philosophy](#12-error-handling-philosophy)
13. [Loading Strategy](#13-loading-strategy)
14. [SEO Strategy](#14-seo-strategy)
15. [Performance Strategy](#15-performance-strategy)
16. [Accessibility Strategy](#16-accessibility-strategy)
17. [Testing Philosophy](#17-testing-philosophy)
18. [Future Scalability](#18-future-scalability)
19. [Monorepo Philosophy](#19-monorepo-philosophy)
20. [Coding Conventions](#20-coding-conventions)

---

## 1. Overall Architecture

### 1.1 Why This Section Exists

Every project begins with a thousand decisions. Most teams make them ad hoc, scattered across PRs and Slack messages and "I thought we agreed on this." This document captures the architectural spine — the decisions that shape everything downstream. If a developer joins the project in year three, this section answers: "Why is the codebase shaped this way?"

### 1.2 The Architecture in One Sentence

A single-page narrative website with 16 scroll-driven sections, 4 service detail child pages, and a 6-step booking overlay — powered by React 18, animated with GSAP ScrollTrigger + Lenis smooth scroll, managed with Redux Toolkit (UI state) and TanStack Query (server state), routed with TanStack Router, styled with Tailwind CSS v4, and backed by Express + PostgreSQL + Redis.

### 1.3 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        VISITOR                              │
│                    (Browser / Mobile)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React 18 + Vite)                 │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ TanStack │ │  Redux   │ │   GSAP   │ │ React Three   │  │
│  │  Router  │ │  Toolkit │ │ ScrollTr.│ │   Fiber + Drei│  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ TanStack │ │ Tailwind │ │  Lenis   │ │    TipTap     │  │
│  │  Query   │ │  CSS v4  │ │ Smooth   │ │  (Future CMS) │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
│  ┌──────────┐ ┌──────────┐                                  │
│  │Framer M. │ │          │                                  │
│  │(Limited) │ │          │                                  │
│  └──────────┘ └──────────┘                                  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API + WebSocket (availability)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                         │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Express │ │  Drizzle │ │  Redis   │ │   BullMQ      │  │
│  │  Router  │ │   ORM    │ │  Cache   │ │  Job Queue    │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────┘  │
│  ┌──────────┐ ┌──────────┐                                  │
│  │PostgreSQL│ │          │                                  │
│  │ Database │ │          │                                  │
│  └──────────┘ └──────────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 Architectural Principles

These principles are derived from the approved planning documents. They are immutable. They are not suggestions — they are the foundation.

**Principle 1: The Experience Is the Architecture.**
The codebase structure must mirror the narrative structure. The three-act dramatic structure (Invitation → Experience → Commitment) is not just a design concept — it is an architectural constraint. Every folder, every route, every component boundary should make it obvious which act a piece of code belongs to.

**Principle 2: Mobile-First Is Not a Strategy — It's the Default.**
Eighty percent-plus of the target audience encounters this brand on mobile first. The architecture must be built mobile-first at every layer: component composition, CSS specificity, animation complexity, image loading, and touch interaction. Desktop is the enhancement, not the other way around.

**Principle 3: Server State and Client State Are Different Animals.**
Data from the API (services, artisans, availability, testimonials) is server state — managed by TanStack Query with caching, revalidation, and background updates. Application state (booking flow progress, UI toggles, scroll position, animation state) is client state — managed by Redux Toolkit. These two concerns must never be conflated.

**Principle 4: Animation Is Infrastructure, Not Decoration.**
GSAP ScrollTrigger + Lenis smooth scroll form the animation backbone. Every scroll-linked animation — the Warm Unveiling, the Transformation Dissolve, section reveals, parallax — runs through this infrastructure. Animation code is not sprinkled into components. It is architected, tested, and version-controlled like any other critical system.

**Principle 5: The Codebase Must Survive Human Turnover.**
"Think like someone designing a codebase that will still be maintainable in five years." Every architectural decision must pass this test: Can a new developer understand why this folder exists, why this state lives here, and why this animation works this way — without asking anyone? Documentation is not optional. Naming is not arbitrary.

### 1.5 Technology Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | React 18 | Concurrent features, Suspense, community ecosystem |
| **Build** | Vite | Fast HMR, ESM-native, minimal config |
| **Language** | TypeScript | Type safety, IDE support, refactoring confidence |
| **Styling** | Tailwind CSS v4 | Utility-first, design token integration, zero-runtime CSS |
| **Routing** | TanStack Router | File-based, type-safe, search param validation, layout routes |
| **Server State** | TanStack Query | Caching, background refetch, optimistic updates, stale-while-revalidate |
| **Client State** | Redux Toolkit | Booking flow, UI state, animation state, feature flags |
| **Rich Text** | TipTap | Future CMS/admin content editing (V2+) |
| **3D** | React Three Fiber + Drei | Atmospheric 3D effects, volumetric light, warm haze |
| **Scroll Animation** | GSAP + ScrollTrigger | Industry-standard scroll-linked animation, pinned sections, scrub |
| **Smooth Scroll** | Lenis | Performant smooth scrolling, integrates with GSAP |
| **Micro Animation** | Framer Motion (limited) | Component-level transitions where GSAP is unnecessary |
| **Backend** | Express | Lightweight, flexible, well-understood |
| **Database** | PostgreSQL | ACID compliance, JSON support, mature ecosystem |
| **ORM** | Drizzle ORM | Type-safe, lightweight, SQL-like API, excellent TS integration |
| **Cache** | Redis | Session caching, availability caching, rate limiting |
| **Job Queue** | BullMQ | Email/SMS confirmation, background processing, retry logic |
| **Analytics** | Plausible/Fathom/Umami | Privacy-respecting, no cookies, GDPR compliant |

### 1.6 What This Architecture Does Not Do

This architecture explicitly excludes:
- Server-side rendering (SSR) — the homepage is a client-rendered narrative experience; SEO for child pages uses static generation or lightweight SSR where needed
- Monolithic state management — server state lives in TanStack Query, not Redux
- Component-level animation mixing — GSAP owns scroll animations, Framer Motion owns component micro-animations, never both on the same element
- Feature flags for A/B testing — the experience is curated, not optimized by committee (V2+)
- Real-time collaboration — single-user booking flow, no multiplayer
- Multi-language in V1 — English only (French/Arabic deferred to V2)

---

## 2. Folder Philosophy

### 2.1 Why This Section Exists

A folder structure is a communication device. It tells developers where to find things, where to put new things, and why things are separated. The wrong folder structure creates confusion that compounds daily. The right one makes the codebase feel inevitable — "of course it's here."

### 2.2 Core Philosophy: Narrative-Aligned, Not Technology-Aligned

Most React projects organize by technology: `/components`, `/hooks`, `/utils`, `/styles`. This works for CRUD applications. It does not work for a narrative experience where the relationship between sections matters more than the technology implementing them.

This project organizes by **narrative concern** with technology sub-organization where it prevents ambiguity. A developer working on the Transformation Dissolve should find all related code — component, animation hook, scroll configuration, image assets — in a place that makes narrative sense.

### 2.3 Top-Level Structure

```
/
├── apps/
│   └── web/                        # The primary frontend application
│       ├── src/
│       │   ├── app/                # Application shell, providers, router
│       │   ├── features/           # Feature modules (narrative-aligned)
│       │   ├── shared/             # Shared components, hooks, utils
│       │   ├── assets/             # Static assets (images, fonts, icons)
│       │   ├── styles/             # Global styles, Tailwind config, tokens
│       │   ├── types/              # Shared TypeScript types
│       │   └── lib/                # Third-party library configuration
│       ├── public/                 # Public static files (favicon, robots.txt)
│       ├── index.html
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── packages/
│   ├── api/                        # Express backend
│   │   ├── src/
│   │   │   ├── routes/             # API route handlers
│   │   │   ├── middleware/         # Auth, validation, error handling
│   │   │   ├── services/           # Business logic
│   │   │   ├── db/                 # Drizzle schema, migrations
│   │   │   ├── jobs/               # BullMQ job definitions
│   │   │   └── lib/                # Shared utilities
│   │   └── package.json
│   │
│   ├── shared/                     # Shared types and constants
│   │   ├── src/
│   │   │   ├── types/              # TypeScript interfaces shared FE↔BE
│   │   │   └── constants/          # Shared constants (status codes, etc.)
│   │   └── package.json
│   │
│   └── db/                         # Database package
│       ├── src/
│       │   ├── schema/             # Drizzle schema definitions
│       │   ├── migrations/         # Generated migrations
│       │   └── seeds/              # Seed data
│       └── package.json
│
├── docs/                           # Project documentation
│   ├── designSystem/
│   ├── codebaseOrganize/
│   ├── creativeDirection/
│   ├── experienceStoryboard/
│   ├── fd&Ts/
│   ├── informationArchitecture/
│   └── userFlows/
│
├── package.json                    # Root workspace config
├── turbo.json                      # Build orchestration
└── tsconfig.base.json              # Shared TypeScript config
```

### 2.4 Why This Structure

**The `apps/` directory contains runnable applications.** Currently, one: the web frontend. If a mobile app or admin dashboard is added later (V2/V3), it lives here alongside. This prevents the frontend from becoming a dumping ground for "we'll add mobile later."

**The `packages/` directory contains shared, publishable code.** The API, shared types, and database schema are packages that multiple apps might consume. The API package could theoretically serve a mobile app in the future. The shared types package prevents frontend-backend type drift.

**The `docs/` directory is a first-class citizen, not an afterthought.** The planning documents live here because the project treats documentation as architecture. A developer who reads the docs understands not just what the code does but why it exists.

### 2.5 Naming Rules for Folders

- **Lowercase with hyphens** for all folder names: `booking-flow/`, not `bookingFlow/` or `booking_flow/`
- **Plural nouns** for containers: `features/`, `components/`, `hooks/`
- **Singular nouns** for specific instances: `service-card.tsx`, not `service-cards.tsx`
- **Feature folders** named after their narrative role: `hero/`, `transformation/`, `artisans/` — not `hero-section/`, `color-service/`, `team/`

---

## 3. Feature-First vs Layer-First Reasoning

### 3.1 Why This Section Exists

The feature-first vs layer-first decision is the single most impactful architectural choice for codebase maintainability. Getting this wrong creates either scattered concerns (layer-first) or duplicated infrastructure (feature-first). This section documents the decision and its reasoning.

### 3.2 The Decision: Hybrid — Feature-First at the Top, Layer-First Within Features

This project uses a **hybrid approach**:

**Feature-first at the top level** — the `features/` directory contains modules organized by narrative concern:

```
features/
├── threshold/          # Prologue — first impression
├── hero/               # Hero image + Warm Unveiling
├── narrative-whisper/  # Brand story section
├── atmosphere/         # Environmental photography
├── breathing-space/    # Act transitions (reusable)
├── hair/               # Craft: Hair service section
├── transformation/     # Transformation: Color + Dissolve
├── bridal/             # Ceremony: Bridal section
├── spa/                # Sanctuary: Spa section
├── artisans/           # Team profiles section
├── testimonials/       # Chorus of Proof section
├── booking/            # Booking invitation + overlay
├── gift/               # Gift card experience
├── closing/            # Closing Image + Golden Return
├── footer/             # Footer
├── navigation/         # Sticky nav, mobile menu
├── service-detail/     # Shared logic for /services/* pages
└── shared/             # Cross-feature narrative components
```

**Layer-first within each feature** — inside a feature folder, code is organized by its technical layer:

```
transformation/
├── index.ts                    # Public API (what other features import)
├── transformation.tsx          # Main section component
├── transformation-dissolve.tsx # The signature scroll-controlled dissolve
├── before-after-slider.tsx     # Image comparison component
├── use-transformation-scroll.ts # Scroll-linked animation hook
├── transformation.types.ts     # TypeScript types
└── transformation.config.ts    # Timing constants, breakpoints
```

### 3.3 Why Not Pure Layer-First?

Pure layer-first (`/components`, `/hooks`, `/styles`) scatters a feature's code across 4-6 directories. When a developer needs to modify the Transformation Dissolve, they must visit:
- `components/transformation-dissolve.tsx`
- `hooks/use-transformation-scroll.ts`
- `styles/transformation.css`
- `utils/transformation-helpers.ts`

This is tolerable in a CRUD app. In a narrative experience where the Transformation Dissolve is a signature moment that may be iterated on dozens of times, the cognitive overhead is unacceptable. The feature must be self-contained.

### 3.4 Why Not Pure Feature-First?

Pure feature-first risks duplicating shared infrastructure. If every feature brings its own button component, its own animation utility, its own type definitions, the codebase fragments. The `shared/` layer prevents this — common components, hooks, and utilities live here and are imported by features as needed.

### 3.5 The Boundary Rules

1. **Features never import from other features directly.** If feature `hair/` needs something from `transformation/`, that something belongs in `shared/`. Exception: the `index.ts` public API of a feature, which may re-export types.

2. **Shared code must be genuinely shared.** Before adding to `shared/`, verify that at least two features need it. Premature sharing creates tight coupling. Under-sharing creates duplication. The rule: if the third feature needs it, extract it.

3. **Each feature has a single entry point.** The `index.ts` file exports the feature's public API. Other features import through this entry point, never reaching into internal files. This makes refactoring safe — internal restructuring doesn't break consumers.

4. **Configuration is co-located with its feature.** Timing constants for the Transformation Dissolve (`transformation.config.ts`) live inside `transformation/`, not in a global config. Each feature owns its behavioral parameters.

---

## 4. Route Organization

### 4.1 Why This Section Exists

The site map from the Information Architecture document defines 16 homepage sections, 4 service detail pages, a booking overlay, and a 404 page. How these map to TanStack Router routes determines developer experience, type safety, and the visitor's URL-based navigation.

### 4.2 Route Map

```
/                               → Homepage (single-page narrative, 16 sections)
/services/hair                  → Hair service detail
/services/color                 → Color service detail
/services/bridal                → Bridal service detail
/services/spa                   → Spa service detail
/booking/confirmation           → Post-booking state
/404                            → Custom branded error page
```

### 4.3 TanStack Router File-Based Routing

TanStack Router supports file-based routing with type-safe params and search validation. The route tree:

```
src/app/
├── __root.tsx                          # Root layout (providers, Lenis, GSAP init)
├── index.tsx                           # Homepage — renders all 16 sections
├── services/
│   ├── _layout.tsx                     # Service detail layout (back nav, breadcrumbs)
│   ├── hair.tsx                        # /services/hair
│   ├── color.tsx                       # /services/color
│   ├── bridal.tsx                      # /services/bridal
│   └── spa.tsx                         # /services/spa
├── booking/
│   └── confirmation.tsx                # /booking/confirmation
├── 404.tsx                             # 404 page
└── _layout.tsx                         # Global layout (analytics, error boundary)
```

### 4.4 The Homepage Is Not a Route — It's the Application

The homepage (`/`) is the entire narrative experience: 16 sections spanning 20-30 viewport heights. It is not a "page" in the traditional sense — it is the application itself. All 16 sections are components rendered within a single route. Section "navigation" is scroll-based, not route-based.

**Internal anchor links** (for navigation smooth-scroll): The navigation links target section IDs (`#hero`, `#whisper`, `#services`, `#artisans`, `#testimonials`, `#booking`). TanStack Router's search params can track the active section for analytics purposes without creating separate routes.

### 4.5 Booking Overlay — Not a Route

The booking flow is an overlay, not a page redirect. It slides in from the edge (40-50% viewport width on desktop, full-screen on mobile) while the homepage remains visible beneath. This is architecturally significant:

- The booking flow does **not** have its own route — it is a **component state** controlled by Redux Toolkit
- Booking step progression (1-6) is tracked in Redux, not in URL params
- The booking overlay mounts/unmounts independently of routing
- Back button closes the booking overlay, it does not navigate away
- Deep linking into a booking step is not supported (the flow is a single interaction, not a navigable page)

**Exception:** The booking confirmation state (`/booking/confirmation`) IS a route, because it represents a completed action that should be shareable, bookmarkable, and back-button-safe.

### 4.6 Route Guards and Prefetching

TanStack Router's `loader` function prefetches data before route transitions. For service detail pages, this means:

- Navigate to `/services/hair` → loader fires → TanStack Query prefetches service data → page renders with data
- No loading spinner, no flash of empty content
- If the service doesn't exist, the loader redirects to 404

### 4.7 Section Deep Linking

Visitors can arrive at `/#artisans` or `/#booking` via shared links. TanStack Router handles this through hash-based scrolling on the homepage route. The `useEffect` in the root layout reads the hash and scrolls to the corresponding section.

---

## 5. Component Organization

### 5.1 Why This Section Exists

Components are the building blocks of the visual experience. How they're organized, named, and composed determines whether a developer can find the right component, modify it safely, and create new variations without breaking existing ones.

### 5.2 Component Taxonomy

Components fall into four categories, each with different rules:

**Narrative Components** — the visual sections of the homepage. Each corresponds to a scene in the Experience Storyboard:
```
features/hero/hero.tsx                    → <HeroSection />
features/transformation/transformation.tsx → <TransformationSection />
features/artisans/artisans.tsx            → <ArtisansSection />
```

**UI Components** — reusable interface elements with no narrative context. These live in `shared/ui/`:
```
shared/ui/button.tsx                      → <Button />
shared/ui/card.tsx                        → <Card />
shared/ui/input.tsx                       → <Input />
shared/ui/modal.tsx                       → <Modal />
shared/ui/navigation.tsx                  → <Navigation />
```

**Composition Components** — narrative components built from UI components and other compositions. These bridge the gap:
```
features/booking/booking-overlay.tsx      → <BookingOverlay />
features/service-detail/service-page.tsx  → <ServiceDetailPage />
```

**Layout Components** — structural containers that define spacing, grid, and alignment:
```
shared/layout/section-wrapper.tsx         → <SectionWrapper />
shared/layout/breathing-space.tsx         → <BreathingSpace />
shared/layout/content-width.tsx           → <ContentWidth />
```

### 5.3 The Component File Structure

Each component file follows a consistent pattern:

```typescript
// 1. Imports (external → internal → relative)
// 2. Types (props interface, exported)
// 3. Constants (configuration, animation timing)
// 4. Component (default export)
// 5. Sub-components (if needed, not exported)
// 6. Hooks (if component-specific)
// 7. Styles (Tailwind classes via className)
```

**One component per file.** The file name matches the component name exactly: `ServiceCard.tsx` exports `ServiceCard`. No index.ts barrel files for individual components — barrel files exist only at the feature level (`features/hero/index.ts`).

### 5.4 Component Naming Convention

| Pattern | Convention | Example |
|---------|-----------|---------|
| Component names | PascalCase | `ServiceCard`, `ArtisanProfile`, `BookingOverlay` |
| File names | kebab-case | `service-card.tsx`, `artisan-profile.tsx`, `booking-overlay.tsx` |
| Feature folders | kebab-case | `booking-flow/`, `service-detail/` |
| Variant separator | BEM double-dash | `Button--primary`, `Button--ghost` |
| State modifier | BEM single-underscore | `Button_disabled`, `Card_expanded` |
| Singular names | Always singular | `ServiceCard`, not `ServiceCards` |
| Function over appearance | Semantic | `ArtisanProfile`, not `TeamMemberCard` |

### 5.5 The Design System Component Inventory

From the DESIGN_SYSTEM.md and DESIGN_SYSTEM_DECISIONS.md, these components are the defined vocabulary:

| Component | Role | Variants |
|-----------|------|---------|
| `ServiceCard` | Primary service display | Hair, Color, Bridal, Spa |
| `ArtisanProfile` | Team member display | Card, Expanded, Inline |
| `ClientReview` | Testimonial display | Standard, Featured |
| `CTAButton` | Primary interaction | Primary (gold), Secondary (outlined), Ghost (text) |
| `NavigationLink` | Navigation items | Top-level, Sub-level |
| `SectionHeader` | Section titles | Numbered, Unnumbered |
| `HeroSection` | Landing experience | Image-based |
| `BookingFlow` | Multi-step form | 6-step overlay |
| `GiftCard` | Gift experience | Digital |
| `Footer` | Site footer | Standard |

### 5.6 Component Composition Rules

1. **Narrative components own their own animation.** The `HeroSection` component owns the Warm Unveiling animation. It does not delegate this to a parent. This keeps the signature moment self-contained and testable.

2. **UI components are animation-agnostic.** `Button`, `Card`, `Input` have no knowledge of GSAP or ScrollTrigger. They receive state (hover, focus, active) via props or CSS and respond with Tailwind transitions.

3. **Composition components orchestrate.** `<BookingOverlay />` composes `<BookingServiceStep />`, `<BookingArtisanStep />`, `<BookingCalendarStep />`, `<BookingTimeStep />`, `<BookingContactStep />`, `<BookingConfirmationStep />`. Each step is a child component; the overlay orchestrates their visibility and transitions.

4. **No prop drilling beyond 2 levels.** If a prop must pass through more than 2 component layers, it should be global state (Redux) or context. The booking flow state, for example, lives in Redux — not passed through 6 step components.

### 5.7 Responsive Component Strategy

All components follow mobile-first responsive design. The Tailwind CSS v4 approach:

- Base styles: mobile (0-767px)
- `md:` prefix: tablet (768-1023px)
- `lg:` prefix: desktop (1024-1439px)
- `xl:` prefix: wide (1440px+)

**Never use desktop-first (max-width) media queries.** Every component's base state is the mobile experience. Desktop enhancements are additive.

---

## 6. State Management Philosophy

### 6.1 Why This Section Exists

State management is where most React projects go wrong. Too much in Redux creates a god-store that nobody understands. Too little leaves components communicating through prop chains that break when you look at them. This section draws a bright line between server state and client state, and defines exactly what each system manages.

### 6.2 The Two-State Architecture

```
┌──────────────────────────────────────────────────────┐
│                  SERVER STATE                         │
│              (TanStack Query)                        │
│                                                      │
│  • Service data (names, descriptions, prices)        │
│  • Artisan data (profiles, specialties, portraits)   │
│  • Testimonials (client reviews, ratings)            │
│  • Availability (real-time time slots)               │
│  • Gift card products                                │
│  • Site configuration                                │
│                                                      │
│  Properties: cached, refetched, background-updated,  │
│  stale-while-revalidate, optimistic, offline-ready   │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                  CLIENT STATE                         │
│              (Redux Toolkit)                          │
│                                                      │
│  • Booking flow (current step, selections, form)     │
│  • UI state (booking overlay open, mobile menu open) │
│  • Animation state (scroll position, active section) │
│  • Feature flags (3D enabled, reduced motion)        │
│  • User preferences (if any persist locally)         │
│                                                      │
│  Properties: synchronous, immediate, local,          │
│  non-persisted, devtools-inspectable                 │
└──────────────────────────────────────────────────────┘
```

### 6.3 TanStack Query — Server State Details

**Query Keys:** Follow a hierarchical convention that enables granular invalidation:

```
['services']                          → All services
['services', 'hair']                  → Hair service detail
['services', 'hair', 'artisans']     → Artisans for hair
['artisans']                          → All artisans
['artisans', artisanId]               → Single artisan
['testimonials']                      → All testimonials
['availability', artisanId, date]     → Time slots for artisan on date
['gift-cards']                        → Gift card products
```

**Caching Strategy:**
- Service data, artisan data, testimonials: **Stale time 5 minutes, cache time 30 minutes.** This data changes rarely. Background refetch keeps it fresh without blocking renders.
- Availability: **Stale time 30 seconds, cache time 5 minutes.** This is real-time data that can change with every booking. Short stale time ensures accuracy.
- Gift cards: **Stale time 1 hour, cache time 24 hours.** Product catalog changes very rarely.

**Prefetching:** TanStack Router loaders trigger prefetching before route transitions. When a visitor clicks "Hair Service Detail," the loader fires `queryClient.prefetchQuery(['services', 'hair'])` so the page renders with data already available.

### 6.4 Redux Toolkit — Client State Details

**Store Structure:**

```typescript
// Conceptual — not implementation
interface RootState {
  booking: {
    isOpen: boolean;
    currentStep: 1 | 2 | 3 | 4 | 5 | 6;
    selections: {
      serviceId: string | null;
      artisanId: string | null;
      date: string | null;
      timeSlot: string | null;
    };
    contact: {
      name: string;
      email: string;
      phone: string;
      notes: string;
    };
    isSubmitting: boolean;
    error: string | null;
  };
  ui: {
    mobileMenuOpen: boolean;
    scrollSection: string;
    isReducedMotion: boolean;
  };
  features: {
    threeDEnabled: boolean;
  };
}
```

**Redux Slices:**

| Slice | Purpose | Persistence |
|-------|---------|-------------|
| `booking` | Booking flow state, selections, form data | Session only (lost on refresh if in progress) |
| `ui` | Mobile menu, scroll tracking, reduced motion | Session + localStorage (preferences) |
| `features` | Feature flags (3D, reduced motion) | Computed from device/user-agent |

**Rules for Redux:**
1. **Never put server data in Redux.** If it comes from the API, it lives in TanStack Query. No exceptions.
2. **Never put animation frame state in Redux.** GSAP's internal state is not Redux's concern. Only derived values (scroll position for analytics, active section for navigation highlighting) belong in Redux.
3. **Keep slices small.** Each slice should be understandable in under 30 seconds. If a slice exceeds 100 lines, split it.
4. **Use Redux DevTools.** Every slice should have readable action names. "booking/setCurrentStep" is readable. "SET_S" is not.

### 6.5 The Booking Flow State Machine

The booking flow is a finite state machine with 6 states and defined transitions:

```
Service → Artisan → Date → Time → Contact → Confirmation
   ↑         ↑        ↑       ↑        ↑
   └─────────┴────────┴───────┴────────┘ (back button from any step)
```

This state machine lives in Redux because:
- It must survive component re-renders (scroll while booking overlay is open)
- It must be inspectable in DevTools for debugging
- It represents client-only state (no server interaction until submission)

### 6.6 State Interaction Patterns

- **Booking submission:** Redux dispatches `booking/setSubmitting(true)` → TanStack Query `useMutation` sends POST to API → on success, Redux dispatches `booking/setStep(6)` + TanStack Query invalidates `['availability']`
- **Scroll tracking:** GSAP ScrollTrigger callback → dispatches `ui/setScrollSection('artisans')` → Navigation component highlights "Artisans" link
- **Availability polling:** TanStack Query's `refetchInterval` polls availability every 30 seconds while the booking date picker is open → no Redux involvement

---

## 7. API Architecture

### 7.1 Why This Section Exists

The backend serves the frontend. It provides data for the narrative experience and processes bookings. This section defines the API contract, the data model, and the background processing pipeline.

### 7.2 API Design Philosophy

**The API is a servant, not a master.** The frontend drives the experience. The API provides data and processes transactions. There is no server-rendered HTML, no server-side routing decisions, no API-controlled page structure. The frontend knows what it needs; the API provides it efficiently.

**REST, not GraphQL.** The data relationships are simple and well-defined. GraphQL's flexibility is unnecessary overhead. REST endpoints with clear resource naming are sufficient and debuggable.

**JSON responses with consistent envelope:**

```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}
```

### 7.3 API Endpoints

```
GET    /api/services                    → List all services
GET    /api/services/:slug              → Single service detail
GET    /api/artisans                    → List all artisans
GET    /api/artisans/:id                → Single artisan profile
GET    /api/artisans/:id/services       → Services by artisan
GET    /api/testimonials                → List testimonials (paginated)
GET    /api/testimonials?service=:slug  → Testimonials by service
GET    /api/availability                → Check time slots
       ?artisanId=:id&date=:date&service=:slug
POST   /api/bookings                    → Create a booking
GET    /api/bookings/:id                → Retrieve booking details
POST   /api/bookings/:id/cancel         → Cancel a booking
GET    /api/gift-cards                  → List gift card products
POST   /api/gift-cards/purchase         → Purchase a gift card
GET    /api/config                      → Site configuration (hours, etc.)
```

### 7.4 Database Schema (High-Level)

```
services
├── id (UUID, PK)
├── slug (string, unique) — 'hair', 'color', 'bridal', 'spa'
├── name (string)
├── description (text)
├── starting_price (integer, cents)
├── duration_minutes (integer)
├── category (enum: hair, color, bridal, spa)
├── display_order (integer)
├── is_active (boolean)
├── created_at, updated_at (timestamps)

artisans
├── id (UUID, PK)
├── name (string)
├── title (string)
├── specialty (string)
├── bio (text)
├── portrait_url (string)
├── display_order (integer)
├── is_active (boolean)
├── created_at, updated_at (timestamps)

artisan_services (junction)
├── artisan_id (FK → artisans)
├── service_id (FK → services)

testimonials
├── id (UUID, PK)
├── client_name (string)
├── content (text)
├── rating (integer, 1-5)
├── service_id (FK → services)
├── is_featured (boolean)
├── display_order (integer)
├── created_at (timestamp)

bookings
├── id (UUID, PK)
├── service_id (FK → services)
├── artisan_id (FK → artisans)
├── date (date)
├── time_slot (time)
├── client_name (string)
├── client_email (string)
├── client_phone (string)
├── notes (text, nullable)
├── status (enum: pending, confirmed, cancelled, completed)
├── created_at, updated_at (timestamps)

gift_cards
├── id (UUID, PK)
├── code (string, unique)
├── amount (integer, cents)
├── purchaser_email (string)
├── recipient_name (string, nullable)
├── recipient_email (string, nullable)
├── message (text, nullable)
├── is_redeemed (boolean)
├── redeemed_by_booking_id (FK → bookings, nullable)
├── created_at, redeemed_at (timestamps)

availability_exceptions
├── id (UUID, PK)
├── artisan_id (FK → artisans)
├── date (date)
├── is_available (boolean)
├── start_time (time, nullable)
├── end_time (time, nullable)
├── reason (string, nullable)
```

### 7.5 Availability System

Real-time availability is the most complex backend concern. The system must:

1. **Calculate available time slots** for a given artisan + service + date combination
2. **Account for existing bookings** — no double-booking
3. **Account for availability exceptions** — artisan days off, partial days, holidays
4. **Account for service duration** — a 90-minute service cannot start 45 minutes before closing
5. **Cache aggressively** — availability changes infrequently (only when a booking is created/cancelled)

**Caching strategy:** Redis caches availability slots keyed by `availability:{artisanId}:{date}:{serviceId}`. Cache is invalidated when a booking is created or cancelled for that artisan on that date. Cache TTL: 30 seconds (serves concurrent requests without recalculation).

**BullMQ integration:** When a booking is created:
1. API validates and saves to PostgreSQL
2. API publishes a `booking.created` job to BullMQ
3. Job processor: invalidates Redis availability cache, sends confirmation email/SMS (V2+)

### 7.6 Background Jobs (BullMQ)

| Job | Trigger | Purpose | Retry |
|-----|---------|---------|-------|
| `booking.created` | POST /api/bookings | Invalidate cache, send confirmation | 3 attempts, exponential backoff |
| `booking.cancelled` | POST /api/bookings/:id/cancel | Invalidate cache, send cancellation notice | 3 attempts |
| `gift-card.purchased` | POST /api/gift-cards/purchase | Send gift card to recipient (V2+) | 3 attempts |
| `availability.sync` | Scheduled (every 5 min) | Sync availability from external sources (V2+) | 1 attempt |

### 7.7 Express Middleware Stack

```
Request → CORS → Rate Limiter → Body Parser → Route Handler → Response
                ↓
         Error Handler → Structured Error Response
```

| Middleware | Purpose |
|-----------|---------|
| CORS | Allow frontend origin |
| Rate Limiter | Prevent abuse (100 req/min per IP) |
| Body Parser | JSON request parsing |
| Request Logger | Structured logging for observability |
| Error Handler | Catch-all with structured error responses |

### 7.8 Security Considerations

- **Input validation:** All booking inputs validated server-side (Drizzle's type safety + manual validation)
- **Rate limiting:** 100 requests per minute per IP, 10 booking attempts per hour per email
- **SQL injection:** Drizzle ORM parameterized queries prevent SQL injection by default
- **CORS:** Strictly configured to frontend origin only
- **No authentication in V1:** The site is public-facing. Admin features (V2) will add authentication.
- **HTTPS only:** All API communication over TLS

---

## 8. Animation Architecture

### 8.1 Why This Section Exists

Animation is not decoration in this project. It is infrastructure. The Warm Unveiling, the Transformation Dissolve, the section reveals, the parallax effects — these are the heartbeat of the narrative experience. The animation architecture must be robust, performant, accessible, and maintainable.

### 8.2 The Three Animation Systems

This project uses three animation systems, each with a defined domain:

```
┌──────────────────────────────────────────────────────────┐
│                    GSAP + ScrollTrigger                    │
│                                                           │
│  Domain: Scroll-linked animations                         │
│  • Section reveal (fade-in on scroll)                     │
│  • Parallax effects (background/foreground differential)  │
│  • Transformation Dissolve (scroll-controlled crossfade)  │
│  • Breathing space transitions                            │
│  • Testimonial cascade                                    │
│  • Any animation tied to scroll position                  │
│                                                           │
│  Why GSAP: Industry standard, ScrollTrigger is unmatched  │
│  for scroll-linked animation, performance-optimized,      │
│  scrub-capable, pin-capable                               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                      Lenis                                │
│                                                           │
│  Domain: Smooth scroll behavior                           │
│  • Replaces native scroll with smooth, interpolated       │
│  • Integrates with GSAP ScrollTrigger                     │
│  • Provides consistent scroll feel across devices         │
│  • Respects prefers-reduced-motion                        │
│                                                           │
│  Why Lenis: Lightweight, GSAP-native integration,        │
│  no scroll-jacking (respects native scroll direction)     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                   Framer Motion (Limited)                 │
│                                                           │
│  Domain: Component-level micro-interactions               │
│  • Booking overlay slide-in/out                           │
│  • Mobile menu open/close                                 │
│  • Button press feedback                                  │
│  • Modal transitions                                      │
│  • Form field focus/blur animations                       │
│                                                           │
│  Why Framer Motion: Declarative API, ideal for            │
│  mount/unmount transitions, component state-driven        │
│                                                           │
│  Rule: Framer Motion NEVER handles scroll-linked          │
│  animations. Only GSAP owns scroll.                       │
└──────────────────────────────────────────────────────────┘
```

### 8.3 The Animation Layer Cake

```
Layer 4: Signature Moments (Warm Unveiling, Transformation Dissolve, Golden Return)
         ↓ Built on
Layer 3: Animation Primitives (useScrollReveal, useParallax, useCrossDissolve)
         ↓ Built on
Layer 2: GSAP + ScrollTrigger + Lenis Infrastructure
         ↓ Runs on
Layer 1: Browser (requestAnimationFrame, IntersectionObserver fallback)
```

### 8.4 The Animation Hook Library

| Hook | Purpose | System |
|------|---------|--------|
| `useScrollReveal(options)` | Fade-in elements on scroll entry | GSAP ScrollTrigger |
| `useParallax(speed)` | Parallax depth effect on scroll | GSAP ScrollTrigger |
| `useCrossDissolve(scrollRange)` | Scroll-controlled before/after crossfade | GSAP ScrollTrigger |
| `useSectionTracking(sectionIds)` | Track which section is active | GSAP ScrollTrigger |
| `useWarmReveal(config)` | Hero Warm Unveiling animation | GSAP timeline |
| `useGoldenReturn(config)` | Closing Image ambient animation | GSAP timeline |
| `useReducedMotion()` | Detect prefers-reduced-motion | CSS media query |
| `useBookingOverlay()` | Overlay open/close transitions | Framer Motion |
| `useMobileMenu()` | Mobile menu transitions | Framer Motion |

### 8.5 Animation Timing Configuration

All animation timing values are centralized in a configuration file:

```typescript
// Conceptual — not implementation
const TIMING = {
  hover: { duration: 250, easing: 'ease-in-out' },       // 200-300ms range
  click: { duration: 100, easing: 'ease-in-out' },        // 100-300ms range
  sectionReveal: { duration: 500, easing: 'ease-out' },   // 400-600ms range
  heroReveal: { duration: 1350, easing: 'warmFade' },     // 1200-1500ms range
  pageTransition: { duration: 350, easing: 'ease-in-out' },// 300-400ms range
  confirmation: { duration: 1000, easing: 'ease-out' },    // 800-1200ms range
  parallaxDifferential: 0.175,                             // 15-20% range
  maxTranslation: 30,                                       // 30px maximum
  maxOpacityStart: 0.8,                                     // Never start below 80%
  maxHoverScale: 1.03,                                      // Never exceed 1.03
} as const;
```

### 8.6 The Transformation Dissolve — Architectural Detail

The Transformation Dissolve is the signature scroll moment. Its architecture:

1. **Two images** (before and after) are absolutely positioned in the same container
2. **The after image** starts with `clip-path: inset(0 100% 0 0)` (fully clipped from the right)
3. **GSAP ScrollTrigger** with `scrub: true` maps scroll position to `clip-path: inset(0 X% 0 0)` where X goes from 100% to 0%
4. **Scroll range:** One full viewport height of scroll distance maps to the complete dissolve
5. **Easing:** Linear mapping — the visitor's scroll speed IS the animation speed
6. **Performance:** Only `clip-path` and `opacity` are animated (GPU-composited, no layout thrashing)

### 8.7 The Warm Unveiling — Architectural Detail

The Warm Unveiling is the first thing visitors see. Its architecture:

1. **On page load:** A GSAP timeline orchestrates the reveal
2. **Elements start at 80-90% opacity** (warm — materializing, not appearing from nothing)
3. **Staggered reveal:** Background → text → CTA, each with 200ms offset
4. **Total duration:** 1200-1500ms
5. **No scroll interaction:** This is the ONLY time-linked animation in the entire experience
6. **Respects reduced-motion:** If `prefers-reduced-motion: reduce`, all elements appear instantly at full opacity

### 8.8 Animation Performance Rules

1. **Only animate `transform` and `opacity`.** These are GPU-composited properties. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
2. **Use `will-change` sparingly.** Only on elements that are actively being animated. Remove after animation completes.
3. **Limit concurrent animations.** Maximum 5 active ScrollTrigger instances below the fold at any time. GSAP's `Refresh` handles viewport management.
4. **Lazy-init animations.** ScrollTrigger instances for below-fold sections are created when those sections approach the viewport, not on page load.
5. **Kill on unmount.** Every component that creates GSAP animations must kill them in its `useEffect` cleanup. Memory leaks from orphaned ScrollTriggers are a common and preventable failure mode.

### 8.9 Accessibility in Animation

Every animation system must respect `prefers-reduced-motion`:

```typescript
// Conceptual pattern
function useReducedMotion() {
  // Returns true if user prefers reduced motion
  // Checked at mount, updated on change
  // Used by ALL animation hooks to short-circuit
}
```

When reduced motion is active:
- GSAP animations: `duration: 0` (instant state changes)
- Framer Motion: `reduceMotion: "always"` in `LazyMotion`
- Lenis: Disabled entirely (native scroll restored)
- Section reveals: Elements appear immediately, no fade-in
- Hero reveal: Instant appearance, no warm fade
- Transformation Dissolve: Both images visible simultaneously (no crossfade)

---

## 9. 3D Architecture

### 9.1 Why This Section Exists

Three-dimensional effects via React Three Fiber and Drei add atmospheric depth — volumetric light rays, warm haze, subtle particle effects. But 3D is expensive. This section defines when 3D is used, when it is disabled, and how to ensure it never compromises the core experience.

### 9.2 3D Usage Rules

From the DESIGN_SYSTEM.md and FEATURE_DEFINITION.md, these rules are absolute:

1. **3D is background, never focus.** Volumetric light rays, warm atmospheric haze, subtle particle movement — these enhance the environment, they never compete with content.
2. **3D is P2 priority.** The entire 3D layer is a V1 enhancement, not a V1 requirement. The experience must be complete without it.
3. **3D is disabled on mobile** if it impacts performance. Mobile devices with <4GB RAM or GPU benchmarks below threshold skip the 3D layer entirely.
4. **3D never blocks content interaction.** The React Three Fiber canvas is always `pointer-events: none` except for intentional 3D interactions (which this project does not have).
5. **3D respects `prefers-reduced-motion`.** If reduced motion is active, the 3D layer is disabled.

### 9.3 3D Scene Architecture

```
3D Scenes (defined per-signature-moment):
├── hero-atmosphere     → Volumetric light rays through hero image
├── transformation-3d   → Before/after as depth layers (scroll-linked)
├── closing-ambient     → Warm particle movement, atmospheric glow
└── threshold-particles → Subtle warm particles (optional, V2)
```

### 9.4 Performance Gate

```typescript
// Conceptual — not implementation
function shouldEnable3D(): boolean {
  // 1. Check reduced motion
  if (prefersReducedMotion) return false;
  
  // 2. Check device memory (if available)
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
  
  // 3. Check viewport width (disable on mobile)
  if (window.innerWidth < 768) return false;
  
  // 4. Check GPU benchmark (optional, V2)
  // if (gpuBenchmarkScore < threshold) return false;
  
  return true;
}
```

### 9.5 3D Fallback Strategy

When 3D is disabled, the experience must not feel incomplete:

- **Hero:** Atmospheric photography remains. The absence of volumetric light is not noticeable because the photography itself provides atmosphere.
- **Transformation Dissolve:** The scroll-controlled crossfade works identically without 3D depth layers. The 3D enhancement is additive, not structural.
- **Closing Image:** The 2000-2500ms ambient animation runs on the 2D image. No particles, no haze — just the photograph and warmth.

### 9.6 React Three Fiber Integration

```typescript
// Conceptual — not implementation
// Only loaded if 3D is enabled (code-split)
const AtmosphereCanvas = lazy(() => import('./atmosphere-canvas'));

// In the hero section:
{is3DEnabled && (
  <Suspense fallback={null}>
    <AtmosphereCanvas />
  </Suspense>
)}
```

Key points:
- **Lazy loaded** — the 3D bundle is not part of the initial page load
- **Suspense with null fallback** — no loading indicator, the 3D layer simply appears when ready
- **Canvas is absolutely positioned** — overlays the section without affecting layout
- **`frameloop="demand"`** — only renders when something changes, saves GPU cycles

---

## 10. Asset Organization

### 10.1 Why This Section Exists

This project is photography-forward. The imagery IS the design. How images are organized, optimized, and served directly impacts performance (LCP < 2.5s), visual quality, and developer experience when swapping or updating images.

### 10.2 Image Asset Structure

```
assets/
├── images/
│   ├── hero/                        # Hero section photography
│   │   ├── hero-main.webp
│   │   ├── hero-main.avif
│   │   └── hero-main.jpg            # Fallback
│   ├── atmosphere/                  # Atmosphere section photography
│   │   ├── space-01.webp
│   │   ├── space-02.webp
│   │   └── space-03.webp
│   ├── services/                    # Service section photography
│   │   ├── hair/
│   │   │   ├── hair-01.webp
│   │   │   └── hair-02.webp
│   │   ├── color/
│   │   │   ├── color-before.webp
│   │   │   ├── color-after.webp
│   │   │   └── color-detail.webp
│   │   ├── bridal/
│   │   │   └── bridal-01.webp
│   │   └── spa/
│   │       └── spa-01.webp
│   ├── artisans/                    # Artisan portraits
│   │   ├── artisan-01.webp
│   │   ├── artisan-02.webp
│   │   └── artisan-03.webp
│   ├── closing/                     # Closing image
│   │   └── closing-main.webp
│   └── og/                          # Open Graph images
│       └── og-default.jpg
├── fonts/                           # Self-hosted fonts (if not using Google Fonts CDN)
│   ├── cormorant-garamond-*.woff2
│   └── dm-sans-*.woff2
└── icons/                           # SVG icons
    ├── nav/
    │   ├── menu.svg                 # Hamburger menu
    │   ├── close.svg                # Close menu
    │   └── arrow-down.svg           # Scroll indicator
    ├── booking/
    │   ├── check.svg                # Confirmation
    │   ├── calendar.svg             # Date picker
    │   └── clock.svg                # Time picker
    └── social/
        ├── instagram.svg
        └── whatsapp.svg
```

### 10.3 Image Format Strategy

| Format | Purpose | When Used |
|--------|---------|-----------|
| **AVIF** | Best compression, modern browsers | First choice for all images |
| **WebP** | Excellent compression, broad support | Fallback when AVIF not supported |
| **JPEG** | Universal support | Final fallback for all browsers |
| **SVG** | Icons, logos, simple graphics | All icons and vector graphics |
| **PNG** | Never used for photography | Only if transparency is required (avoid) |

**Implementation:** Use the `<picture>` element with AVIF → WebP → JPEG source chain. Or use Vite's image processing to generate multiple formats at build time.

### 10.4 Image Aspect Ratios (From DESIGN_SYSTEM.md)

| Context | Aspect Ratio | Rationale |
|---------|-------------|-----------|
| Hero | 16:9 or wider | Full-viewport impact |
| Service cards | 4:3 or 3:2 | Editorial proportion |
| Artisan portraits | 3:4 or 2:3 | Portrait orientation, human |
| Detail shots | 1:1 | Square for focused detail |

**Never crop to unexpected ratios.** If an image was shot at 3:2, do not crop to 1:1 for aesthetic reasons. The aspect ratios are defined by the photography registers in CREATIVE_DIRECTION.md.

### 10.5 Image Optimization Pipeline

1. **Original files** are stored in `assets/images/` at full resolution
2. **Build process** (Vite plugin or Sharp script) generates:
   - AVIF at 80% quality
   - WebP at 85% quality
   - JPEG at 80% quality (fallback)
   - Multiple sizes: 640px, 1024px, 1920px, 2560px wide
3. **Responsive srcset** provides the browser with multiple options
4. **Lazy loading** via `loading="lazy"` for below-fold images
5. **Hero image** uses `loading="eager"` and `fetchpriority="high"`
6. **Blur-up placeholders** — lightweight inline base64 placeholder in the image component

### 10.6 Font Strategy

The design system specifies two typeface families:
- **Serif (voice):** Cormorant Garamond — headlines, emotional moments, pull quotes
- **Sans-serif (function):** DM Sans — body copy, navigation, UI elements, metadata

**Loading strategy:**
1. Use `font-display: swap` to prevent invisible text
2. Self-host fonts (from Google Fonts or licensed source) for performance and privacy
3. Subset fonts to include only necessary characters (Latin for V1)
4. Preload critical font files: `<link rel="preload" as="font" type="font/woff2" crossorigin>`
5. Use system font stack as fallback: `font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;`

### 10.7 Static Files (Public Directory)

```
public/
├── favicon.ico
├── favicon.svg
├── apple-touch-icon.png
├── robots.txt
├── sitemap.xml
├── og-default.jpg                    # Default Open Graph image
└── manifest.json                     # Web app manifest (PWA-ready, V2)
```

---

## 11. Hooks Philosophy

### 11.1 Why This Section Exists

Custom hooks are the primary abstraction mechanism in React. They encapsulate reusable logic, isolate side effects, and provide clean APIs for complex behaviors. In this project, hooks are particularly critical for animation coordination, scroll tracking, and the booking flow.

### 11.2 Hook Categories

**Animation Hooks** — encapsulate GSAP/ScrollTrigger/Framer Motion logic:

| Hook | Purpose | Used By |
|------|---------|---------|
| `useScrollReveal` | Fade-in elements on scroll entry | Every narrative section |
| `useParallax` | Parallax depth effect | Hero, atmosphere, closing |
| `useCrossDissolve` | Scroll-controlled before/after | Transformation section |
| `useSectionTracking` | Track active section for nav | Navigation |
| `useWarmReveal` | Hero load animation | Hero section |
| `useGoldenReturn` | Closing ambient animation | Closing section |
| `useReducedMotion` | Detect motion preference | All animation hooks |

**Data Hooks** — encapsulate TanStack Query logic:

| Hook | Purpose | Used By |
|------|---------|---------|
| `useServices` | Fetch all services | Homepage services section |
| `useServiceDetail(slug)` | Fetch single service | Service detail pages |
| `useArtisans` | Fetch all artisans | Homepage artisans section |
| `useArtisanDetail(id)` | Fetch single artisan | Artisan expanded view |
| `useTestimonials(service?)` | Fetch testimonials | Testimonials section |
| `useAvailability(artisanId, date)` | Fetch time slots | Booking calendar step |
| `useCreateBooking()` | Mutation for booking creation | Booking confirmation step |

**UI Hooks** — encapsulate interface behavior:

| Hook | Purpose | Used By |
|------|---------|---------|
| `useBookingFlow` | Booking state machine actions | Booking overlay |
| `useMobileMenu` | Mobile menu toggle | Navigation |
| `useScrollDirection` | Detect scroll up/down | Sticky navigation |
| `useMediaQuery` | Responsive breakpoint detection | Various components |
| `useClickOutside` | Detect clicks outside element | Dropdowns, overlays |
| `useKeyboardNavigation` | Keyboard trap management | Booking overlay, modals |

### 11.3 Hook Design Rules

**Rule 1: One concern per hook.** `useScrollReveal` handles scroll-triggered fade-in. It does not handle parallax. If a component needs both, it uses both hooks. Single-responsibility applies to hooks as much as to components.

**Rule 2: Hooks return objects, not arrays.** Unlike React convention, this project returns objects from hooks for better readability:

```typescript
// Preferred — destructuring is explicit
const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

// Not preferred — positional destructuring is fragile
const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });
```

**Exception:** Standard React hooks (`useState`, `useRef`, `useEffect`) follow React conventions.

**Rule 3: Animation hooks must clean up.** Every hook that creates a GSAP animation must return a cleanup function or use `useEffect` cleanup to kill the animation. Memory leaks from orphaned ScrollTriggers are the most common animation bug.

**Rule 4: Data hooks encapsulate error handling.** `useServiceDetail` does not just fetch data — it handles loading states, error states, and empty states. The consuming component receives `{ data, isLoading, error }` and does not need to understand TanStack Query internals.

**Rule 5: Hooks are testable in isolation.** Every hook can be tested with `renderHook` from React Testing Library. Animation hooks can be tested by mocking GSAP. Data hooks can be tested by mocking the API.

### 11.4 Hook File Organization

```
shared/hooks/
├── animation/
│   ├── use-scroll-reveal.ts
│   ├── use-parallax.ts
│   ├── use-cross-dissolve.ts
│   ├── use-section-tracking.ts
│   ├── use-warm-reveal.ts
│   ├── use-golden-return.ts
│   └── use-reduced-motion.ts
├── data/
│   ├── use-services.ts
│   ├── use-service-detail.ts
│   ├── use-artisans.ts
│   ├── use-artisan-detail.ts
│   ├── use-testimonials.ts
│   ├── use-availability.ts
│   └── use-create-booking.ts
└── ui/
    ├── use-booking-flow.ts
    ├── use-mobile-menu.ts
    ├── use-scroll-direction.ts
    ├── use-media-query.ts
    ├── use-click-outside.ts
    └── use-keyboard-navigation.ts
```

### 11.5 The useScrollReveal Contract

The most-used hook in the project. Its contract:

```typescript
// Conceptual interface
interface UseScrollRevealOptions {
  threshold?: number;       // Intersection threshold (0-1)
  rootMargin?: string;      // Intersection root margin
  once?: boolean;           // Reveal only once (default: true)
  delay?: number;           // Delay before reveal (ms)
  direction?: 'up' | 'down'; // Scroll direction to trigger
}

interface UseScrollRevealResult {
  ref: RefObject<HTMLElement>;  // Attach to the element
  isVisible: boolean;            // Current visibility state
}
```

Every narrative section uses this hook. Consistency is non-negotiable.

---

## 12. Error Handling Philosophy

### 12.1 Why This Section Exists

Errors are not edge cases — they are guaranteed states. The network will fail. The API will return errors. The user will do unexpected things. The booking flow will be abandoned. This section defines how errors are handled, communicated, and recovered from — without breaking the emotional journey.

### 12.2 The Error Hierarchy

```
Level 1: Page-Level Errors (404, 500, network down)
         → Full-page branded error experience
         
Level 2: Section-Level Errors (API failure for a section's data)
         → Graceful degradation within the section
         
Level 3: Component-Level Errors (form validation, input errors)
         → Inline error messaging, warm-toned, helpful
         
Level 4: Silent Errors (analytics failures, tracking errors)
         → Log and continue, never show to visitor
```

### 12.3 Error Handling Rules

**Rule 1: Never show raw error messages.** "Error 500: Internal Server Error" means nothing to a visitor. Instead: "Something went wrong on our end. Please try again, or contact us directly."

**Rule 2: Error states must match the brand.** Error messages use the warm tone, warm colors (warm red-brown, not harsh red), editorial voice. An error is a moment of friction — the brand voice must remain consistent even in failure.

**Rule 3: Every error state has a recovery path.** A network error doesn't just say "failed" — it provides a retry button, a link to the homepage, or a phone number to call. The visitor should never feel stranded.

**Rule 4: Never hide errors behind spinners.** If something fails, say so immediately. "We couldn't load the available times. Please try again." is better than an infinite spinner.

**Rule 5: Booking errors are critical.** The booking flow is the conversion funnel. Errors here directly impact revenue. Every possible booking error (network failure, time slot taken, validation failure, server error) must have a specific, helpful error message and a clear recovery path.

### 12.4 Error States by Feature

| Feature | Possible Errors | Recovery |
|---------|----------------|----------|
| **Homepage sections** | API failure to load services/artisans/testimonials | Show last-cached data (TanStack Query cache), or show a graceful fallback message |
| **Booking flow (step 1-4)** | Availability API failure | "We couldn't check availability. Please try again or call us." + retry button |
| **Booking flow (step 5)** | Form validation failure | Inline field-level errors, warm red-brown, specific messages |
| **Booking flow (step 6)** | Booking submission failure | "Your booking couldn't be completed. Your selections are saved — try again." + retry button |
| **Service detail pages** | Service not found (invalid slug) | Redirect to custom 404 |
| **Availability check** | Time slot taken by another visitor | "That time was just booked. Here are the next available slots." + auto-refresh |
| **Gift card purchase** | Payment failure (V1: simulated) | "Something went wrong with your purchase. Please try again." |
| **Image loading** | Image fails to load | Show warm-toned placeholder with service name |

### 12.5 The Custom 404 Page

The 404 page is a branded experience, not a technical error:

- Warm background matching the site palette
- The salon's brand voice: "The page you're looking for doesn't exist, but we'd love to see you."
- Links to: Homepage, Services, Booking
- Navigation remains accessible
- No broken layout, no raw error messages

### 12.6 Error Boundary Architecture

```typescript
// Conceptual — not implementation
// Root Error Boundary (catches everything)
<ErrorBoundary fallback={<FullPageError />}>
  <RouterProvider />
</ErrorBoundary>

// Section Error Boundaries (catches section-specific failures)
<ErrorBoundary fallback={<SectionFallback />}>
  <ArtisansSection />
</ErrorBoundary>
```

- **Root boundary:** Catches catastrophic failures (JavaScript errors that crash React). Shows full-page branded error with recovery links.
- **Section boundaries:** Catches failures within specific sections (e.g., artisan data fails to load). Shows a graceful fallback within the section without crashing the entire page.
- **Booking overlay boundary:** Catches failures within the booking flow. Shows error state with saved progress and retry option.

### 12.7 Backend Error Handling (Express)

Express middleware catches all unhandled errors and returns structured responses:

```typescript
// Conceptual — not implementation
interface ErrorResponse {
  error: {
    code: string;           // Machine-readable: 'AVAILABILITY_CONFLICT'
    message: string;        // Human-readable: 'That time slot is no longer available'
    details?: Record<string, string>; // Field-level errors for form validation
  };
}
```

All errors logged to server-side logging (structured JSON). No sensitive information in error responses.

---

## 13. Loading Strategy

### 13.1 Why This Section Exists

The loading experience is the first experience. A white screen with a spinner destroys the emotional journey before it begins. The loading strategy must be as carefully designed as any other part of the narrative.

### 13.2 The Loading Philosophy

From the DESIGN_SYSTEM.md and FEATURE_DEFINITION.md:

- **No loading spinners.** Ever. Generic spinners communicate "we're not ready" — this brand communicates "we've been expecting you."
- **No skeleton shimmer.** Skeleton loaders are a pattern for dashboards, not narrative experiences. They communicate "data is loading" when the experience should communicate "the space is revealing itself."
- **Instant content or branded indicator.** If content can appear in <300ms, show nothing. If it takes longer, use a branded indicator that matches the warm aesthetic.

### 13.3 Loading Strategy by Layer

**Initial Page Load (Critical Path):**

```
HTML shell (inline critical CSS)
    → React bundle loads (code-split by route)
        → Root layout renders (providers, Lenis, analytics)
            → Homepage route mounts
                → Above-the-fold content renders immediately
                    → Hero Warm Unveiling begins (1200-1500ms)
```

Key strategies:
- **Critical CSS inlined** in `index.html` — no flash of unstyled content
- **Code splitting by route** — the homepage chunk loads first, service detail pages are separate chunks
- **Hero image preloaded** — `fetchpriority="high"` on the hero image, `<link rel="preload">` in HTML head
- **Below-fold code deferred** — GSAP ScrollTrigger, 3D canvas, and below-fold section components are lazy-loaded

**Section Data Loading:**

```
Section mounts → TanStack Query fetch → data arrives → section renders
                                ↓ (if cached)
                    section renders immediately from cache
```

- Service data, artisan data, testimonials: Fetched on homepage mount. TanStack Query serves from cache if available, refetches in background.
- Availability data: Fetched only when the booking calendar step opens.
- No section shows a loading state if data is cached (stale-while-revalidate).

**Image Loading:**

```
Image enters viewport → lightweight placeholder visible → full image loads → placeholder fades to full image (300ms)
```

- **Above-fold images (hero):** Loaded eagerly with `fetchpriority="high"`
- **Below-fold images:** Loaded lazily with `loading="lazy"`
- **Placeholder:** Lightweight base64 blur or solid warm color
- **Transition:** 300ms fade from placeholder to full image
- **No layout shift:** Images have explicit `width` and `height` attributes, or are in containers with defined aspect ratios

### 13.4 The Booking Flow Loading States

The booking flow has specific loading states for each step:

| Step | Loading State | Duration |
|------|-------------|----------|
| Service → Artisan | Instant (data already loaded) | 0ms |
| Artisan → Date | Instant (calendar is client-side) | 0ms |
| Date → Time | Availability API call | 200-800ms |
| Time → Contact | Instant (form render) | 0ms |
| Contact → Confirmation | Booking submission | 500-1500ms |
| Submission → Success | Warm Confirmation animation | 800-1200ms |

For the availability check (Date → Time), if the response takes >300ms, show a warm gold pulse indicator (NOT a spinner). This indicator is a subtle animation that matches the brand's visual language.

### 13.5 Progressive Enhancement

The loading strategy follows progressive enhancement:

1. **HTML shell renders immediately** — the visitor sees the page structure
2. **Critical content appears** — hero, navigation, first section
3. **JavaScript hydrates** — interactive features become available
4. **Below-fold content loads** — sections appear as the visitor scrolls
5. **3D layer loads** — atmospheric effects layer on top (if enabled)
6. **Background data refreshes** — TanStack Query keeps data fresh

The visitor is never staring at a blank screen. Something is always visible within 500ms.

### 13.6 The Warm Unveiling as Loading Experience

The Warm Unveiling animation (1200-1500ms) IS the loading experience. It serves a dual purpose:
1. **Technical:** Gives JavaScript time to hydrate, GSAP to initialize, ScrollTrigger to set up
2. **Emotional:** Creates anticipation, establishes warmth, communicates quality

The visitor does not experience a loading screen followed by content. They experience a reveal — the brand materializing from warmth. The loading IS the experience.

---

## 14. SEO Strategy

### 14.1 Why This Section Exists

A single-page narrative website presents unique SEO challenges. The homepage is not a traditional multi-page site with individual URLs for each section. Service detail pages are the primary SEO targets. This section defines the technical SEO architecture.

### 14.2 The SEO Challenge

The homepage (`/`) is a single URL containing 16 sections. Search engines index one page, not sixteen. The strategy must ensure:
- The homepage ranks for brand terms and general salon queries
- Service detail pages rank for service-specific queries
- Local SEO is strong for Marrakech-specific searches
- The narrative structure does not harm SEO performance

### 14.3 Page-Level SEO

| Page | Primary Keywords | Title Tag | Meta Description |
|------|-----------------|-----------|-----------------|
| `/` (Homepage) | Salon name, salon Marrakech | `{Salon Name} — {Tagline}` | `{Brand description, 155 chars}` |
| `/services/hair` | Hair salon Marrakech, hair services | `Hair Services — {Salon Name}` | `{Hair service description, 155 chars}` |
| `/services/color` | Hair color Marrakech, color specialist | `Color Services — {Salon Name}` | `{Color service description, 155 chars}` |
| `/services/bridal` | Bridal hair Marrakech, wedding stylist | `Bridal Services — {Salon Name}` | `{Bridal service description, 155 chars}` |
| `/services/spa` | Spa Marrakech, wellness treatments | `Spa & Wellness — {Salon Name}` | `{Spa service description, 155 chars}` |

### 14.4 Technical SEO Implementation

**TanStack Router SEO:** TanStack Router supports document metadata via `useHead` or a head management library. Each route sets:
- `<title>` — unique per page
- `<meta name="description">` — unique per page
- `<meta property="og:title">` — Open Graph title
- `<meta property="og:description">` — Open Graph description
- `<meta property="og:image">` — Open Graph image (per-page or default)
- `<meta property="og:url">` — Canonical URL
- `<link rel="canonical">` — Canonical URL

**Semantic HTML:**
- One `<h1>` per page (the page title or hero heading)
- `<h2>` for each homepage section heading (Hero, Whisper, Services, etc.)
- Never skip heading levels: `<h1>` → `<h2>` → `<h3>` is valid; `<h1>` → `<h3>` is not
- `<main>`, `<nav>`, `<header>`, `<footer>` landmark elements
- `<article>` for testimonials, `<section>` for narrative sections

**Structured Data (JSON-LD):**

```json
// Service detail pages
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Hair Services",
  "provider": {
    "@type": "HairSalon",
    "name": "{Salon Name}",
    "address": { "@type": "PostalAddress", ... },
    "telephone": "{phone}"
  },
  "areaServed": "Marrakech",
  "serviceType": "Hair Styling"
}

// Homepage
{
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "{Salon Name}",
  "address": { ... },
  "openingHours": { ... },
  "priceRange": "$$",
  "aggregateRating": { ... }
}
```

### 14.5 Internal Linking Strategy

From the INFORMATION_ARCHITECTURE.md, six rules:

1. **Every service section links to its detail page** — `<a href="/services/hair">` from the Hair section
2. **Every service detail page links back to the homepage** — "Return to experience" link
3. **Service detail pages cross-link** — Hair detail links to Color, Bridal, Spa
4. **Navigation links target homepage sections** — smooth scroll, not route changes
5. **Booking CTAs appear in multiple sections** — but all open the overlay, not a new page
6. **Footer contains full site map** — all routes accessible from footer

### 14.6 Local SEO

- **NAP consistency:** Name, Address, Phone number identical everywhere (website, Google Business, directories)
- **Google Business Profile:** Claimed and optimized
- **Location references:** "Marrakech" appears naturally in homepage copy and service detail pages
- **Schema.org LocalBusiness:** Implemented on homepage
- **Map embed:** On service detail pages or a dedicated location section (V1: link to Google Maps)

### 14.7 Sitemap and robots.txt

```
// sitemap.xml
- / (priority: 1.0, changefreq: weekly)
- /services/hair (priority: 0.8, changefreq: monthly)
- /services/color (priority: 0.8, changefreq: monthly)
- /services/bridal (priority: 0.8, changefreq: monthly)
- /services/spa (priority: 0.8, changefreq: monthly)
- /booking/confirmation (priority: 0.0, noindex)

// robots.txt
User-agent: *
Allow: /
Disallow: /booking/confirmation
Sitemap: https://domain.com/sitemap.xml
```

### 14.8 SSR/SSG Considerations

For maximum SEO, service detail pages should be server-side rendered or statically generated at build time. The homepage can be client-rendered because:
1. It is the brand page — it ranks on brand name, not content keywords
2. The hero image and H1 are in the HTML shell
3. The Warm Unveiling animation provides the "first paint" experience

**Implementation option:** Use TanStack Router's `loader` with Vite SSR, or use a build-time static generation step for service detail pages. The decision depends on deployment infrastructure (see Section 15).

---

## 15. Performance Strategy

### 15.1 Why This Section Exists

Performance is not a nice-to-have. A 1-second delay in page load reduces conversions by 7%. For a narrative experience that depends on first impressions (the Warm Unveiling must arrive within 1200-1500ms), performance IS the experience.

### 15.2 Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Google Core Web Vital, directly impacts SEO |
| **INP** (Interaction to Next Paint) | < 200ms | Google Core Web Vital, measures responsiveness |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Google Core Web Vital, measures visual stability |
| **Initial bundle size** | < 300KB (gzipped) | Reasonable for React 18 + routing |
| **Total page weight** | < 1MB (initial load) | Including hero image |
| **Mobile PageSpeed** | 90+ | Industry standard for premium sites |
| **Time to Interactive** | < 3.5s on 3G | 80%+ of visitors on mobile |

### 15.3 Bundle Optimization

**Code Splitting Strategy:**

```
Initial bundle (critical):
├── React 18 core
├── TanStack Router (route matching only)
├── Root layout + homepage above-fold components
├── Critical CSS (inlined)
└── Hero image

Deferred chunks (loaded on scroll/interaction):
├── GSAP + ScrollTrigger
├── Lenis smooth scroll
├── Below-fold homepage sections
├── Booking overlay
└── Service detail page code

Lazy chunks (loaded on demand):
├── React Three Fiber + Drei (3D)
├── TipTap (rich text)
├── Framer Motion (used only where needed)
└── Analytics library
```

**Tree Shaking:** Vite's ESM-based build automatically tree-shakes unused code. Import only what's needed:
```typescript
// Preferred
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Not preferred
import gsap from 'gsap/all';
```

### 15.4 Image Performance

The hero image is the largest contentful paint candidate. Its optimization is critical:

1. **AVIF format** with WebP fallback — 30-50% smaller than JPEG
2. **Responsive sizes** — serve 640px on mobile, 1920px on desktop
3. **Preloaded** — `<link rel="preload" as="image">` in HTML head
4. **`fetchpriority="high"`** — tells the browser to prioritize this image
5. **Explicit dimensions** — `width` and `height` attributes prevent CLS
6. **Below-fold images** — `loading="lazy"`, loaded only when approaching viewport

### 15.5 CSS Performance (Tailwind CSS v4)

Tailwind CSS v4 generates only the CSS that's used:

- **Zero-runtime:** No JavaScript CSS-in-JS overhead
- **Purge unused:** Only classes actually used in components are included
- **Critical CSS:** Above-fold styles inlined in HTML
- **No layout thrashing:** Tailwind utilities are single-property, not compound selectors

### 15.6 JavaScript Performance

- **No layout thrashing in animations:** GSAP animates `transform` and `opacity` only (GPU-composited)
- **Passive event listeners:** Scroll and touch events use `{ passive: true }`
- **Debounced scroll handlers:** Navigation scroll detection debounced at 16ms (one frame)
- **`requestAnimationFrame` for visual updates:** All scroll-linked visual updates go through rAF
- **No synchronous operations on main thread:** All heavy computation deferred to `requestIdleCallback` or Web Workers

### 15.7 Caching Strategy

**Browser Caching:**

| Asset | Cache Duration | Strategy |
|-------|---------------|----------|
| HTML | No cache | Always fresh (served from CDN edge) |
| JS bundles | 1 year (content-hashed filenames) | Immutable cache |
| CSS | 1 year (content-hashed filenames) | Immutable cache |
| Images | 1 month | Stale-while-revalidate |
| Fonts | 1 year | Immutable cache |
| API responses | No cache (handled by TanStack Query) | Client-side caching |

**CDN Strategy:**

The static assets (JS, CSS, images, fonts) should be served from a CDN edge:
- Vercel, Cloudflare Pages, or Netlify for static hosting
- Edge deployment for low latency (important for Marrakech visitors)
- Brotli compression for text assets

### 15.8 Third-Party Script Management

**Allowed third-party scripts (V1):**
| Script | Purpose | Loading Strategy |
|--------|---------|-----------------|
| Plausible/Fathom/Umami | Analytics | `<script defer>` in head, no cookies |

**Prohibited third-party scripts (V1):**
- Google Analytics / Google Tag Manager (cookies, GDPR)
- Facebook Pixel (tracking, privacy)
- Hotjar / FullStory (session recording, performance)
- Any script that adds >50KB to page weight
- Any script that blocks rendering

### 15.9 Performance Monitoring

- **Lighthouse CI** in the build pipeline — automated performance audits on every PR
- **Core Web Vitals tracking** via analytics (Plausible supports this)
- **Real User Monitoring (RUM):** If available through the analytics provider, track actual visitor performance
- **Bundle analysis:** Use `vite-plugin-visualizer` to identify bundle size increases

### 15.10 The 3G Performance Requirement

The FEATURE_DEFINITION.md explicitly requires 3G usability. This means:

- The initial page load must be functional on a 3G connection (~1.5 Mbps)
- Above-the-fold content must appear within 5 seconds on 3G
- Below-fold content loads progressively as the visitor scrolls
- Images are the first to degrade — serve smaller sizes on slower connections
- 3D is disabled entirely on slow connections (detected via `navigator.connection`)

---

## 16. Accessibility Strategy

### 16.1 Why This Section Exists

Accessibility is not a feature. It is a requirement. WCAG 2.1 Level AA compliance is non-negotiable. This is not because the law requires it (though it might), but because the brand's core value is warmth and welcome — and a website that excludes people with disabilities is neither warm nor welcoming.

### 16.2 Compliance Target

**WCAG 2.1 Level AA minimum, Level AAA where achievable.**

From the DESIGN_SYSTEM_DECISIONS.md, these accessibility requirements are binding:

| Requirement | Standard | Implementation |
|------------|----------|----------------|
| Text contrast | Normal: 4.5:1, Large: 3:1 | Warm charcoal on warm off-white achieves 7:1+ |
| Keyboard navigation | All interactive elements reachable | Tab order, focus management, skip-to-content |
| Focus indicators | Gold accent, 2px minimum, never removed | `outline: 2px solid gold` on `:focus-visible` |
| `prefers-reduced-motion` | All motion disabled | CSS query + JavaScript detection |
| Form labels | All fields have associated labels | `<label>` elements, `aria-label` where visual labels absent |
| Error messages | Specific and helpful | Field-level errors, warm red-brown color |
| Screen reader landmarks | Header, nav, main, footer | Semantic HTML5 elements |
| Touch targets | 44×44px minimum, 8px spacing | Tailwind `min-h-[44px] min-w-[44px]` |
| Content reflow | 200% text zoom, no horizontal scroll | Responsive layout, relative units |
| Heading hierarchy | Never skip levels | One h1, h2 for sections, h3 for subsections |
| Alt text | Descriptive for meaningful images | Component-level alt text props |
| No color-only communication | Secondary signal for every color distinction | Icons + text + color for states |

### 16.3 The Accessibility Layer Cake

```
Layer 4: User Experience
         • Keyboard-navigable booking flow
         • Screen reader-friendly narrative
         • Touch-optimized mobile experience
         
Layer 3: ARIA & Semantic Enhancement
         • aria-labels on interactive elements
         • aria-live regions for dynamic content
         • role attributes where HTML semantics are insufficient
         
Layer 2: Semantic HTML
         • Proper heading hierarchy
         • landmark elements (header, nav, main, footer)
         • Form labels, fieldset, legend
         • Button vs. link distinction
         
Layer 1: Visual Accessibility
         • Color contrast (7:1+)
         • Focus indicators (2px gold ring)
         • No content loss at 200% zoom
         • Reduced motion support
```

### 16.4 Accessibility by Feature

**Navigation:**
- Skip-to-content link (first focusable element)
- Keyboard-navigable hamburger menu on mobile
- Focus trap within mobile menu when open
- `aria-expanded` on hamburger button
- `aria-current="page"` on active navigation link

**Booking Flow:**
- Focus management: When a step opens, focus moves to the first interactive element
- Progress indicator with `aria-valuenow` for screen readers
- Form validation errors announced via `aria-live="polite"`
- Back button is keyboard-reachable
- Confirmation announced via `aria-live="assertive"`

**Scroll Animations:**
- All scroll-triggered content is visible without animation (content is in the DOM, animation is enhancement)
- `aria-hidden="true"` on decorative elements
- Skip-to-content bypasses all animated sections

**Transformation Dissolve:**
- Both images have descriptive alt text
- The "before" and "after" states are communicated via text, not just visual crossfade
- Screen reader receives the narrative description of the transformation

**Image Loading:**
- Placeholder has a meaningful `alt` attribute (describes the incoming image)
- `role="presentation"` on decorative images
- Images that convey information have descriptive alt text

### 16.5 Testing Accessibility

- **Automated:** axe-core integration in the build pipeline (runs on every page)
- **Manual keyboard testing:** Every feature must be completable using only keyboard
- **Screen reader testing:** VoiceOver (macOS), NVDA (Windows) — monthly manual audit
- **Color contrast testing:** Contrast ratio checked for every text/background combination
- **Zoom testing:** All pages tested at 200% browser zoom

### 16.6 Reduced Motion

When `prefers-reduced-motion: reduce` is active:
- All GSAP animations set to `duration: 0`
- Framer Motion uses `reduceMotion: "always"`
- Lenis smooth scroll is disabled (native scroll restored)
- Section content appears immediately (no fade-in)
- Hero appears immediately (no Warm Unveiling)
- Transformation Dissolve shows both images simultaneously
- The emotional journey is preserved through content and typography alone

---

## 17. Testing Philosophy

### 17.1 Why This Section Exists

Testing is not about proving the code works today. It is about ensuring the code works tomorrow, after a new developer modifies a component, after a library update, after a browser change. For a narrative experience where subtle animation timing matters as much as data correctness, the testing philosophy must be comprehensive and thoughtful.

### 17.2 The Testing Pyramid

```
                    ┌───────────────┐
                    │   E2E Tests   │  ← Few, critical paths
                    │  (Playwright) │
                    ├───────────────┤
                  │  Integration    │  ← Moderate, feature-level
                  │   Tests (RTL)  │
                ├───────────────────┤
              │    Unit Tests        │  ← Many, function-level
              │   (Vitest)          │
            └─────────────────────────┘
```

### 17.3 Test Categories

**Unit Tests (Vitest):**
- Pure functions (date formatting, price calculation, slug generation)
- Custom hooks (with `renderHook`)
- Redux reducers and selectors
- Animation timing calculations
- Type guards and validators

**Integration Tests (React Testing Library):**
- Component rendering with mock data
- Booking flow step transitions
- Form validation and submission
- Navigation behavior
- Error state rendering
- Accessibility compliance (via axe-core)

**End-to-End Tests (Playwright):**
- Homepage loads and hero is visible
- Scroll through all 16 sections
- Booking flow from start to confirmation
- Service detail page navigation
- 404 page display
- Mobile menu toggle
- Keyboard navigation through booking flow

### 17.4 What We Test and What We Don't

**We test:**
- ✅ Booking flow state transitions (the conversion funnel)
- ✅ Form validation logic (every error state)
- ✅ API data rendering (services, artisans, testimonials display correctly)
- ✅ Navigation (routing, smooth scroll, mobile menu)
- ✅ Accessibility (keyboard navigation, screen reader landmarks, contrast)
- ✅ Error handling (network failures, validation errors, 404)
- ✅ Responsive layouts (mobile, tablet, desktop)
- ✅ Redux state management (booking flow, UI state)

**We do not test:**
- ❌ Exact animation pixel values (tested visually, not programmatically)
- ❌ Third-party library internals (GSAP, TanStack Query behavior)
- ❌ Visual design compliance (tested via design review, not automated)
- ❌ Performance benchmarks in unit tests (tested via Lighthouse CI)
- ❌ SEO metadata correctness (tested via manual audit)

### 17.5 Animation Testing

Animation testing is inherently difficult because GSAP animations are time-based and scroll-linked. The approach:

1. **Hook-level testing:** Test that `useScrollReveal` returns the correct ref and visibility state. Mock GSAP.
2. **Configuration testing:** Test that timing values are within the ranges defined in DESIGN_SYSTEM.md. For example: hero reveal must be between 1200-1500ms.
3. **Visual regression testing (V2):** Capture screenshots at specific scroll positions. Compare against baseline. This catches visual drift but is expensive to maintain.
4. **Manual visual testing:** The primary method for animation quality. Automated tools cannot judge whether the Warm Unveiling "feels right."

### 17.6 Test File Organization

```
src/
├── features/
│   ├── booking/
│   │   ├── __tests__/
│   │   │   ├── booking-overlay.test.tsx
│   │   │   ├── booking-flow.test.tsx
│   │   │   └── booking-form-validation.test.ts
│   │   └── booking-overlay.tsx
├── shared/
│   ├── hooks/
│   │   ├── __tests__/
│   │   │   ├── use-scroll-reveal.test.ts
│   │   │   └── use-availability.test.ts
│   │   └── animation/
│   │       └── use-scroll-reveal.ts
```

Tests live next to the code they test, in a `__tests__/` directory. Test files match source file names with `.test.ts` or `.test.tsx` suffix.

### 17.7 CI/CD Testing Pipeline

```
Pull Request Created
    → Lint (ESLint + TypeScript)
        → Unit Tests (Vitest)
            → Integration Tests (Vitest + RTL)
                → Build (Vite)
                    → Lighthouse CI (performance audit)
                        → Axe-core (accessibility audit)
                            → E2E Tests (Playwright)
                                → PR Review Ready
```

---

## 18. Future Scalability

### 18.1 Why This Section Exists

The planning documents define a phased evolution: V1 (narrative site + booking), V2 (CMS + admin), V3 (AI features). The architecture must accommodate this evolution without rewrite.

### 18.2 V1 → V2 Expansion Points

**V1 (Current):**
- Static content managed in code
- Manual booking management (phone/email confirmation)
- No admin interface

**V2 Additions (planned):**

| Feature | Architecture Impact | Preparedness |
|---------|-------------------|-------------|
| **CMS (TipTap)** | Content editing for services, artisans, testimonials | TipTap already in stack, deferred integration |
| **Admin Dashboard** | New route (`/admin`), new layout, authentication | Route organization supports adding `/admin` |
| **Booking Management** | Admin views/modifies bookings | API endpoints already defined, just add auth |
| **Authentication** | Admin login, session management | Express middleware prepared for auth layer |
| **Email/SMS Confirmations** | BullMQ job processor already defined | Infrastructure ready, just add email service |
| **French/Arabic** | i18n for content and UI | Component structure supports i18n wrapping |

**Preparation in V1:**
- Content is typed with TypeScript interfaces that can accept CMS-sourced data
- API endpoints are designed for CRUD operations, not just Read
- BullMQ job queue is installed and configured for future email/SMS jobs
- TipTap is installed for future admin content editing

### 18.3 V2 → V3 Expansion Points

| Feature | Architecture Impact | Preparedness |
|---------|-------------------|-------------|
| **AI Style Recommendations** | New API endpoint, ML model integration | API architecture supports new endpoints |
| **Virtual Try-On** | WebRTC/canvas integration | React Three Fiber in stack for 3D rendering |
| **Chat-Based Booking** | WebSocket or polling, conversational UI | Express supports WebSocket upgrade |
| **Multi-Language** | i18n framework, content translation | Component structure supports i18n |

### 18.4 V3 → V4+ Expansion Points

| Feature | Architecture Impact |
|---------|-------------------|
| **Multi-Location** | Data model expansion, location-based routing |
| **E-Commerce** | Product model, payment integration (Stripe) |
| **Loyalty Program** | User accounts, points system |
| **Mobile App** | React Native (shares `packages/shared` types) |

### 18.5 The API Versioning Strategy

All API endpoints are prefixed with `/api/`. When breaking changes are needed (V2, V3), new versions are introduced:

```
/api/v1/services     → V1 API
/api/v2/services     → V2 API (when needed)
```

V1 API remains operational during V2 migration. No breaking changes to V1 endpoints.

### 18.6 The Component Evolution Strategy

Components are versioned implicitly through their prop interfaces. When a component's API changes:
1. The new version is created alongside the old (e.g., `ServiceCardV2.tsx`)
2. Consumers migrate incrementally
3. The old version is removed once no consumers remain

This prevents large-bang rewrites and allows gradual migration.

### 18.7 The Database Migration Strategy

Drizzle ORM generates SQL migrations from schema changes. The workflow:

1. Modify schema in `packages/db/src/schema/`
2. Run `drizzle-kit generate` to create migration SQL
3. Review the generated SQL
4. Run `drizzle-kit push` to apply to development database
5. Migrations are version-controlled and applied in order during deployment

**No schema-breaking changes without migration scripts.** Every schema change has a corresponding migration that can be applied forward and rolled back.

---

## 19. Monorepo Philosophy

### 19.1 Why This Section Exists

The project uses a monorepo structure with multiple packages. This section explains why, how it's organized, and what tooling manages it.

### 19.2 Why Monorepo

A monorepo is chosen because:
1. **Shared types:** The `packages/shared` package ensures frontend and backend share TypeScript interfaces. A change to a booking API response type is immediately visible in both the Express route handler and the React component.
2. **Atomic changes:** A feature that spans frontend and backend (e.g., adding gift card support) can be committed in a single PR.
3. **Consistent tooling:** One TypeScript config, one ESLint config, one build pipeline.
4. **Future flexibility:** Adding a mobile app or admin dashboard is trivial in a monorepo — add a new `apps/` entry that imports shared packages.

### 19.3 Monorepo Tooling

**Package Manager:** pnpm workspaces (preferred for monorepos due to strict dependency resolution and efficient disk usage)

**Build Orchestration:** Turborepo (or equivalent) for:
- Parallel package builds
- Dependency-aware task ordering
- Caching of build outputs
- Incremental builds

**Workspace Configuration:**

```json
// Root package.json (conceptual)
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### 19.4 Package Dependency Graph

```
apps/web (frontend)
├── depends on → packages/shared (types, constants)
├── depends on → packages/db (schema types for TanStack Query generics)
└── external deps → React, GSAP, TanStack, etc.

packages/api (backend)
├── depends on → packages/shared (types, constants)
├── depends on → packages/db (schema, migrations)
└── external deps → Express, Drizzle, Redis, BullMQ

packages/db (database)
├── depends on → packages/shared (types, constants)
└── external deps → Drizzle ORM, PostgreSQL driver

packages/shared (shared)
└── depends on → nothing (leaf package)
```

**Rule:** Dependencies flow downward. `apps/web` depends on `packages/shared`, not the reverse. `packages/shared` depends on nothing. This prevents circular dependencies.

### 19.5 Shared Type Package

The `packages/shared` package is the contract between frontend and backend:

```typescript
// packages/shared/src/types/booking.ts (conceptual)
export interface BookingRequest {
  serviceId: string;
  artisanId: string;
  date: string;        // ISO 8601 date
  timeSlot: string;    // HH:MM format
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
}

export interface BookingResponse {
  id: string;
  status: 'pending' | 'confirmed';
  service: ServiceSummary;
  artisan: ArtisanSummary;
  date: string;
  timeSlot: string;
  createdAt: string;
}
```

This type is used by:
- **Express route handler** — validates incoming `BookingRequest`, returns `BookingResponse`
- **React booking form** — sends `BookingRequest`, receives `BookingResponse`
- **TanStack Query mutation** — types the mutation function
- **API tests** — types the test fixtures

One source of truth. Type drift between frontend and backend is impossible.

### 19.6 Monorepo Scripts

```json
// Root scripts
{
  "dev": "turbo run dev",                    // Start all dev servers
  "build": "turbo run build",               // Build all packages
  "test": "turbo run test",                 // Run all tests
  "lint": "turbo run lint",                 // Lint all packages
  "typecheck": "turbo run typecheck",       // TypeScript check all
  "db:generate": "pnpm --filter @salon/db generate",
  "db:push": "pnpm --filter @salon/db push",
  "db:migrate": "pnpm --filter @salon/db migrate"
}
```

---

## 20. Coding Conventions

### 20.1 Why This Section Exists

Conventions are the social contract of a codebase. They reduce cognitive load, eliminate bikeshedding, and ensure that code written by different developers reads as if written by one person. These conventions are derived from the design system's naming rules and adapted for TypeScript/React.

### 20.2 File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React components | kebab-case.tsx | `service-card.tsx` |
| TypeScript modules | kebab-case.ts | `animation-timing.ts` |
| Test files | kebab-case.test.ts(x) | `service-card.test.tsx` |
| Hook files | kebab-case.ts (prefixed `use-`) | `use-scroll-reveal.ts` |
| Type files | kebab-case.types.ts | `booking.types.ts` |
| Config files | kebab-case.config.ts | `tailwind.config.ts` |
| Utility files | kebab-case.ts | `format-price.ts` |
| Feature folders | kebab-case | `booking-flow/`, `service-detail/` |

### 20.3 Component Naming

| Pattern | Convention | Example |
|---------|-----------|---------|
| Component name | PascalCase | `ServiceCard`, `BookingOverlay` |
| Component file | kebab-case | `service-card.tsx`, `booking-overlay.tsx` |
| Exported from index | Named export | `export { ServiceCard }` |
| Default export | Only for pages/routes | `export default function HomePage()` |
| Variant naming | BEM-inspired | `Button--primary`, `Card_expanded` |
| Singular always | No plural component names | `ServiceCard`, not `ServiceCards` |

### 20.4 TypeScript Conventions

**Strict mode enabled.** `tsconfig.json` has `"strict": true` with no exceptions.

**Type annotations:**
- **Always explicit return types** on exported functions
- **No `any`** — use `unknown` and type narrow
- **Interface over type** for object shapes (interfaces are extendable, more readable)
- **Type imports:** Use `import type` for type-only imports

```typescript
// Preferred
import type { BookingRequest } from '@salon/shared';

// Not preferred
import { BookingRequest } from '@salon/shared';
```

**Naming:**
- Interfaces: PascalCase, no `I` prefix (`BookingRequest`, not `IBookingRequest`)
- Type guards: `is` prefix (`isBookingComplete`, not `checkBookingComplete`)
- Enums: PascalCase values (`BookingStatus.Confirmed`, not `BOOKING_STATUS_CONFIRMED`)
- Constants: UPPER_SNAKE_CASE only for true constants (`MAX_TRANSLATION_PX`), camelCase for everything else

### 20.5 Import Order

```typescript
// 1. External packages (React, GSAP, TanStack)
import { useState } from 'react';
import { gsap } from 'gsap';
import { useQuery } from '@tanstack/react-query';

// 2. Internal packages (@salon/*)
import type { Service } from '@salon/shared';
import { useServices } from '@salon/shared/hooks';

// 3. Feature imports (relative, from features/)
import { ServiceCard } from '../service-card';

// 4. Shared imports (relative, from shared/)
import { Button } from '../../shared/ui/button';
import { useScrollReveal } from '../../shared/hooks/animation/use-scroll-reveal';

// 5. Local imports (same directory)
import { transformTimingConfig } from './transformation.config';
import type { TransformationProps } from './transformation.types';
```

**Enforced via ESLint import ordering rule.** No manual enforcement needed.

### 20.6 CSS/Tailwind Conventions

- **Utility-first:** All styling via Tailwind utility classes. No custom CSS except for GSAP-injected styles and Tailwind's `@layer` directives.
- **Component variant via class-variance-authority (cva):** For components with multiple variants (Button, Card), use `cva` to define variant classes.
- **Responsive prefix order:** Mobile-first: no prefix → `md:` → `lg:` → `xl:` (never reverse)
- **Dark mode:** `dark:` prefix (prepared for V2 dark mode implementation)
- **Custom properties:** For animation timing values referenced in CSS: `--animation-duration: 500ms;`
- **No inline styles** except for dynamic values computed from JavaScript (e.g., GSAP-injected transforms)

### 20.7 Comment Standards

- **No comments for obvious code.** If the code needs a comment to explain what it does, rewrite the code.
- **"Why" comments are mandatory.** If a decision is non-obvious, explain the reasoning: `// GSAP ScrollTrigger requires refresh after Lenis initialization — see GSAP docs`
- **TODO format:** `// TODO(author): Description — ticket/link` — every TODO has an owner and context
- **No commented-out code.** It's in git history. Delete it.
- **Section comments for long files:** `// --- Animation Configuration ---` as visual landmarks

### 20.8 Git Conventions

**Branch naming:**
```
feature/transformation-dissolve      # New features
fix/booking-time-slot-overlap        # Bug fixes
docs/animation-architecture          # Documentation
refactor/booking-flow-state          # Refactoring
```

**Commit messages:** Conventional Commits format
```
feat: add Transformation Dissolve scroll-linked animation
fix: prevent double-booking in time slot selection
docs: update animation architecture section
refactor: extract booking state machine into custom hook
```

**PR requirements:**
- Descriptive title and body
- Screenshots/recordings for visual changes
- Accessibility checklist completed
- No merge conflicts
- All CI checks passing

### 20.9 Error Message Conventions

**User-facing errors:** Warm, helpful, specific
- ✅ "That time slot was just booked. Here are the next available times."
- ❌ "Error: Slot unavailable."

**Developer-facing errors:** Precise, actionable
- ✅ `[BookingFlow] Failed to fetch availability for artisan ${artisanId} on ${date}: ${error.message}`
- ❌ `Error fetching data`

### 20.10 The Code Review Checklist

Every PR must verify:
- [ ] TypeScript strict mode compliance (no `any`, no type assertions without justification)
- [ ] Accessibility: keyboard navigable, screen reader friendly, focus visible
- [ ] Responsive: works on mobile (375px), tablet (768px), desktop (1024px), wide (1440px+)
- [ ] Performance: no layout thrashing, images lazy-loaded, no unnecessary re-renders
- [ ] Animation: respects `prefers-reduced-motion`, cleans up on unmount, GSAP kill in useEffect
- [ ] Error handling: loading, error, and success states implemented
- [ ] Testing: new logic has tests, existing tests still pass
- [ ] Naming: follows conventions in this document
- [ ] Design system: uses design tokens, follows component patterns, matches visual spec

---

*This document is the architectural blueprint for the project. Every decision herein is permanent until formally amended through a documented, intentional process. It is derived from all 17 approved planning documents and represents the complete technical foundation.*

*Document prepared: July 2026*
*Source: All approved planning documents, DESIGN_SYSTEM.md, DESIGN_SYSTEM_DECISIONS.md*

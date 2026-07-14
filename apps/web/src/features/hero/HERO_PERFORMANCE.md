# Hero Performance Architecture

> Phase 4.7 — Performance Preparation
> Role: Lead Performance Engineer / Web Vitals Specialist

## Overview

The hero section is the first thing every visitor sees. Its performance directly determines whether the visitor stays or bounces. This document describes the performance architecture that keeps the hero fast, stable, and non-blocking.

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| **LCP** | < 2.5s | Eager image loading, font preload, `<link rel="preload">` |
| **CLS** | < 0.05 | Explicit dimensions, `aspect-ratio`, font metric preparation |
| **INP** | < 200ms | No blocking JS, event handlers use `useCallback` |
| **TTFB** | < 800ms | Server responsibility — not managed by hero code |

## Architecture

### Render Pipeline

```
Mount → Loading Threshold → Asset Loading → Reveal Animation → Idle → 3D (optional)
  │           │                    │                │              │        │
  │     HeroLoading         useHeroAssets     useHeroAnimation  GSAP     R3F
  │     (branded)          (preload+fonts)    (warm unveil)   (lazy)   (lazy)
  │
  └── Immediate: Background + Content skeleton visible within first frame
```

### Component Render Order

```
HeroErrorBoundary
└── HeroInteractionProvider (context)
    └── <section role="banner">
        ├── HeroBackground (z:0) — always visible, warm surface
        ├── HeroMedia (z:1) — image loads eagerly via <picture>
        ├── Hero3DMount (z:1) — deferred until browser idle
        ├── HeroOverlay (z:2) — static atmospheric layers
        ├── HeroContent (z:10) — memoized, fades in on reveal
        ├── HeroLoading (z:100) — fades out when hero is ready
        └── HeroScrollIndicator — visible when hero is ready
```

### File Organization

| File | Purpose | Phase |
|------|---------|-------|
| `hero-perf.config.ts` | Performance budgets, asset paths, lazy thresholds | 4.7 |
| `hero-performance.css` | CLS prevention, GPU hints, content-visibility | 4.7 |
| `hooks/use-hero-performance.ts` | Core Web Vitals measurement (LCP, CLS, INP) | 4.7 |
| `hooks/use-hero-assets.ts` | Asset loading, font validation, preload injection | 4.7 |
| `hooks/use-deferred-load.ts` | Browser idle deferral via rIC/setTimeout | 4.7 |
| `hooks/use-gsap-lazy.ts` | GSAP/ScrollTrigger dynamic import singleton | 4.7 |

## Optimization Strategies

### 1. Render Optimization

**React.memo** — Applied to all sub-components that receive stable props:
- `HeroContent` — memoized (brandName, tagline, cta, variant rarely change)
- `HeroMedia` — memoized (loadState transitions once)
- `HeroLoading` — memoized (isVisible transitions once)
- `Hero3DMount` — memoized (is3DEnabled, hasWebGL are stable)
- `HeroScrollIndicator` — memoized (label, bottom, isVisible stable)
- `HeroBackground` — already memoized (prefersReducedMotion stable)
- `HeroOverlay` — already memoized (layers count stable)

**useMemo** — Stabilizes computed objects:
- `HeroSection.config` — merged config object, depends on configOverrides
- `HeroContent` styles — containerStyle, headlineStyle, taglineStyle, ctaGroupStyle
- `HeroInteractionProvider` context value — prevents consumer re-renders

**useCallback** — Stabilizes function references:
- `HeroSection.handleImageLoad` / `handleImageError` — stable callbacks for HeroMedia
- `HeroInteractionProvider.upgradeMode` / `registerAnimationTarget` — stable refs
- `HeroScrollIndicator` handlers — handleClick, handleKeyDown, mergedRef

### 2. Asset Loading Strategy

```
1. <link rel="preload"> injected for hero image (via use-hero-assets.ts)
2. Image() constructor preloads decoded pixels in background
3. Font Loading API validates critical fonts (Cormorant Garamond, DM Sans)
4. <picture> element negotiates format (AVIF > WebP > JPEG)
5. fetchPriority="high" signals browser priority
6. loading="eager" — no lazy loading for above-the-fold content
```

### 3. CLS Prevention

```
1. Explicit width/height on <img> (1920×1080)
2. CSS aspect-ratio on hero media container
3. HeroLoading reserves full viewport during load (100svh)
4. Font metric preparation (size-adjust) — architecture defined, Phase 11.7
5. Content min-height per variant (mobile: 200px, tablet: 280px, desktop: 320px)
```

### 4. Lazy Loading Boundaries

| Component | Strategy | Trigger |
|-----------|----------|---------|
| Hero3DMount | `useDeferredLoad` + `React.lazy` (Phase 6) | Browser idle |
| GSAP core | `use-gsap-lazy.ts` dynamic import | Idle preload or first animation |
| ScrollTrigger | `use-gsap-lazy.ts` dynamic import | Scroll animation start |
| Below-fold sections | Content-visibility CSS | IntersectionObserver |

### 5. GPU Acceleration

All animations use only `transform` and `opacity` — never animate layout properties:
- `will-change: opacity` on overlay layers
- `will-change: transform` prepared for Phase 9 image reveal
- All GSAP animations target compositor-only properties

### 6. Memory Management

- **AbortController** — Cancels in-flight fetches on unmount (`use-hero-assets.ts`)
- **PerformanceObserver** — Disconnected on unmount (`use-hero-performance.ts`)
- **Event listeners** — All removed on unmount (hover-intent, interaction, assets)
- **Refs** — GSAP context and animation targets cleared on unmount
- **Singleton pattern** — GSAP module loaded once, reused, never re-imported

### 7. Font Loading

```
1. font-display: swap — text visible immediately with system fallback
2. Font Loading API validates critical fonts (document.fonts.load())
3. 3-second timeout — proceed with fallback if fonts don't load
4. Phase 11.7: size-adjust for metric alignment (reduce CLS from swap)
```

## Budget Configuration

All budgets defined in `hero-perf.config.ts`:

```typescript
HERO_PERF_BUDGET = {
  lcpTarget: 2_500,      // 2.5 seconds
  clsBudget: 0.05,       // Near-zero layout shift
  inpTarget: 200,        // 200ms interaction response
  ttfbTarget: 800,       // Server response time
  maxTotalWeight: 600_000, // 600KB total hero weight
  maxImageSize: 400_000,   // 400KB hero image
  maxFontPreloads: 4,      // Max 4 font files preloaded
}
```

## Measurement Infrastructure

`useHeroPerformance` hook provides:
- **LCP** via `PerformanceObserver` (type: `largest-contentful-paint`)
- **CLS** via `PerformanceObserver` (type: `layout-shift`)
- **INP** via `PerformanceObserver` (type: `event`, durationThreshold: 40)
- **Milestones** — mountTime, loadStartTime, imageLoadTime, fontsLoadTime, revealCompleteTime
- **Budget violations** — logged in development, reported to analytics in Phase 13

## Phase Responsibilities

| Phase | Performance Work |
|-------|-----------------|
| 4.7 (current) | Architecture, memo, deferred loading, monitoring, CLS prevention |
| 6 | 3D lazy loading via React.lazy + Suspense |
| 9 | GSAP timeline using lazy-loaded GSAP module |
| 11.6 | Image srcset generation, format optimization |
| 11.7 | Font metric adjustment (size-adjust) for CLS |
| 13 | Performance analytics reporting |
| 14 | Bundle analysis and production budgets |

## DO NOT

- ❌ Animate layout properties (width, height, top, left, padding, margin)
- ❌ Use `React.memo` on components that receive new objects every render (fix the objects first)
- ❌ Preload 3D assets — they load on browser idle
- ❌ Add measurement that blocks the main thread
- ❌ Optimize without measuring — profile first, then optimize

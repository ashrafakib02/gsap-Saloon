# Codebase Audit Report

_Repository: `sovereign-artisor` (The Sovereign Artisor — luxury salon site)_
_Audit date: 2026-07-15 · Branch: `main` · HEAD: `7c7c51f` (PHASE-5.5)_
_Scope: read-only. No code was modified._

---

## Executive Summary

This is an early-phase (PHASE-5 of a multi-phase plan) pnpm + Turborepo monorepo with a React 18 / Vite / TypeScript frontend (`apps/web`) and three backend packages (`packages/{api,db,shared}`). Code quality where implemented is genuinely high: strict TypeScript, thorough JSDoc, consistent token-driven styling, SSR-safe guards, and disciplined cleanup in most hooks. The dominant issue is **imbalance between infrastructure and product**: large, elaborate subsystems (an 853-line scroll-state manager, ~40 narrative hooks, a full feature-flag/env-validation/analytics/logging layer) have been built ahead of the features that would use them, and much of it is **not wired into anything that renders** — the homepage mounts only `<HeroSection>`. The backend packages are essentially empty stubs (`export {}`), and there is **no test infrastructure anywhere** despite `pnpm test` being advertised. There are a handful of real correctness bugs (a duplicated `<main>`/`id` landmark, `useScrollManager` mounted twice, three competing reduced-motion implementations that fight over the same Redux state) and process issues (build artifacts committed to git, a UTF-16-encoded README). None are security-critical — no secrets are committed and input handling is minimal because there is little input yet. Overall health: **structurally sound but over-built for its stage**; the priority is to prune/consolidate duplicates, wire up or quarantine dead infrastructure, add tests, and fix the small correctness bugs before layering on more.

**Health snapshot**

| Area | Rating | Note |
|------|--------|------|
| Architecture | 🟡 | Clean boundaries; heavy over-engineering & unmounted subsystems |
| Consistency | 🟡 | Excellent within a file; duplicate hooks/error boundaries across files |
| Code quality | 🟡 | High craft; lots of dead/stub code by design of the phase plan |
| Type safety | 🟢 | Strict mode, minimal justified `any` |
| Testing | 🔴 | Zero tests, no runner configured |
| Security | 🟢 | No secrets committed; small attack surface so far |
| Performance | 🟢 | Careful rAF/passive/memo discipline; a few duplicate listeners |
| Documentation | 🟡 | Extensive `docs/`, but README is UTF-16-mangled |
| Dependencies | 🟢 | Modern, pinned ranges; a couple unused so far |

---

## 1. Architecture & Structure

**Overall layout.** Monorepo via `pnpm-workspace.yaml` (`apps/*`, `packages/*`) with Turborepo orchestration. Dependency flow is clean and acyclic: `apps/web` → `@salon/shared`; `@salon/api` → `@salon/db` → `@salon/shared` (leaf). `apps/web` uses a hybrid "feature-first at top level, layer-first within" organization (`src/{app,features,shared,lib,styles,types,assets}`), which is a reasonable and well-documented choice (README §Architecture).

### 🔴 Large subsystems are built but never mounted
- **`apps/web/src/features/narrative/`** — ~40 hooks plus `scroll-state-manager.ts` (853 lines), `scrolltrigger-manager.ts`, timeline/transition registries, and configs. A grep for external consumers (`@/features/narrative`) returns **only files inside `narrative/` itself** — nothing in `app/`, no provider, no route mounts `NarrativeProvider`, `useScrollState`, or `scrollStateManager`. The homepage (`app/index.tsx`) renders only `<HeroSection>`.
  - *Why it matters:* Thousands of lines of untested, unrendered code carry maintenance cost, inflate the bundle if accidentally imported, and make it hard to tell "shipped" from "scaffolding." Dead-on-arrival abstractions also tend to be wrong once the real feature arrives.
  - *Suggested fix:* Either mount it behind the sections it's meant to drive, or move not-yet-wired subsystems under a clearly-labeled `_wip`/`experimental` area (or keep on a feature branch) until the consuming sections exist. At minimum, document in the module that it is inert as of PHASE-5.

### 🟡 Runtime infrastructure defined but never invoked
- `lib/analytics.ts` (`initAnalytics`, `trackEvent`), `shared/config/env-validation.ts` (`getEnvConfig`/`validateEnv`), and `shared/config/feature-flags.ts` (`getFeatureFlags`) are only referenced by the dev `foundation.tsx` showcase and their own modules — never called in the real app boot path (`main.tsx` / providers).
  - *Why it matters:* Env validation that never runs gives a false sense of "fail-fast" safety; analytics that's never initialized won't record anything. These read as done but are inert.
  - *Suggested fix:* Call `getEnvConfig()` once during boot (in `main.tsx` before `createRoot`) and wire `initAnalytics` behind the `analytics` feature flag in a provider/effect.

### 🟡 Backend packages are empty stubs
- `packages/db/src/schema/index.ts` is a comment only; `packages/db/src/index.ts` does `export * from './schema'` → exports nothing. `packages/api/src/lib/{redis,bullmq}.ts` are `export {}`. `packages/api/src/{routes,services,middleware,jobs}` are `.gitkeep` only. The API server exposes only `/api/health`.
  - *Why it matters:* Expected for PHASE-5, but `drizzle.config.ts` points `schema: './src/schema/*'` at an empty dir, so `db:generate`/`db:push` will no-op or error. The `@salon/db` → `@salon/shared` dependency is currently unused.
  - *Suggested fix:* Fine to leave as scaffolding, but note it in the tracker; guard the `db:*` scripts or add a placeholder schema so they don't fail confusingly.

### 🟢 Provider composition is clean
`app/providers/root-provider.tsx` composes Redux → Query → Theme → Animation → Portal → Cursor in a documented, sensible order. Each provider is small and single-purpose. Good separation of "app boot" (`main.tsx`) from "route-level concerns" (`__root.tsx`).

---

## 2. Code Consistency

### 🔴 Three competing reduced-motion implementations share one Redux field
- `shared/hooks/ui/use-reduced-motion.ts` — dispatches `setReducedMotion` from a `matchMedia` listener and reads it back from Redux.
- `app/providers/theme-provider.tsx` (lines 110–125) — does the **exact same** `matchMedia('(prefers-reduced-motion: reduce)')` subscribe + `dispatch(setReducedMotion(...))`.
- `shared/hooks/ui/use-prefers-reduced-motion.ts` — a third variant that reads `matchMedia` via `useMediaQuery` and does **not** touch Redux.
  - *Why it matters:* `Navigation` calls `useReducedMotion()` while `ThemeProvider` also subscribes — so there are (at least) two independent listeners both writing the same `state.ui.isReducedMotion`, and a third hook that reports a value that may diverge from Redux. Redundant listeners and a real source-of-truth ambiguity.
  - *Suggested fix:* Pick one owner. Let `ThemeProvider` be the sole subscriber that writes Redux; expose a thin `useReducedMotion()` that only *reads* `state.ui.isReducedMotion`; delete `use-prefers-reduced-motion.ts` (or make it the internal primitive used only by the provider).

### 🟡 Duplicate scroll hooks (shared vs. narrative)
Two unrelated `useScrollDirection` implementations exist:
- `shared/hooks/ui/use-scroll-direction.ts` — standalone `window.scroll` + rAF, returns `'up' | 'down'`.
- `features/narrative/hooks/use-scroll-direction.ts` — reads from `scrollStateManager`, returns `{ direction, isScrolling, isForward, isBackward }`.
Similarly `use-scroll-progress` exists in both trees.
  - *Why it matters:* Same name, different shape, different data source — a magnet for import mistakes and behavioral drift.
  - *Suggested fix:* Namespace or rename (e.g., `useNavScrollDirection` vs. `useNarrativeScrollDirection`), and once the narrative manager is the single source of truth, retire the standalone `shared` versions.

### 🟡 Three error-boundary variants, one unused and stylistically inconsistent
- `app/error-boundary.tsx` `RootErrorBoundary` (token-styled).
- `shared/feedback/error-boundary.tsx` `ErrorBoundary` (token-styled, section-level).
- `shared/feedback/enhanced-error-boundary.tsx` `EnhancedErrorBoundary` — **never imported anywhere** (grep confirms single match: its own file), and it uses **hardcoded hex colors and font strings** (`#c9a96e`, `#ef4444`, `'Cormorant Garamond', serif`, `#6b7280`) plus inline styles rather than the CSS-variable tokens every other component uses.
  - *Why it matters:* Dead component; and if it were used it would violate the "colors only from tokens" design rule (DESIGN_SYSTEM §3 C4) and drift from dark-mode theming.
  - *Suggested fix:* Delete `EnhancedErrorBoundary`, or if its retry-count feature is wanted, fold it into `ErrorBoundary` and replace hex/inline styles with `var(--color-*)` tokens.

### 🟡 Imports placed at the bottom of `navigation.tsx`
`features/navigation/navigation.tsx` lines 259–260 place `import { useSelector }` and `import type { RootState }` at the **end** of the file, after the component, to feed a helper (`useScrollManagerActiveSection`).
  - *Why it matters:* Valid JS (imports hoist) but violates the top-of-file convention used everywhere else; easy to miss, and lint/formatting tools may flag or reorder it.
  - *Suggested fix:* Move both imports to the top with the other imports.

### 🟢 Strong intra-file consistency
Naming is consistent and idiomatic: kebab-case filenames, `use*` hooks, `PascalCase` components, `SCREAMING_SNAKE` module constants, `camelCase` locals. Styling almost everywhere uses CSS-variable tokens (`var(--color-*)`, `var(--text-*)`, `var(--spacing-*)`). `.editorconfig` + Prettier + ESLint (`recommended-requiring-type-checking`) enforce a uniform baseline.

---

## 3. Code Quality

### 🔴 No test runner despite advertised `test` script
Root `package.json` defines `"test": "turbo run test"` and README documents `pnpm test`, but **no package defines a `test` script**, no test framework (vitest/jest) is in any `devDependencies`, and there are **zero `*.test.ts(x)`/`*.spec` files** in source (only inside `node_modules`). See §5.

### 🟡 Large dev-only showcase committed to the app source
`app/dev/foundation.tsx` is **~2,300 lines** and is a design-token showcase page (`/dev/foundation`). It's self-described as "Development only… Removable in one commit" and uses many inline-style hex values.
  - *Why it matters:* It ships as a real route unless excluded from the production build; it's by far the largest file in the app and skews complexity metrics.
  - *Suggested fix:* Gate the route behind `import.meta.env.DEV` (don't register it in prod builds) or move it out of `src/app` so the router never emits it.

### 🟡 Stub routes return `null`
`app/404.tsx`, `app/services/{hair,color,bridal,spa}.tsx`, and `app/booking/confirmation.tsx` all render `return null`.
  - *Why it matters:* Expected for the phase, but a **404 page that renders nothing** is a poor fallback if a user hits an unknown URL now. `services/_layout.tsx` renders a bare `<Outlet/>`.
  - *Suggested fix:* Give at least the 404 route minimal branded content; leave the others tracked as pending.

### 🟡 `console.error` used directly for error reporting
`app/error-boundary.tsx:39` and `enhanced-error-boundary.tsx:84-90` log via `console` directly, while the codebase has a purpose-built `shared/infra/logger.ts` and `shared/utils/error-utils.ts#logError`.
  - *Why it matters:* Inconsistent error pipeline; production error reporting is a `// TODO` placeholder in both `logError` and the boundaries.
  - *Suggested fix:* Route boundary errors through `logError`/`logger` so the future monitoring integration has a single seam.

### 🟢 Hardcoded values are mostly justified & documented
Magic numbers that exist are named and commented: `SCROLL_HIDE_DELAY = 300`, `SCROLL_THRESHOLD = 10` (navigation), Lenis `duration: 1.2` with rationale, query `staleTime`/`gcTime` with unit comments, rate-limit `windowMs`/`max`. This is good practice. Site constants (`SITE_URL = 'https://thesovereignartisor.com'` in `lib/seo.ts`) are centralized rather than scattered.

### 🟢 Consistent cleanup discipline
Event listeners and observers are removed on unmount across `use-scroll-manager` (disconnect observer, clear timeout), `use-scroll-direction`, `theme-provider`, `cursor`, and `lenis-config` (`cancelAnimationFrame` + `destroy`). No obvious listener leaks in the hero/shared hooks reviewed.

---

## 4. Type Safety & Correctness

### 🔴 Duplicate `<main>` landmark and duplicate DOM id `#main-content`
`app/__root.tsx` (lines 65–70) renders `<main id="main-content" role="main">` wrapping the `<Outlet/>`. But `app/index.tsx` (line 25) **also** renders `<main id="main-content">` for the homepage. Because the homepage renders inside the Outlet, this produces a **nested `<main>` inside `<main>` and two elements with the same `id`**.
  - *Why it matters:* Invalid HTML (only one `<main>`/one id per document), and the skip-link (`href="#main-content"`) now targets an ambiguous anchor — an accessibility regression for a project that explicitly targets WCAG 2.1 AA.
  - *Suggested fix:* Remove the `<main>` wrapper from `app/index.tsx` (let it render a fragment/section); keep the single `<main id="main-content">` in `__root.tsx`.

### 🟡 `useScrollManager` initialized twice
It runs in `__root.tsx` (`useScrollManager()` with no section IDs) **and** inside `Navigation` (`useScrollManager({ sectionIds, onActiveSectionChange })`). Each call sets up hash-deep-link effects and (when given IDs) an IntersectionObserver.
  - *Why it matters:* Two hash-handling effects race on mount/route change; duplicated scroll-to logic. Not catastrophic (the root call passes no section IDs so it skips the observer) but the hash-deep-link `setTimeout(100)` fires twice.
  - *Suggested fix:* Own scroll management in exactly one place (the root), and have `Navigation` consume the active section from Redux + a shared `scrollToSection` rather than re-instantiating the manager.

### 🟢 Strict TS, minimal and mostly justified `any`
`tsconfig.base.json` enables `strict`, `noUnusedLocals/Parameters`, `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames`. Total `any` occurrences in `apps/web/src` are ~52 across 27 files, but 10 are in the generated `routeTree.gen.ts` (excluded from lint) and the rest are largely in typed-escape hatches for GSAP/R3F interop (`use-gsap-lazy.ts`, `animation-registry.ts`, `scrolltrigger.types.ts`) where the third-party types are loose. `error-utils.ts` and `logger.ts` correctly prefer `unknown` over `any` at the public boundary.
  - *Suggested fix:* Where feasible, replace GSAP `any` with `gsap.core.*` types; otherwise annotate each with a `// eslint-disable`/comment explaining the escape.

### 🟢 Good null/SSR guarding
`typeof window === 'undefined'` / `typeof document === 'undefined'` guards are consistent (`env.ts`, `theme-provider`, `use-local-storage`, `scroll-state-manager` snapshot builder). `localStorage` access is universally wrapped in try/catch (`theme-provider`, `feature-flags`, `use-local-storage`).

---

## 5. Testing

### 🔴 No tests and no test infrastructure
- No `*.test.*` or `*.spec.*` files exist in `apps/` or `packages/` source.
- No `vitest`, `jest`, `@testing-library/*`, or `playwright` in any `package.json`.
- No package defines a `test` script, yet root `test` (`turbo run test`) and README both advertise testing.
  - *Why it matters:* Every subsystem here (scroll-state manager, reduced-motion sync, booking reducer state machine, error boundaries, `useScrollManager`) is exactly the kind of pure/logic-heavy code that is cheap to unit test and easy to break silently. The step-clamping logic in `booking-slice.ts` (`nextStep`/`prevStep` bounds), `env-validation`, `feature-flags` parsing, and `error-utils` are ideal first targets.
  - *Suggested fix:* Add Vitest (+ `@testing-library/react` and jsdom) to `apps/web`, define `test` scripts per package so `turbo run test` resolves, and start with pure-logic units: booking reducer, `toAppError`/`getErrorMessage`, `feature-flags` parsing, `validateEnv`, and the scroll-state selectors.

---

## 6. Security

### 🟢 No committed secrets
`.env.example` contains only non-sensitive `VITE_*` URLs; real `.env`/`.env.local` are gitignored. No API keys, tokens, or credentials found in source. Backend `redis`/`bullmq` are stubs so no connection strings are embedded. `drizzle.config.ts` reads `process.env.DATABASE_URL` (correct).

### 🟢 Reasonable API hardening for its size
`packages/api/src/index.ts` uses `helmet()`, `cors` restricted via `CORS_ORIGIN` env (defaulting to localhost), `express.json()`, and `express-rate-limit` (100 req/min). Good defaults even though only `/api/health` exists.

### 🟡 Third-party analytics script injected without SRI / CSP
`lib/analytics.ts` appends a `<script src="https://plausible.io/js/script.js">` to `document.head` with no `integrity` attribute and no documented CSP.
  - *Why it matters:* A compromised or spoofed analytics host could execute arbitrary JS in-page. Low likelihood, but this is the app's only external script-injection point.
  - *Suggested fix:* Add SRI (`integrity`/`crossorigin`) if the provider publishes a hash, and define a Content-Security-Policy (via `helmet` on the server or a meta tag) that whitelists the analytics origin. Also note the function is currently never called (§1).

### 🟢 No dangerous sinks
No `dangerouslySetInnerHTML`, `eval`, or `innerHTML` assignment found in reviewed source. `SeoHead` builds meta tags via `setAttribute` on created elements (safe), not string HTML. Input handling is essentially absent because the booking form isn't built yet — validate rigorously (Zod is already a dependency) when it lands.

---

## 7. Performance

### 🟢 Deliberate performance discipline
- Vite `manualChunks` splits `react`/`router`/`query` vendor bundles.
- Scroll handlers use rAF-throttling + `{ passive: true }` (`use-scroll-direction`), and the scroll-state manager batches via requestAnimationFrame with selector-based subscriptions.
- Hero sub-components (`HeroMedia`, `HeroContent`) are `React.memo`'d with documented rationale; hero image uses `width`/`height` + `aspect-ratio` for CLS prevention and `fetchPriority`/`loading` hints.
- Query client disables `refetchOnWindowFocus` and sets sane stale/gc times.
- Providers memoize context values (`theme-provider` `useMemo`/`useCallback`).

### 🟡 Duplicate scroll listeners (see §4)
Two `useScrollManager` instances and the triple reduced-motion subscription mean more `matchMedia`/scroll listeners than necessary. Minor now; consolidate before adding 16 animated sections.

### 🟢 Bundle risk is contained (for now)
The large `narrative` subsystem and `foundation.tsx` are not imported by the render tree, so they shouldn't reach the production bundle — **provided** they stay unimported. Excluding `foundation.tsx` from prod (§3) removes ~2.3k lines of risk.

---

## 8. Documentation

### 🔴 README.md is UTF-16 / null-byte-mangled
`README.md` renders with a space between every character (`T h e   S o v e r e i g n`) and broken box-drawing/arrow glyphs (`% % %`, `�!`), indicating it was saved as UTF-16 (or with a BOM/encoding mismatch) rather than UTF-8.
  - *Why it matters:* It's the project's front door; it's currently near-unreadable in most tooling and diffs, and `.editorconfig` declares `charset = utf-8`, which this violates.
  - *Suggested fix:* Re-save `README.md` as UTF-8 (LF). The content itself is good — tech stack table, scripts, structure, env vars — it just needs re-encoding.

### 🟢 Exceptional in-code and project docs
Nearly every module carries a JSDoc header citing the design/architecture doc it implements (e.g., "From TECHNICAL_ARCHITECTURE §8.2"). The `docs/` tree is extensive (blueprint, technical architecture, design system, storyboards, IA, user flows, tracker). This is well above typical for a project this size.

### 🟡 Doc/reality drift to watch
- `.env.example` lists `VITE_APP_URL`, but `env-validation.ts`'s Zod schema validates `VITE_FEATURE_3D`/`VITE_DEBUG` and not `VITE_APP_URL` — the documented and validated env sets don't match.
- README advertises testing and a `db:generate` workflow that currently can't produce output (empty schema).
  - *Suggested fix:* Reconcile the env schema with `.env.example`; mark unbuilt workflows as "planned" in the README.

---

## 9. Dependencies

### 🟢 Modern, consistently pinned
All dependencies use caret ranges on current major versions (React 18.3, Vite 6, TanStack Router/Query, Redux Toolkit 2, GSAP 3.12, Drizzle 0.35, Express 4.21, Zod 3.23). The root `pnpm.overrides` pins `esbuild ^0.25.0` (addresses the known esbuild dev-server advisory) — a good supply-chain touch. `packageManager` is pinned (`pnpm@9.0.0`).

### 🟡 Declared-but-unused / not-yet-used dependencies
Based on current imports:
- `apps/web`: `framer-motion`, `react-hook-form`, `class-variance-authority`, `tailwind-merge`, `lucide-react` are in `dependencies` but the rendered app currently draws SVG icons inline (navigation) and animates via GSAP; these appear reserved for later phases (booking form, service pages). `@gsap/react` present but GSAP is used directly.
- `@salon/db` depends on `@salon/shared` but imports nothing from it yet.
  - *Why it matters:* Unused deps inflate install size and audit surface. Some (framer-motion + GSAP + Lenis) represent **three animation systems**; confirm all three are truly needed or the bundle will carry redundant motion libraries.
  - *Suggested fix:* Keep if the phase plan needs them, but track them; run `pnpm dlx depcheck` before release and drop any that never get wired. Explicitly decide GSAP vs. Framer Motion ownership per interaction type (the navigation comment already says "GSAP-animated transitions (no Framer Motion)" — apply that rule consistently).

### 🟡 Build artifacts committed to git
`git ls-files` shows `apps/web/vite.config.js` and `apps/web/vite.config.d.ts` tracked alongside the source `vite.config.ts`. `.gitignore` ignores `*.tsbuildinfo` and `dist/`, but the compiled `vite.config.{js,d.ts}` slipped in. (`routeTree.gen.ts` is also tracked — that one is conventional for TanStack Router and acceptable.)
  - *Why it matters:* Generated files in VCS cause spurious diffs and can go stale relative to the `.ts` source.
  - *Suggested fix:* `git rm --cached apps/web/vite.config.js apps/web/vite.config.d.ts` and add them to `.gitignore`.

---

## Prioritized Action Items

Ordered by impact ÷ effort (highest first).

1. **Fix the duplicate `<main id="main-content">` (🔴, tiny effort).** Remove the `<main>` wrapper in `app/index.tsx`; keep only the one in `__root.tsx`. Restores valid HTML + working skip-link/a11y. _(§4)_
2. **Re-encode `README.md` as UTF-8 (🔴, tiny effort).** Content is fine; it's just saved as UTF-16. _(§8)_
3. **Consolidate the three reduced-motion implementations (🔴→🟡, small effort).** Make `ThemeProvider` the sole writer of `state.ui.isReducedMotion`; `useReducedMotion` reads only; delete `use-prefers-reduced-motion.ts`. Eliminates duplicate listeners and source-of-truth ambiguity. _(§2)_
4. **Add a test runner and first unit tests (🔴, medium effort).** Vitest + Testing Library in `apps/web`; per-package `test` scripts so `turbo run test` works. Start with `booking-slice`, `error-utils`, `feature-flags`, `validateEnv`. _(§5)_
5. **Quarantine or wire up the `narrative` subsystem (🔴, medium effort).** Decide: mount it behind real sections now, or move it to `_wip`/a branch and document it as inert. It's the single biggest chunk of unshipped, untested code. _(§1)_
6. **Single-source scroll management (🟡, small effort).** Call `useScrollManager` once (root); have `Navigation` consume active section from Redux. Removes racing hash/observer effects. _(§4)_
7. **Delete `EnhancedErrorBoundary` (or detokenize-fix it) (🟡, small effort).** It's unused and hardcodes hex colors/fonts. If keeping its retry feature, fold into `ErrorBoundary` with tokens. _(§2)_
8. **Exclude `app/dev/foundation.tsx` from production (🟡, small effort).** Gate behind `import.meta.env.DEV` or move out of `src/app`. Removes ~2.3k dev-only lines from the shippable route tree. _(§3)_
9. **Untrack committed build artifacts (🟡, tiny effort).** `git rm --cached apps/web/vite.config.js apps/web/vite.config.d.ts`, add to `.gitignore`. _(§9)_
10. **Wire up (or explicitly defer) env-validation + analytics, and reconcile env docs (🟡, small effort).** Call `getEnvConfig()` at boot; init analytics behind its flag; align `.env.example` with the Zod schema. _(§1, §6, §8)_

---

_Method note: this was a manual read-through of the frontend source (app routes/providers, `lib/`, hero & narrative features, the full `shared/` layer, Redux slices, styles/config) plus all package manifests and tooling configs, and a survey of the backend/shared packages. Findings cite specific files and lines. Nothing in the repository was modified. Coverage of the very large `narrative/` and `shared/hooks/` trees was via targeted reads and cross-file grep for consumers rather than exhaustive line-by-line reading of every one of the ~270 source files; the conclusions about wiring (what is mounted vs. inert) are grep-verified._

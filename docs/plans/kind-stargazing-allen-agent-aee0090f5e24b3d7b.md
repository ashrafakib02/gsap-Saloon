# Phase 6.2 — Scene Architecture

## Design Decisions

### Q1: subscribeSelector vs useSyncExternalStore?
**Answer: Both.** The scene-manager exposes `subscribe` + `subscribeSelector` at the manager level (matching progressive-reveal-manager.ts). The React hook (`useScene`) uses `useSyncExternalStore` with the `subscribe` function, then applies selector in the hook with equality check (matching useThreePerformance.ts). Non-React consumers get subscribeSelector; React consumers get useSyncExternalStore.

### Q2: Who owns scene-manager init?
**Answer: scene-root.tsx.** The provider (scene-provider.tsx) is pure context — no effects, no side effects. This follows the Fast Refresh compliance split pattern from narrative (narrative-context-internal.ts + narrative-context.tsx). scene-root.tsx initializes the manager, subscribes to scene-manager, and provides the SceneTreeContext.

### Q3: How is scene visibility derived?
**Answer: Pure function from stage + quality, triggered reactively.** `deriveSceneVisibility(stage, isReducedMotion, quality)` is a pure function in scene.config.ts. The scene-manager subscribes to quality changes from ThreeContext (via scene-root.tsx passing quality in) and re-derives visibility. Single-matchMedia-owner chain is preserved: ThemeProvider → scrollStateManager → scene-manager reads quality from context.

### Q4: SceneRoot inside or outside ThreeCanvas?
**Answer: Inside, as children.** SceneRoot is a lightweight React coordinator that reads ThreeContext, initializes the scene-manager, and renders SceneTreeContext. It renders as children of ThreeCanvas's Suspense boundary so its descendants have R3F context. It does NOT wrap ThreeCanvas.

### Q5: Eager or on-demand layer/slot registration?
**Answer: Eager.** All 7 layers and 9 slots are registered in `init()`. They are fixed architectural concepts (like the 16 narrative sections), not user-defined. This means the scene tree has complete structure immediately. Cost is negligible — just Map entries, no 3D objects.

## Implementation Order

### Step 1: scene.types.ts
Types — no dependencies on other new files.

### Step 2: scene.constants.ts
Constants — depends on scene.types.ts.

### Step 3: scene.config.ts
Pure derivation functions — depends on scene.types.ts + scene.constants.ts.

### Step 4: scene-manager.ts
Singleton manager — depends on scene.types.ts + scene.constants.ts + scene.config.ts + threePerformanceManager.

### Step 5: scene-provider.tsx
React context — depends on scene.types.ts.

### Step 6: scene-root.tsx
React coordinator — depends on scene-manager + scene-provider + ThreeContext.

### Step 7: scene-stage.tsx
Scene stage component — depends on scene-manager + scene-provider.

### Step 8: scene-slot.tsx
Scene slot component — depends on scene-manager + scene-provider.

### Step 9: scene-boundary.tsx
Error boundary — depends on threeEventManager.

### Step 10: hooks/use-scene.ts
Main hook — depends on scene-manager + scene-provider.

### Step 11: hooks/use-scene-manager.ts
Manager access hook — depends on scene-manager + scene-provider.

### Step 12: hooks/use-scene-stage.ts
Stage hook — depends on scene-manager + scene-provider.

### Step 13: hooks/use-scene-slot.ts
Slot hook — depends on scene-manager + scene-provider.

### Step 14: hooks/use-scene-visibility.ts
Visibility hook — depends on scene-manager + scene-provider.

### Step 15: index.ts
Barrel exports — depends on everything.

### Step 16: MEMORY.md + IMPLEMENTATION_TRACKER.md
Documentation updates.

/**
 * useNarrativeRegistry — Registry Access Hook
 *
 * From DESIGN_SYSTEM §Architecture:
 * "Registry pattern for centralized section metadata."
 *
 * This hook provides direct access to the narrative registry
 * for component-level lookups (e.g., getting metadata for a
 * specific section).
 *
 * Architecture:
 *   - Pure data access hook — returns the immutable registry
 *   - No effects, no state, no side effects
 *   - Registry is a singleton — never changes
 *   - Must be used within NarrativeProvider
 *
 * Usage:
 *   const registry = useNarrativeRegistry();
 *   const hero = registry.get('hero');
 *   const actTwoSections = registry.getByCategory('act-two');
 *
 * Phase 5.1: Data access only.
 */

import { useNarrativeContext } from '../narrative-context-internal';
import type { NarrativeRegistry } from '../narrative.types';

/**
 * Access the narrative registry for direct section lookups.
 *
 * The registry provides:
 * - `get(id)` — O(1) section lookup by ID
 * - `getAll()` — all sections in scroll order
 * - `getByCategory(category)` — sections filtered by category
 * - `getByStage(stage)` — sections filtered by narrative stage
 * - `getEnabled()` — only enabled sections
 * - `getNarrativeParticipants()` — scroll-linked sections
 * - `getPreloadOrder()` — sections ordered for preloading
 * - `count()` — total section count
 * - `has(id)` — existence check
 *
 * Must be used within a NarrativeProvider.
 *
 * @returns The immutable narrative registry
 *
 * @example
 * ```tsx
 * function SectionHeader({ sectionId }: { sectionId: SectionId }) {
 *   const registry = useNarrativeRegistry();
 *   const section = registry.get(sectionId);
 *   if (!section) return null;
 *   return <h2>{section.title}</h2>;
 * }
 * ```
 */
export function useNarrativeRegistry(): NarrativeRegistry {
  const { registry } = useNarrativeContext();
  return registry;
}

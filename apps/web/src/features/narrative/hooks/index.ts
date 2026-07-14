/**
 * Narrative Hooks — Barrel Export
 */

export { useNarrative } from './use-narrative';
export { useNarrativeRegistry } from './use-narrative-registry';
export { useNarrativeOrder } from './use-narrative-order';
export type { NarrativeOrderAPI } from './use-narrative-order';

// ── Transition Hooks ──────────────────────────────────────

export {
  useSectionTransition,
  useEntryTransition,
  useExitTransition,
} from './use-section-transition';
export type { UseSectionTransitionResult } from './use-section-transition';

export { useTransitionRegistry } from './use-transition-registry';

export {
  useTransitionsByType,
  useTransitionsByMood,
  useTransitionsByPriority,
  useEnabledTransitions,
  useActTransitions,
} from './use-transition-metadata';

export {
  useTransitionSequence,
  useTransitionDefinition,
} from './use-transition-sequence';
export type { UseTransitionSequenceResult } from './use-transition-sequence';

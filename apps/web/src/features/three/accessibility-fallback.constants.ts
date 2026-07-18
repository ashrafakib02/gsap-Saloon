/**
 * Accessibility Fallback Constants — Default Values, Profiles, and Configuration
 *
 * Centralizes all accessibility fallback metadata: descriptions, ordering,
 * profiles, rules, preferences, compatibility entries, and the default
 * snapshot. All values are frozen and immutable.
 *
 * Phase 6.10: Accessibility Fallback — architecture only, no runtime switching.
 */

import {
  ACCESSIBILITY_PROFILES,
  ACCESSIBILITY_CATEGORIES,
  ACCESSIBILITY_STRATEGIES,
  ACCESSIBILITY_LIFECYCLE_STATES,
} from './accessibility-fallback.types';

import type {
  AccessibilityProfile,
  AccessibilityCategory,
  AccessibilityStrategy,
  AccessibilityLifecycle,
  AccessibilityCapabilityProfile,
  AccessibilityRule,
  AccessibilityPreference,
  AccessibilityCompatibilityEntry,
  AccessibilitySnapshot,
} from './accessibility-fallback.types';

// ── Re-exports ──────────────────────────────────────────────

export {
  ACCESSIBILITY_PROFILES,
  ACCESSIBILITY_CATEGORIES,
  ACCESSIBILITY_STRATEGIES,
  ACCESSIBILITY_LIFECYCLE_STATES,
};

// ── Description Records ─────────────────────────────────────

/** Human-readable descriptions for each accessibility profile. */
export const ACCESSIBILITY_PROFILE_DESCRIPTIONS: Readonly<Record<AccessibilityProfile, string>> = Object.freeze({
  'default': 'No specific accessibility requirements — default experience',
  'reduced-motion': 'User prefers reduced motion — minimize animations, transitions, parallax',
  'high-contrast': 'User needs high contrast — maximize visual distinction between elements',
  'keyboard': 'User navigates primarily via keyboard — ensure full keyboard operability',
  'screen-reader': 'User relies on screen readers — ensure all content is perceivable',
  'low-vision': 'User has low vision — enlarge text, increase contrast, simplify layout',
  'custom': 'Custom accessibility configuration — user-defined overrides',
});

/** Human-readable descriptions for each accessibility category. */
export const ACCESSIBILITY_CATEGORY_DESCRIPTIONS: Readonly<Record<AccessibilityCategory, string>> = Object.freeze({
  'motion': 'Reduce or eliminate motion and animations',
  'animation': 'Animation-specific: timelines, scroll-linked, stagger',
  'camera': 'Camera movement and viewport transitions',
  'lighting': 'Lighting changes, flicker avoidance, color temperature',
  'materials': 'Material rendering: shaders, textures, visual effects',
  'environment': 'Environment: sky, fog, background, atmosphere',
  'particles': 'Particle effects: spawn rate, density, motion',
  'audio': 'Audio: spatial audio, ambient sound, music',
  'captions': 'Captions for audio content',
  'transcripts': 'Transcripts for audio/video content',
  'keyboard': 'Keyboard operability and tab order',
  'focus': 'Focus management and focus indicators',
  'navigation': 'Navigation: landmarks, headings, skip links',
  'screen-reader': 'Screen reader compatibility and ARIA semantics',
  'contrast': 'Color contrast: minimum ratios, text/background distinction',
  'text': 'Text: sizing, spacing, readability',
  'touch': 'Touch target sizing and spacing',
  'gesture': 'Gesture alternatives and simplified interactions',
  'pointer': 'Pointer input: mouse, trackpad, stylus',
  'timing': 'Timing: auto-play, duration, pauses',
  'feedback': 'User feedback: status messages, loading states, errors',
  'debug': 'Debug information: screen reader only, verbose descriptions',
});

/** Human-readable descriptions for each accessibility strategy. */
export const ACCESSIBILITY_STRATEGY_DESCRIPTIONS: Readonly<Record<AccessibilityStrategy, string>> = Object.freeze({
  'enabled': 'Feature operates at full fidelity — no adaptation needed',
  'disabled': 'Feature is completely disabled for this profile',
  'simplified': 'Feature operates with reduced complexity for clarity',
  'alternative': 'Feature is replaced with an accessible alternative',
  'reduced': 'Feature operates with reduced intensity or frequency',
  'substituted': 'Feature is replaced with a non-interactive substitute',
  'enhanced': 'Feature is enhanced for better accessibility',
});

/** Human-readable descriptions for each lifecycle state. */
export const ACCESSIBILITY_LIFECYCLE_DESCRIPTIONS: Readonly<Record<AccessibilityLifecycle, string>> = Object.freeze({
  'active': 'Adaptation is active and being applied',
  'inactive': 'Adaptation is inactive — not currently needed',
  'pending': 'Adaptation is pending evaluation',
  'evaluating': 'Adaptation is being evaluated for applicability',
  'disposed': 'Adaptation has been disposed',
});

// ── Ordering Records ────────────────────────────────────────

/** Ordered accessibility profiles (default first, custom last). */
export const ACCESSIBILITY_PROFILE_ORDER: readonly AccessibilityProfile[] = Object.freeze([
  'default', 'reduced-motion', 'high-contrast', 'keyboard', 'screen-reader', 'low-vision', 'custom',
]);

/** Ordered accessibility categories. */
export const ACCESSIBILITY_CATEGORY_ORDER: readonly AccessibilityCategory[] = Object.freeze([
  'motion', 'animation', 'camera', 'lighting', 'materials', 'environment', 'particles',
  'audio', 'captions', 'transcripts', 'keyboard', 'focus', 'navigation', 'screen-reader',
  'contrast', 'text', 'touch', 'gesture', 'pointer', 'timing', 'feedback', 'debug',
]);

/** Ordered accessibility strategies (highest to lowest fidelity). */
export const ACCESSIBILITY_STRATEGY_ORDER: readonly AccessibilityStrategy[] = Object.freeze([
  'enhanced', 'enabled', 'simplified', 'alternative', 'reduced', 'substituted', 'disabled',
]);

// ── Default Profiles Per Profile ────────────────────────────

/**
 * Creates a frozen capability profile for a given accessibility profile.
 *
 * Each profile maps all 22 accessibility categories to a strategy.
 * These are the architectural defaults — future implementation phases
 * consume these to make actual runtime decisions.
 */
function createAccessibilityProfile(
  profile: AccessibilityProfile,
  label: string,
  requiresReducedMotion: boolean,
  requiresHighContrast: boolean,
  requiresKeyboard: boolean,
  requiresScreenReader: boolean,
  requiresTextEnlargement: boolean,
  requiresSimplifiedInteractions: boolean,
  minContrastRatio: number,
  minTouchTargetSize: number,
  maxAnimationDuration: number,
  maxConcurrentAnimations: number,
  capabilities: ReadonlyArray<readonly [AccessibilityCategory, AccessibilityStrategy]>,
): AccessibilityCapabilityProfile {
  return Object.freeze({
    profile,
    label,
    requiresReducedMotion,
    requiresHighContrast,
    requiresKeyboard,
    requiresScreenReader,
    requiresTextEnlargement,
    requiresSimplifiedInteractions,
    minContrastRatio,
    minTouchTargetSize,
    maxAnimationDuration,
    maxConcurrentAnimations,
    capabilities: Object.freeze(new Map(capabilities)),
  });
}

/** Default profile — no specific accessibility requirements. */
export const DEFAULT_ACCESSIBILITY_PROFILE: AccessibilityCapabilityProfile = createAccessibilityProfile(
  'default',
  'Default',
  false,
  false,
  false,
  false,
  false,
  false,
  4.5,
  44,
  1200,
  8,
  [
    ['motion', 'enabled'],
    ['animation', 'enabled'],
    ['camera', 'enabled'],
    ['lighting', 'enabled'],
    ['materials', 'enabled'],
    ['environment', 'enabled'],
    ['particles', 'enabled'],
    ['audio', 'enabled'],
    ['captions', 'disabled'],
    ['transcripts', 'disabled'],
    ['keyboard', 'enabled'],
    ['focus', 'enabled'],
    ['navigation', 'enabled'],
    ['screen-reader', 'enabled'],
    ['contrast', 'enabled'],
    ['text', 'enabled'],
    ['touch', 'enabled'],
    ['gesture', 'enabled'],
    ['pointer', 'enabled'],
    ['timing', 'enabled'],
    ['feedback', 'enabled'],
    ['debug', 'disabled'],
  ],
);

/** Reduced Motion profile — minimize animations and transitions. */
export const REDUCED_MOTION_ACCESSIBILITY_PROFILE: AccessibilityCapabilityProfile = createAccessibilityProfile(
  'reduced-motion',
  'Reduced Motion',
  true,
  false,
  false,
  false,
  false,
  false,
  4.5,
  44,
  0,
  0,
  [
    ['motion', 'disabled'],
    ['animation', 'disabled'],
    ['camera', 'simplified'],
    ['lighting', 'enabled'],
    ['materials', 'enabled'],
    ['environment', 'enabled'],
    ['particles', 'disabled'],
    ['audio', 'enabled'],
    ['captions', 'disabled'],
    ['transcripts', 'disabled'],
    ['keyboard', 'enabled'],
    ['focus', 'enabled'],
    ['navigation', 'enabled'],
    ['screen-reader', 'enabled'],
    ['contrast', 'enabled'],
    ['text', 'enabled'],
    ['touch', 'enabled'],
    ['gesture', 'enabled'],
    ['pointer', 'enabled'],
    ['timing', 'reduced'],
    ['feedback', 'enabled'],
    ['debug', 'disabled'],
  ],
);

/** High Contrast profile — maximize visual distinction. */
export const HIGH_CONTRAST_ACCESSIBILITY_PROFILE: AccessibilityCapabilityProfile = createAccessibilityProfile(
  'high-contrast',
  'High Contrast',
  false,
  true,
  false,
  false,
  false,
  false,
  7,
  44,
  1200,
  8,
  [
    ['motion', 'enabled'],
    ['animation', 'enabled'],
    ['camera', 'enabled'],
    ['lighting', 'enhanced'],
    ['materials', 'simplified'],
    ['environment', 'simplified'],
    ['particles', 'reduced'],
    ['audio', 'enabled'],
    ['captions', 'disabled'],
    ['transcripts', 'disabled'],
    ['keyboard', 'enabled'],
    ['focus', 'enhanced'],
    ['navigation', 'enabled'],
    ['screen-reader', 'enabled'],
    ['contrast', 'enhanced'],
    ['text', 'enhanced'],
    ['touch', 'enabled'],
    ['gesture', 'enabled'],
    ['pointer', 'enabled'],
    ['timing', 'enabled'],
    ['feedback', 'enhanced'],
    ['debug', 'disabled'],
  ],
);

/** Keyboard profile — ensure full keyboard operability. */
export const KEYBOARD_ACCESSIBILITY_PROFILE: AccessibilityCapabilityProfile = createAccessibilityProfile(
  'keyboard',
  'Keyboard',
  false,
  false,
  true,
  false,
  false,
  false,
  4.5,
  44,
  1200,
  8,
  [
    ['motion', 'enabled'],
    ['animation', 'enabled'],
    ['camera', 'enabled'],
    ['lighting', 'enabled'],
    ['materials', 'enabled'],
    ['environment', 'enabled'],
    ['particles', 'enabled'],
    ['audio', 'enabled'],
    ['captions', 'disabled'],
    ['transcripts', 'disabled'],
    ['keyboard', 'enhanced'],
    ['focus', 'enhanced'],
    ['navigation', 'enhanced'],
    ['screen-reader', 'enabled'],
    ['contrast', 'enabled'],
    ['text', 'enabled'],
    ['touch', 'enabled'],
    ['gesture', 'alternative'],
    ['pointer', 'enabled'],
    ['timing', 'enabled'],
    ['feedback', 'enhanced'],
    ['debug', 'disabled'],
  ],
);

/** Screen Reader profile — ensure content is perceivable. */
export const SCREEN_READER_ACCESSIBILITY_PROFILE: AccessibilityCapabilityProfile = createAccessibilityProfile(
  'screen-reader',
  'Screen Reader',
  false,
  false,
  false,
  true,
  false,
  false,
  4.5,
  44,
  1200,
  8,
  [
    ['motion', 'disabled'],
    ['animation', 'disabled'],
    ['camera', 'simplified'],
    ['lighting', 'enabled'],
    ['materials', 'simplified'],
    ['environment', 'simplified'],
    ['particles', 'disabled'],
    ['audio', 'enabled'],
    ['captions', 'alternative'],
    ['transcripts', 'alternative'],
    ['keyboard', 'enabled'],
    ['focus', 'enhanced'],
    ['navigation', 'enhanced'],
    ['screen-reader', 'enhanced'],
    ['contrast', 'enabled'],
    ['text', 'enabled'],
    ['touch', 'enabled'],
    ['gesture', 'alternative'],
    ['pointer', 'enabled'],
    ['timing', 'disabled'],
    ['feedback', 'enhanced'],
    ['debug', 'alternative'],
  ],
);

/** Low Vision profile — enlarge text and simplify. */
export const LOW_VISION_ACCESSIBILITY_PROFILE: AccessibilityCapabilityProfile = createAccessibilityProfile(
  'low-vision',
  'Low Vision',
  false,
  false,
  false,
  false,
  true,
  true,
  7,
  48,
  2000,
  4,
  [
    ['motion', 'reduced'],
    ['animation', 'reduced'],
    ['camera', 'simplified'],
    ['lighting', 'enhanced'],
    ['materials', 'simplified'],
    ['environment', 'simplified'],
    ['particles', 'disabled'],
    ['audio', 'enabled'],
    ['captions', 'disabled'],
    ['transcripts', 'disabled'],
    ['keyboard', 'enabled'],
    ['focus', 'enhanced'],
    ['navigation', 'enabled'],
    ['screen-reader', 'enabled'],
    ['contrast', 'enhanced'],
    ['text', 'enhanced'],
    ['touch', 'enhanced'],
    ['gesture', 'simplified'],
    ['pointer', 'enabled'],
    ['timing', 'reduced'],
    ['feedback', 'enhanced'],
    ['debug', 'disabled'],
  ],
);

/** Custom profile — user-defined overrides. */
export const CUSTOM_ACCESSIBILITY_PROFILE: AccessibilityCapabilityProfile = createAccessibilityProfile(
  'custom',
  'Custom',
  false,
  false,
  false,
  false,
  false,
  false,
  4.5,
  44,
  1200,
  8,
  [
    ['motion', 'enabled'],
    ['animation', 'enabled'],
    ['camera', 'enabled'],
    ['lighting', 'enabled'],
    ['materials', 'enabled'],
    ['environment', 'enabled'],
    ['particles', 'enabled'],
    ['audio', 'enabled'],
    ['captions', 'enabled'],
    ['transcripts', 'enabled'],
    ['keyboard', 'enabled'],
    ['focus', 'enabled'],
    ['navigation', 'enabled'],
    ['screen-reader', 'enabled'],
    ['contrast', 'enabled'],
    ['text', 'enabled'],
    ['touch', 'enabled'],
    ['gesture', 'enabled'],
    ['pointer', 'enabled'],
    ['timing', 'enabled'],
    ['feedback', 'enabled'],
    ['debug', 'disabled'],
  ],
);

/** All accessibility profiles indexed by profile. */
export const ACCESSIBILITY_PROFILES_MAP: ReadonlyMap<AccessibilityProfile, AccessibilityCapabilityProfile> =
  new Map<AccessibilityProfile, AccessibilityCapabilityProfile>([
    ['default', DEFAULT_ACCESSIBILITY_PROFILE],
    ['reduced-motion', REDUCED_MOTION_ACCESSIBILITY_PROFILE],
    ['high-contrast', HIGH_CONTRAST_ACCESSIBILITY_PROFILE],
    ['keyboard', KEYBOARD_ACCESSIBILITY_PROFILE],
    ['screen-reader', SCREEN_READER_ACCESSIBILITY_PROFILE],
    ['low-vision', LOW_VISION_ACCESSIBILITY_PROFILE],
    ['custom', CUSTOM_ACCESSIBILITY_PROFILE],
  ]);

// ── Default Rules ────────────────────────────────────────────

/** Default accessibility rules — WCAG-aligned adaptations per profile. */
export const DEFAULT_ACCESSIBILITY_RULES: readonly AccessibilityRule[] = Object.freeze([
  Object.freeze({
    id: 'motion-disabled-reduced-motion',
    category: 'motion',
    profile: 'reduced-motion',
    strategy: 'disabled',
    description: 'Motion disabled when user prefers reduced motion',
    wcagReference: '2.3.3',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'animation-disabled-reduced-motion',
    category: 'animation',
    profile: 'reduced-motion',
    strategy: 'disabled',
    description: 'All animations disabled when user prefers reduced motion',
    wcagReference: '2.3.3',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'particles-disabled-reduced-motion',
    category: 'particles',
    profile: 'reduced-motion',
    strategy: 'disabled',
    description: 'Particle effects disabled when user prefers reduced motion',
    wcagReference: '2.3.3',
    priority: 9,
    enabled: true,
  }),
  Object.freeze({
    id: 'camera-simplified-reduced-motion',
    category: 'camera',
    profile: 'reduced-motion',
    strategy: 'simplified',
    description: 'Camera transitions simplified when user prefers reduced motion',
    wcagReference: '2.3.3',
    priority: 8,
    enabled: true,
  }),
  Object.freeze({
    id: 'timing-reduced-reduced-motion',
    category: 'timing',
    profile: 'reduced-motion',
    strategy: 'reduced',
    description: 'Auto-play timing extended when user prefers reduced motion',
    wcagReference: '2.2.1',
    priority: 7,
    enabled: true,
  }),
  Object.freeze({
    id: 'contrast-enhanced-high-contrast',
    category: 'contrast',
    profile: 'high-contrast',
    strategy: 'enhanced',
    description: 'Color contrast enhanced for high-contrast mode (WCAG AAA)',
    wcagReference: '1.4.6',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'text-enhanced-high-contrast',
    category: 'text',
    profile: 'high-contrast',
    strategy: 'enhanced',
    description: 'Text rendered with enhanced contrast and weight',
    wcagReference: '1.4.6',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'materials-simplified-high-contrast',
    category: 'materials',
    profile: 'high-contrast',
    strategy: 'simplified',
    description: 'Materials simplified for high-contrast — reduce visual noise',
    wcagReference: '1.4.6',
    priority: 8,
    enabled: true,
  }),
  Object.freeze({
    id: 'focus-enhanced-keyboard',
    category: 'focus',
    profile: 'keyboard',
    strategy: 'enhanced',
    description: 'Focus indicators enhanced for keyboard navigation',
    wcagReference: '2.4.7',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'navigation-enhanced-keyboard',
    category: 'navigation',
    profile: 'keyboard',
    strategy: 'enhanced',
    description: 'Navigation landmarks and headings enhanced for keyboard users',
    wcagReference: '2.4.1',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'gesture-alternative-keyboard',
    category: 'gesture',
    profile: 'keyboard',
    strategy: 'alternative',
    description: 'Gesture interactions replaced with keyboard alternatives',
    wcagReference: '2.1.1',
    priority: 9,
    enabled: true,
  }),
  Object.freeze({
    id: 'screen-reader-enhanced',
    category: 'screen-reader',
    profile: 'screen-reader',
    strategy: 'enhanced',
    description: 'Screen reader semantics enhanced — descriptive labels for all 3D content',
    wcagReference: '1.1.1',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'captions-alternative-screen-reader',
    category: 'captions',
    profile: 'screen-reader',
    strategy: 'alternative',
    description: 'Audio captions provided as alternative content for screen readers',
    wcagReference: '1.2.2',
    priority: 9,
    enabled: true,
  }),
  Object.freeze({
    id: 'transcripts-alternative-screen-reader',
    category: 'transcripts',
    profile: 'screen-reader',
    strategy: 'alternative',
    description: 'Audio transcripts provided as alternative content for screen readers',
    wcagReference: '1.2.1',
    priority: 9,
    enabled: true,
  }),
  Object.freeze({
    id: 'timing-disabled-screen-reader',
    category: 'timing',
    profile: 'screen-reader',
    strategy: 'disabled',
    description: 'Auto-play timing disabled — screen readers need user-controlled pacing',
    wcagReference: '2.2.1',
    priority: 8,
    enabled: true,
  }),
  Object.freeze({
    id: 'text-enhanced-low-vision',
    category: 'text',
    profile: 'low-vision',
    strategy: 'enhanced',
    description: 'Text enlarged and spaced for low-vision users',
    wcagReference: '1.4.4',
    priority: 10,
    enabled: true,
  }),
  Object.freeze({
    id: 'touch-enhanced-low-vision',
    category: 'touch',
    profile: 'low-vision',
    strategy: 'enhanced',
    description: 'Touch targets enlarged for low-vision users',
    wcagReference: '2.5.5',
    priority: 9,
    enabled: true,
  }),
  Object.freeze({
    id: 'feedback-enhanced-low-vision',
    category: 'feedback',
    profile: 'low-vision',
    strategy: 'enhanced',
    description: 'Status messages enhanced with larger text and higher contrast',
    wcagReference: '4.1.3',
    priority: 8,
    enabled: true,
  }),
]);

// ── Default Preferences ──────────────────────────────────────

/** Default accessibility preferences — per-profile enablement maps. */
export const DEFAULT_ACCESSIBILITY_PREFERENCES: readonly AccessibilityPreference[] = Object.freeze([
  Object.freeze({
    id: 'reduce-motion',
    label: 'Reduce Motion',
    category: 'motion',
    profiles: new Map<AccessibilityProfile, boolean>([
      ['default', false],
      ['reduced-motion', true],
      ['high-contrast', false],
      ['keyboard', false],
      ['screen-reader', true],
      ['low-vision', true],
      ['custom', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'high-contrast-mode',
    label: 'High Contrast Mode',
    category: 'contrast',
    profiles: new Map<AccessibilityProfile, boolean>([
      ['default', false],
      ['reduced-motion', false],
      ['high-contrast', true],
      ['keyboard', false],
      ['screen-reader', false],
      ['low-vision', true],
      ['custom', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'keyboard-navigation',
    label: 'Keyboard Navigation',
    category: 'keyboard',
    profiles: new Map<AccessibilityProfile, boolean>([
      ['default', false],
      ['reduced-motion', false],
      ['high-contrast', false],
      ['keyboard', true],
      ['screen-reader', true],
      ['low-vision', false],
      ['custom', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'screen-reader-support',
    label: 'Screen Reader Support',
    category: 'screen-reader',
    profiles: new Map<AccessibilityProfile, boolean>([
      ['default', false],
      ['reduced-motion', false],
      ['high-contrast', false],
      ['keyboard', false],
      ['screen-reader', true],
      ['low-vision', false],
      ['custom', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'enlarge-text',
    label: 'Enlarge Text',
    category: 'text',
    profiles: new Map<AccessibilityProfile, boolean>([
      ['default', false],
      ['reduced-motion', false],
      ['high-contrast', false],
      ['keyboard', false],
      ['screen-reader', false],
      ['low-vision', true],
      ['custom', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'simplify-interactions',
    label: 'Simplify Interactions',
    category: 'gesture',
    profiles: new Map<AccessibilityProfile, boolean>([
      ['default', false],
      ['reduced-motion', false],
      ['high-contrast', false],
      ['keyboard', true],
      ['screen-reader', true],
      ['low-vision', true],
      ['custom', false],
    ]),
    enabled: true,
  }),
  Object.freeze({
    id: 'audio-descriptions',
    label: 'Audio Descriptions',
    category: 'audio',
    profiles: new Map<AccessibilityProfile, boolean>([
      ['default', false],
      ['reduced-motion', false],
      ['high-contrast', false],
      ['keyboard', false],
      ['screen-reader', true],
      ['low-vision', false],
      ['custom', false],
    ]),
    enabled: true,
  }),
]);

// ── Default Compatibility Matrix ─────────────────────────────

/** Default compatibility entries — system interaction rules. */
export const DEFAULT_ACCESSIBILITY_COMPATIBILITY: readonly AccessibilityCompatibilityEntry[] = Object.freeze([
  Object.freeze({
    id: 'motion-animation-reduced-motion',
    systemA: 'motion',
    systemB: 'animation',
    profile: 'reduced-motion',
    isCompatible: true,
    description: 'Both motion and animation are disabled — fully compatible',
  }),
  Object.freeze({
    id: 'contrast-materials-high-contrast',
    systemA: 'contrast',
    systemB: 'materials',
    profile: 'high-contrast',
    isCompatible: false,
    precedence: 'contrast',
    description: 'High contrast and complex materials are incompatible — contrast takes precedence',
  }),
  Object.freeze({
    id: 'keyboard-gesture-keyboard',
    systemA: 'keyboard',
    systemB: 'gesture',
    profile: 'keyboard',
    isCompatible: false,
    precedence: 'keyboard',
    description: 'Gesture interactions conflict with keyboard — keyboard alternatives required',
  }),
  Object.freeze({
    id: 'screen-reader-motion-reduced-motion',
    systemA: 'screen-reader',
    systemB: 'motion',
    profile: 'reduced-motion',
    isCompatible: true,
    description: 'Screen reader and motion reduction are compatible — motion disabled for clarity',
  }),
  Object.freeze({
    id: 'text-contrast-low-vision',
    systemA: 'text',
    systemB: 'contrast',
    profile: 'low-vision',
    isCompatible: true,
    description: 'Text enlargement and high contrast are complementary for low-vision users',
  }),
  Object.freeze({
    id: 'timing-screen-reader',
    systemA: 'timing',
    systemB: 'screen-reader',
    profile: 'screen-reader',
    isCompatible: false,
    precedence: 'screen-reader',
    description: 'Auto-play timing conflicts with screen reader pacing — timing disabled',
  }),
]);

// ── Default Snapshot ─────────────────────────────────────────

/** The default (uninitialized) snapshot. */
export const DEFAULT_ACCESSIBILITY_SNAPSHOT: AccessibilitySnapshot = Object.freeze({
  activeProfile: 'default',
  profile: DEFAULT_ACCESSIBILITY_PROFILE,
  capabilities: Object.freeze(new Map()),
  preferences: Object.freeze(new Map()),
  rules: Object.freeze(new Map()),
  compatibilityMatrix: Object.freeze(new Map()),
  recommendations: Object.freeze([]),
  isReducedMotion: false,
  isHighContrast: false,
  isKeyboardOnly: false,
  isScreenReader: false,
  isLowVision: false,
  enables3D: true,
  enablesAnimations: true,
  enablesAudio: true,
  activeCapabilityCount: 0,
  disabledCapabilityCount: 0,
  alternativeCapabilityCount: 0,
  enhancedCapabilityCount: 0,
  preferenceCount: 0,
  ruleCount: 0,
  compatibilityCount: 0,
  revision: 0,
  timestamp: 0,
});

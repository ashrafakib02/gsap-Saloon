/**
 * Narrative Timeline Config — Central Timeline Registry
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The scroll is a narrative timeline."
 *
 * From PRODUCT_VISION §Scroll Philosophy:
 * "The scroll is the conductor; the content is the orchestra."
 *
 * This module creates the immutable timeline registry containing
 * all tracks, segments, markers, keyframes, cues, and groups
 * that future animation engines will consume.
 *
 * Architecture:
 *   1. TRACK_DEFINITIONS — all 11 parallel tracks
 *   2. SEGMENT_DEFINITIONS — scroll ranges mapped to sections
 *   3. MARKER_DEFINITIONS — semantic reference points
 *   4. KEYFRAME_DEFINITIONS — parameter values at positions
 *   5. CUE_DEFINITIONS — event triggers
 *   6. GROUP_DEFINITIONS — track resource groups
 *   7. createTimelineRegistry() — factory function
 *   8. TIMELINE_REGISTRY — singleton frozen registry
 *
 * Phase 5.3: Timeline structure and metadata.
 * Phase 9: GSAP timeline adapters consume this data.
 * Phase 6: R3F camera/lighting tracks populated.
 */

import type {
  TimelineRegistry,
  TimelineDefinition,
  TimelineTrack,
  TimelineSegment,
  TimelineMarker,
  TimelineKeyframe,
  TimelineCue,
  TimelineGroup,
  TimelineMetadata,
  TimelineTrackType,
  TimelinePriority,
  TimelinePlaybackMode,
  TimelineDurationCategory,
  TimelineRange,
} from './narrative-timeline.types';

import type { SectionId, NarrativeStage } from './narrative.types';

// ── Scroll Range Helper ────────────────────────────────────

/**
 * Creates a normalized scroll range from section position.
 *
 * Sections are evenly distributed across 0-1 scroll progress.
 * With 16 sections, each section spans ~6.25% of the total.
 */
function sectionRange(order: number, totalSections: number): TimelineRange {
  const sectionWidth = 1 / totalSections;
  return {
    start: order * sectionWidth,
    end: (order + 1) * sectionWidth,
  };
}

// ── Timeline Constants ─────────────────────────────────────

const SECTION_COUNT = 16;
const NARRATIVE_STAGES: readonly NarrativeStage[] = [
  'prologue', 'act-one', 'act-two', 'act-three', 'epilogue',
] as const;

// ── Track Definitions ──────────────────────────────────────

const TRACK_DEFINITIONS: readonly TimelineTrack[] = [
  {
    id: 'track-narrative',
    type: 'narrative',
    label: 'Narrative',
    syncMode: 'global-progress',
    priority: 'critical',
    enabled: true,
    isPrimary: true,
    stageRange: [...NARRATIVE_STAGES],
    segments: [], // populated below
  },
  {
    id: 'track-ui',
    type: 'ui',
    label: 'User Interface',
    syncMode: 'narrative-locked',
    priority: 'high',
    enabled: true,
    isPrimary: false,
    stageRange: [...NARRATIVE_STAGES],
    segments: [],
  },
  {
    id: 'track-camera',
    type: 'camera',
    label: 'Camera',
    syncMode: 'narrative-locked',
    priority: 'normal',
    enabled: true,
    isPrimary: false,
    stageRange: ['prologue', 'act-one', 'act-two', 'act-three'],
    segments: [],
  },
  {
    id: 'track-lighting',
    type: 'lighting',
    label: 'Lighting',
    syncMode: 'narrative-locked',
    priority: 'normal',
    enabled: true,
    isPrimary: false,
    stageRange: ['prologue', 'act-one', 'act-two', 'act-three'],
    segments: [],
  },
  {
    id: 'track-environment',
    type: 'environment',
    label: 'Environment',
    syncMode: 'narrative-locked',
    priority: 'low',
    enabled: true,
    isPrimary: false,
    stageRange: ['prologue', 'act-one', 'act-two', 'act-three'],
    segments: [],
  },
  {
    id: 'track-three-d',
    type: 'three-d',
    label: '3D Elements',
    syncMode: 'narrative-locked',
    priority: 'low',
    enabled: true,
    isPrimary: false,
    stageRange: ['prologue', 'act-one'],
    segments: [],
  },
  {
    id: 'track-particle',
    type: 'particle',
    label: 'Particles',
    syncMode: 'narrative-locked',
    priority: 'low',
    enabled: true,
    isPrimary: false,
    stageRange: ['prologue', 'act-three'],
    segments: [],
  },
  {
    id: 'track-audio',
    type: 'audio',
    label: 'Audio',
    syncMode: 'threshold-triggered',
    priority: 'low',
    enabled: false,
    isPrimary: false,
    stageRange: [],
    segments: [],
  },
  {
    id: 'track-analytics',
    type: 'analytics',
    label: 'Analytics',
    syncMode: 'threshold-triggered',
    priority: 'low',
    enabled: true,
    isPrimary: false,
    stageRange: [...NARRATIVE_STAGES],
    segments: [],
  },
  {
    id: 'track-accessibility',
    type: 'accessibility',
    label: 'Accessibility',
    syncMode: 'global-progress',
    priority: 'high',
    enabled: true,
    isPrimary: false,
    stageRange: [...NARRATIVE_STAGES],
    segments: [],
  },
  {
    id: 'track-preload',
    type: 'preload',
    label: 'Asset Preloading',
    syncMode: 'threshold-triggered',
    priority: 'normal',
    enabled: true,
    isPrimary: false,
    stageRange: ['prologue', 'act-one', 'act-two'],
    segments: [],
  },
] as const;

// ── Section Metadata ───────────────────────────────────────

/**
 * Maps section IDs to their order, stage, and stage order
 * for segment generation.
 */
interface SectionMeta {
  readonly order: number;
  readonly stage: NarrativeStage;
  readonly stageOrder: number;
}

const SECTION_META: Record<SectionId, SectionMeta> = {
  'threshold':                    { order: 0,  stage: 'prologue',  stageOrder: 0 },
  'hero':                         { order: 1,  stage: 'prologue',  stageOrder: 1 },
  'whisper':                      { order: 2,  stage: 'act-one',   stageOrder: 0 },
  'atmosphere':                   { order: 3,  stage: 'act-one',   stageOrder: 1 },
  'breathing-space-arrival':      { order: 4,  stage: 'act-one',   stageOrder: 2 },
  'hair':                         { order: 5,  stage: 'act-two',   stageOrder: 0 },
  'transformation':               { order: 6,  stage: 'act-two',   stageOrder: 1 },
  'bridal':                       { order: 7,  stage: 'act-two',   stageOrder: 2 },
  'spa':                          { order: 8,  stage: 'act-two',   stageOrder: 3 },
  'artisans':                     { order: 9,  stage: 'act-two',   stageOrder: 4 },
  'testimonials':                 { order: 10, stage: 'act-two',   stageOrder: 5 },
  'breathing-space-commitment':   { order: 11, stage: 'act-three', stageOrder: 0 },
  'booking':                      { order: 12, stage: 'act-three', stageOrder: 1 },
  'gift':                         { order: 13, stage: 'act-three', stageOrder: 2 },
  'closing':                      { order: 14, stage: 'act-three', stageOrder: 3 },
  'footer':                       { order: 15, stage: 'epilogue',  stageOrder: 0 },
} as const;

const SECTION_IDS: readonly SectionId[] = [
  'threshold', 'hero', 'whisper', 'atmosphere', 'breathing-space-arrival',
  'hair', 'transformation', 'bridal', 'spa', 'artisans', 'testimonials',
  'breathing-space-commitment', 'booking', 'gift', 'closing', 'footer',
] as const;

// ── Narrative Segment Definitions ──────────────────────────

/**
 * Generate narrative track segments — one per section.
 * Each segment maps a scroll range to a section with
 * appropriate playback mode and duration category.
 */
function createNarrativeSegments(): readonly TimelineSegment[] {
  return SECTION_IDS.map((sectionId): TimelineSegment => {
    const meta = SECTION_META[sectionId];
    const range = sectionRange(meta.order, SECTION_COUNT);

    /* Determine playback mode based on section characteristics */
    let playbackMode: TimelinePlaybackMode = 'scroll-linked';
    let durationCategory: TimelineDurationCategory = 'standard';
    let priority: TimelinePriority = 'normal';

    if (sectionId === 'threshold' || sectionId === 'footer') {
      playbackMode = 'trigger';
      durationCategory = 'instant';
      priority = 'low';
    } else if (sectionId === 'hero') {
      playbackMode = 'time-based';
      durationCategory = 'extended';
      priority = 'critical';
    } else if (sectionId === 'breathing-space-arrival' || sectionId === 'breathing-space-commitment') {
      durationCategory = 'brief';
    } else if (sectionId === 'closing') {
      durationCategory = 'extended';
      priority = 'critical';
    } else if (sectionId === 'transformation') {
      priority = 'high';
    } else if (sectionId === 'booking') {
      priority = 'high';
    }

    return {
      id: `seg-narrative-${sectionId}`,
      trackType: 'narrative',
      sectionId,
      range,
      stage: meta.stage,
      playbackMode,
      durationCategory,
      priority,
      keyframes: [],
      cues: [],
      enabled: true,
      reducedMotionEnabled: true,
    };
  });
}

// ── Marker Definitions ─────────────────────────────────────

/**
 * Generate timeline markers — semantic reference points.
 *
 * Each section generates up to 3 markers (start, center, end).
 * Act transitions generate act-start/act-end markers.
 * Breathing spaces generate breathing-point markers.
 */
function createMarkers(): readonly TimelineMarker[] {
  const markers: TimelineMarker[] = [];
  let markerIndex = 0;

  const stages = new Set<NarrativeStage>();
  let currentStage: NarrativeStage | null = null;

  for (const sectionId of SECTION_IDS) {
    const meta = SECTION_META[sectionId];
    const range = sectionRange(meta.order, SECTION_COUNT);
    const sectionWidth = range.end - range.start;

    /* Section start marker */
    markers.push({
      id: `marker-${markerIndex++}`,
      type: 'section-start',
      position: range.start,
      sectionId,
      label: `${sectionId} — start`,
      listenerTrackTypes: ['narrative', 'accessibility'],
    });

    /* Section center marker */
    markers.push({
      id: `marker-${markerIndex++}`,
      type: 'section-center',
      position: range.start + sectionWidth * 0.5,
      sectionId,
      label: `${sectionId} — center`,
      listenerTrackTypes: ['narrative', 'camera', 'analytics'],
    });

    /* Section end marker */
    markers.push({
      id: `marker-${markerIndex++}`,
      type: 'section-end',
      position: range.end,
      sectionId,
      label: `${sectionId} — end`,
      listenerTrackTypes: ['narrative', 'accessibility'],
    });

    /* Act boundary markers */
    if (!stages.has(meta.stage)) {
      stages.add(meta.stage);
      markers.push({
        id: `marker-${markerIndex++}`,
        type: 'act-start',
        position: range.start,
        sectionId,
        label: `${meta.stage} — act start`,
        listenerTrackTypes: ['narrative', 'camera', 'lighting', 'analytics'],
      });
    }

    if (currentStage !== null && currentStage !== meta.stage) {
      /* Previous stage ended at the previous section's end */
      const prevSectionId = SECTION_IDS[meta.order - 1];
      const prevRange = sectionRange(SECTION_META[prevSectionId].order, SECTION_COUNT);
      markers.push({
        id: `marker-${markerIndex++}`,
        type: 'act-end',
        position: prevRange.end,
        sectionId: prevSectionId,
        label: `${currentStage} — act end`,
        listenerTrackTypes: ['narrative', 'camera', 'lighting', 'analytics'],
      });
    }
    currentStage = meta.stage;

    /* Breathing point markers */
    if (sectionId === 'breathing-space-arrival' || sectionId === 'breathing-space-commitment') {
      markers.push({
        id: `marker-${markerIndex++}`,
        type: 'breathing-point',
        position: range.start + sectionWidth * 0.5,
        sectionId,
        label: `${sectionId} — breathing point`,
        listenerTrackTypes: ['narrative', 'accessibility'],
      });
    }

    /* Preload triggers — fire at section center for upcoming sections */
    if (meta.order >= 2 && meta.order <= 9) {
      markers.push({
        id: `marker-${markerIndex++}`,
        type: 'preload-point',
        position: range.start + sectionWidth * 0.3,
        sectionId,
        label: `${sectionId} — preload trigger`,
        listenerTrackTypes: ['preload'],
      });
    }

    /* Camera cues — for 3D-aware sections */
    if (['hero', 'atmosphere', 'transformation', 'closing'].includes(sectionId)) {
      markers.push({
        id: `marker-${markerIndex++}`,
        type: 'camera-cue',
        position: range.start + sectionWidth * 0.5,
        sectionId,
        label: `${sectionId} — camera cue`,
        listenerTrackTypes: ['camera', 'three-d', 'environment'],
      });
    }

    /* Analytics cues — track scroll depth into each content section */
    if (meta.order >= 1 && meta.order <= 14) {
      markers.push({
        id: `marker-${markerIndex++}`,
        type: 'analytics-cue',
        position: range.start + sectionWidth * 0.25,
        sectionId,
        label: `${sectionId} — analytics entry`,
        listenerTrackTypes: ['analytics'],
      });
    }
  }

  /* Final act-end marker for the last stage */
  if (currentStage !== null) {
    const lastSection = SECTION_IDS[SECTION_IDS.length - 1];
    const lastRange = sectionRange(SECTION_META[lastSection].order, SECTION_COUNT);
    markers.push({
      id: `marker-${markerIndex++}`,
      type: 'act-end',
      position: lastRange.end,
      sectionId: lastSection,
      label: `${currentStage} — act end`,
      listenerTrackTypes: ['narrative', 'analytics'],
    });
  }

  return markers;
}

// ── Keyframe Definitions ───────────────────────────────────

/**
 * Define keyframes for the narrative track — the core animation data.
 *
 * Keyframes map scroll positions to property values.
 * These are consumed by GSAP ScrollTrigger in Phase 9.
 */
function createKeyframes(): readonly TimelineKeyframe[] {
  const keyframes: TimelineKeyframe[] = [];
  let keyframeIndex = 0;

  for (const sectionId of SECTION_IDS) {
    const meta = SECTION_META[sectionId];
    const range = sectionRange(meta.order, SECTION_COUNT);

    /* Skip structural sections (threshold, footer) */
    if (sectionId === 'threshold' || sectionId === 'footer') continue;

    /* Standard reveal keyframes: opacity 0→1, translateY 30→0 */
    if (sectionId === 'hero') {
      /* Hero warm reveal — time-based, starts at 0.85 opacity */
      keyframes.push(
        {
          id: `kf-${keyframeIndex++}`,
          position: range.start,
          property: 'opacity',
          value: 0.85,
          interpolation: 'ease-out',
        },
        {
          id: `kf-${keyframeIndex++}`,
          position: range.start + (range.end - range.start) * 0.15,
          property: 'opacity',
          value: 1,
          interpolation: 'ease-out',
        },
      );
    } else if (sectionId === 'closing') {
      /* Closing dissolve — slow, extended */
      keyframes.push(
        {
          id: `kf-${keyframeIndex++}`,
          position: range.start + (range.end - range.start) * 0.1,
          property: 'opacity',
          value: 0,
          interpolation: 'ease-in-out',
        },
        {
          id: `kf-${keyframeIndex++}`,
          position: range.start + (range.end - range.start) * 0.7,
          property: 'opacity',
          value: 1,
          interpolation: 'ease-in-out',
        },
      );
    } else if (sectionId === 'breathing-space-arrival' || sectionId === 'breathing-space-commitment') {
      /* Breathing spaces — minimal, just fade */
      keyframes.push(
        {
          id: `kf-${keyframeIndex++}`,
          position: range.start + (range.end - range.start) * 0.2,
          property: 'opacity',
          value: 1,
          interpolation: 'ease-out',
        },
      );
    } else {
      /* Standard section reveal: fade + rise */
      keyframes.push(
        {
          id: `kf-${keyframeIndex++}`,
          position: range.start + (range.end - range.start) * 0.1,
          property: 'opacity',
          value: 0,
          interpolation: 'linear',
        },
        {
          id: `kf-${keyframeIndex++}`,
          position: range.start + (range.end - range.start) * 0.3,
          property: 'opacity',
          value: 1,
          interpolation: 'ease-out',
        },
        {
          id: `kf-${keyframeIndex++}`,
          position: range.start + (range.end - range.start) * 0.1,
          property: 'translateY',
          value: 30,
          interpolation: 'linear',
        },
        {
          id: `kf-${keyframeIndex++}`,
          position: range.start + (range.end - range.start) * 0.3,
          property: 'translateY',
          value: 0,
          interpolation: 'ease-out',
        },
      );
    }
  }

  return keyframes;
}

// ── Cue Definitions ────────────────────────────────────────

/**
 * Define cues — discrete events at specific scroll positions.
 */
function createCues(): readonly TimelineCue[] {
  const cues: TimelineCue[] = [];
  let cueIndex = 0;

  for (const sectionId of SECTION_IDS) {
    const meta = SECTION_META[sectionId];
    const range = sectionRange(meta.order, SECTION_COUNT);
    const sectionWidth = range.end - range.start;

    /* Section entry cue — fires when section starts entering viewport */
    if (sectionId !== 'threshold') {
      cues.push({
        id: `cue-${cueIndex++}`,
        position: range.start + sectionWidth * 0.15,
        trackType: 'analytics',
        action: 'section-view',
        priority: 'low',
        once: true,
        payload: { sectionId, stage: meta.stage },
      });
    }

    /* Preload cue — triggers asset loading ahead of section */
    if (meta.order >= 1 && meta.order <= 8) {
      cues.push({
        id: `cue-${cueIndex++}`,
        position: range.start + sectionWidth * 0.2,
        trackType: 'preload',
        action: 'preload-section-assets',
        priority: 'normal',
        once: true,
        payload: { sectionId },
      });
    }

    /* Reduced motion cue — notifies accessibility track */
    cues.push({
      id: `cue-${cueIndex++}`,
      position: range.start,
      trackType: 'accessibility',
      action: 'section-entered',
      priority: 'high',
      once: false,
      payload: { sectionId },
    });
  }

  return cues;
}

// ── Group Definitions ──────────────────────────────────────

const GROUP_DEFINITIONS: readonly TimelineGroup[] = [
  {
    id: 'group-visual',
    label: 'Visual — 2D scroll-linked animations',
    trackTypes: ['narrative', 'ui'],
    enabled: true,
    resourceBudget: 'standard',
  },
  {
    id: 'group-3d',
    label: '3D — React Three Fiber, particles, atmosphere',
    trackTypes: ['camera', 'lighting', 'environment', 'three-d', 'particle'],
    enabled: true,
    resourceBudget: 'generous',
    featureFlag: 'enable-3d',
  },
  {
    id: 'group-infrastructure',
    label: 'Infrastructure — analytics, accessibility, preloading',
    trackTypes: ['analytics', 'accessibility', 'preload', 'audio'],
    enabled: true,
    resourceBudget: 'minimal',
  },
] as const;

// ── Populate Segments and Keyframes ────────────────────────

const narrativeSegments = createNarrativeSegments();
const allMarkers = createMarkers();
const allKeyframes = createKeyframes();
const allCues = createCues();

/**
 * Distribute keyframes and cues into their parent segments.
 */
function attachDataToSegments(
  segments: readonly TimelineSegment[],
  keyframes: readonly TimelineKeyframe[],
  cues: readonly TimelineCue[],
): readonly TimelineSegment[] {
  return segments.map((segment) => {
    const segmentKeyframes = keyframes.filter((kf) => {
      return kf.position >= segment.range.start && kf.position <= segment.range.end;
    });
    const segmentCues = cues.filter((cue) => {
      return cue.position >= segment.range.start && cue.position <= segment.range.end;
    });
    return {
      ...segment,
      keyframes: segmentKeyframes,
      cues: segmentCues,
    };
  });
}

const populatedNarrativeSegments = attachDataToSegments(narrativeSegments, allKeyframes, allCues);

/**
 * Build UI segments — one per section, mirroring narrative.
 * UI track uses trigger mode for overlays/modals.
 */
const uiSegments: readonly TimelineSegment[] = SECTION_IDS.map((sectionId): TimelineSegment => {
  const meta = SECTION_META[sectionId];
  const range = sectionRange(meta.order, SECTION_COUNT);
  return {
    id: `seg-ui-${sectionId}`,
    trackType: 'ui',
    sectionId,
    range,
    stage: meta.stage,
    playbackMode: 'trigger',
    durationCategory: 'standard',
    priority: 'normal',
    keyframes: [],
    cues: [],
    enabled: sectionId !== 'threshold' && sectionId !== 'footer',
    reducedMotionEnabled: true,
  };
});

/**
 * Build camera segments — for 3D-aware sections only.
 */
const cameraSections: readonly SectionId[] = [
  'hero', 'atmosphere', 'transformation', 'closing',
];
const cameraSegments: readonly TimelineSegment[] = cameraSections.map((sectionId): TimelineSegment => {
  const meta = SECTION_META[sectionId];
  const range = sectionRange(meta.order, SECTION_COUNT);
  return {
    id: `seg-camera-${sectionId}`,
    trackType: 'camera',
    sectionId,
    range,
    stage: meta.stage,
    playbackMode: 'scroll-linked',
    durationCategory: sectionId === 'hero' || sectionId === 'closing' ? 'extended' : 'standard',
    priority: sectionId === 'hero' ? 'high' : 'normal',
    keyframes: [],
    cues: [],
    enabled: true,
    reducedMotionEnabled: true,
  };
});

/**
 * Build analytics segments — all content sections.
 */
const analyticsSegments: readonly TimelineSegment[] = SECTION_IDS.filter(
  (id) => id !== 'threshold',
).map((sectionId): TimelineSegment => {
  const meta = SECTION_META[sectionId];
  const range = sectionRange(meta.order, SECTION_COUNT);
  return {
    id: `seg-analytics-${sectionId}`,
    trackType: 'analytics',
    sectionId,
    range,
    stage: meta.stage,
    playbackMode: 'trigger',
    durationCategory: 'instant',
    priority: 'low',
    keyframes: [],
    cues: [],
    enabled: true,
    reducedMotionEnabled: false,
  };
});

/**
 * Build accessibility segments — all sections.
 */
const accessibilitySegments: readonly TimelineSegment[] = SECTION_IDS.map((sectionId): TimelineSegment => {
  const meta = SECTION_META[sectionId];
  const range = sectionRange(meta.order, SECTION_COUNT);
  return {
    id: `seg-accessibility-${sectionId}`,
    trackType: 'accessibility',
    sectionId,
    range,
    stage: meta.stage,
    playbackMode: 'scroll-linked',
    durationCategory: 'instant',
    priority: 'high',
    keyframes: [],
    cues: [],
    enabled: true,
    reducedMotionEnabled: false,
  };
});

/**
 * Build preload segments — for sections with preloadable assets.
 */
const preloadSections: readonly SectionId[] = [
  'hero', 'whisper', 'atmosphere', 'hair', 'transformation',
  'bridal', 'spa', 'artisans',
];
const preloadSegments: readonly TimelineSegment[] = preloadSections.map((sectionId): TimelineSegment => {
  const meta = SECTION_META[sectionId];
  const range = sectionRange(meta.order, SECTION_COUNT);
  return {
    id: `seg-preload-${sectionId}`,
    trackType: 'preload',
    sectionId,
    range: {
      start: Math.max(0, range.start - 0.0625),
      end: range.start + (range.end - range.start) * 0.3,
    },
    stage: meta.stage,
    playbackMode: 'trigger',
    durationCategory: 'instant',
    priority: meta.order < 4 ? 'high' : 'normal',
    keyframes: [],
    cues: [],
    enabled: true,
    reducedMotionEnabled: false,
  };
});

// ── Assemble Tracks with Segments ──────────────────────────

function assembleTracks(): readonly TimelineTrack[] {
  const segmentMap = new Map<TimelineTrackType, readonly TimelineSegment[]>([
    ['narrative', populatedNarrativeSegments],
    ['ui', uiSegments],
    ['camera', cameraSegments],
    ['analytics', analyticsSegments],
    ['accessibility', accessibilitySegments],
    ['preload', preloadSegments],
    ['lighting', []],
    ['environment', []],
    ['three-d', []],
    ['particle', []],
    ['audio', []],
  ]);

  return TRACK_DEFINITIONS.map((track) => ({
    ...track,
    segments: segmentMap.get(track.type) ?? [],
  }));
}

// ── Registry Factory ───────────────────────────────────────

/**
 * Creates an immutable timeline registry.
 *
 * Built once at module initialization. All methods are pure.
 *
 * @returns A frozen TimelineRegistry
 */
function createTimelineRegistry(): TimelineRegistry {
  const tracks = assembleTracks();

  /* Index tracks by type */
  const tracksByType = new Map<TimelineTrackType, TimelineTrack>(
    tracks.map((t) => [t.type, t]),
  );

  /* Index markers by ID */
  const markersById = new Map<string, TimelineMarker>(
    allMarkers.map((m) => [m.id, m]),
  );

  /* Index markers by type */
  const markersByType = new Map<string, TimelineMarker[]>();
  for (const m of allMarkers) {
    const group = markersByType.get(m.type) ?? [];
    group.push(m);
    markersByType.set(m.type, group);
  }

  /* Index markers by section */
  const markersBySection = new Map<SectionId, TimelineMarker[]>();
  for (const m of allMarkers) {
    const group = markersBySection.get(m.sectionId) ?? [];
    group.push(m);
    markersBySection.set(m.sectionId, group);
  }

  /* Collect all segments */
  const allSegments = tracks.flatMap((t) => t.segments);

  /* Index segments by ID */
  const segmentsById = new Map<string, TimelineSegment>(
    allSegments.map((s) => [s.id, s]),
  );

  /* Index segments by track type */
  const segmentsByTrackType = new Map<TimelineTrackType, TimelineSegment[]>();
  for (const s of allSegments) {
    const group = segmentsByTrackType.get(s.trackType) ?? [];
    group.push(s);
    segmentsByTrackType.set(s.trackType, group);
  }

  /* Index segments by section */
  const segmentsBySection = new Map<SectionId, TimelineSegment[]>();
  for (const s of allSegments) {
    const group = segmentsBySection.get(s.sectionId) ?? [];
    group.push(s);
    segmentsBySection.set(s.sectionId, group);
  }

  /* Index groups by ID */
  const groupsById = new Map<string, TimelineGroup>(
    GROUP_DEFINITIONS.map((g) => [g.id, g]),
  );

  /* Compute metadata */
  const totalKeyframes = allSegments.reduce((sum, s) => sum + s.keyframes.length, 0);
  const totalCues = allSegments.reduce((sum, s) => sum + s.cues.length, 0);

  const metadata: TimelineMetadata = {
    id: 'main-timeline',
    name: 'The Sovereign Artisor — Homepage Timeline',
    totalScrollHeight: 0, // populated at runtime by scroll engine
    sectionCount: SECTION_COUNT,
    trackCount: tracks.length,
    markerCount: allMarkers.length,
    segmentCount: allSegments.length,
    keyframeCount: totalKeyframes,
    cueCount: totalCues,
    stages: [...NARRATIVE_STAGES],
    reducedMotionActive: false, // populated at runtime
  };

  const timeline: TimelineDefinition = {
    metadata,
    tracks,
    markers: allMarkers,
    groups: [...GROUP_DEFINITIONS],
  };

  const registry: TimelineRegistry = {
    getTimeline(): TimelineDefinition {
      return timeline;
    },

    getTrack(type: TimelineTrackType): TimelineTrack | undefined {
      return tracksByType.get(type);
    },

    getTracks(): readonly TimelineTrack[] {
      return tracks;
    },

    getTracksByPriority(priority: TimelinePriority): readonly TimelineTrack[] {
      return tracks.filter((t) => t.priority === priority);
    },

    getMarker(id: string): TimelineMarker | undefined {
      return markersById.get(id);
    },

    getMarkers(): readonly TimelineMarker[] {
      return allMarkers;
    },

    getMarkersByType(type: string): readonly TimelineMarker[] {
      return markersByType.get(type) ?? [];
    },

    getMarkersForSection(sectionId: SectionId): readonly TimelineMarker[] {
      return markersBySection.get(sectionId) ?? [];
    },

    getSegment(id: string): TimelineSegment | undefined {
      return segmentsById.get(id);
    },

    getSegmentsForTrack(trackType: TimelineTrackType): readonly TimelineSegment[] {
      return segmentsByTrackType.get(trackType) ?? [];
    },

    getSegmentsForSection(sectionId: SectionId): readonly TimelineSegment[] {
      return segmentsBySection.get(sectionId) ?? [];
    },

    getSegmentsInRange(range: TimelineRange): readonly TimelineSegment[] {
      return allSegments.filter(
        (s) => s.range.start < range.end && s.range.end > range.start,
      );
    },

    getGroup(id: string): TimelineGroup | undefined {
      return groupsById.get(id);
    },

    getGroups(): readonly TimelineGroup[] {
      return GROUP_DEFINITIONS;
    },

    getMetadata(): TimelineMetadata {
      return metadata;
    },

    hasTrack(type: TimelineTrackType): boolean {
      return tracksByType.has(type);
    },

    hasMarker(id: string): boolean {
      return markersById.has(id);
    },

    trackCount(): number {
      return tracks.length;
    },

    markerCount(): number {
      return allMarkers.length;
    },

    segmentCount(): number {
      return allSegments.length;
    },
  };

  return Object.freeze(registry);
}

// ── Singleton Registry ─────────────────────────────────────

/**
 * The singleton timeline registry.
 *
 * Created once at module load time. Frozen and immutable.
 */
export const TIMELINE_REGISTRY: TimelineRegistry = createTimelineRegistry();

// ── Validation (Development Only) ──────────────────────────

if (import.meta.env.DEV) {
  /* Verify track count matches expected (11 tracks) */
  if (TIMELINE_REGISTRY.trackCount() !== 11) {
    console.error(
      `[Narrative Timeline] Expected 11 tracks, got ${TIMELINE_REGISTRY.trackCount()}`,
    );
  }

  /* Verify marker count is reasonable */
  const markerCount = TIMELINE_REGISTRY.markerCount();
  if (markerCount < 30) {
    console.error(
      `[Narrative Timeline] Expected 30+ markers, got ${markerCount}`,
    );
  }

  /* Verify all sections have narrative segments */
  const narrativeSegments = TIMELINE_REGISTRY.getSegmentsForTrack('narrative');
  if (narrativeSegments.length !== SECTION_COUNT) {
    console.error(
      `[Narrative Timeline] Expected ${SECTION_COUNT} narrative segments, got ${narrativeSegments.length}`,
    );
  }

  /* Verify primary track exists and is narrative */
  const narrativeTrack = TIMELINE_REGISTRY.getTrack('narrative');
  if (!narrativeTrack?.isPrimary) {
    console.error('[Narrative Timeline] Narrative track must be primary');
  }

  /* Verify group count */
  if (TIMELINE_REGISTRY.getGroups().length !== 3) {
    console.error(
      `[Narrative Timeline] Expected 3 groups, got ${TIMELINE_REGISTRY.getGroups().length}`,
    );
  }
}

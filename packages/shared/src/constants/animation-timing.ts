export const ANIMATION_TIMING = {
  heroReveal: { min: 1200, max: 1500 },
  confirmationReveal: { min: 800, max: 1200 },
  sectionReveal: { duration: 600, maxOpacity: 1, startOpacity: 0.8 },
  parallax: { maxDifferential: 0.2 },
  hover: { duration: 200, maxScale: 1.03 },
  scrollReveal: { threshold: 0.15 },
} as const;

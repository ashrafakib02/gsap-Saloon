import { createFileRoute } from '@tanstack/react-router';
import HeroSection from '@/features/hero';

export const Route = createFileRoute('/')({
  component: HomePage,
});

/**
 * Homepage — The Cinematic Journey Begins
 *
 * From EXPERIENCE_STORYBOARD:
 * "The homepage is a single scroll through a story.
 *  Each section is a scene. The hero is Scene 1."
 *
 * Scene 1: Threshold (Hero) — "The entrance"
 * Scene 2: Whisper (Phase 4.2) — "The promise"
 * Scene 3: Immersion (Phase 4.3) — "The world"
 * ...
 *
 * Current phase: 4.1 — Hero Experience
 * The hero stands alone until subsequent phases add scenes.
 */
function HomePage() {
  return (
    <>
      {/* ── Scene 1: Threshold ────────────────────────────
       * The hero is the first and most important scene.
       * It occupies the full viewport.
       * From DESIGN_SYSTEM §1 (P2: One Idea Per Moment):
       * "One section, one idea. One scene, one emotion." */}
      <HeroSection />
    </>
  );
}

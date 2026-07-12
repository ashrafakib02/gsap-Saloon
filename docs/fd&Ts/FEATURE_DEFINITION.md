# FEATURE_DEFINITION.md
## Product Scope — Version 1

> "Every feature exists because it serves the visitor's journey from curiosity to commitment. If a feature does not advance that journey, it does not belong in Version 1. We build what matters. We defer what is premature. We refuse what dilutes."

---

## DOCUMENT PURPOSE

This document defines every feature that will exist in Version 1 of The Sovereign Artisor's digital presence. It is the product scope — the single source of truth for what will be built, what will not, and what comes later.

Every feature is categorized, prioritized, and defined by its purpose, user value, business value, complexity, dependencies, and future expansion potential. This document is the boundary between V1 and everything else.

**This is not a design document.** It does not discuss visual execution. It does not discuss implementation. It defines WHAT will exist and WHY — not HOW it will look or HOW it will be built.

**Source of truth documents:**
- PRODUCT_VISION.md → Brand strategy and business objectives
- COMPETITOR_RESEARCH.md → Market landscape and differentiation
- CREATIVE_DIRECTION.md → Artistic identity and emotional language
- MOODBOARD.md → Visual references and aesthetic principles
- DESIGN_LANGUAGE.md → Visual grammar and compositional rules
- VISUAL_RULES.md → Constitutional rules (always-do, never-do)
- EXPERIENCE_STORYBOARD.md → Cinematic narrative structure
- SCROLL_STORY.md → Pacing and emotional architecture
- EMOTIONAL_TIMELINE.md → Feeling at every step of the journey
- INTERACTION_TIMELINE.md → Tactile vocabulary and interaction design
- SIGNATURE_MOMENTS.md → The 10 unforgettable moments users leave with
- SECTION_PURPOSE.md → Why every section exists and what happens if removed

---

## FEATURE PRIORITY LEGEND

| Priority | Meaning | Decision Rule |
|----------|---------|---------------|
| **P0** | Must-have for launch. The experience fails without it. | Would removing this break the core journey? |
| **P1** | Should-have for launch. The experience is significantly weakened without it. | Would removing this noticeably damage user trust or conversion? |
| **P2** | Nice-to-have for launch. The experience works without it but benefits from it. | Would adding this improve the experience but not damage it if absent? |
| **P3** | Deferred to V2+. Important but not essential for the initial launch. | Does this require infrastructure, content, or data not yet available? |

## COMPLEXITY LEGEND

| Level | Meaning | Implication |
|-------|---------|-------------|
| **Low** | Single component or simple content page | Days, not weeks |
| **Medium** | Multi-component feature with interaction design | 1-3 weeks of focused work |
| **High** | System-level feature with multiple dependencies | 3-6 weeks, may require external services |
| **Very High** | Complex system with third-party integrations | 6+ weeks, architectural decisions required |

---

# CATEGORIES

---

## 1. LANDING EXPERIENCE

The threshold — the passage from the outside world into the brand's universe. Every decision about what happens in the first 3 seconds.

---

### F1.1 — Designed Loading Threshold

**Purpose:** Transform the transit from noise to sanctuary. The warm background appears first, followed by a single atmospheric element, dissolving into the hero image. No spinner. No progress bar. No blank screen. The loading moment IS the hero reveal.

**User Value:** The visitor feels she has arrived somewhere — not that a page is loading. The emotional transition from "browsing" to "experiencing" is bridged in the first 1-3 seconds.

**Business Value:** First impressions are formed in under 3 seconds. A beautiful threshold reduces bounce rate and establishes the premium positioning before any content is seen. Every competitor uses a spinner or blank screen — we differentiate in the first frame.

**Priority:** P0 — The experience fundamentally fails without it. The threshold is the first of ten signature moments (The Designed Threshold).

**Complexity:** Medium — Requires careful timing choreography between the warm background, the atmospheric element, and the hero image dissolve. The dissolve must be seamless.

**Dependencies:** Hero image (F2.1) must be optimized for fast initial render. Brand mark or atmospheric element asset must be defined. Warm background color from the approved palette.

**Future Expansion:** V2 could introduce seasonal atmospheric elements (subtle variations in the threshold's element based on season or time of day). V3 could personalize the threshold based on referral source (returning client vs. new visitor).

---

### F1.2 — Warm Background as First Visual

**Purpose:** Establish the brand's warmth before any content appears. The warm off-white background is the first thing the visitor sees — it sets the color temperature, communicates care, and signals that this is not a default white screen.

**User Value:** The visitor's eyes adjust to warmth before encountering any content. The color temperature primes the emotional experience — warmth before information.

**Business Value:** The warm background is the brand's most fundamental differentiator. Every competitor uses white or near-white backgrounds. Our warmth is visible from the first millisecond.

**Priority:** P0 — Without the warm background, the threshold dissolves into a generic white screen.

**Complexity:** Low — Single color applied to the document body. The complexity is in the decision, not the execution.

**Dependencies:** Color palette defined in VISUAL_RULES.md (C1, C3, C4).

**Future Expansion:** V2 could introduce the three lighting moods (Morning Light, Afternoon Gold, Evening Warmth) as time-of-day ambient shifts — but only with extensive testing.

---

### F1.3 — Seamless Transition from Threshold to Hero

**Purpose:** Ensure there is no visible boundary between "loading" and "loaded." The threshold element dissolves into the hero image — the visitor does not notice the moment the page finishes loading because the loading moment was designed to flow seamlessly into the first scene.

**User Value:** The visitor never waits. She arrives. The seamlessness creates the feeling that the experience was always there, waiting for her.

**Business Value:** Eliminates the perception of loading time. The visitor's first impression is "instant" because the designed threshold occupies the loading period with beauty rather than waiting.

**Priority:** P0 — The threshold (F1.1) exists to create this transition. Without it, the threshold is an isolated animation with no payoff.

**Complexity:** Medium — Requires precise timing coordination between the threshold animation and the hero image render. The hero must be ready before the threshold animation completes.

**Dependencies:** F1.1 (threshold), F2.1 (hero image), performance optimization for hero image loading.

**Future Expansion:** None needed — the transition should remain invisible and seamless across all versions.

---

## 2. NAVIGATION

The wayfinding system — how the visitor moves through the experience. Minimal, confident, always accessible.

---

### F2.1 — Sticky Navigation Bar

**Purpose:** Provide persistent access to the brand identity and the booking CTA from any point in the scroll. The navigation bar is always present — not as a demand for attention, but as a quiet assurance that the way forward is always available.

**User Value:** The visitor never feels lost or trapped. The booking CTA is always one tap away. The brand identity is always visible. The navigation provides orientation without interrupting the scroll experience.

**Business Value:** Every page view must have a clear path to conversion. The sticky navigation ensures the booking CTA is accessible from any scroll position, reducing the friction between "I want to book" and "I can book." Rule A12 (VISUAL_RULES.md): The booking CTA is always accessible.

**Priority:** P0 — Without persistent navigation, the visitor has no reliable path to booking.

**Complexity:** Medium — Requires scroll-aware behavior (appears/disappears based on scroll direction), responsive design for all viewports, and performance optimization to avoid layout thrashing.

**Dependencies:** Booking flow (F11.1). Brand mark asset. Navigation links to all sections.

**Future Expansion:** V2 could introduce a secondary navigation state for logged-in returning clients (showing their next appointment, preferred artisan). V3 could add breadcrumb-style scroll progress indication.

---

### F2.2 — Brand Mark in Navigation

**Purpose:** The brand identity is always visible. The logo or wordmark in the navigation bar anchors the visitor's sense of place — she always knows where she is.

**User Value:** Brand recognition builds through repeated exposure during the scroll. The brand mark serves as a "home" anchor — tapping it returns the visitor to the top of the page.

**Business Value:** Brand recall increases with every scroll. The brand mark's consistent presence reinforces the premium identity.

**Priority:** P0 — Brand identity must be present in the navigation.

**Complexity:** Low — Brand mark asset (SVG or optimized format) placed in the navigation component.

**Dependencies:** Brand mark design and asset delivery.

**Future Expansion:** V2 could make the brand mark a link to a brand story or about page (if multi-page architecture is introduced).

---

### F2.3 — Minimal Navigation Links

**Purpose:** Provide access to key sections without cluttering the navigation. The navigation includes only the essential links: Services, Gallery/Portfolio, About/Team, and Contact. Every link is a direct path to a section within the single-page experience.

**User Value:** The visitor can jump to any section of interest without scrolling through the entire page. The navigation respects her time while maintaining the cinematic scroll experience.

**Business Value:** Reduces the path to conversion for visitors who arrive with specific intent (e.g., "I want to see bridal services" → direct link to Bridal section).

**Priority:** P1 — Navigation links improve usability but the scroll experience works without them.

**Complexity:** Low — Anchor links to sections within the single-page experience. Smooth scroll behavior.

**Dependencies:** Section IDs defined across the page. Smooth scroll implementation.

**Future Expansion:** V2 could introduce a mega-menu for services if the service catalog grows significantly.

---

### F2.4 — Mobile Navigation (Hamburger Menu)

**Purpose:** Provide full navigation access on mobile viewports where horizontal navigation links do not fit. The mobile menu opens as a full-screen overlay with the same warm aesthetic as the rest of the experience — not a generic dropdown.

**User Value:** Mobile visitors have full access to all sections. The full-screen overlay maintains the brand experience — it feels like entering a room, not opening a menu.

**Business Value:** Mobile is the primary viewport. Without a functional mobile navigation, 60%+ of visitors cannot reach key sections efficiently.

**Priority:** P0 — Mobile navigation is essential for mobile-first design.

**Complexity:** Medium — Full-screen overlay with animation (slide-in or fade-in), navigation links, booking CTA, and contact information. Must follow the brand's motion principles (ease-out, no bounce, 400-600ms).

**Dependencies:** F2.1 (navigation structure), animation system.

**Future Expansion:** V2 could add language switcher to the mobile navigation for multilingual support.

---

## 3. HERO

The establishing shot — the single image that communicates the brand's identity, quality, and world.

---

### F3.1 — Full-Viewport Hero Image

**Purpose:** The first visual impression — a single, extraordinary, full-viewport editorial photograph that communicates the brand's identity in a wordless frame. No text. No headline. No call to action. Just the image. Just the feeling. Just the space.

**User Value:** The visitor feels awe — the involuntary deep breath. The hero creates the emotional opening that every subsequent section needs. It answers the unconscious question: "Is this place for me?" with a visual "Yes."

**Business Value:** The hero creates the Halo Effect — the psychological phenomenon where the first impression colors all subsequent impressions. If the hero is extraordinary, everything that follows benefits from the assumption of quality. This is the single most important image in the entire experience.

**Priority:** P0 — The experience fundamentally fails without a hero. The hero is the first of ten signature moments (The Warm Unveiling).

**Complexity:** Medium — Requires editorial photography of exceptional quality, optimized for fast loading across viewports, with responsive treatment (full-viewport on all devices).

**Dependencies:** Original photography (I1, VISUAL_RULES.md — no stock, no AI). Image optimization pipeline (WebP/AVIF with fallbacks). Performance budget for LCP under 2.5 seconds (P1).

**Future Expansion:** V2 could introduce the three lighting moods as seasonal hero variations. V3 could offer personalized hero images based on visitor behavior (returning vs. new).

---

### F3.2 — Hero Image Warm Reveal

**Purpose:** The signature reveal animation — the hero image fades in from 80-90% opacity (not from black), creating the feeling that the image was always there and is now simply becoming clear. Duration: 800-1200ms.

**User Value:** The reveal is the Warm Reveal — the brand's signature interaction. It creates the sense of materialization from warmth, not appearance from void. The near-opacity starting point means the image never "pops" into existence; it emerges.

**Business Value:** The Warm Reveal is the brand's most recognizable motion signature. Consistent use across the hero and other elements creates the visual fingerprint that makes the experience feel like it belongs to the same world.

**Priority:** P0 — The hero reveal is the signature interaction (CINEMATIC_PRESET.md).

**Complexity:** Medium — Requires precise opacity animation with ease-out timing. Must be the only time-linked animation in the experience (M2, VISUAL_RULES.md).

**Dependencies:** F3.1 (hero image). Animation system.

**Future Expansion:** None needed — the Warm Reveal should remain consistent across all versions.

---

### F3.3 — Hero Image Parallax on Exit

**Purpose:** As the visitor scrolls past the hero, the image slowly fades and translates upward at a gentle parallax rate (80% of scroll speed), creating the Legacy Fade transition into the Narrative Whisper section.

**User Value:** The hero's impression lingers as the next scene emerges. The transition is a cinematic cross-fade, not an abrupt scroll-past. The visitor feels the hero dissolving into the next moment.

**Business Value:** The extended hero impression maximizes the Halo Effect. The parallax is subtle (10-15% differential) — felt, not seen (N19: Maximum parallax 15-20%).

**Priority:** P1 — Enhances the hero-to-narrative transition but the hero works without parallax.

**Complexity:** Medium — Scroll-linked animation using GPU-accelerated properties only (P10). Must respect prefers-reduced-motion (M11).

**Dependencies:** F3.1 (hero image). Scroll animation system.

**Future Expansion:** None — the parallax rate should remain subtle and consistent.

---

## 4. STORYTELLING

The narrative voice — the words, the images, and the atmospheric moments that communicate the brand's identity and create emotional connection.

---

### F4.1 — Narrative Whisper (Thesis Section)

**Purpose:** The brand's voice, heard for the first time. A single headline (5-8 words) in the serif typeface at Display scale, perhaps followed by one supporting line, surrounded by 70%+ whitespace. The thesis is a declaration of belief, not a tagline.

**User Value:** The visitor hears the brand's philosophy and recognizes alignment: "Yes, that is exactly what I have been looking for." The whisper creates the transition from visual impression to verbal understanding.

**Business Value:** The thesis provides the verbal memorability that drives word-of-mouth. When the visitor tells a friend about the salon, she quotes the thesis. The thesis is the brand's elevator pitch — compressed into a single sentence.

**Priority:** P0 — Without the thesis, the brand has no voice. The Narrative Whisper is the third of ten signature moments.

**Complexity:** Low — Typographic composition with generous whitespace. The complexity is in the editorial craft, not the technical execution.

**Dependencies:** Brand voice guidelines. Serif typeface selection.

**Future Expansion:** V2 could A/B test thesis variants for conversion optimization.

---

### F4.2 — Word-by-Word Reveal Animation

**Purpose:** The thesis headline reveals word by word — each word appearing with a 60-80ms delay, creating the feeling of a voice speaking slowly and deliberately. The reveal is not typed but materialized.

**User Value:** The visitor experiences the thesis as a voice, not as text. The word-by-word reveal creates the rhythm of speech — statement, breath, elaboration.

**Business Value:** The reveal animation transforms static text into an experience. The cinematic quality of the reveal reinforces the premium positioning.

**Priority:** P1 — Enhances the thesis but the words carry meaning without animation.

**Complexity:** Low — Scroll-linked word reveal with timing delays.

**Dependencies:** F4.1 (thesis content). Scroll animation system.

**Future Expansion:** None — the word-by-word reveal should remain consistent.

---

### F4.3 — Atmospheric Immersion Section

**Purpose:** A sequence of 2-4 full-bleed or near-full-bleed editorial images that place the visitor INSIDE the salon space. Environmental shots (the space) alternate with tactile shots (materials, light, details). Between images, brief typographic moments — single words in the serif typeface.

**User Value:** The visitor shifts from observer to participant. She is no longer "looking at a salon website" — she is "inside a space." The immersion creates desire: "I want to be there."

**Business Value:** The immersion section is where desire crystallizes. It transforms the brand from "visually appealing" to "personally desired." This is the section that makes the service chapters meaningful — the visitor evaluates services as someone who already wants to be in the space.

**Priority:** P0 — The Atmosphere Surround is the fourth of ten signature moments. Without it, the visitor never transitions from appreciation to desire.

**Complexity:** Medium — Requires editorial photography (multiple images), scroll-linked parallax, and typographic moments.

**Dependencies:** Original photography. Scroll animation system. Serif typeface.

**Future Expansion:** V2 could introduce the three lighting moods across different immersion images. V3 could add subtle ambient soundscapes (opt-in only).

---

### F4.4 — Parallax Scrolling on Immersion Images

**Purpose:** Each immersion image moves at 80% of the scroll speed, creating the tracking-shot feeling — the visitor is the camera, moving through the space at her own pace. The parallax creates the sensation of looking INTO a space, not AT a flat surface.

**User Value:** The parallax creates dimensional depth. The visitor feels she is moving through the salon, not past it. Fast scrolling creates a quick walkthrough; slow scrolling creates a lingering exploration.

**Business Value:** The parallax transforms static images into a cinematic experience. The scroll-linked motion creates engagement and increases time-on-section — both indicators of interest.

**Priority:** P1 — Enhances the immersion but the images work without parallax.

**Complexity:** Medium — Scroll-linked animation with GPU-accelerated properties. Must respect prefers-reduced-motion and not exceed 15-20% differential.

**Dependencies:** F4.3 (immersion images). Scroll animation system.

**Future Expansion:** None — the parallax should remain subtle.

---

### F4.5 — Typographic Moments Between Immersion Images

**Purpose:** Single words or short phrases in the serif typeface that act as "titles" for each atmospheric image — like chapter headings in a visual poem. Words from the brand vocabulary: "Warmth." "Touch." "Ritual."

**User Value:** The words name what the images show without describing them. The visitor reads a word and looks at the image with new eyes — the word creates a lens for interpretation.

**Business Value:** The typographic moments create the text-image dialogue (Rhythm 5, SCROLL_STORY.md) that prevents visual fatigue. They also reinforce the brand vocabulary.

**Priority:** P2 — Enhances the immersion rhythm but the images work without captions.

**Complexity:** Low — Simple fade-in animation for each word. Scroll-linked.

**Dependencies:** F4.3 (immersion images). Brand vocabulary.

**Future Expansion:** None needed.

---

### F4.6 — Editorial Photography System

**Purpose:** All images across the experience are original, editorial-quality photographs of the real salon, real artisans, and real clients. No stock. No AI-generated. No third-party imagery. The photography follows consistent warm color grading (amber midtones, warm shadows, golden highlights).

**User Value:** Authenticity creates trust. The visitor sees real people, real spaces, and real work — not stock models in generic salons. The consistency of the photography creates the feeling that the entire experience exists in the same warm, golden world.

**Business Value:** Authentic photography is the brand's most valuable differentiator. Every competitor uses stock or AI imagery. Our originality is our credibility. Rule A4, N1, N2, I1 (VISUAL_RULES.md).

**Priority:** P0 — Without original photography, the brand's credibility collapses.

**Complexity:** Very High — Requires a professional photography production: art direction, shooting schedule, location preparation, model coordination, post-production with consistent color grading. This is a content production project, not a technical feature.

**Dependencies:** Photography budget, art direction guidelines (CREATIVE_DIRECTION.md, MOODBOARD.md), post-production pipeline.

**Future Expansion:** V2 could introduce photography refreshes seasonally. V3 could add behind-the-scenes content.

---

## 5. 3D EXPERIENCE

Atmospheric depth — the subtle, felt-but-not-seen dimensional quality that makes the experience feel like it exists in a real space.

---

### F5.1 — Atmospheric 3D Depth Layer

**Purpose:** A subtle, volumetric atmospheric layer that creates the sensation of looking through golden afternoon light. Not 3D objects, not particle systems, not rotatable models — atmospheric depth. The 3D is the light itself, not what the light illuminates.

**User Value:** The visitor feels depth without seeing it. The atmospheric layer creates the subconscious sense that the experience exists in a three-dimensional space — a space with air, light, and warmth. This dimensionality makes the experience feel more real, more present, more immersive.

**Business Value:** The atmospheric 3D is the most subtle but most differentiating visual treatment. It creates the "something I can't put my finger on" quality that luxury experiences are defined by. Rule D1: 3D is atmospheric, never the focus.

**Priority:** P2 — The experience works without 3D but loses the atmospheric depth that creates the luxury "feel." This is an enhancement, not a requirement.

**Complexity:** High — Requires WebGL or CSS-based volumetric effects that are performant across devices. Must be disabled on mobile if performance is impacted (D2).

**Dependencies:** 3D rules (D1-D6). Performance budget. prefers-reduced-motion support (D6).

**Future Expansion:** V2 could introduce context-sensitive atmospheric depth (warmer during the Transformation section, softer during Bridal). V3 could add the three lighting moods as atmospheric variations.

---

### F5.2 — Volumetric Light Bloom (Threshold)

**Purpose:** A single volumetric light bloom during the loading threshold — the warmest, softest light expanding from the center of the viewport. Not a particle system. A bloom of warmth, as if the room is slowly being illuminated by curtains being drawn.

**User Value:** The threshold's light bloom is the first atmospheric element the visitor encounters. It sets the tone for the entire experience: warm, considered, cinematic.

**Business Value:** The light bloom is part of the Designed Threshold (Signature Moment 1). It differentiates the loading experience from every competitor's spinner.

**Priority:** P1 — Part of the threshold experience.

**Complexity:** Medium — CSS or canvas-based bloom effect. Must be lightweight and fast.

**Dependencies:** F1.1 (threshold). Performance budget.

**Future Expansion:** None — the bloom should remain consistent.

---

## 6. SCROLL ANIMATIONS

The choreographed movement that makes the scroll feel cinematic — every element has its moment of arrival.

---

### F6.1 — Scroll-Linked Content Reveals

**Purpose:** All content elements below the fold enter the viewport with a standardized reveal animation: 400-600ms duration, 20-30px upward translation, ease-out curve. The animation is triggered by viewport entry — elements animate only when the visitor scrolls to them.

**User Value:** The visitor discovers content as she scrolls — each section arrives with a considered, unhurried reveal. The consistency of the reveal animation creates a learnable rhythm: "Every new section appears this way."

**Business Value:** Scroll-linked reveals create the cinematic pacing that defines the brand. The reveals transform a static page into a choreographed experience.

**Priority:** P0 — Without scroll-linked reveals, the experience is a static page. The entire scroll narrative depends on content appearing at the right moment.

**Complexity:** Medium — Intersection Observer-based animation triggers. GPU-accelerated properties only (transform, opacity). must respect prefers-reduced-motion.

**Dependencies:** Animation rules (M1-M14). Performance budget.

**Future Expansion:** V2 could introduce section-specific reveal variations (e.g., the Transformation Dissolve for the color section).

---

### F6.2 — Breathing Spaces Between Sections

**Purpose:** Designed rest between content sections — 40-60% viewport of warm background with no content. Full viewport breathing between acts. The breathing creates rhythm, allows processing, and prevents content density fatigue.

**User Value:** The visitor processes each section before encountering the next. The breathing spaces create the pacing that makes the scroll feel like a film rather than a document.

**Business Value:** The breathing spaces are the structural foundation of the scroll's emotional architecture. Without them, sections collide and the narrative collapses.

**Priority:** P0 — Breathing spaces are architectural, not decorative. The scroll story requires them.

**Complexity:** Low — Spacing and background color. The complexity is in the design decision, not the implementation.

**Dependencies:** Spacing scale (S1-S8). Section purpose definitions (SECTION_PURPOSE.md).

**Future Expansion:** None — breathing spaces should remain consistent.

---

### F6.3 — Chapter Break Transitions

**Purpose:** The breathing spaces between acts are distinguished from the breathing spaces between sections. Chapter breaks use full-viewport breathing (vs. 40-60% for section breaks) and may include a subtle visual signal (a shift in content density or a typographic pause).

**User Value:** The visitor feels the transition between narrative chapters — the shift from Act I (Invitation) to Act II (Experience) to Act III (Commitment). The chapter breaks create the three-act structure.

**Business Value:** The three-act structure is the narrative architecture of the entire experience. Chapter breaks maintain this structure across the scroll.

**Priority:** P1 — Chapter breaks enhance the narrative structure but the acts flow without explicit markers.

**Complexity:** Low — Spacing and design treatment.

**Dependencies:** Breathing spaces (F6.2). Section purpose definitions.

**Future Expansion:** None.

---

### F6.4 — prefers-reduced-motion Support

**Purpose:** When the visitor has prefers-reduced-motion active, all scroll-linked animations become instant. All hover transitions become instant. The experience is complete and satisfying without any motion. The content is all present; it simply appears without animation.

**User Value:** Visitors with motion sensitivity, vestibular disorders, or preference for static content receive a complete, satisfying experience. They lose no content and no functionality.

**Business Value:** Accessibility compliance (AC5, VISUAL_RULES.md). Motion sensitivity affects 30-40% of the population. Respecting this preference is a legal and ethical obligation.

**Priority:** P0 — Accessibility is non-negotiable.

**Complexity:** Low — CSS media query implementation. All animations gated behind prefers-reduced-motion check.

**Dependencies:** Animation system. All animated features.

**Future Expansion:** None — this must always be supported.

---

## 7. SERVICES

The four service chapters — the evidence that the brand's beauty is rooted in genuine skill.

---

### F7.1 — Hair Service Chapter

**Purpose:** The first concrete encounter with the craft. Editorial photography of hair work in action, sensory copy describing the experience, transparent pricing, and proof images. The chapter establishes the pattern for all service chapters: image → headline → copy → price → proof.

**User Value:** The visitor sees the craft and thinks: "These people are extraordinary at what they do." The editorial photography communicates mastery; the copy communicates experience; the pricing communicates confidence.

**Business Value:** The Hair chapter is the widest part of the funnel — the most universal service. It captures the broadest audience segment and establishes the quality standard for all subsequent service chapters.

**Priority:** P0 — The Craft: Hair is the entry point to Act II.

**Complexity:** Medium — Service content component with editorial photography, typographic hierarchy, and pricing display.

**Dependencies:** Original photography. Service content and pricing. Typography system.

**Future Expansion:** V2 could add individual service detail pages. V3 could add service-specific booking paths.

---

### F7.2 — Color/Transformation Service Chapter

**Purpose:** The emotional peak of Act II — featuring the Transformation Dissolve, the scroll-controlled before/after cross-dissolve where the visitor becomes the author of the transformation. Editorial photography, the scroll-linked reveal, process images, and a client quote.

**User Value:** The visitor controls the transformation — she scrolls to reveal the before fading and the after emerging. The agency creates ownership: "This could be my transformation." The emotional peak creates longing.

**Business Value:** The Transformation Dissolve is the signature scroll moment and the sixth of ten signature moments (The Mirror Moment). It is the single most emotionally intense moment in the entire scroll and directly drives conversion intent.

**Priority:** P0 — The Transformation is the emotional centerpiece of the experience.

**Complexity:** High — Requires the scroll-linked cross-dissolve (before/after images mapped to scroll position), process image sequence, and client quote integration. The dissolve must be linear (no easing) and reversible (scrolling back shows the before again).

**Dependencies:** Before/after photography. Scroll animation system. Client quote content.

**Future Expansion:** V2 could add multiple transformation examples (hair color, balayage, etc.). V3 could allow visitors to upload their own before photo for a simulated transformation.

---

### F7.3 — Bridal Service Chapter

**Purpose:** Speaks to the high-value bridal audience with tenderness and reverence. The slowest section in the entire scroll — everything at 50% speed. Morning Light lighting. The chapter demonstrates that the salon understands occasions that matter.

**User Value:** The bridal client feels understood — this is not a generic service page but a section that honors the significance of her day. The emotional weight of the section communicates that the salon treats bridal as a ceremony, not an appointment.

**Business Value:** Bridal is the highest-value service category. The section captures premium bookings, generates referral traffic (bridesmaids, family), and creates shareable content.

**Priority:** P1 — Essential for capturing the bridal segment but the service chapters work without it.

**Complexity:** Medium — Service content component with unique motion treatment (slowest animations in the experience).

**Dependencies:** Bridal photography. Service content. Animation system (with duration overrides).

**Future Expansion:** V2 could add a dedicated bridal micro-site or landing page. V3 could add bridal package tiers.

---

### F7.4 — Spa Service Chapter

**Purpose:** Completes the service arc with sensory imagery and the gentlest motion in the experience. Evening Warmth lighting. The chapter demonstrates that the salon understands the body's need for rest and care.

**User Value:** The visitor's body responds to the sensory imagery — she can "almost feel it." The Spa chapter creates physical desire and emotional relief after the intensity of the preceding chapters.

**Business Value:** The Spa section diversifies the service offering, broadens the addressable audience (wellness-seeking clients), and increases average transaction value through service bundling.

**Priority:** P1 — Important for service diversity but the experience works without it.

**Complexity:** Medium — Service content component with gentle motion treatment.

**Dependencies:** Spa photography. Service content.

**Future Expansion:** V2 could add spa treatment menus. V3 could add spa packages and memberships.

---

### F7.5 — Service Breathing Spaces

**Purpose:** 40-60% viewport breathing spaces between each service chapter. Each creates a chapter break that allows the visitor to process one service before encountering the next.

**User Value:** The visitor processes each service independently. The breathing creates rhythm and prevents the services from blurring together.

**Business Value:** Each service chapter gets its full emotional moment. The breathing ensures the visitor encounters each service with fresh attention.

**Priority:** P0 — Architectural requirement for the service chapter sequence.

**Complexity:** Low — Spacing between sections.

**Dependencies:** Spacing scale.

**Future Expansion:** None.

---

## 8. SERVICE DETAILS

The depth layer — what happens when the visitor wants to know more about a specific service.

---

### F8.1 — Service Pricing Display

**Purpose:** Every service has a visible, transparent price. Pricing is presented as a fact, not a selling point. No "starting at" ambiguity. No "call for pricing." Rule N18, L3 (VISUAL_RULES.md).

**User Value:** The visitor can evaluate the service offering without anxiety. Transparent pricing communicates confidence and respect for the visitor's time. She does not need to call or inquire to learn the price.

**Business Value:** Transparent pricing is a trust signal. It reduces the friction between interest and booking — the visitor knows the price before she books, eliminating sticker shock and increasing conversion confidence.

**Priority:** P0 — Pricing transparency is a brand principle.

**Complexity:** Low — Text display within service content.

**Dependencies:** Pricing data from the business.

**Future Expansion:** V2 could add a pricing comparison tool. V3 could add dynamic pricing (if applicable).

---

### F8.2 — Service Duration Display

**Purpose:** Every service shows its approximate duration. Duration helps the visitor plan her visit and communicates the thoroughness of the experience.

**User Value:** The visitor can plan her schedule around the appointment. Duration also communicates quality — a 90-minute color session is clearly different from a 30-minute touch-up.

**Business Value:** Duration transparency reduces no-shows (the visitor knows what she is committing to) and helps with scheduling optimization.

**Priority:** P1 — Important for booking confidence.

**Complexity:** Low — Text display within service content.

**Dependencies:** Service data from the business.

**Future Expansion:** V2 could integrate duration into the booking calendar for real-time availability.

---

## 9. GALLERY / PORTFOLIO

The visual evidence — proof of the salon's work through curated imagery.

---

### F9.1 — Editorial Portfolio Grid

**Purpose:** A curated grid of the salon's best work — editorial-quality photographs showcasing the range and quality of the salon's craft. Not a social media feed. Not a chronological blog. A curated gallery where every image has been selected for its quality and compositional value.

**User Value:** The visitor sees the breadth and quality of the salon's work. The editorial curation communicates that every image was selected — not every image was posted. The quality threshold is visible.

**Business Value:** The portfolio is the visual evidence that supports the brand's positioning. It is the "proof" section of the experience — the section where the visitor can explore the salon's work at her own pace.

**Priority:** P1 — The portfolio strengthens trust but the service chapters already provide visual evidence.

**Complexity:** Medium — Grid layout with consistent aspect ratios, hover effects (Warm Reveal), and responsive behavior.

**Dependencies:** Portfolio photography (same standards as editorial photography). Image optimization pipeline.

**Future Expansion:** V2 could add filtering by service type. V3 could add before/after pairs within the gallery.

---

### F9.2 — Portfolio Image Hover (Warm Reveal)

**Purpose:** Portfolio images respond to hover with the Warm Reveal — a subtle warming of the image toward golden tones and a 1-2px lift. The hover communicates interactivity without breaking the editorial feel.

**User Value:** The visitor knows which images are tappable/clickable. The warm hover response creates the feeling that the image is being brought closer.

**Business Value:** The consistent Warm Reveal on all interactive elements creates the learnable interaction language that defines the brand's tactile quality.

**Priority:** P1 — Enhances the portfolio interaction.

**Complexity:** Low — Hover state animation on image components.

**Dependencies:** F6.1 (animation system). Portfolio grid (F9.1).

**Future Expansion:** None — the Warm Reveal should remain consistent.

---

## 10. TEAM / ARTISANS

The people behind the craft — the faces, names, and personalities that create trust through human connection.

---

### F10.1 — Artisan Portrait Gallery

**Purpose:** Large, warm, editorial portraits of each artisan, introduced one at a time. Each portrait occupies the majority of the viewport — these are the most important images in the section. Below each portrait: name, title, one sentence about their specialty, and availability.

**User Value:** The visitor meets the people behind the work. The parasocial connection forms during the gallery — she sees faces, reads specialties, and begins to choose her artisan. By the time she reaches booking, the decision is already made emotionally.

**Business Value:** The Artisan gallery is the seventh of ten signature moments (The Artisan's Hand). It pre-qualifies the booking decision and creates the personal trust that makes booking feel safe.

**Priority:** P0 — Without artisan portraits, the brand has no human face.

**Complexity:** Medium — Portrait gallery with consistent layout, typography, and animation treatment.

**Dependencies:** Artisan photography (I8: faces, not backs of heads). Artisan data (names, titles, specialties, availability).

**Future Expansion:** V2 could add individual artisan profile pages. V3 could add artisan booking (book directly with a specific artisan).

---

### F10.2 — Artisan Reveal Animation

**Purpose:** The Artisan Reveal — the portrait fades in with the Warm Reveal (400-600ms), then the specialty text appears 200ms later. The rhythm: face → pause → specialty. The rhythm creates intimacy.

**User Value:** The reveal creates the feeling of being introduced to a person — not shown a card. The pause between face and text gives the visitor time to see the face before reading about the person.

**Business Value:** The consistent Artisan Reveal across all portraits creates the gallery rhythm that makes the section feel like meeting an ensemble cast.

**Priority:** P1 — Enhances the artisan introduction.

**Complexity:** Low — Sequential animation with delay.

**Dependencies:** F10.1 (artisan portraits). Animation system.

**Future Expansion:** None.

---

### F10.3 — Artisan Portrait Hover (Still Presence)

**Purpose:** Artisan portraits do NOT respond to hover. This is a deliberate choice — the absence of hover feedback communicates: "This is a person, not a card." Rule: artisan portraits have no hover state.

**User Value:** The stillness communicates respect. The visitor hovers over the portrait and nothing happens — this teaches her that the experience distinguishes between content cards (interactive) and human portraits (still).

**Business Value:** The deliberate absence of interaction is a brand statement: "We treat people as people, not as content."

**Priority:** P1 — Part of the interaction design.

**Complexity:** Low — Intentionally no animation.

**Dependencies:** Interaction design rules (INTERACTION_TIMELINE.md, 1.4).

**Future Expansion:** None.

---

## 11. TESTIMONIALS

The chorus of proof — authentic voices that eliminate doubt and confirm trust.

---

### F11.1 — Testimonial Cascade

**Purpose:** A text-forward section presenting 4-6 named, attributed testimonials organized by emotional arc (nervous → understood → transformed → confident). Each testimonial occupies its own compositional moment with generous whitespace.

**User Value:** The visitor hears real voices that mirror her own journey. The first testimonial voices her doubt; the last voices her resolution. She sees her own journey reflected in the words of others.

**Business Value:** The Chorus of Proof is the eighth of ten signature moments. It is the final trust-building element before the booking invitation — the section that eliminates the remaining doubt that prevents conversion.

**Priority:** P0 — Without testimonials, the brand has no external validation.

**Complexity:** Medium — Testimonial content component with consistent layout, generous whitespace, and real client photography.

**Dependencies:** Real client testimonials (N1, N2, L5 — real names, real dates, real services). Client photography.

**Future Expansion:** V2 could add video testimonials. V3 could integrate Google/Trustpilot reviews.

---

### F11.2 — Testimonial Staggered Cascade Animation

**Purpose:** Testimonials enter with a staggered cascade — each one appearing 200ms after the previous. The cascade creates the feeling of a chorus of voices building.

**User Value:** The visitor experiences the testimonials as a sequence of voices, not as a wall of text. The stagger creates rhythm and allows each testimonial to be encountered individually.

**Business Value:** The cascade animation creates the musical quality (Rhythm 1: The Breathing Pattern) that makes the testimonials feel considered rather than dumped.

**Priority:** P2 — Enhances the testimonial presentation.

**Complexity:** Low — Staggered scroll-linked animation.

**Dependencies:** F11.1 (testimonials). Animation system.

**Future Expansion:** None.

---

## 12. PRICING

Transparency — every service has a visible price, presented as a fact, not a selling point.

---

### F12.1 — Transparent Service Pricing

**Purpose:** Every service displays its price clearly and prominently. No "starting at" ambiguity. No "call for pricing." No hidden fees. The price is part of the service description, not hidden behind a CTA.

**User Value:** The visitor can make informed decisions. Transparent pricing eliminates the anxiety of "how much will this cost?" and communicates confidence: "We are worth every dirham."

**Business Value:** Transparent pricing is a brand principle (L3, VISUAL_RULES.md) and a trust signal. It reduces booking friction — the visitor knows the price before she books, eliminating the hesitation that hidden pricing creates.

**Priority:** P0 — Pricing transparency is non-negotiable.

**Complexity:** Low — Price display within service content.

**Dependencies:** Pricing data from the business.

**Future Expansion:** V2 could add a pricing summary page. V3 could add service bundles with combined pricing.

---

## 13. BOOKING

The narrative resolution — the moment where emotional investment becomes a commitment.

---

### F13.1 — Booking CTA (Primary Button)

**Purpose:** The most prominent interactive element on every page. Primary variant: gold accent, always visible (sticky in navigation), sentence case label ("Book your experience"), confident but never aggressive. Rule B7 (VISUAL_RULES.md).

**User Value:** The visitor always has a clear path to booking. From any point in the scroll, from any section, the booking CTA is accessible within one interaction. The CTA's consistent presence communicates: "We are here when you are ready."

**Business Value:** The booking CTA is the primary conversion mechanism. Its visibility, accessibility, and consistency directly impact conversion rate. Rule A12: The booking CTA is always accessible.

**Priority:** P0 — Without a booking CTA, the experience has no conversion path.

**Complexity:** Low — Button component with consistent styling and behavior.

**Dependencies:** Booking flow (F13.2). Button design system (B1-B10).

**Future Expansion:** V2 could add a secondary CTA for specific services ("Book bridal consultation").

---

### F13.2 — Booking Flow (Multi-Step)

**Purpose:** A multi-step booking conversation that replaces the traditional form. Each step asks one considered question: Service → Artisan → Date → Time → Contact → Confirmation. The flow slides in from the edge — the visitor never leaves the world of the experience.

**User Value:** The booking flow feels like a conversation, not a form. Each step is a single, clear question with generous whitespace and considered typography. The flow respects the visitor's pace — no rush, no pressure, no urgency tactics.

**Business Value:** A well-designed booking flow reduces abandonment. Each step reduces cognitive load — the visitor makes one decision at a time, building toward the commitment gradually. The booking flow is the ninth of ten signature moments (The Confident Threshold).

**Priority:** P0 — The booking flow IS the conversion mechanism.

**Complexity:** High — Multi-step flow with state management, validation, error handling, responsive design, and seamless transition from the main experience.

**Dependencies:** Service data (F7.1-F7.4), artisan data (F10.1), availability data (F14.1), calendar system (F15.1).

**Future Expansion:** V2 could add returning-client recognition (pre-filled data). V3 could add AI-assisted service recommendations.

---

### F13.3 — Booking Flow Slide-In Transition

**Purpose:** The booking flow slides in gently from the edge — the visitor never leaves the world of the experience. The transition is a smooth, considered slide (400-600ms, ease-out) that maintains the cinematic quality.

**User Value:** The transition from browsing to booking is seamless. The visitor does not feel she has been transported to a different experience — the booking flow is part of the same world.

**Business Value:** The seamless transition maintains the emotional investment built across the scroll. A jarring transition (page load, modal popup) would break the immersion and reduce conversion confidence.

**Priority:** P0 — The transition is part of the booking flow's design.

**Complexity:** Medium — Animated transition from main content to booking overlay.

**Dependencies:** F13.2 (booking flow). Animation system.

**Future Expansion:** None — the slide-in must remain consistent.

---

### F13.4 — Booking Confirmation Moment

**Purpose:** After the booking is submitted, a dedicated confirmation moment — not a generic "Thank you" page. The confirmation includes the appointment details, a warm message, and the longest, most generous animation in the booking journey (800-1200ms). Rule M14: Confirmation animation is our longest.

**User Value:** The visitor feels the satisfaction of completion. The confirmation is calm, beautiful, and reassuring — not a party (no confetti, Rule N25). The moment communicates: "This was effortless. Your appointment is confirmed."

**Business Value:** The confirmation moment is the emotional resolution of the booking journey. It creates the positive final impression that leads to word-of-mouth and return visits.

**Priority:** P0 — Every booking needs a confirmation.

**Complexity:** Medium — Confirmation screen with appointment details, warm messaging, and generous animation.

**Dependencies:** F13.2 (booking flow). Appointment data. Email/SMS confirmation system.

**Future Expansion:** V2 could add calendar integration (add to Google/Apple Calendar). V3 could add pre-appointment preparation tips.

---

### F13.5 — Booking Error Handling

**Purpose:** Graceful error states for every possible booking failure — network errors, availability conflicts, form validation errors. Every error message is specific, helpful, and maintains the brand voice. Rule AC8: Error messages explain what went wrong and how to fix it.

**User Value:** The visitor is never left confused. Every error is explained clearly with a path to resolution. The error states maintain the brand's warmth — even failures feel considered.

**Business Value:** Error handling prevents booking abandonment. A confusing error message can lose a booking; a clear one can save it.

**Priority:** P0 — Error handling is essential for a functional booking flow.

**Complexity:** Medium — Error states for each booking step, with specific messaging and recovery paths.

**Dependencies:** F13.2 (booking flow). Backend availability system.

**Future Expansion:** V2 could add retry logic and intelligent error recovery.

---

## 14. CALENDAR

The scheduling backbone — how dates and availability are managed.

---

### F14.1 — Service Calendar Display

**Purpose:** A calendar interface within the booking flow that shows available dates for the selected service and artisan. Available dates are visually distinguished from unavailable dates. The calendar follows the brand's typography, color, and spacing rules.

**User Value:** The visitor sees her options at a glance. Available dates are obvious; unavailable dates are muted. The calendar communicates availability without requiring the visitor to call or inquire.

**Business Value:** The calendar reduces booking friction — the visitor can see availability instantly and choose a date that works for her schedule.

**Priority:** P0 — Calendar availability is essential for the booking flow.

**Complexity:** High — Calendar component with responsive design, date selection, availability states, and integration with the backend scheduling system.

**Dependencies:** Backend scheduling system. Service and artisan data.

**Future Expansion:** V2 could add monthly/weekly view toggle. V3 could add waitlist functionality for fully booked dates.

---

### F14.2 — Date Selection Interaction

**Purpose:** The visitor taps a date to select it. Available dates respond to hover with the Warm Reveal (subtle golden warmth). Unavailable dates are visually muted with no hover response. The selected date shows a clear visual state (gold accent).

**User Value:** The selection is clear and confident. The visitor knows which dates are available, which she has selected, and which are unavailable. The interaction is simple: tap to select.

**Business Value:** Clear date selection reduces errors and confusion in the booking flow.

**Priority:** P0 — Core booking interaction.

**Complexity:** Medium — Interactive calendar with hover, selection, and disabled states.

**Dependencies:** F14.1 (calendar). Backend availability data.

**Future Expansion:** None.

---

## 15. AVAILABILITY

The real-time data layer — which time slots are open, which are taken.

---

### F15.1 — Real-Time Availability Data

**Purpose:** The booking system displays real-time availability for each service and artisan. Availability updates reflect actual booking state — no double-bookings, no phantom slots.

**User Value:** The visitor trusts that the availability she sees is accurate. She does not book a slot only to be told it is unavailable. The accuracy builds trust in the booking system.

**Business Value:** Real-time availability prevents overbooking, reduces administrative overhead, and increases booking confidence.

**Priority:** P0 — Availability accuracy is essential for a functional booking system.

**Complexity:** Very High — Real-time data synchronization between the booking interface and the backend scheduling system. Requires conflict resolution, optimistic updates, and error recovery.

**Dependencies:** Backend scheduling system. Real-time data infrastructure.

**Future Expansion:** V2 could add availability notifications ("Get notified when a slot opens"). V3 could add AI-powered availability prediction.

---

### F15.2 — Availability Loading State

**Purpose:** When availability data is being fetched, a branded loading state appears — not a generic spinner. The loading state uses the brand's warm background color and a subtle animation consistent with the experience's motion language.

**User Value:** The visitor never stares at a blank screen or generic spinner. The loading state communicates that the system is working, maintaining the brand experience even during data fetching.

**Business Value:** Branded loading states (Rule M13) maintain the premium experience during necessary waits.

**Priority:** P1 — Enhances the booking experience.

**Complexity:** Low — Loading state component with branded animation.

**Dependencies:** Animation system. Booking flow.

**Future Expansion:** None.

---

## 16. TIME SLOTS

The granular scheduling layer — specific appointment times within available dates.

---

### F16.1 — Time Slot Selection

**Purpose:** After selecting a date, the visitor sees available time slots for that date. Time slots are displayed in a clear, scannable format — morning, afternoon, evening groupings. Each slot shows the time and is selectable with a single tap.

**User Value:** The visitor can choose the specific time that works for her schedule. The time slots are grouped logically (morning/afternoon/evening) to reduce scanning effort.

**Business Value:** Time slot selection is the final scheduling decision before contact information. The clarity of the selection reduces booking abandonment at the last step.

**Priority:** P0 — Essential for the booking flow.

**Complexity:** Medium — Time slot display with availability states, selection interaction, and responsive design.

**Dependencies:** F14.1 (calendar), F15.1 (availability data). Backend scheduling system.

**Future Expansion:** V2 could add preferred time-of-day memory for returning clients.

---

### F16.2 — Time Slot Interaction States

**Purpose:** Available slots respond to hover with warmth. Unavailable slots are muted. Selected slots show the gold accent. The interaction follows the established pattern: warm hover → selection → confirmation.

**User Value:** The visitor sees availability clearly and selects confidently. The visual states eliminate ambiguity.

**Business Value:** Clear interaction states reduce errors and confusion.

**Priority:** P1 — Part of the booking flow interaction design.

**Complexity:** Low — CSS states (default, hover, selected, unavailable).

**Dependencies:** Interaction design system.

**Future Expansion:** None.

---

## 17. APPOINTMENT CONFIRMATION

The resolution — the moment after booking where the visitor receives confirmation and the experience concludes.

---

### F17.1 — Confirmation Details Display

**Purpose:** After booking is submitted, the confirmation shows all appointment details: service, artisan, date, time, and any special requests. The details are presented in the brand's typography and spacing — not a plain-text email dump.

**User Value:** The visitor can verify her appointment details at a glance. The confirmation is clear, complete, and reassuring.

**Business Value:** A clear confirmation reduces post-booking anxiety and support inquiries ("Did my booking go through?").

**Priority:** P0 — Every booking needs a confirmation with details.

**Complexity:** Low — Confirmation display with appointment data.

**Dependencies:** F13.2 (booking flow). Appointment data.

**Future Expansion:** V2 could add a "Add to calendar" button. V3 could add a pre-appointment preparation guide.

---

### F17.2 — Email/SMS Confirmation

**Purpose:** After the on-screen confirmation, an email and/or SMS is sent to the client with the appointment details. The message follows the brand voice — warm, specific, and unhurried.

**User Value:** The visitor receives a permanent record of her appointment. The confirmation arrives in her inbox or messages — a tangible artifact of the booking.

**Business Value:** Email/SMS confirmation reduces no-shows (the client has a reminder), provides a communication channel for changes, and reinforces the brand through another touchpoint.

**Priority:** P0 — Standard expectation for any booking system.

**Complexity:** High — Email/SMS templating, sending infrastructure, delivery verification.

**Dependencies:** Email/SMS service provider. Booking data. Brand voice guidelines.

**Future Expansion:** V2 could add reminder emails (24 hours before, 1 hour before). V3 could add follow-up emails (post-appointment feedback request).

---

## 18. CONTACT

The safety net — when the visitor needs to reach the salon directly.

---

### F18.1 — Contact Information Display

**Purpose:** Clear display of the salon's contact information: phone number, email address, physical address, and operating hours. The information is presented in the brand's typography — not as a plain-text dump but as considered content.

**User Value:** The visitor can contact the salon through her preferred channel. The information is easy to find and easy to read.

**Business Value:** Contact information is a trust signal — the salon is reachable, available, and transparent. It also supports local SEO (NAP consistency).

**Priority:** P0 — Contact information is a basic business requirement.

**Complexity:** Low — Content display with links (phone, email, maps).

**Dependencies:** Business contact data.

**Future Expansion:** V2 could add a contact form. V3 could add live chat (opt-in only, not auto-greeting — Rule N14).

---

### F18.2 — Click-to-Call (Mobile)

**Purpose:** On mobile devices, the phone number is a clickable link that initiates a call. The interaction is seamless — one tap to call.

**User Value:** Mobile visitors can call the salon instantly without copying and pasting the number.

**Business Value:** Reduces friction for phone bookings — the most common booking method for luxury salons.

**Priority:** P1 — Essential for mobile usability.

**Complexity:** Low — Standard tel: link.

**Dependencies:** F18.1 (contact information).

**Future Expansion:** None.

---

## 19. LOCATION

Where the salon exists in the physical world.

---

### F19.1 — Location Display

**Purpose:** The salon's physical address displayed with clear formatting: street address, city, postal code. The location is part of the contact section and may also appear in the footer.

**User Value:** The visitor knows exactly where the salon is. The address is easy to read and easy to copy.

**Business Value:** Location information supports local SEO and helps clients plan their visit. It also communicates legitimacy — the salon has a real, physical presence.

**Priority:** P0 — Basic business requirement.

**Complexity:** Low — Address text display.

**Dependencies:** Business address data.

**Future Expansion:** V2 could add an interactive map. V3 could add directions from the client's location.

---

### F19.2 — Map Integration

**Purpose:** An embedded map showing the salon's location. The map follows the brand's warm color treatment — no default Google Maps blue/grey. The map is functional, not decorative.

**User Value:** The visitor can visualize the salon's location relative to her own. She can get directions with one tap.

**Business Value:** Map integration increases the likelihood of a visit — the visitor can plan her route before booking.

**Priority:** P2 — Nice-to-have for the initial launch. The address alone is sufficient.

**Complexity:** Medium — Map embed with custom styling, responsive behavior, and interaction states.

**Dependencies:** Location data. Map API key.

**Future Expansion:** V2 could add parking information. V3 could add public transport directions.

---

## 20. FAQ

Anticipating questions — reducing uncertainty before it becomes a barrier.

---

### F20.1 — FAQ Section

**Purpose:** A curated list of the most common visitor questions, organized by category (Booking, Services, Pricing, Policies). Each answer is written in the brand voice — warm, specific, and unhurried. The FAQ is not a customer service dump; it is considered content.

**User Value:** The visitor finds answers to her questions without needing to call or email. The FAQ reduces uncertainty and builds confidence — "They've thought about my questions before I asked them."

**Business Value:** A well-designed FAQ reduces support inquiries (phone calls, emails, DMs) and increases booking confidence. It also supports SEO through question-based content.

**Priority:** P1 — Important for reducing booking friction.

**Complexity:** Low — Accordion or expandable content component.

**Dependencies:** FAQ content from the business. Brand voice guidelines.

**Future Expansion:** V2 could add search within the FAQ. V3 could add AI-powered FAQ that generates answers from the content library.

---

### F20.2 — FAQ Interaction (Expand/Collapse)

**Purpose:** FAQ items expand to reveal answers on tap/click. The expansion is smooth — the answer slides open with the brand's motion language (ease-out, 300-400ms). Only one item is expanded at a time — expanding a new item collapses the previous.

**User Value:** The visitor scans questions and expands only the ones that matter to her. The single-expand behavior keeps the FAQ scannable.

**Business Value:** The interaction reduces visual clutter — only one answer is visible at a time, keeping the section clean and readable.

**Priority:** P1 — Part of the FAQ feature.

**Complexity:** Low — Accordion interaction with animation.

**Dependencies:** F20.1 (FAQ content). Animation system.

**Future Expansion:** None.

---

## 21. ACCESSIBILITY

Inclusion — ensuring every visitor, regardless of ability, can experience the brand fully.

---

### F21.1 — WCAG 2.1 AA Compliance

**Purpose:** The entire experience meets or exceeds WCAG 2.1 Level AA compliance. This includes color contrast (4.5:1 minimum), keyboard navigation, screen reader support, focus indicators, and content reflow at 200% zoom. Rule AC1 (VISUAL_RULES.md).

**User Value:** Visitors with disabilities can experience the brand fully. The accessibility is not a separate "accessible version" — it is the same experience, equally accessible to all.

**Business Value:** WCAG compliance is a legal requirement in many jurisdictions. Beyond compliance, accessibility is a brand value — the salon cares about every guest, including those with disabilities.

**Priority:** P0 — Legal and ethical obligation.

**Complexity:** High — Requires accessibility-first design and development, testing with assistive technologies, and ongoing audit.

**Dependencies:** All features. Accessibility testing tools.

**Future Expansion:** V2 could add AAA compliance for additional accessibility enhancements.

---

### F21.2 — Keyboard Navigation

**Purpose:** Every interactive element is reachable and activatable via keyboard alone. Tab order follows the visual reading order. Focus indicators are visible (gold accent, 2px minimum). Rule AC3, AC4 (VISUAL_RULES.md).

**User Value:** Keyboard-only users can navigate the entire experience without a mouse or touch screen. The focus indicators make it clear where they are at all times.

**Business Value:** Keyboard accessibility is a fundamental WCAG requirement and a legal obligation.

**Priority:** P0 — Non-negotiable.

**Complexity:** Medium — Requires semantic HTML, proper ARIA attributes, and focus management for the booking flow overlay.

**Dependencies:** All interactive features.

**Future Expansion:** None — always supported.

---

### F21.3 — Screen Reader Support

**Purpose:** The experience is fully navigable by screen readers. Content is organized with proper heading hierarchy (h1 → h2 → h3, no skipped levels — Rule A8). Landmark regions (header, main, footer) enable navigation by region. Images have descriptive alt text (Rule A11).

**User Value:** Screen reader users receive the same information and emotional content as sighted users. Alt text is written in the brand voice — descriptive, specific, and warm.

**Business Value:** Screen reader support is a WCAG requirement and extends the brand's reach to visually impaired users.

**Priority:** P0 — Legal and ethical obligation.

**Complexity:** Medium — Semantic HTML, ARIA attributes, alt text for all images.

**Dependencies:** All content features. Photography (alt text for all images).

**Future Expansion:** None — always supported.

---

### F21.4 — Reduced Motion Support

**Purpose:** When prefers-reduced-motion is active, all scroll-linked animations become instant, all hover transitions become instant, and all page transitions become instant. The experience is complete and satisfying without any motion. Rules AC5, M11, D6.

**User Value:** Visitors with motion sensitivity receive a complete experience. No content is hidden behind animation. No functionality requires motion to operate.

**Business Value:** Respecting reduced motion is a legal and ethical obligation. It affects 30-40% of the population.

**Priority:** P0 — Non-negotiable.

**Complexity:** Low — CSS media query gating all animations.

**Dependencies:** All animated features.

**Future Expansion:** None.

---

## 22. PERFORMANCE

Speed — ensuring the experience is as fast as it is beautiful.

---

### F22.1 — LCP Under 2.5 Seconds

**Purpose:** The Largest Contentful Paint (the hero image) must be visible within 2.5 seconds of page load on a 4G connection. Rule P1 (VISUAL_RULES.md).

**User Value:** The visitor sees the hero image within 3 seconds — the threshold where first impressions form. She never waits for the defining visual element.

**Business Value:** LCP directly impacts SEO ranking and bounce rate. A slow hero kills the first impression.

**Priority:** P0 — Performance is part of the experience.

**Complexity:** Very High — Requires image optimization (WebP/AVIF), critical CSS extraction, font loading strategy, and CDN deployment.

**Dependencies:** All content features. Hosting infrastructure. Image pipeline.

**Future Expansion:** V2 could add edge caching for specific regions (Marrakech, Casablanca, Rabat).

---

### F22.2 — CLS Under 0.1

**Purpose:** Cumulative Layout Shift — content does not jump, shift, or reflow after initial render. All dimensions (images, fonts, dynamic content) are reserved before content loads. Rule P2.

**User Value:** The page feels stable and considered. Content does not jump around as the page loads — a behavior that communicates poor craftsmanship.

**Business Value:** CLS directly impacts SEO ranking and user trust.

**Priority:** P0 — Non-negotiable for a premium experience.

**Complexity:** High — Requires aspect ratio reservations for images, font-display strategy, and layout stability testing.

**Dependencies:** Image pipeline. Font loading. Layout system.

**Future Expansion:** None.

---

### F22.3 — Image Optimization Pipeline

**Purpose:** All images served in modern formats (WebP/AVIF) with fallbacks. Images lazy-loaded below the fold. Responsive image sizing (different sizes for mobile, tablet, desktop). Progressive loading on mobile (blurred placeholder → full image). Rules P5, P6, I13.

**User Value:** The visitor never stares at a blank rectangle. Images load fast and look sharp on every device.

**Business Value:** Image optimization is the single most impactful performance improvement. It reduces bandwidth, improves LCP, and improves CLS.

**Priority:** P0 — Critical for performance.

**Complexity:** High — Requires image processing pipeline, CDN configuration, and responsive image markup.

**Dependencies:** Hosting infrastructure. Image format support.

**Future Expansion:** V2 could add AVIF-first serving with WebP fallback. V3 could add AI-powered image compression.

---

### F22.4 — Font Loading Strategy

**Purpose:** Custom fonts load without blocking text rendering. Text is visible immediately in a system font; custom fonts replace it once loaded (font-display: swap). Rule P7.

**User Value:** The visitor can read text immediately — she never waits for fonts to load. The font swap is so smooth it is imperceptible.

**Business Value:** Font loading is a common performance bottleneck. The swap strategy eliminates the "flash of invisible text" (FOIT) that degrades first impressions.

**Priority:** P0 — Critical for performance.

**Complexity:** Medium — Font loading optimization, font-display strategy, and font subsetting.

**Dependencies:** Typography system. Font files.

**Future Expansion:** V2 could add font subsetting for non-Latin characters (Arabic, French).

---

### F22.5 — JavaScript Deferral

**Purpose:** Non-critical JavaScript (animation libraries, analytics, secondary features) loads after the primary content is interactive. Critical functionality loads first; everything else loads after. Rule P8.

**User Value:** The page is interactive before all scripts have loaded. The visitor can begin scrolling and reading immediately.

**Business Value:** JavaScript deferral improves First Input Delay and Interaction to Next Paint metrics.

**Priority:** P0 — Critical for performance.

**Complexity:** Medium — Requires JavaScript bundling strategy and critical path analysis.

**Dependencies:** All JavaScript features.

**Future Expansion:** V2 could add code splitting per route.

---

### F22.6 — 3G Usability

**Purpose:** The experience must be usable (not beautiful — usable) on a throttled 3G connection. If the experience breaks on 3G, performance is insufficient. Rule P9.

**User Value:** Visitors on slow connections can still access the salon's information and book appointments. The experience degrades gracefully — images may be lower quality, animations may be simpler, but functionality is preserved.

**Business Value:** Many of the salon's clients may be on mobile networks with variable speeds. 3G usability ensures the experience works for everyone.

**Priority:** P1 — Important for broad accessibility.

**Complexity:** High — Requires performance testing under network throttling, graceful degradation, and progressive enhancement.

**Dependencies:** All performance features.

**Future Expansion:** V2 could add a dedicated lightweight mode for slow connections.

---

## 23. SEO

Discoverability — ensuring the salon is found by the people who need it.

---

### F23.1 — Semantic HTML Structure

**Purpose:** The page uses semantic HTML5 elements: header, main, article, section, footer, nav. Heading hierarchy is correct (one h1, sequential h2s, etc.). Landmark regions enable screen reader navigation. This is both an accessibility and an SEO feature.

**User Value:** Search engines can understand the page structure, improving the likelihood of appearing in relevant search results.

**Business Value:** Semantic HTML is a foundational SEO signal. It improves crawlability, indexability, and the likelihood of rich snippet appearance.

**Priority:** P0 — Foundational for SEO.

**Complexity:** Low — Semantic HTML is a development practice, not a feature.

**Dependencies:** All content features.

**Future Expansion:** V2 could add structured data (LocalBusiness, Service, FAQPage schemas).

---

### F23.2 — Meta Tags and Open Graph

**Purpose:** Proper meta title, meta description, and Open Graph tags for social sharing. The meta content follows the brand voice — warm, specific, and compelling.

**User Value:** When the link is shared on social media or appears in search results, the description communicates the brand's value proposition.

**Business Value:** Meta tags directly impact click-through rates from search results and social platforms. Open Graph tags control how the link appears when shared on Facebook, WhatsApp, Instagram, etc.

**Priority:** P0 — Standard requirement for any website.

**Complexity:** Low — Static meta tags in the HTML head.

**Dependencies:** Brand voice guidelines. Brand assets (OG image).

**Future Expansion:** V2 could add dynamic meta tags for individual sections. V3 could add Twitter Card optimization.

---

### F23.3 — Local SEO (NAP Consistency)

**Purpose:** The salon's Name, Address, and Phone number (NAP) are consistent across the website and all external listings (Google Business Profile, Facebook, TripAdvisor, etc.). Schema.org LocalBusiness markup is included.

**User Value:** When the visitor searches "salon in Marrakech" or "hairdresser near me," the salon appears with correct, consistent information.

**Business Value:** Local SEO is the primary discovery channel for salon businesses. NAP consistency is a ranking factor for Google's local pack.

**Priority:** P0 — Critical for local discovery.

**Complexity:** Medium — Requires audit of external listings and implementation of structured data.

**Dependencies:** Business information. Google Business Profile.

**Future Expansion:** V2 could add Google Business Profile integration. V3 could add review aggregation.

---

## 24. ANALYTICS

Measurement — understanding how the experience performs and where it can improve.

---

### F24.1 — Page View and Scroll Tracking

**Purpose:** Track which sections visitors reach, how far they scroll, and where they stop. The data reveals the scroll completion rate and identifies sections that cause drop-off.

**User Value:** N/A — This is a business intelligence feature, not a user-facing feature.

**Business Value:** Scroll data reveals whether the narrative structure holds the visitor's attention across the full experience. Drop-off points indicate sections that need improvement.

**Priority:** P1 — Important for post-launch optimization.

**Complexity:** Medium — Analytics implementation with scroll depth tracking.

**Dependencies:** Analytics platform (e.g., Plausible, Fathom — privacy-respecting alternatives to Google Analytics).

**Future Expansion:** V2 could add heatmaps. V3 could add A/B testing infrastructure.

---

### F24.2 — Booking Funnel Tracking

**Purpose:** Track the booking flow from CTA click through each step (Service → Artisan → Date → Time → Contact → Confirmation) and measure completion rate at each step. Identify where visitors abandon the booking flow.

**User Value:** N/A — Business intelligence feature.

**Business Value:** Funnel data reveals exactly where booking abandonment occurs, enabling targeted optimization. The highest-value metric in the entire analytics setup.

**Priority:** P0 — Essential for conversion optimization.

**Complexity:** Medium — Event tracking at each booking step.

**Dependencies:** F13.2 (booking flow). Analytics platform.

**Future Expansion:** V2 could add funnel visualization dashboard. V3 could add predictive analytics (likelihood of booking completion).

---

### F24.3 — Privacy-Respecting Analytics

**Purpose:** Analytics that do not use cookies, do not track individuals, and comply with GDPR and Moroccan data protection regulations. Aggregate data only — no personal data collection.

**User Value:** The visitor's privacy is respected. She is not tracked, profiled, or remarketed to.

**Business Value:** Privacy-respecting analytics avoid the legal and reputational risks of non-compliant tracking. They also build trust — the brand does not spy on its guests.

**Priority:** P0 — Legal requirement and brand value.

**Complexity:** Low — Use a privacy-respecting analytics platform (Plausible, Fathom, Umami).

**Dependencies:** Analytics platform selection.

**Future Expansion:** None — privacy is always a priority.

---

## 25. ERROR STATES

Graceful failure — when things go wrong, the brand's warmth must still be present.

---

### F25.1 — 404 Page (Not Found)

**Purpose:** When a visitor reaches a URL that does not exist, a branded 404 page appears — not a generic server error. The 404 page includes a warm message, a link back to the homepage, and the booking CTA.

**User Value:** The visitor is not stranded. She has a clear path back to the experience. The 404 page maintains the brand's warmth even in failure.

**Business Value:** A 404 page that includes a booking CTA can convert a lost visitor into a booking. It also prevents the negative brand impression that a generic error page creates.

**Priority:** P1 — Standard requirement for any website.

**Complexity:** Low — Custom 404 page with brand design.

**Dependencies:** Brand design system.

**Future Expansion:** V2 could add search functionality to the 404 page.

---

### F25.2 — Network Error States

**Purpose:** When the booking flow encounters a network error (server timeout, connection lost), a clear error message appears with a retry option. The message is specific ("We couldn't reach our scheduling system. Please try again.") and includes a path to resolution.

**User Value:** The visitor knows what happened and what to do. She is not left confused or stuck.

**Business Value:** Network errors are inevitable. A well-designed error state can save a booking that would otherwise be lost.

**Priority:** P0 — Essential for the booking flow.

**Complexity:** Medium — Error state components for each booking step.

**Dependencies:** F13.2 (booking flow). Network error handling.

**Future Expansion:** V2 could add automatic retry with exponential backoff.

---

### F25.3 — Form Validation Errors

**Purpose:** When the visitor submits incomplete or invalid information in the booking flow, specific error messages appear next to the relevant field. The messages explain what is wrong and how to fix it ("Please enter a valid email address"). Rule AC8.

**User Value:** The visitor can correct her input without guessing what went wrong. The error messages are helpful, not punitive.

**Business Value:** Clear validation errors reduce booking abandonment caused by form frustration.

**Priority:** P0 — Essential for the booking flow.

**Complexity:** Low — Inline validation with specific error messages.

**Dependencies:** F13.2 (booking flow).

**Future Expansion:** V2 could add real-time validation (validate as the user types).

---

## 26. LOADING STATES

The waiting experience — when content is being fetched, the brand's warmth must still be present.

---

### F26.1 — Booking Flow Loading States

**Purpose:** When the booking flow is loading data (services, artisans, availability), a branded loading state appears — not a generic spinner. The loading state uses the warm background color and a subtle, considered animation.

**User Value:** The visitor never sees a generic spinner. The loading state communicates that the system is working and maintains the brand experience.

**Business Value:** Branded loading states (Rule M13) prevent the premium experience from being undermined by generic UI patterns during data fetching.

**Priority:** P1 — Enhances the booking experience.

**Complexity:** Low — Loading state components with branded design.

**Dependencies:** Animation system. Booking flow.

**Future Expansion:** V2 could add skeleton loading states with the brand's warm color treatment.

---

### F26.2 — Image Loading States

**Purpose:** While images are loading (especially on mobile or slow connections), a warm placeholder appears — either a blurred low-resolution version or a warm solid color matching the background. The visitor never stares at a blank rectangle. Rule I13.

**User Value:** The visitor sees something immediately — the warm placeholder communicates that an image is coming. The transition from placeholder to full image is smooth.

**Business Value:** Image placeholders improve perceived performance — the page feels faster even if the actual load time is the same.

**Priority:** P1 — Important for perceived performance.

**Complexity:** Low — Placeholder treatment for image components.

**Dependencies:** Image optimization pipeline.

**Future Expansion:** V2 could add blurhash placeholders.

---

## 27. MOBILE EXPERIENCE

The primary viewport — designed for the device most of the salon's clients use.

---

### F27.1 — Mobile-First Responsive Design

**Purpose:** The experience is designed for mobile first and enhanced for larger viewports. All features, all content, all interactions work flawlessly on mobile. The mobile experience is not a degraded version of the desktop — it IS the primary experience.

**User Value:** Mobile visitors receive the full brand experience — no compromises on content, quality, or interaction. The mobile experience feels native, not shrunk.

**Business Value:** Mobile is the primary viewport for 60%+ of salon website visitors. A mobile-first approach ensures the largest audience segment receives the best experience.

**Priority:** P0 — Mobile-first is a foundational design principle.

**Complexity:** High — Responsive design across all components, interactions, and content types.

**Dependencies:** All features. Design system.

**Future Expansion:** V2 could add a Progressive Web App (PWA) for mobile home screen installation.

---

### F27.2 — Mobile Navigation (Hamburger Menu)

**Purpose:** Full-screen navigation overlay for mobile viewports. The overlay follows the brand's design — warm background, serif headlines for section names, generous spacing, booking CTA prominently placed.

**User Value:** Mobile visitors can access all sections easily. The full-screen overlay maintains the brand experience.

**Business Value:** Mobile navigation is the primary way mobile visitors move through the experience.

**Priority:** P0 — Essential for mobile.

**Complexity:** Medium — Full-screen overlay with animation.

**Dependencies:** Navigation structure.

**Future Expansion:** V2 could add swipe gestures for section navigation.

---

### F27.3 — Mobile Touch Interactions

**Purpose:** All interactive elements on mobile use touch-appropriate interactions: tap targets meet 44×44px minimum (A9), spacing between adjacent targets is 8px minimum, and hover states translate to active/pressed states.

**User Value:** Mobile visitors can interact with all elements comfortably. No tiny buttons, no mis-taps, no frustration.

**Business Value:** Touch accessibility ensures mobile visitors can complete the booking flow without friction.

**Priority:** P0 — Touch accessibility is non-negotiable.

**Complexity:** Medium — Touch-specific interaction states for all interactive elements.

**Dependencies:** All interactive features. Accessibility rules.

**Future Expansion:** None.

---

### F27.4 — Mobile 3D Performance Optimization

**Purpose:** 3D atmospheric effects are disabled or simplified on mobile devices when they impact performance (frame rate drops, battery drain, data consumption). The experience is complete without 3D on mobile. Rule D2.

**User Value:** Mobile visitors receive a smooth, fast experience. 3D effects do not slow down their device or drain their battery.

**Business Value:** Mobile performance is prioritized over visual flourish. A slow mobile experience damages the brand more than a missing atmospheric effect.

**Priority:** P1 — Part of the performance strategy.

**Complexity:** Medium — Device detection and conditional rendering of 3D effects.

**Dependencies:** F5.1 (3D depth layer). Performance testing.

**Future Expansion:** V2 could add device-tier detection for progressive enhancement.

---

## 28. TABLET EXPERIENCE

The intermediate viewport — bridging mobile and desktop.

---

### F28.1 — Tablet Responsive Layout

**Purpose:** The tablet experience occupies the space between mobile and desktop. Content layouts adapt to the tablet viewport — typically showing 2-column layouts where mobile shows 1 and desktop shows 3. The tablet experience maintains the brand's breathing spaces and typographic hierarchy.

**User Value:** Tablet visitors receive an experience optimized for their viewport — not a blown-up mobile view or a cramped desktop view.

**Business Value:** Tablet users represent a significant audience segment, particularly for browsing and research (pre-booking contemplation).

**Priority:** P1 — Important for broad device support.

**Complexity:** Medium — Responsive breakpoints for tablet viewports.

**Dependencies:** All features. Design system.

**Future Expansion:** None — tablet support should be maintained across versions.

---

### F28.2 — Tablet Navigation

**Purpose:** The tablet navigation adapts to the viewport — it may show a condensed horizontal navigation or a smaller hamburger menu. The booking CTA remains sticky and accessible.

**User Value:** Tablet visitors can navigate easily with the adapted navigation.

**Business Value:** Consistent navigation across devices ensures the booking path is always accessible.

**Priority:** P1 — Part of the responsive design.

**Complexity:** Low — Responsive navigation adaptation.

**Dependencies:** F2.1 (navigation). F2.4 (mobile navigation).

**Future Expansion:** None.

---

## 29. DESKTOP EXPERIENCE

The expansive viewport — where the experience has the most room to breathe.

---

### F29.1 — Desktop Responsive Layout

**Purpose:** The desktop experience takes full advantage of the wide viewport — generous whitespace, 3-column maximum grids (Rule CR8), and the full breathing space rhythm. The desktop layout is the most spacious and editorial version of the experience.

**User Value:** Desktop visitors see the experience in its most expansive form. The generous whitespace and large editorial images create the strongest visual impact.

**Business Value:** Desktop visitors include high-intent bookers (researching on a work computer) and referral traffic (sharing links via email/Slack). The desktop experience must be as strong as the mobile experience.

**Priority:** P1 — Important for comprehensive device support.

**Complexity:** Medium — Responsive breakpoints for desktop viewports.

**Dependencies:** All features. Design system.

**Future Expansion:** V2 could add enhanced desktop interactions (keyboard shortcuts for navigation).

---

### F29.2 — Desktop Hover Interactions

**Purpose:** Desktop visitors receive the full hover interaction vocabulary: navigation underline (1.1), CTA warmth shift (1.2), card warmth (1.3), and the deliberate stillness on artisan portraits (1.4).

**User Value:** Desktop visitors experience the brand's complete interaction language. The hover states create the tactile quality that defines the premium experience.

**Business Value:** Hover interactions are the desktop-specific dimension of the brand's tactile quality. They are not available on mobile — desktop is where they shine.

**Priority:** P1 — Part of the interaction design.

**Complexity:** Low — Hover states already defined in the interaction system.

**Dependencies:** F6.4 (animation system). Interaction design rules.

**Future Expansion:** None — hover interactions should remain consistent.

---

### F29.3 — Desktop Booking Flow

**Purpose:** On desktop, the booking flow slides in as a right-side panel (approximately 40-50% of the viewport width). The main experience remains visible on the left, maintaining context. The panel follows the brand's design — warm background, generous spacing, considered typography.

**User Value:** Desktop visitors see the booking flow alongside the experience they were browsing. The context is maintained — she can see the hero image, the service she was reading, or the artisan she was viewing while filling in her booking details.

**Business Value:** The side-panel booking flow on desktop maintains the emotional investment from the scroll. The visitor does not lose context — she is still in the world of the experience while booking.

**Priority:** P0 — The booking flow must work on desktop.

**Complexity:** Medium — Responsive booking flow layout (side panel on desktop, full-screen on mobile).

**Dependencies:** F13.2 (booking flow). Responsive design system.

**Future Expansion:** None — the side-panel pattern should remain consistent.

---

## 30. ADMIN REQUIREMENTS (FUTURE)

The management layer — how the salon manages its content, bookings, and data. Deferred to V2.

---

### F30.1 — Content Management System (CMS)

**Purpose:** An admin interface where the salon team can manage all website content: service descriptions, pricing, artisan profiles, portfolio images, testimonials, and FAQ entries. The CMS replaces the need for a developer to make content updates.

**User Value:** N/A — Admin-facing feature.

**Business Value:** A CMS empowers the salon to keep its content fresh without developer dependency. New services, updated pricing, new artisan profiles, and new testimonials can be added by the salon team.

**Priority:** P3 — Deferred to V2. V1 content is managed through code/configuration.

**Complexity:** Very High — Requires a full CMS implementation with authentication, authorization, content modeling, media management, and deployment pipeline.

**Dependencies:** Content model definition. Media storage infrastructure. Authentication system.

**Future Expansion:** V2: Basic CMS. V3: Advanced CMS with workflow, scheduling, and approval.

---

### F30.2 — Booking Management Dashboard

**Purpose:** An admin interface where the salon team can view, manage, and modify bookings — see upcoming appointments, reschedule, cancel, and view client history.

**User Value:** N/A — Admin-facing feature.

**Business Value:** A booking dashboard replaces manual scheduling (phone calls, WhatsApp messages) with a digital system. It reduces errors, prevents double-bookings, and provides visibility into the salon's schedule.

**Priority:** P3 — Deferred to V2. V1 bookings are managed through the existing system (if any).

**Complexity:** Very High — Requires a full booking management system with real-time updates, conflict resolution, and notification infrastructure.

**Dependencies:** F13.2 (booking flow). Backend scheduling system. Notification infrastructure.

**Future Expansion:** V2: Basic dashboard. V3: Advanced dashboard with analytics, client profiles, and automated reminders.

---

### F30.3 — Client Database

**Purpose:** A database of clients who have booked — their contact information, booking history, preferred artisans, and notes. The database supports personalized service and relationship management.

**User Value:** N/A — Admin-facing feature (but enables personalized client experience in future versions).

**Business Value:** A client database enables the salon to understand its clientele, personalize communications, and build long-term relationships. It is the foundation for loyalty programs, personalized recommendations, and targeted marketing.

**Priority:** P3 — Deferred to V2/V3.

**Complexity:** Very High — Requires data modeling, privacy compliance (GDPR, Moroccan data protection), and integration with booking and communication systems.

**Dependencies:** Booking system. Communication infrastructure. Privacy policy.

**Future Expansion:** V2: Basic client records. V3: Client profiles with preferences, history, and AI-powered recommendations.

---

### F30.4 — Inventory/Product Management

**Purpose:** Manage the salon's product catalog — retail products available for purchase, product descriptions, pricing, and images.

**User Value:** N/A — Admin-facing feature (but enables product display on the website in future versions).

**Business Value:** Product management enables the salon to sell retail products through the website, creating an additional revenue stream.

**Priority:** P3 — Deferred to V3.

**Complexity:** High — Product catalog with images, pricing, and inventory tracking.

**Dependencies:** Product data. E-commerce infrastructure.

**Future Expansion:** V3: Product catalog display. V4: E-commerce checkout.

---

## 31. FUTURE AI FEATURES

Intelligence layer — AI-powered features that enhance the experience. Explicitly deferred beyond V1.

---

### F31.1 — AI Chatbot (Multilingual)

**Purpose:** An AI-powered chatbot that can answer visitor questions about services, pricing, availability, and policies. The chatbot speaks Arabic, French, and English. It does not auto-greet (Rule N14) — it is available when the visitor initiates.

**User Value:** Visitors can get instant answers to specific questions without calling or emailing. The chatbot provides 24/7 availability for basic inquiries.

**Business Value:** A chatbot reduces the volume of phone calls and emails for routine questions, freeing staff for higher-value interactions.

**Priority:** P3 — Explicitly deferred to V2/V3. PRODUCT_VISION.md notes "AI chatbot — not in V1."

**Complexity:** Very High — Requires AI/NLP integration, multilingual training, knowledge base creation, and conversation design.

**Dependencies:** Service data. Pricing data. FAQ content. AI platform.

**Future Expansion:** V2: Basic FAQ chatbot. V3: Conversational booking assistant. V4: Personalized recommendations.

---

### F31.2 — AI Service Recommendation

**Purpose:** An AI-powered recommendation engine that suggests services based on the visitor's browsing behavior, stated preferences, or uploaded photos. "Based on what you're looking at, we recommend..."

**User Value:** Visitors receive personalized service recommendations tailored to their needs. The recommendation reduces decision fatigue and increases booking confidence.

**Business Value:** Personalized recommendations increase average ticket value and conversion rates by matching visitors with services they are most likely to book.

**Priority:** P3 — Deferred to V3.

**Complexity:** Very High — Requires recommendation algorithm, user behavior tracking, and integration with the booking flow.

**Dependencies:** F24 (analytics). Service data. Booking data.

**Future Expansion:** V3: Basic recommendation. V4: Photo-based recommendation.

---

### F31.3 — AI-Powered Virtual Try-On

**Purpose:** An AI feature that allows visitors to upload a photo and see a simulated preview of a color or style change. The "virtual try-on" creates a personalized before/after experience.

**User Value:** Visitors can visualize the transformation before committing. The virtual try-on reduces the anxiety of change and increases booking confidence.

**Business Value:** Virtual try-on is a powerful conversion tool — it personalizes the transformation narrative and creates shareable content.

**Priority:** P3 — Explicitly deferred. PRODUCT_VISION.md notes this for "later phase."

**Complexity:** Very High — Requires AI image processing, style transfer, and integration with the service catalog.

**Dependencies:** AI platform. Service data. Image processing infrastructure.

**Future Expansion:** V4+: AI-powered virtual try-on.

---

### F31.4 — AI Content Generation

**Purpose:** AI-powered content generation for service descriptions, blog posts, social media captions, and email marketing. The AI writes in the brand voice, maintaining consistency across all communications.

**User Value:** N/A — Internal tool.

**Business Value:** AI content generation reduces the time and cost of content production while maintaining brand voice consistency.

**Priority:** P3 — Deferred to V3/V4.

**Complexity:** High — Requires AI training on brand voice, content templates, and review workflow.

**Dependencies:** Brand voice guidelines. Content strategy.

**Future Expansion:** V3: Basic content generation. V4: Advanced content personalization.

---

### F31.5 — AI-Powered Scheduling Optimization

**Purpose:** An AI system that optimizes the salon's schedule — suggesting optimal appointment slots, reducing gaps between appointments, and predicting peak demand periods.

**User Value:** N/A — Backend feature (but enables better availability for visitors).

**Business Value:** Scheduling optimization increases revenue per day by maximizing chair utilization and reducing idle time.

**Priority:** P3 — Deferred to V4+.

**Complexity:** Very High — Requires machine learning on historical booking data, demand prediction, and schedule optimization algorithms.

**Dependencies:** F30.2 (booking management). Historical booking data. Staff scheduling data.

**Future Expansion:** V4+: AI scheduling.

---

# SUMMARY

---

## 1. MVP FEATURES (Version 1)

These features must be present for the experience to launch. Removing any of them breaks the core journey.

| Category | Feature | Priority | Complexity |
|----------|---------|----------|------------|
| **Landing** | Designed Loading Threshold (F1.1) | P0 | Medium |
| **Landing** | Warm Background (F1.2) | P0 | Low |
| **Landing** | Threshold-to-Hero Transition (F1.3) | P0 | Medium |
| **Navigation** | Sticky Navigation Bar (F2.1) | P0 | Medium |
| **Navigation** | Brand Mark (F2.2) | P0 | Low |
| **Navigation** | Mobile Navigation (F2.4) | P0 | Medium |
| **Hero** | Full-Viewport Hero Image (F3.1) | P0 | Medium |
| **Hero** | Hero Warm Reveal (F3.2) | P0 | Medium |
| **Storytelling** | Narrative Whisper (F4.1) | P0 | Low |
| **Storytelling** | Atmospheric Immersion (F4.3) | P0 | Medium |
| **Storytelling** | Editorial Photography System (F4.6) | P0 | Very High |
| **Scroll** | Scroll-Linked Content Reveals (F6.1) | P0 | Medium |
| **Scroll** | Breathing Spaces (F6.2) | P0 | Low |
| **Scroll** | prefers-reduced-motion (F6.4) | P0 | Low |
| **Services** | Hair Service Chapter (F7.1) | P0 | Medium |
| **Services** | Color/Transformation Chapter (F7.2) | P0 | High |
| **Services** | Service Breathing Spaces (F7.5) | P0 | Low |
| **Services** | Transparent Pricing (F12.1) | P0 | Low |
| **Team** | Artisan Portrait Gallery (F10.1) | P0 | Medium |
| **Testimonials** | Testimonial Cascade (F11.1) | P0 | Medium |
| **Booking** | Booking CTA (F13.1) | P0 | Low |
| **Booking** | Booking Flow (F13.2) | P0 | High |
| **Booking** | Booking Slide-In (F13.3) | P0 | Medium |
| **Booking** | Booking Confirmation (F13.4) | P0 | Medium |
| **Booking** | Booking Error Handling (F13.5) | P0 | Medium |
| **Calendar** | Service Calendar (F14.1) | P0 | High |
| **Calendar** | Date Selection (F14.2) | P0 | Medium |
| **Availability** | Real-Time Availability (F15.1) | P0 | Very High |
| **Time Slots** | Time Slot Selection (F16.1) | P0 | Medium |
| **Confirmation** | Confirmation Details (F17.1) | P0 | Low |
| **Confirmation** | Email/SMS Confirmation (F17.2) | P0 | High |
| **Contact** | Contact Information (F18.1) | P0 | Low |
| **Location** | Location Display (F19.1) | P0 | Low |
| **Accessibility** | WCAG 2.1 AA (F21.1) | P0 | High |
| **Accessibility** | Keyboard Navigation (F21.2) | P0 | Medium |
| **Accessibility** | Screen Reader Support (F21.3) | P0 | Medium |
| **Accessibility** | Reduced Motion (F21.4) | P0 | Low |
| **Performance** | LCP Under 2.5s (F22.1) | P0 | Very High |
| **Performance** | CLS Under 0.1 (F22.2) | P0 | High |
| **Performance** | Image Optimization (F22.3) | P0 | High |
| **Performance** | Font Loading (F22.4) | P0 | Medium |
| **Performance** | JavaScript Deferral (F22.5) | P0 | Medium |
| **SEO** | Semantic HTML (F23.1) | P0 | Low |
| **SEO** | Meta Tags / Open Graph (F23.2) | P0 | Low |
| **SEO** | Local SEO / NAP (F23.3) | P0 | Medium |
| **Analytics** | Booking Funnel Tracking (F24.2) | P0 | Medium |
| **Analytics** | Privacy-Respecting Analytics (F24.3) | P0 | Low |
| **Errors** | Network Error States (F25.2) | P0 | Medium |
| **Errors** | Form Validation (F25.3) | P0 | Low |
| **Mobile** | Mobile-First Responsive (F27.1) | P0 | High |
| **Mobile** | Mobile Navigation (F27.2) | P0 | Medium |
| **Mobile** | Mobile Touch Interactions (F27.3) | P0 | Medium |
| **Desktop** | Desktop Booking Flow (F29.3) | P0 | Medium |

**MVP Total: ~55 features at P0**

---

## 2. VERSION 2 FEATURES

These features enhance the experience significantly and should be planned for the second release cycle (3-6 months post-launch).

| Category | Feature | Priority | Complexity |
|----------|---------|----------|------------|
| **Hero** | Hero Parallax on Exit (F3.3) | P1 | Medium |
| **Storytelling** | Word-by-Word Reveal (F4.2) | P1 | Low |
| **Storytelling** | Parallax on Immersion (F4.4) | P1 | Medium |
| **Scroll** | Chapter Break Transitions (F6.3) | P1 | Low |
| **Services** | Bridal Chapter (F7.3) | P1 | Medium |
| **Services** | Spa Chapter (F7.4) | P1 | Medium |
| **Services** | Service Duration Display (F8.2) | P1 | Low |
| **Gallery** | Editorial Portfolio Grid (F9.1) | P1 | Medium |
| **Gallery** | Portfolio Hover (F9.2) | P1 | Low |
| **Team** | Artisan Reveal Animation (F10.2) | P1 | Low |
| **Team** | Artisan Still Presence (F10.3) | P1 | Low |
| **Testimonials** | Staggered Cascade (F11.2) | P2 | Low |
| **3D** | Atmospheric Depth Layer (F5.1) | P2 | High |
| **3D** | Volumetric Light Bloom (F5.2) | P1 | Medium |
| **Navigation** | Minimal Nav Links (F2.3) | P1 | Low |
| **FAQ** | FAQ Section (F20.1) | P1 | Low |
| **FAQ** | FAQ Expand/Collapse (F20.2) | P1 | Low |
| **Contact** | Click-to-Call (F18.2) | P1 | Low |
| **Location** | Map Integration (F19.2) | P2 | Medium |
| **Errors** | 404 Page (F25.1) | P1 | Low |
| **Loading** | Booking Loading States (F26.1) | P1 | Low |
| **Loading** | Image Loading States (F26.2) | P1 | Low |
| **Performance** | 3G Usability (F22.6) | P1 | High |
| **Analytics** | Page View / Scroll Tracking (F24.1) | P1 | Medium |
| **Tablet** | Tablet Responsive Layout (F28.1) | P1 | Medium |
| **Tablet** | Tablet Navigation (F28.2) | P1 | Low |
| **Desktop** | Desktop Layout (F29.1) | P1 | Medium |
| **Desktop** | Desktop Hover Interactions (F29.2) | P1 | Low |
| **Mobile** | Mobile 3D Optimization (F27.4) | P1 | Medium |
| **Admin** | Content Management System (F30.1) | P3→V2 | Very High |
| **Admin** | Booking Management Dashboard (F30.2) | P3→V2 | Very High |

**V2 Total: ~33 features (mix of P1 and P2, plus deferred P3)**

---

## 3. NICE-TO-HAVE FEATURES

Features that enhance the experience but are not essential for any release. Implement when resources allow.

| Category | Feature | Priority | Complexity |
|----------|---------|----------|------------|
| **Storytelling** | Typographic Moments (F4.5) | P2 | Low |
| **Testimonials** | Staggered Cascade (F11.2) | P2 | Low |
| **3D** | Atmospheric Depth Layer (F5.1) | P2 | High |
| **Location** | Map Integration (F19.2) | P2 | Medium |
| **Admin** | Client Database (F30.3) | P3 | Very High |
| **Admin** | Inventory Management (F30.4) | P3 | High |
| **AI** | AI Chatbot (F31.1) | P3 | Very High |
| **AI** | AI Service Recommendation (F31.2) | P3 | Very High |
| **AI** | Virtual Try-On (F31.3) | P3 | Very High |
| **AI** | AI Content Generation (F31.4) | P3 | High |
| **AI** | AI Scheduling Optimization (F31.5) | P3 | Very High |

---

## 4. EXPLICITLY OUT OF SCOPE

Features that will NOT be built — not in V1, not in V2, not in any planned version. These are either contradictions of the brand principles or premature for the salon's current stage.

| Feature | Reason Excluded | Brand Rule Violated |
|---------|-----------------|---------------------|
| **E-commerce / Product Sales** | The salon sells experiences, not products. Adding e-commerce dilutes the luxury positioning. | L2 (Never persuade — present) |
| **Client Reviews / Ratings System** | Reviews are curated by the salon, not crowdsourced. A public ratings system invites negativity and commoditizes the experience. | L5 (Social proof is specific and authentic) |
| **Blog / Content Marketing** | A blog requires ongoing content production that may not be maintained. An abandoned blog damages the brand more than no blog. | A13 (Every design decision is documented) |
| **Social Media Feed Embed** | The website IS the experience. Social media supports the website; the website never defers to social media. | N15 (Never embed social media feeds) |
| **Discount / Coupon System** | The salon competes on experience, never price. Discount language and mechanics undermine premium positioning. | L6 (No discount language) |
| **Loyalty Points / Rewards Program** | Points systems commoditize the experience. Loyalty is built through quality, not gamification. | L2 (Never persuade — present) |
| **Multi-Location Support** | The salon is a single, sovereign location. Multi-location dilutes the specificity that defines the brand. | Brand positioning |
| **Multi-User / Staff Portal (V1)** | Staff management is a V3+ concern. V1 focuses on the client experience. | Scope management |
| **Live Chat (Auto-Greeting)** | Auto-greeting chatbots communicate desperation, not confidence. Live chat may be considered in V3, but only opt-in. | N14 (Never use chatbots that auto-greet) |
| **Popup / Overlay Marketing** | Pop-ups communicate "our needs are more important than your experience." Email capture, exit-intent, and promotional overlays are prohibited. | N13 (Never use pop-up overlays) |
| **Video Auto-Play** | Auto-playing video with sound is the single most hostile thing a website can do. Even muted auto-play video consumes bandwidth and attention. | N20 (Never auto-play video with sound) |
| **Hero Carousel / Image Slider** | Carousels hide content, confuse visitors, and communicate indecision. One hero image, composed perfectly. | N16 (Never use hero carousels), N17 (No image sliders) |
| **Cookie Consent Banner (Intrusive)** | A large, intrusive cookie banner breaks the cinematic immersion. If cookies are used (analytics only, privacy-respecting), a minimal, non-intrusive notice is acceptable. | Brand experience integrity |
| **Newsletter Signup Pop-Up** | Pop-up email capture is prohibited. If email capture is desired, it should be a considered section within the experience, not an interruption. | N13 (Never use pop-up overlays) |
| **Chat Widget (Third-Party)** | Third-party chat widgets (Intercom, Drift, etc.) inject their own branding, styles, and scripts. They break the brand experience and introduce third-party dependencies. | Brand experience integrity |
| **AI-Generated Content on the Website** | AI-generated text, images, or faces are prohibited. The brand is built on authenticity. | N2 (Never use AI-generated faces or images) |
| **Countdown Timers / Urgency Tactics** | "Only 2 spots left today!" "Offer ends in 3 hours!" Urgency is the opposite of the brand's calm, confident voice. | N12 (Never use countdown timers) |
| **Stock Photography** | Every image is original. No exceptions. Not for placeholder. Not for development. Not ever. | N1 (Never use stock photography) |
| **Onboarding Tutorials / Walkthroughs** | If a tutorial is needed, the interface has failed. | N24 (Never use onboarding tutorials) |
| **Skeleton Loading Shimmer** | Shimmer skeletons are a generic pattern. Our loading experience is designed, not defaulted. | N23 (Never use skeleton shimmer) |

---

## FEATURE COUNT SUMMARY

| Category | P0 | P1 | P2 | P3 | Total |
|----------|-----|-----|-----|-----|-------|
| Landing Experience | 3 | 0 | 0 | 0 | 3 |
| Navigation | 3 | 1 | 0 | 0 | 4 |
| Hero | 2 | 1 | 0 | 0 | 3 |
| Storytelling | 3 | 2 | 1 | 0 | 6 |
| 3D Experience | 0 | 1 | 1 | 0 | 2 |
| Scroll Animations | 3 | 1 | 0 | 0 | 4 |
| Services | 3 | 3 | 0 | 0 | 6 |
| Service Details | 1 | 1 | 0 | 0 | 2 |
| Gallery | 0 | 2 | 0 | 0 | 2 |
| Team | 1 | 2 | 0 | 0 | 3 |
| Testimonials | 1 | 0 | 1 | 0 | 2 |
| Pricing | 1 | 0 | 0 | 0 | 1 |
| Booking | 5 | 0 | 0 | 0 | 5 |
| Calendar | 2 | 0 | 0 | 0 | 2 |
| Availability | 1 | 0 | 0 | 0 | 1 |
| Time Slots | 1 | 1 | 0 | 0 | 2 |
| Appointment Confirmation | 2 | 0 | 0 | 0 | 2 |
| Contact | 1 | 1 | 0 | 0 | 2 |
| Location | 1 | 0 | 1 | 0 | 2 |
| FAQ | 0 | 2 | 0 | 0 | 2 |
| Accessibility | 4 | 0 | 0 | 0 | 4 |
| Performance | 5 | 1 | 0 | 0 | 6 |
| SEO | 3 | 0 | 0 | 0 | 3 |
| Analytics | 1 | 1 | 0 | 0 | 2 |
| Error States | 2 | 1 | 0 | 0 | 3 |
| Loading States | 0 | 2 | 0 | 0 | 2 |
| Mobile Experience | 3 | 1 | 0 | 0 | 4 |
| Tablet Experience | 0 | 2 | 0 | 0 | 2 |
| Desktop Experience | 1 | 2 | 0 | 0 | 3 |
| Admin (Future) | 0 | 0 | 0 | 4 | 4 |
| AI Features (Future) | 0 | 0 | 0 | 5 | 5 |
| **TOTAL** | **~55** | **~30** | **~4** | **~9** | **~98** |

---

## THE ONE THING TO REMEMBER

Features are not a wish list. They are a commitment. Every P0 feature in this document will exist in Version 1. Every P3 feature will not. The discipline of this document is the discipline of saying no — no to premature features, no to competitor-mimicking additions, no to scope creep disguised as "nice to have."

The experience succeeds or fails on the quality of its core features, not the quantity of its peripheral ones. We build fewer things, each extraordinary. That is the brand.

---

*This document is the product scope for Version 1. It should be consulted during sprint planning, during design review, during stakeholder discussions, and during any conversation about adding features. Every feature request should be tested against the question: "Is this in the document? If not, why should it exist?"*

*Document prepared: July 2026*
*Source documents: PRODUCT_VISION.md, COMPETITOR_RESEARCH.md, CREATIVE_DIRECTION.md, MOODBOARD.md, DESIGN_LANGUAGE.md, VISUAL_RULES.md, EXPERIENCE_STORYBOARD.md, SCROLL_STORY.md, EMOTIONAL_TIMELINE.md, INTERACTION_TIMELINE.md, SIGNATURE_MOMENTS.md, SECTION_PURPOSE.md*
*Constraint: Product scope only — no code, no implementation details*

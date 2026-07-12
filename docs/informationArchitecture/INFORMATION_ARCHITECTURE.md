# INFORMATION_ARCHITECTURE.md
## The Structural Blueprint

> "Information Architecture is the skeleton beneath the skin. It is the invisible structure that makes the visible experience feel inevitable. Every page has a reason. Every link has a destination. Every hierarchy has been questioned. The architecture is not what the visitor sees — it is what the visitor feels: that everything is exactly where it should be."

---

## DOCUMENT PURPOSE

This document defines the complete information architecture of The Sovereign Artisor's digital presence — the structural blueprint that governs how content is organized, how navigation flows, how pages relate to each other, and how the visitor moves from arrival to commitment.

This is not a design document. This is not a code document. This is the architectural plan — the skeletal structure that every subsequent design and development decision must support.

**The architect's lens:** Every decision in this document is evaluated through three questions:
1. Does this structure serve the visitor's journey from curiosity to commitment?
2. Does this structure support the emotional narrative defined in the experience documents?
3. Does this structure enable the business goals defined in the product vision?

**Relationship to other documents:**
- PRODUCT_VISION.md → Business goals, audience segments, conversion targets
- COMPETITOR_RESEARCH.md → Market landscape, competitive positioning
- CREATIVE_DIRECTION.md → Visual and emotional identity
- DESIGN_LANGUAGE.md → Compositional grammar, spacing, typography
- VISUAL_RULES.md → Constitutional rules (always-do, never-do)
- EXPERIENCE_STORYBOARD.md → Cinematic narrative structure (scene-by-scene)
- SCROLL_STORY.md → Pacing and emotional architecture
- EMOTIONAL_TIMELINE.md → Feeling at every step
- INTERACTION_TIMELINE.md → Tactile vocabulary
- SIGNATURE_MOMENTS.md → The 10 unforgettable moments
- SECTION_PURPOSE.md → Why every section exists
- FEATURE_DEFINITION.md → Product scope, feature priorities
- **INFORMATION_ARCHITECTURE.md → The structural blueprint**

---

## 1. SITE STRUCTURE PHILOSOPHY

### The Architectural Premise

The Sovereign Artisor's digital presence is built on a **single-page narrative architecture** — a continuous scroll that functions as a cinematic experience. This is not a multi-page website with separate pages for services, about, and contact. This is a single, unified experience that unfolds as the visitor scrolls.

The single-page architecture was chosen for three structural reasons:

1. **Narrative control.** A single page preserves the director's control over pacing, sequence, and emotional progression. The visitor encounters sections in the order the story demands — not the order she chooses. This controlled sequence is the foundation of the emotional architecture.

2. **Reduced cognitive load.** There are no navigation decisions to make, no pages to evaluate, no information hierarchy to parse. The visitor scrolls. The experience unfolds. The architecture is invisible — which is exactly right.

3. **Conversion efficiency.** A single page means a single scroll path to the booking CTA. There are no dead-end pages, no orphaned sections, no lost visitors. Every scroll position is on the path to conversion.

**The exception:** Service detail pages exist as an optional depth layer for visitors who want to explore a specific service beyond what the homepage provides. These are the only child pages in the architecture.

### The Structural Hierarchy

```
LEVEL 0:  HOMEPAGE (Single-Page Experience)
          │
          ├── LEVEL 1: SECTION (within the scroll)
          │   ├── Section Purpose
          │   ├── Section Content
          │   └── Section Interaction
          │
          ├── LEVEL 1: SERVICE DETAIL PAGE (optional depth)
          │   ├── Service Overview
          │   ├── Service Experience
          │   └── Service Booking
          │
          └── LEVEL 1: UTILITY PAGE (functional, not narrative)
              ├── 404 Page
              └── Booking Confirmation

LEVEL 0:  BOOKING FLOW (overlay, not a page)
          │
          ├── STEP 1: Service Selection
          ├── STEP 2: Artisan Selection
          ├── STEP 3: Date Selection
          ├── STEP 4: Time Selection
          ├── STEP 5: Contact Information
          └── STEP 6: Confirmation
```

---

## 2. COMPLETE SITE MAP

### The Full Architecture

```
THE SOVEREIGN ARTISOR — COMPLETE SITE MAP
═══════════════════════════════════════════

ROOT: /
│
├── HOMEPAGE (Single-Page Scroll)
│   │
│   ├── PROLOGUE: The Threshold
│   │   └── Loading Moment (designed arrival)
│   │
│   ├── ACT I: The Invitation
│   │   ├── The Hero Image
│   │   ├── The Narrative Whisper (Thesis)
│   │   └── The Atmosphere (Immersion)
│   │
│   ├── [Breathing Space — Act I → Act II]
│   │
│   ├── ACT II: The Experience
│   │   ├── The Craft: Hair
│   │   │   └── → /services/hair (optional depth page)
│   │   ├── The Transformation: Color
│   │   │   └── → /services/color (optional depth page)
│   │   ├── The Ceremony: Bridal
│   │   │   └── → /services/bridal (optional depth page)
│   │   ├── The Sanctuary: Spa
│   │   │   └── → /services/spa (optional depth page)
│   │   ├── The Artisans
│   │   └── The Chorus of Proof (Testimonials)
│   │
│   ├── [Breathing Space — Act II → Act III]
│   │
│   ├── ACT III: The Commitment
│   │   ├── The Booking Invitation
│   │   ├── The Gift Experience
│   │   └── The Closing Image
│   │
│   └── EPILOGUE: The Footer
│       ├── Contact Information
│       ├── Operating Hours
│       ├── Physical Address
│       ├── Social Links
│       └── Legal Notices
│
├── /services/hair (Service Detail — optional)
├── /services/color (Service Detail — optional)
├── /services/bridal (Service Detail — optional)
├── /services/spa (Service Detail — optional)
│
├── BOOKING FLOW (overlay — /book)
│   ├── Step 1: Choose Service
│   ├── Step 2: Choose Artisan
│   ├── Step 3: Choose Date
│   ├── Step 4: Choose Time
│   ├── Step 5: Contact Details
│   └── Step 6: Confirmation
│
├── /404 (Not Found)
│
└── /confirmation (Post-Booking)
```

---

## 3. PAGE TREE — HOMEPAGE SECTIONS

### Complete Section Inventory

The homepage is the primary and most important page in the architecture. Every section within it is defined below with its structural relationships, content requirements, and architectural dependencies.

---

### 3.1 PROLOGUE: THE THRESHOLD

**Why it exists:** Creates a designed passage between the noise of the internet and the sanctuary of the experience. Transforms waiting into arrival.

**Parent:** Homepage root
**Children:** None (leads directly to Hero)
**Preceded by:** External context (browser, search, social)
**Followed by:** Hero Image (seamless dissolve)

**Entry points:**
- Direct URL access (primary)
- Referral links from social media, search engines, word-of-mouth

**Exit points:**
- Scroll down (into Hero)
- Browser back/forward (exit)

**User intent:** Arriving. The visitor has clicked a link or typed a URL. She is in transit.

**Business intent:** First impression quality. Bounce rate reduction. Premium positioning established in the first 1-3 seconds.

**Required content:**
- Warm background color (first visual element)
- Single atmospheric element (light bloom, brand mark emergence, or warmth particle)

**Optional content:**
- None. The threshold is defined by its singularity.

**Required interactions:**
- None from the visitor (time-based, not scroll-based)

**SEO importance:** Low. This is a visual moment, not a content moment. It does not need to be crawlable or indexable.

**Accessibility considerations:**
- Screen reader: Skip directly to Hero content. The threshold is decorative.
- prefers-reduced-motion: Threshold animation becomes instant or minimal.
- The warm background color must meet contrast requirements for any text that follows.

**Dependencies:**
- Hero image must be optimized for fast initial render
- Brand mark or atmospheric element asset must be defined
- Warm background color from approved palette (VISUAL_RULES.md C1, C3, C4)

---

### 3.2 ACT I: THE HERO IMAGE

**Why it exists:** The first visual impression. A single, extraordinary, full-viewport editorial photograph that communicates the brand's identity in a wordless frame. Creates the Halo Effect — the psychological phenomenon where the first impression colors all subsequent impressions.

**Parent:** Homepage → Act I
**Children:** None
**Preceded by:** Threshold (seamless dissolve)
**Followed by:** Narrative Whisper (cross-dissolve transition)

**Entry points:**
- Scroll down from Threshold
- Direct URL with section anchor (if supported)

**Exit points:**
- Scroll down (into Thesis)
- Navigation link click (jump to another section)

**User intent:** Absorbing. The visitor is experiencing the brand's visual identity for the first time. She is forming her first impression.

**Business intent:** Brand differentiation. Emotional engagement. Halo Effect creation. The hero sets the quality standard for the entire experience.

**Required content:**
- Full-viewport editorial photograph (original, no stock, no AI)
- Afternoon Gold lighting treatment

**Optional content:**
- None. The hero is image-only. No text, no headline, no CTA.

**Required interactions:**
- Warm Reveal animation (800-1200ms, 80-90% opacity starting point)
- Stillness after reveal (no parallax, no animation)

**SEO importance:**
- The hero image needs descriptive alt text for accessibility and SEO
- The hero contributes to LCP (Largest Contentful Paint) — must be under 2.5 seconds
- Open Graph image should be derived from or match the hero

**Accessibility considerations:**
- Alt text: Descriptive, specific, warm — describes the visual scene
- Screen reader: Announces the image before the visitor encounters it
- prefers-reduced-motion: Hero reveal becomes instant

**Dependencies:**
- Original editorial photography (F4.6, FEATURE_DEFINITION.md)
- Image optimization pipeline (WebP/AVIF with fallbacks)
- Performance budget for LCP under 2.5s

---

### 3.3 ACT I: THE NARRATIVE WHISPER (Thesis)

**Why it exists:** Names the feeling the hero created. Gives the visitor language for what she is experiencing. Establishes the brand's verbal identity. Bridges visual impression to philosophical alignment.

**Parent:** Homepage → Act I
**Children:** None
**Preceded by:** Hero Image (cross-dissolve)
**Followed by:** Atmosphere (cross-dissolve transition)

**Entry points:**
- Scroll down from Hero
- Navigation link jump (if "About" or "Philosophy" anchors here)

**Exit points:**
- Scroll down (into Atmosphere)
- Navigation link click

**User intent:** Understanding. The visitor has felt something from the hero; now she wants to understand what that feeling means.

**Business intent:** Brand positioning and memorability. The thesis is the verbal hook that drives word-of-mouth. It is the phrase the visitor quotes to friends.

**Required content:**
- Single headline (5-8 words) in serif typeface at Display scale
- Single supporting line (10-15 words) in sans-serif typeface
- Centered composition with 70%+ whitespace

**Optional content:**
- None. The thesis is defined by its brevity.

**Required interactions:**
- Word-by-word reveal animation (60-80ms per word)
- Supporting line fade (300ms delay after headline, 400ms duration)

**SEO importance:**
- The thesis text is the primary keyword/content signal for the homepage
- It should contain the brand name or brand concept naturally
- H1 or H2 level heading for semantic structure

**Accessibility considerations:**
- Heading hierarchy: The thesis headline is the primary heading (H1) on the page
- Screen reader: Reads the complete thesis text
- prefers-reduced-motion: Text appears instantly without word-by-word animation

**Dependencies:**
- Brand voice guidelines
- Serif typeface selection and loading

---

### 3.4 ACT I: THE ATMOSPHERE (Immersion)

**Why it exists:** Places the visitor INSIDE the salon space through sensory immersion. Transforms observer to participant. Creates desire: "I want to be there." This is the most important psychological transformation in Act I.

**Parent:** Homepage → Act I
**Children:** None
**Preceded by:** Narrative Whisper (cross-dissolve)
**Followed by:** Breathing Space → Act II (chapter break)

**Entry points:**
- Scroll down from Thesis
- Navigation link jump (if "Gallery" or "Experience" anchors here)

**Exit points:**
- Scroll down (into Breathing Space → Hair)
- Navigation link click

**User intent:** Immersing. The visitor is exploring the sensory reality of the salon. She is no longer evaluating — she is imagining herself in the space.

**Business intent:** Desire creation. Aspiration building. The atmosphere section is where the visitor begins to imagine herself in the space — the most powerful form of desire creation.

**Required content:**
- 2-4 full-bleed or near-full-bleed editorial photographs
- Environmental shots (the space) alternating with tactile shots (materials, light, details)
- Consistent Afternoon Gold lighting across all images

**Optional content:**
- 2-3 brief typographic moments between images ("Warmth." "Touch." "Ritual.")

**Required interactions:**
- Scroll-linked parallax (80% of scroll speed, 10-15% differential)
- Standard section reveal for each image

**SEO importance:**
- Images need descriptive alt text
- The section contributes to time-on-page (a positive SEO signal)
- No critical keyword content here — this is a sensory section

**Accessibility considerations:**
- All images have descriptive alt text
- Parallax is disabled with prefers-reduced-motion
- Screen reader: Reads image descriptions and any typographic words

**Dependencies:**
- Original editorial photography (multiple images)
- Scroll animation system
- Image optimization pipeline

---

### 3.5 BREATHING SPACE: ACT I → ACT II

**Why it exists:** Chapter break between the Invitation (Act I) and the Experience (Act II). Provides processing time for the desire created by the Atmosphere. Resets the visitor's attention for the service chapters.

**Parent:** Homepage → Transition
**Children:** None
**Preceded by:** Atmosphere
**Followed by:** The Craft: Hair

**Entry points:**
- Scroll down from Atmosphere

**Exit points:**
- Scroll down (into Hair)

**User intent:** Resting. The visitor is processing the atmospheric immersion before encountering the service chapters.

**Business intent:** Cognitive load management. Content presented after a rest is processed more deeply and remembered more accurately.

**Required content:**
- Full viewport of warm background with no content

**Optional content:**
- None. The breathing space is defined by emptiness.

**Required interactions:**
- None

**SEO importance:** None. This is structural space, not content.

**Accessibility considerations:**
- Screen reader: Skips this section entirely (it contains no content)

**Dependencies:**
- Spacing scale (VISUAL_RULES.md S1-S8)

---

### 3.6 ACT II: THE CRAFT: HAIR

**Why it exists:** First concrete encounter with the brand's craft. Establishes skill credibility. The widest part of the funnel — the most universal service, capturing the broadest audience segment.

**Parent:** Homepage → Act II → Services
**Children:** Optional link to /services/hair
**Preceded by:** Breathing Space (Act I → Act II)
**Followed by:** Breathing Space → Transformation

**Entry points:**
- Scroll down from Breathing Space
- Navigation link "Services" → scrolls to this section
- Direct anchor link

**Exit points:**
- Scroll down (into Breathing Space → Transformation)
- Click to /services/hair (service detail page)
- Navigation link click

**User intent:** Exploring. The visitor sees the craft and begins to understand the level of skill. "What can they do?"

**Business intent:** Service comprehension and value communication. Establishes the quality standard. Justifies premium pricing through editorial presentation.

**Required content:**
- Editorial photograph of hair work in action
- Detail/close-up image of technique
- Service headline (5-8 words)
- Sensory copy describing the experience (1-2 paragraphs)
- Transparent pricing (visible, no "call for pricing")
- Artisan name/connection

**Optional content:**
- Link to /services/hair for deeper exploration
- Service duration information

**Required interactions:**
- Standard section reveal (400-600ms, 20-30px upward, ease-out)
- Word-by-word headline reveal
- Subtle parallax on images
- Hover warmth on service card (if card-based layout)

**SEO importance:**
- Service-specific keywords in headline and copy
- H2 or H3 heading for semantic structure
- Pricing information is indexable and valuable for search
- Schema.org Service markup potential

**Accessibility considerations:**
- Heading hierarchy maintained (H2 or H3)
- Pricing information clearly associated with its service
- Images have descriptive alt text
- All text meets 4.5:1 contrast ratio

**Dependencies:**
- Original editorial photography
- Service content and pricing from the business
- Typography system

---

### 3.7 ACT II: THE TRANSFORMATION: COLOR

**Why it exists:** The emotional peak of Act II. Features the Transformation Dissolve — the scroll-controlled before/after cross-dissolve where the visitor becomes the author of the transformation. The single most emotionally intense moment in the entire scroll.

**Parent:** Homepage → Act II → Services
**Children:** Optional link to /services/color
**Preceded by:** Breathing Space (Hair → Color)
**Followed by:** Breathing Space → Bridal

**Entry points:**
- Scroll down from Hair breathing space
- Navigation link → scrolls to this section
- Direct anchor link

**Exit points:**
- Scroll down (into Breathing Space → Bridal)
- Click to /services/color (service detail page)
- Navigation link click

**User intent:** Imagining. The visitor sees the transformation and projects herself into it. "I want that feeling."

**Business intent:** Conversion acceleration. The Transformation is the moment where interest becomes intent. The scroll-controlled dissolve creates agency — the visitor is not watching someone else's transformation; she is authoring her own.

**Required content:**
- Before image (natural, honest lighting)
- After image (Afternoon Gold lighting)
- Scroll-linked cross-dissolve between before/after
- Process images (color being mixed, applied, developed)
- Client quote (specific, emotional, real)
- Transparent pricing

**Optional content:**
- Link to /services/color for deeper exploration
- Service duration

**Required interactions:**
- Transformation Dissolve (scroll-linked, linear, full viewport of scroll)
- Staggered process image reveals (200ms between each)
- Client quote fade-in after transformation completes

**SEO importance:**
- Before/after content is highly shareable and linkable
- Service-specific keywords
- Client quote provides unique, authentic content

**Accessibility considerations:**
- Before/after images both have descriptive alt text
- The dissolve animation is disabled with prefers-reduced-motion (both images visible simultaneously or sequentially without scroll control)
- Screen reader: Reads both image descriptions and the client quote

**Dependencies:**
- Before/after photography
- Scroll animation system
- Client quote content

---

### 3.8 ACT II: THE CEREMONY: BRIDAL

**Why it exists:** Speaks to the high-value bridal audience with tenderness and reverence. The slowest section in the entire scroll — everything at 50% speed. Demonstrates the salon understands occasions that matter.

**Parent:** Homepage → Act II → Services
**Children:** Optional link to /services/bridal
**Preceded by:** Breathing Space (Color → Bridal)
**Followed by:** Breathing Space → Spa

**Entry points:**
- Scroll down from Color breathing space
- Navigation link → scrolls to this section
- Direct anchor link

**Exit points:**
- Scroll down (into Breathing Space → Spa)
- Click to /services/bridal
- Navigation link click

**User intent:** Feeling. The visitor senses the emotional weight of the occasion. "They understand what this day means."

**Business intent:** Premium service capture. Bridal is the highest-value service category. Generates referral traffic (bridesmaids, family, friends). Creates shareable content.

**Required content:**
- Full-viewport portrait of a bride mid-preparation
- Detail shots (veil, hair pins, hands at work, mirror reflection)
- Service headline (5-8 words)
- Sensory copy (30-50 words)
- Transparent pricing

**Optional content:**
- Link to /services/bridal
- Artisan name/connection

**Required interactions:**
- Slowest reveal in the experience (50% of standard speed)
- Morning Light lighting mood

**SEO importance:**
- "Bridal" keyword targeting
- Service-specific pricing (brides search for this)
- High commercial intent keyword potential

**Accessibility considerations:**
- Same as other service chapters
- Slower animation is already accessible-friendly

**Dependencies:**
- Bridal photography
- Service content
- Animation system with duration overrides

---

### 3.9 ACT II: THE SANCTUARY: SPA

**Why it exists:** Completes the service arc with sensory imagery and the gentlest motion. Demonstrates the salon understands the body's need for rest and care. Provides emotional release after the intensity of preceding chapters.

**Parent:** Homepage → Act II → Services
**Children:** Optional link to /services/spa
**Preceded by:** Breathing Space (Bridal → Spa)
**Followed by:** Full breathing space → Artisans

**Entry points:**
- Scroll down from Bridal breathing space
- Navigation link → scrolls to this section
- Direct anchor link

**Exit points:**
- Scroll down (into full breathing space → Artisans)
- Click to /services/spa
- Navigation link click

**User intent:** Relaxing. The visitor's body responds to the sensory imagery. "I can almost feel it."

**Business intent:** Service diversification and average ticket increase. Broadens the salon's addressable audience to wellness-seeking clients.

**Required content:**
- Full-viewport sensory images (warm towels, candle glow, hands on skin)
- Service headline (5-8 words)
- Sensory copy (30-50 words)
- Evening Warmth lighting mood
- Transparent pricing

**Optional content:**
- Link to /services/spa
- Artisan name/connection

**Required interactions:**
- Gentlest motion of any section (imperceptible fades, subtle parallax)

**SEO importance:**
- "Spa" keyword targeting
- Wellness-related search terms
- Service pricing

**Accessibility considerations:**
- Same as other service chapters
- Gentle motion is inherently accessible

**Dependencies:**
- Spa photography
- Service content

---

### 3.10 ACT II: THE ARTISANS

**Why it exists:** Humanizes the brand. Transforms the brand from an entity into a collection of individuals. Pre-qualifies the booking decision by facilitating artisan pre-selection. People trust people, not brands.

**Parent:** Homepage → Act II
**Children:** None (artisans are displayed within the section, not as separate pages in V1)
**Preceded by:** Full breathing space (Spa → Artisans)
**Followed by:** Breathing Space → Testimonials

**Entry points:**
- Scroll down from Spa breathing space
- Navigation link "Team" or "Artisans" → scrolls here
- Direct anchor link

**Exit points:**
- Scroll down (into Testimonials)
- Navigation link click

**User intent:** Meeting. The visitor encounters the faces behind the craft. She begins to form parasocial connections and pre-select her artisan.

**Business intent:** Staff retention and personal branding. Client retention through personal connection. Differentiation from anonymous salon brands.

**Required content:**
- Large, warm, editorial portrait of each artisan (majority of viewport)
- Name, title
- One sentence about their specialty (specific, human language)
- Availability information

**Optional content:**
- Individual artisan detail pages (V2)

**Required interactions:**
- Artisan Reveal: portrait fades in (Warm Reveal 400-600ms), specialty text appears 200ms later
- No hover effects on portraits (deliberate stillness)

**SEO importance:**
- Artisan names are searchable (people search for specific stylists)
- Structured data for Person schema
- Local SEO signal (real team at a real location)

**Accessibility considerations:**
- Portraits have descriptive alt text (names, titles)
- Heading hierarchy for artisan names
- No hover dependency — all information is visible without interaction

**Dependencies:**
- Artisan photography (faces, not backs of heads)
- Artisan data (names, titles, specialties, availability)

---

### 3.11 ACT II: THE CHORUS OF PROOF (Testimonials)

**Why it exists:** Eliminates the final barrier before booking — doubt. Provides external validation through authentic, named, specific testimonials. The most "real" section in the entire scroll.

**Parent:** Homepage → Act II
**Children:** None
**Preceded by:** Breathing Space (Artisans → Testimonials)
**Followed by:** Full breathing space (longest pause) → Booking

**Entry points:**
- Scroll down from Artisans breathing space
- Navigation link → scrolls here (if anchored)

**Exit points:**
- Scroll down (into longest breathing space → Booking)
- Navigation link click

**User intent:** Validating. The visitor seeks confirmation that her trust is well-placed. "These are real people. This is real."

**Business intent:** Conversion optimization. The final trust-building element before the booking invitation. The section that eliminates the remaining doubt.

**Required content:**
- 4-6 named, attributed testimonials
- Real names, real dates, real services
- Specific, emotional stories (not generic praise)
- Real client photography (candid moments, not headshots)
- Organized by emotional arc (nervous → understood → transformed → confident)

**Optional content:**
- Client service details
- Client photographs

**Required interactions:**
- Staggered cascade (200ms between each testimonial)
- Simple fade-in (no translation, no scale)

**SEO importance:**
- Testimonials provide unique, authentic content
- Named reviews are more trustworthy to search engines
- Service-specific testimonials support long-tail keyword targeting

**Accessibility considerations:**
- Text-forward section — inherently accessible
- Each testimonial is a distinct block (proper semantic markup)
- Client photos have alt text
- Reading order follows the emotional arc

**Dependencies:**
- Real client testimonials (curated, not crowdsourced)
- Client photography
- Brand voice guidelines

---

### 3.12 BREATHING SPACE: ACT II → ACT III

**Why it exists:** The longest breathing space in the entire scroll. Trust settling into certainty. Desire crystallizing into intention. The most important pause — the moment where the entire emotional arc of Act II is allowed to settle before the commitment of Act III begins.

**Parent:** Homepage → Transition
**Children:** None
**Preceded by:** Testimonials
**Followed by:** Booking Invitation

**Entry points:**
- Scroll down from Testimonials

**Exit points:**
- Scroll down (into Booking)

**User intent:** Deciding. The visitor is processing the accumulated evidence and forming her decision internally.

**Business intent:** Decision quality. Ensures the visitor makes her booking decision from clarity, not information overload.

**Required content:**
- Full viewport of warm background with no content

**Optional content:**
- None

**Required interactions:**
- None

**SEO importance:** None

**Accessibility considerations:**
- Screen reader: Skips entirely

**Dependencies:**
- Spacing scale

---

### 3.13 ACT III: THE BOOKING INVITATION

**Why it exists:** The narrative resolution. The moment where all emotional investment becomes a commitment. Defined by radical simplicity — typography and a button. The absence of persuasion is the most persuasive statement on the page.

**Parent:** Homepage → Act III
**Children:** None (leads to Booking Flow overlay)
**Preceded by:** Longest breathing space (Act II → Act III)
**Followed by:** Gift Experience

**Entry points:**
- Scroll down from longest breathing space
- Navigation link → scrolls here
- Sticky booking CTA (always accessible)

**Exit points:**
- Click "Book your experience" → Booking Flow opens
- Scroll down (into Gift Experience)
- Navigation link click

**User intent:** Deciding. The visitor is ready to book. The invitation confirms what she has already decided internally.

**Business intent:** Conversion. The single most business-critical section. Transforms emotional investment into a concrete appointment.

**Required content:**
- Headline: "Your chair is waiting." or "When you're ready." or "Let's begin."
- Supporting line: "Choose your service, choose your artisan, choose your moment."
- Primary CTA button: "Book your experience" (gold accent)
- Afternoon Gold lighting mood

**Optional content:**
- None. Radical simplicity.

**Required interactions:**
- Stillness (no animation, no reveal)
- CTA hover: subtle luminosity shift (200-300ms)
- CTA click: 97% compression, then Booking Flow opens

**SEO importance:**
- The booking CTA is the primary conversion signal
- Schema.org action markup potential

**Accessibility considerations:**
- CTA button meets 44×44px minimum touch target
- Focus indicator visible on the CTA
- Screen reader: Announces the CTA clearly

**Dependencies:**
- Booking Flow (F13.2)
- Button design system (B1-B10)

---

### 3.14 ACT III: THE GIFT EXPERIENCE

**Why it exists:** Captures secondary audience (gift buyers) without diluting the primary booking path. The second door for visitors who did not walk through the first.

**Parent:** Homepage → Act III
**Children:** None
**Preceded by:** Booking Invitation
**Followed by:** Closing Image

**Entry points:**
- Scroll down from Booking Invitation
- Navigation link (if "Gifts" is in the nav)

**Exit points:**
- Scroll down (into Closing Image)
- Click CTA → Gift booking flow

**User intent:** Considering. The visitor who is not booking for herself may be inspired to book for someone she loves.

**Business intent:** Secondary conversion and revenue expansion. Gift certificates, gift packages.

**Required content:**
- Single image (gift-related, warm, intimate)
- Headline: "Give the gift of being taken care of"
- CTA: "Explore gift options"

**Optional content:**
- Gift package details
- Gift card options

**Required interactions:**
- Standard section reveal (400-600ms)

**SEO importance:**
- "Gift" and "gift card" keyword targeting
- Seasonal search traffic potential

**Accessibility considerations:**
- Same as other content sections

**Dependencies:**
- Gift-related photography
- Gift service/pricing data

---

### 3.15 ACT III: THE CLOSING IMAGE

**Why it exists:** The Peak-End Rule's "end" — the last visual impression, the final emotional beat. Creates the lasting impression that determines what the visitor carries with her. Circular return to the beginning.

**Parent:** Homepage → Act III
**Children:** None
**Preceded by:** Gift Experience
**Followed by:** Footer (Epilogue)

**Entry points:**
- Scroll down from Gift Experience

**Exit points:**
- Scroll down (into Footer)
- Browser exit

**User intent:** Absorbing. The visitor is taking in the final image — the last emotional moment before the experience ends.

**Business intent:** Brand retention and return visits. The closing image creates the memory that makes the visitor think of "The Sovereign Artisor" when she next needs salon services.

**Required content:**
- Full-viewport, full-bleed editorial image
- Afternoon Gold at its warmest and most beautiful
- Optional: single line of text ("We'll be here." or brand name)

**Optional content:**
- Brand name in serif typeface, centered
- A promise or welcome statement

**Required interactions:**
- Longest dissolve in the experience (2000-2500ms)
- Stillness after reveal

**SEO importance:**
- The image contributes to the page's overall quality signal
- Brand name in text supports brand keyword targeting

**Accessibility considerations:**
- Image has descriptive alt text
- Any text is readable and properly structured
- prefers-reduced-motion: Image appears instantly

**Dependencies:**
- Extraordinary closing photography (must be at least as powerful as the hero)

---

### 3.16 EPILOGUE: THE FOOTER

**Why it exists:** Provides practical information (hours, address, contact) clearly, beautifully, and respectfully. The credits of the film — functional, necessary, but not competing with the closing image.

**Parent:** Homepage → Epilogue
**Children:** None
**Preceded by:** Closing Image
**Followed by:** End of page

**Entry points:**
- Scroll to bottom of page

**Exit points:**
- Browser exit
- External links (social media, email, phone)

**User intent:** Finding. The visitor is looking for specific practical information — hours, address, phone number.

**Business intent:** Operational accessibility, local SEO (NAP consistency), social media growth, legal compliance.

**Required content:**
- Salon name and brand mark
- Operating hours
- Physical address
- Phone number (click-to-call on mobile)
- Email address
- Social media links
- Privacy policy link
- Terms of service link
- Copyright notice

**Optional content:**
- Map embed (V2)
- Newsletter signup (non-intrusive, V2)
- Booking CTA (repeated for convenience)

**Required interactions:**
- Click-to-call on phone number (mobile)
- External links open in new tab
- Social links open in new tab

**SEO importance:**
- NAP (Name, Address, Phone) consistency is critical for local SEO
- Schema.org LocalBusiness markup
- Operating hours for Google Business Profile consistency
- Privacy policy and terms for legal compliance

**Accessibility considerations:**
- All links are keyboard-accessible
- Phone number uses tel: link
- Social links have descriptive labels (not just icons)
- Copyright and legal text is readable at all zoom levels

**Dependencies:**
- Business contact data
- Social media accounts
- Legal documents (privacy policy, terms)

---

## 4. SERVICE DETAIL PAGES

### 4.1 Purpose and Scope

Service detail pages are the only child pages in the architecture. They exist as an optional depth layer for visitors who want to explore a specific service beyond what the homepage provides. These pages are not required for the core journey — the homepage provides sufficient service information for most visitors.

**When a visitor accesses a service detail page:** She has already been emotionally converted by the homepage and now wants to investigate a specific service in more detail. The service page serves this deeper intent.

### 4.2 Service Page Structure (Common to All)

Each service detail page follows a three-act mini-film structure:

```
ACT I:  THE INVITATION
        └── Full-viewport editorial image with service name
        └── The emotional thesis of this specific service

ACT II: THE EXPERIENCE
        └── Scroll-narrative describing the service
        └── Sensory language, process imagery, artisan expertise

ACT III: THE RESOLUTION
        └── Transparent pricing
        └── Artisan selection
        └── Embedded booking CTA
        └── Link back to homepage
```

### 4.3 Service Page: /services/hair

**Parent:** Homepage → Hair section (linked from there)
**Children:** None
**Preceded by:** Homepage (visitor clicks from Hair section)
**Followed by:** Homepage (return link) or Booking Flow

**Entry points:**
- Link from homepage Hair section
- Direct URL
- Search engine results (SEO-driven)

**Exit points:**
- Back to homepage
- Booking CTA → Booking Flow
- Navigation link → another section

**User intent:** Investigating. The visitor wants to understand the hair service in full detail before booking.

**Business intent:** Service-specific SEO. Deeper service comprehension for high-intent visitors.

**Required content:**
- Full-viewport hero image (hair service editorial)
- Service name and emotional thesis
- Detailed sensory description of the experience
- Process imagery (technique in action)
- Transparent pricing (all hair services listed)
- Artisan connection (who performs this service)
- Booking CTA
- Duration information

**Optional content:**
- Before/after examples
- Client quotes specific to hair services
- FAQ about hair services

**SEO requirements:**
- Unique H1: "Hair Services" or similar
- Service-specific keywords throughout
- Schema.org Service markup
- Unique meta title and description
- Internal links to homepage and other service pages

---

### 4.4 Service Page: /services/color

**Parent:** Homepage → Color section
**Same structure as Hair, adapted for color-specific content:**
- Before/after transformation examples
- Color consultation process
- Color-specific pricing
- Color specialist artisan connection

---

### 4.5 Service Page: /services/bridal

**Parent:** Homepage → Bridal section
**Same structure, adapted for bridal-specific content:**
- Bridal-specific editorial photography
- Morning Light lighting mood
- Wedding day timeline integration
- Bridal package pricing
- Consultation process

---

### 4.6 Service Page: /services/spa

**Parent:** Homepage → Spa section
**Same structure, adapted for spa-specific content:**
- Sensory imagery
- Evening Warmth lighting mood
- Treatment menu with pricing
- Duration and booking information

---

## 5. BOOKING FLOW ARCHITECTURE

### 5.1 Structure

The booking flow is NOT a page — it is an overlay that slides in from the edge of the viewport. The visitor never leaves the brand world. The flow maintains the same typography, colors, spacing, and warmth as the rest of the experience.

### 5.2 Booking Flow Steps

```
BOOKING FLOW — COMPLETE STEP MAP
══════════════════════════════════

STEP 1: CHOOSE SERVICE
│   Entry: CTA click from any page
│   Content: Service categories (Hair, Color, Bridal, Spa)
│   Interaction: Card selection with warm hover
│   Validation: Service must be selected to proceed
│
├──→ STEP 2: CHOOSE ARTISAN
│    Content: Artisan portraits (same as homepage gallery)
│    Interaction: Portrait selection with gold border
│    Validation: Artisan must be selected to proceed
│
├──→ STEP 3: CHOOSE DATE
│    Content: Calendar with available dates
│    Interaction: Date tap to select
│    Validation: Date must be available and selected
│
├──→ STEP 4: CHOOSE TIME
│    Content: Time slots grouped (morning/afternoon/evening)
│    Interaction: Time slot tap to select
│    Validation: Time slot must be available and selected
│
├──→ STEP 5: CONTACT DETAILS
│    Content: Name, email, phone, special requests
│    Interaction: Form fields with warm focus states
│    Validation: Required fields validated inline
│
└──→ STEP 6: CONFIRMATION
     Content: Appointment details, warm message, next steps
     Interaction: Warm Confirmation animation (800-1200ms)
     Exit: Return to homepage or close overlay
```

### 5.3 Booking Flow Entry Points

| Entry Point | Location | Trigger |
|-------------|----------|---------|
| Primary CTA | Sticky navigation | "Book your experience" button |
| Section CTA | Booking Invitation section | "Book your experience" button |
| Gift CTA | Gift Experience section | "Explore gift options" |
| Footer CTA | Footer (optional) | "Book your experience" button |
| Direct URL | /book | URL access (V2) |
| Service pages | Each service detail page | "Book this service" button |

### 5.4 Booking Flow Exit Points

| Exit Point | Behavior | Brand Experience |
|------------|----------|-----------------|
| Completion | Confirmation displayed, overlay remains | Warm, satisfying |
| Abandonment (close) | Overlay closes, returns to page state | No data loss |
| Network error | Error message with retry | Specific, helpful |
| Validation error | Inline error on relevant field | Clear, warm |

### 5.5 Booking Flow Dependencies

```
BOOKING FLOW DEPENDENCY MAP
════════════════════════════

Service Data ──────────┐
                       ├──→ Step 1: Service Selection
Artisan Data ──────────┤
                       ├──→ Step 2: Artisan Selection
Availability Data ─────┤
                       ├──→ Step 3: Date Selection
Calendar System ───────┤
                       ├──→ Step 4: Time Selection
Time Slot Data ────────┘
                       │
                       ├──→ Step 5: Contact (no external dependency)
                       │
                       └──→ Step 6: Confirmation
                            ├──→ Email/SMS Service
                            └──→ Backend Booking System
```

---

## 6. NAVIGATION SYSTEMS

### 6.1 Primary Navigation

**Purpose:** Persistent access to key sections from any point in the scroll. Always present via sticky navigation bar.

**Structure:**
```
PRIMARY NAVIGATION (Sticky Bar)
═══════════════════════════════

[Brand Mark]     [Services] [Gallery] [Team] [Contact]     [Book Your Experience]
   │                 │          │        │       │                    │
   │                 │          │        │       │                    │
   ▼                 ▼          ▼        ▼       ▼                    ▼
  Top of       Hair/Color/  Atmosphere  Artisans  Footer          Booking
  Page         Bridal/Spa   Section     Section   Section          Flow
  (anchor)     (anchor)     (anchor)    (anchor)  (anchor)        (overlay)
```

**Rules:**
- Brand mark always links to top of page
- Navigation links are anchor links to sections within the single-page experience
- Booking CTA is always visible, always accessible (Rule A12)
- Navigation appears/disappears based on scroll direction (hide on scroll down, show on scroll up)
- Active section is indicated with gold underline

**Mobile navigation:**
- Hamburger menu replaces horizontal links
- Opens as full-screen overlay with warm background
- Contains all navigation links + booking CTA + contact information
- Closes on link selection or X button

### 6.2 Secondary Navigation

**Purpose:** Within-page navigation that helps visitors orient and jump to specific content.

**Structure:**
```
SECONDARY NAVIGATION
════════════════════

• Scroll progress indicator (subtle, V2)
• Back to top functionality (via brand mark)
• "Book your experience" repeated in Booking Invitation section
```

**Rules:**
- Secondary navigation never competes with primary navigation
- It provides convenience, not wayfinding
- The scroll experience is the primary navigation method

### 6.3 Footer Navigation

**Purpose:** Practical wayfinding after the narrative experience is complete.

**Structure:**
```
FOOTER NAVIGATION
═════════════════

Column 1: Brand
  └── Brand mark
  └── Tagline or thesis

Column 2: Quick Links
  └── Services (scrolls to Services section)
  └── Our Team (scrolls to Artisans section)
  └── Book Now (opens Booking Flow)
  └── Gift Cards (scrolls to Gift section)

Column 3: Contact
  └── Address
  └── Phone (click-to-call)
  └── Email
  └── Hours

Column 4: Social & Legal
  └── Instagram
  └── Facebook
  └── Privacy Policy
  └── Terms of Service
```

**Rules:**
- Footer links use the same warm typography as the rest of the experience
- External links open in new tabs
- Phone number uses tel: protocol
- Footer does not compete with the Closing Image for emotional attention

### 6.4 Booking Entry Points

All paths that lead to the booking flow:

| Path | Source | Frequency Estimate |
|------|--------|--------------------|
| Sticky CTA | Always visible in navigation | Highest |
| Booking Section CTA | Scroll to Booking Invitation | High |
| Service Page CTAs | Each service detail page | Medium |
| Gift Section CTA | Gift Experience section | Low |
| Footer CTA | Footer "Book Now" link | Low |
| Direct URL /book | Shared links, bookmarks | Low (V2) |

### 6.5 Conversion Entry Points

All paths that lead to conversion actions (booking, gift purchase, contact):

```
CONVERSION PATH MAP
═══════════════════

                     ┌─── Booking CTA (sticky) ──── Booking Flow
                     │
                     ├─── Booking Section CTA ───── Booking Flow
                     │
HOMEPAGE SCROLL ─────├─── Gift Section CTA ──────── Gift Flow
                     │
                     ├─── Phone Number (footer) ─── Phone Call
                     │
                     └─── Email (footer) ─────────── Email

SERVICE PAGES ───────└─── "Book this service" ────── Booking Flow
                     └─── Phone Number ───────────── Phone Call
```

### 6.6 Trust Building Flow

The trust is built progressively through the scroll — not through a single element, but through the accumulation of signals:

```
TRUST BUILDING PROGRESSION
═══════════════════════════

STAGE 1: VISUAL TRUST (Hero)
  └── Extraordinary photography communicates quality
  └── "This place is beautiful and considered"

STAGE 2: PHILOSOPHICAL TRUST (Thesis)
  └── Brand voice communicates values
  └── "This place understands what I believe"

STAGE 3: SENSORY TRUST (Atmosphere)
  └── Immersive images communicate reality
  └── "This place is real and I want to be there"

STAGE 4: CRAFT TRUST (Service Chapters)
  └── Editorial work photographs communicate skill
  └── "These people are extraordinary at what they do"

STAGE 5: PERSONAL TRUST (Artisans)
  └── Portraits communicate humanity
  └── "These are real people I could trust"

STAGE 6: SOCIAL TRUST (Testimonials)
  └── Authentic voices communicate community
  └── "Real people love this place. I can too."

STAGE 7: CONFIDENCE (Booking Invitation)
  └── Radical simplicity communicates confidence
  └── "They have nothing left to prove. I'm ready."
```

---

## 7. HIERARCHIES

### 7.1 Content Hierarchy

The content follows a strict priority order that mirrors the visitor's information needs:

```
CONTENT HIERARCHY
═════════════════

TIER 1: EMOTIONAL CONTENT (must be extraordinary)
  ├── Hero image (the first impression)
  ├── Transformation Dissolve (the emotional peak)
  ├── Closing image (the lasting impression)
  └── Artisan portraits (the human connection)

TIER 2: NARRATIVE CONTENT (must be excellent)
  ├── Thesis statement (the brand's voice)
  ├── Service descriptions (the craft evidence)
  ├── Testimonials (the social proof)
  └── Gift section (the secondary path)

TIER 3: INFORMATIONAL CONTENT (must be clear)
  ├── Pricing (transparent, always visible)
  ├── Duration (helpful, always visible)
  ├── Contact information (accessible, always findable)
  ├── Operating hours (clear, consistent)
  └── Address (accurate, local SEO)

TIER 4: FUNCTIONAL CONTENT (must work perfectly)
  ├── Booking flow (frictionless, conversational)
  ├── Calendar and availability (accurate, real-time)
  ├── Error states (specific, helpful, branded)
  ├── Loading states (branded, not generic)
  └── Footer links (legal, social, practical)
```

### 7.2 Reading Hierarchy

The reading experience follows the scroll's narrative pacing:

```
READING HIERARCHY
═════════════════

ACT I (The Invitation):
  Reading: Minimal (thesis only, 15-20 words)
  Visual:  Dominant (hero image, atmospheric montage)
  Mode:    Visual absorption → brief reading → visual immersion

ACT II (The Experience):
  Reading: Moderate (service descriptions, artisan specialties, testimonials)
  Visual:  Strong but balanced with text
  Mode:    Alternating between visual and textual processing

ACT III (The Commitment):
  Reading: Minimal (booking headline, closing text)
  Visual:  Dominant (closing image)
  Mode:    Brief reading → decision → visual absorption

OVERALL: 80% visual, 20% textual across the complete experience
```

### 7.3 Mobile Hierarchy

The mobile experience prioritizes differently due to viewport constraints:

```
MOBILE CONTENT HIERARCHY
════════════════════════

1. Hero image (full viewport, maximum impact)
2. Thesis (typography, whitespace)
3. Atmosphere images (sequential, one at a time)
4. Service chapters (condensed, image-forward)
5. Artisan portraits (one at a time, full viewport)
6. Testimonials (stacked, generous spacing)
7. Booking CTA (prominent, always accessible)
8. Closing image (full viewport)
9. Footer (functional, condensed)

MOBILE-SPECIFIC RULES:
  ├── Touch targets: 44×44px minimum
  ├── Spacing between targets: 8px minimum
  ├── Single-column layout (no side-by-side)
  ├── Full-screen booking flow (no side panel)
  ├── Hamburger navigation (full-screen overlay)
  ├── 3D effects disabled if performance impacted
  └── Parallax reduced or disabled
```

### 7.4 Desktop Hierarchy

The desktop experience takes advantage of the wider viewport:

```
DESKTOP CONTENT HIERARCHY
═════════════════════════

1. Hero image (full viewport, maximum impact)
2. Thesis (centered typography, vast whitespace)
3. Atmosphere images (full-bleed, parallax depth)
4. Service chapters (editorial layouts, generous spacing)
5. Artisan portraits (gallery rhythm, generous whitespace)
6. Testimonials (stacked with generous spacing)
7. Booking section (radical simplicity)
8. Closing image (full viewport, maximum beauty)
9. Footer (4-column layout, comprehensive)

DESKTOP-SPECIFIC RULES:
  ├── Hover interactions active (warmth shifts, underline draws)
  ├── Booking flow slides in as right-side panel (40-50% viewport)
  ├── 3-column maximum grid (Rule CR8)
  ├── Maximum content width: 60-65% viewport
  ├── Full parallax depth (10-15% differential)
  └── 3D atmospheric effects active
```

---

## 8. CONTENT DEPENDENCY GRAPH

### 8.1 Data Dependencies

```
CONTENT DEPENDENCY MAP
═════════════════════

BRAND IDENTITY
  ├── Brand Mark / Logo ──────────→ Navigation, Footer, Loading
  ├── Color Palette ──────────────→ Everywhere
  ├── Typography ─────────────────→ Everywhere
  └── Photography Style ─────────→ All images

CONTENT DATA
  ├── Service Descriptions ───────→ Service chapters, Service pages, Booking flow
  ├── Service Pricing ────────────→ Service chapters, Service pages, Booking flow
  ├── Service Duration ───────────→ Service pages, Booking calendar
  ├── Artisan Profiles ───────────→ Artisan section, Booking flow, Service pages
  ├── Testimonials ───────────────→ Testimonial section
  ├── Operating Hours ────────────→ Footer, Booking calendar, Local SEO
  ├── Contact Information ────────→ Footer, Contact section
  ├── Address ────────────────────→ Footer, Local SEO, Schema markup
  └── Legal Documents ───────────→ Footer (Privacy, Terms)

BOOKING SYSTEM DATA
  ├── Service Catalog ────────────→ Booking Step 1
  ├── Artisan Catalog ────────────→ Booking Step 2
  ├── Availability Calendar ──────→ Booking Step 3
  ├── Time Slots ─────────────────→ Booking Step 4
  └── Booking Records ───────────→ Booking Step 6 (Confirmation)

EXTERNAL SERVICES
  ├── Email Service ──────────────→ Booking confirmation emails
  ├── SMS Service ────────────────→ Booking confirmation texts
  ├── Analytics Platform ─────────→ Event tracking
  └── Hosting / CDN ─────────────→ Performance
```

### 8.2 Content Creation Dependencies

```
CONTENT CREATION ORDER
═════════════════════

PHASE 1: FOUNDATION (must exist before anything else)
  1. Brand voice guidelines
  2. Typography system (font selection, loading strategy)
  3. Color palette (approved, finalized)
  4. Brand mark / logo

PHASE 2: PHOTOGRAPHY (must be completed for visual content)
  1. Hero image
  2. Atmospheric images (2-4)
  3. Service photography (Hair, Color, Bridal, Spa)
  4. Artisan portraits
  5. Client testimonials photography
  6. Closing image
  7. Gift section image

PHASE 3: COPYWRITING (must follow brand voice guidelines)
  1. Thesis statement
  2. Service descriptions (sensory, specific)
  3. Artisan specialty statements
  4. Testimonial selection and curation
  5. Booking flow copy
  6. Confirmation copy
  7. Footer copy
  8. SEO meta tags

PHASE 4: DATA (must be accurate and current)
  1. Service pricing
  2. Service duration
  3. Artisan availability
  4. Operating hours
  5. Contact information
  6. Legal documents
```

---

## 9. CONVERSION FLOW

### 9.1 Primary Conversion Flow

The primary conversion path — from visitor arrival to booking confirmation:

```
PRIMARY CONVERSION FLOW
═══════════════════════

ARRIVAL
  │
  ▼
THRESHOLD (1-3 seconds)
  │  Visitor arrives, warm background, atmospheric element
  │  Emotion: Anticipation
  │
  ▼
HERO (8-12 seconds)
  │  Visitor sees the extraordinary image
  │  Emotion: Awe
  │  Conversion signal: "This place is different"
  │
  ▼
THESIS (3-5 seconds)
  │  Visitor reads the brand's belief
  │  Emotion: Calm → Recognition
  │  Conversion signal: "They understand me"
  │
  ▼
ATMOSPHERE (10-15 seconds)
  │  Visitor immerses in the sensory world
  │  Emotion: Desire
  │  Conversion signal: "I want to be there"
  │
  ▼
SERVICES (40-60 seconds)
  │  Visitor sees the craft, the transformation, the tenderness
  │  Emotion: Curiosity → Longing → Tenderness → Relief
  │  Conversion signal: "They are extraordinary. I want that feeling."
  │
  ▼
ARTISANS (10-15 seconds)
  │  Visitor meets the people
  │  Emotion: Connection
  │  Conversion signal: "I know who I want to book with"
  │
  ▼
TESTIMONIALS (15-25 seconds)
  │  Visitor hears real voices
  │  Emotion: Trust
  │  Conversion signal: "Real people love this place"
  │
  ▼
BREATHING (8-12 seconds)
  │  Visitor processes and decides
  │  Emotion: Trust → Certainty
  │  Conversion signal: Internal decision made
  │
  ▼
BOOKING INVITATION
  │  Visitor encounters the simple invitation
  │  Emotion: Confidence
  │  Conversion signal: "I'm ready"
  │
  ▼
CTA CLICK
  │  Visitor clicks "Book your experience"
  │  Action: Booking Flow opens
  │
  ▼
BOOKING FLOW (60-120 seconds)
  │  Step 1: Service → Step 2: Artisan → Step 3: Date
  │  → Step 4: Time → Step 5: Contact → Step 6: Confirm
  │  Emotion: Ease → Confidence → Completion
  │
  ▼
CONFIRMATION
  │  Booking confirmed, details displayed
  │  Emotion: Completion → Anticipation
  │  Exit: Return to homepage or close
  │
  ▼
POST-BOOKING
  ├── Email confirmation sent
  ├── SMS confirmation sent (if opted in)
  └── Visitor carries the warmth with her
```

### 9.2 Secondary Conversion Flow

For visitors who don't book for themselves:

```
SECONDARY CONVERSION FLOW (GIFT)
════════════════════════════════

Same arrival → hero → thesis → atmosphere → services → artisans → testimonials flow

  │
  ▼
BOOKING INVITATION
  │  Visitor scrolls past (not ready to book for herself)
  │
  ▼
GIFT EXPERIENCE
  │  Visitor sees the gift option
  │  Emotion: Warmth
  │  Conversion signal: "I could give this to someone I love"
  │
  ▼
GIFT CTA CLICK
  │  Visitor clicks "Explore gift options"
  │  Action: Gift booking flow opens
  │
  ▼
GIFT FLOW
  │  Gift card / gift package selection
  │  Recipient details
  │  Payment
  │
  ▼
GIFT CONFIRMATION
  │  Gift sent to recipient
  │  Emotion: Generosity → Satisfaction
```

### 9.3 Tertiary Conversion Flow

For visitors who don't convert on first visit:

```
TERTIARY CONVERSION FLOW (RETURN)
═════════════════════════════════

FIRST VISIT:
  Arrival → Full scroll → Closing Image → Exit
  Memory: "That was the most beautiful thing I saw today"
  Action: Bookmark the page, remember the brand

RETURN VISIT:
  Direct URL or bookmark → Hero → Scroll to Booking → CTA Click
  Conversion signal: "I'm back. I'm ready."

REFERRAL VISIT:
  Word-of-mouth → URL → Full scroll → Booking
  Conversion signal: "My friend told me about this place"
```

---

## 10. INTERNAL LINKING STRATEGY

### 10.1 Link Architecture

```
INTERNAL LINK MAP
═════════════════

HOMEPAGE
  │
  ├── Navigation Links (anchor links to sections)
  │   ├── Services → Hair, Color, Bridal, Spa sections
  │   ├── Gallery → Atmosphere section (or Portfolio, V2)
  │   ├── Team → Artisans section
  │   ├── Contact → Footer
  │   └── Book → Booking Flow
  │
  ├── Section-to-Section (within scroll, no links needed)
  │   The scroll IS the internal link structure
  │
  ├── Service Section → Service Detail Page
  │   ├── Hair section → /services/hair
  │   ├── Color section → /services/color
  │   ├── Bridal section → /services/bridal
  │   └── Spa section → /services/spa
  │
  ├── Service Detail Page → Homepage
  │   └── "Back to experience" link
  │
  ├── Service Detail Page → Other Service Pages
  │   └── Related services (V2)
  │
  ├── Booking CTA → Booking Flow (overlay)
  │
  └── Footer → External Links
      ├── Instagram
      ├── Facebook
      ├── Privacy Policy
      └── Terms of Service
```

### 10.2 Link Rules

1. **No orphan pages.** Every page must be reachable from the homepage within 2 clicks maximum.
2. **No dead ends.** Every page has at least one path forward (booking, another page, or back to homepage).
3. **Consistent CTA.** "Book your experience" appears in the sticky navigation, the Booking Invitation section, each service detail page, and the footer.
4. **Breadcrumbs are unnecessary.** The single-page architecture makes breadcrumbs redundant. The navigation bar serves this purpose.
5. **External links open in new tabs.** The visitor never leaves our world unexpectedly.
6. **Anchor links use smooth scroll.** The transition between sections is gentle and considered.

### 10.3 SEO Link Strategy

```
SEO INTERNAL LINKING
═══════════════════

HOMEPAGE
  └── Links TO: /services/hair, /services/color, /services/bridal, /services/spa
  └── Receives links FROM: All service pages (via "Back to experience")

SERVICE PAGES
  └── Link TO: Homepage (back link)
  └── Link TO: /book (booking CTA)
  └── Receive links FROM: Homepage service sections

BOOKING FLOW
  └── Not indexable (overlay, not a page)

SCHEMA MARKUP
  └── LocalBusiness on all pages
  └── Service on each service page
  └── FAQPage on FAQ section (V2)
  └── Person on each artisan profile (V2)
```

---

## 11. FUTURE EXPANSION STRATEGY

### 11.1 Version 1 → Version 2 Expansion

```
V2 ARCHITECTURAL ADDITIONS
══════════════════════════

NEW PAGES:
  ├── Individual artisan profile pages (/artisans/[name])
  │   ├── Full biography
  │   ├── Portfolio gallery
  │   ├── Specialties and certifications
  │   └── Direct booking with this artisan
  │
  ├── Dedicated bridal micro-site or landing page (/bridal)
  │   ├── Wedding day timeline
  │   ├── Bridal package details
  │   ├── Consultation booking
  │   └── Bridal portfolio
  │
  └── Blog or editorial section (/journal) [if maintained]
      ├── Hair care tips
      ├── Behind-the-scenes stories
      ├── Seasonal trends
      └── Artisan spotlights

NEW SECTIONS (within homepage):
  ├── Editorial Portfolio Grid (between Artisans and Testimonials)
  ├── FAQ Section (between Testimonials and Booking)
  └── Map Integration (in Footer)

NEW FEATURES:
  ├── Language switcher (Arabic, French, English)
  ├── Returning client recognition
  ├── Calendar integration (add to Google/Apple Calendar)
  ├── Availability notifications
  └── Enhanced analytics dashboard
```

### 11.2 Version 2 → Version 3 Expansion

```
V3 ARCHITECTURAL ADDITIONS
══════════════════════════

NEW PAGES:
  ├── Product catalog (/products)
  │   ├── Product listings
  │   ├── Product detail pages
  │   └── E-commerce checkout
  │
  └── Membership / loyalty (/membership)
      ├── Membership tiers
      ├── Benefits overview
      └── Enrollment flow

NEW FEATURES:
  ├── AI-powered service recommendations
  ├── Virtual try-on (photo-based)
  ├── Video testimonials
  ├── Google/Trustpilot review integration
  ├── AI chatbot (multilingual, opt-in only)
  └── Client database and profiles

ARCHITECTURAL EVOLUTION:
  ├── Multi-page architecture consideration
  │   └── If content volume exceeds single-page capacity
  │   └── Homepage remains the primary experience
  │   └── Service pages become richer
  │   └── Artisan pages become standalone
  │
  └── Progressive Web App (PWA)
      └── Mobile home screen installation
      └── Offline content caching
      └── Push notifications for appointments
```

### 11.3 Version 3 → Version 4+ Expansion

```
V4+ ARCHITECTURAL VISION
════════════════════════

  ├── E-commerce maturity (full product sales)
  ├── AI scheduling optimization
  ├── Multi-location support (if brand expands)
  ├── Client portal (appointment history, preferences)
  ├── Integrated marketing (email campaigns, SMS)
  └── Advanced personalization (returning client experience)
```

### 11.4 Expansion Principles

Every future expansion must遵守 these principles:

1. **The homepage remains the primary experience.** No expansion should dilute or compete with the homepage's narrative architecture. The homepage is the film. Everything else is the extended universe.

2. **New pages serve deeper intent.** A new page exists only when a visitor's intent cannot be satisfied by the homepage or existing pages. "Would a visitor need this page to make a booking decision?" If no, it does not exist.

3. **The booking flow is sacred.** The booking flow's conversational, frictionless design must be preserved across all expansions. No feature should add friction to the booking path.

4. **Content freshness requires commitment.** Every new section, page, or feature that requires ongoing content must have a clear ownership plan. An abandoned section damages the brand more than no section.

5. **Performance is non-negotiable.** Every expansion must meet the same performance standards (LCP < 2.5s, CLS < 0.1, 3G usability). No feature justifies a performance regression.

6. **Accessibility is universal.** Every expansion must meet WCAG 2.1 AA compliance. No feature is exempt.

---

## 12. ARCHITECTURAL DECISIONS LOG

### Decision 1: Single-Page vs. Multi-Page

**Decision:** Single-page scroll for the homepage. Multi-page only for service detail pages and utility pages.

**Rationale:** The single-page architecture preserves narrative control, reduces cognitive load, and ensures every scroll position is on the path to conversion. The emotional architecture defined in EXPERIENCE_STORYBOARD.md requires sequential, controlled progression — which is only possible on a single page.

**Trade-off:** Service detail pages require separate URLs, which means the homepage must link to them. This creates a potential exit point from the narrative. Mitigated by making service pages optional depth, not required stops.

### Decision 2: Service Pages as Optional Depth

**Decision:** Service detail pages exist but are not required for the core journey. The homepage provides sufficient service information for most visitors.

**Rationale:** The homepage's service chapters provide the emotional and informational content needed for booking. Service detail pages serve visitors with deeper intent — those who want to investigate before committing. Making them optional preserves the single-page narrative while allowing depth.

**Trade-off:** Some visitors may miss the service pages entirely. Mitigated by making the homepage service chapters comprehensive enough to stand alone.

### Decision 3: Booking Flow as Overlay, Not Page

**Decision:** The booking flow slides in from the edge as an overlay. It does not redirect to a new page.

**Rationale:** A redirect would break the cinematic immersion. The overlay maintains the brand world — the visitor sees the page she was browsing while filling in her booking details. The transition from browsing to booking is seamless.

**Trade-off:** Overlay complexity is higher than a separate page. Mitigated by the booking flow being a contained, multi-step system with clear state management.

### Decision 4: No Blog in V1

**Decision:** No blog or content marketing section in Version 1.

**Rationale:** A blog requires ongoing content production that may not be maintained. An abandoned blog damages the brand more than no blog. The salon's content strategy is editorial photography and curated testimonials, not written articles.

**Trade-off:** Loss of SEO content opportunities. Mitigated by the service pages and homepage content providing sufficient SEO value. Blog can be added in V2 if content production commitment is established.

### Decision 5: No E-Commerce in V1

**Decision:** No product sales or e-commerce functionality.

**Rationale:** The salon sells experiences, not products. Adding e-commerce dilutes the luxury positioning. Product sales (retail haircare) can be added in V3 if the brand's e-commerce strategy is mature.

**Trade-off:** Loss of retail revenue stream. Mitigated by the salon's primary revenue being service-based, not product-based.

---

## 13. INFORMATION ARCHITECTURE VALIDATION

### 13.1 IA Health Checks

Before launch, the information architecture must pass these validation checks:

```
VALIDATION CHECKLIST
═══════════════════

STRUCTURE:
  ☐ Every page is reachable from the homepage within 2 clicks
  ☐ No orphan pages exist
  ☐ No dead-end pages exist (every page has a forward path)
  ☐ Navigation links all resolve to valid sections/pages
  ☐ Booking CTA is accessible from every page and section
  ☐ Footer contains all required information

CONTENT:
  ☐ Every section has a clear, singular purpose
  ☐ No section is redundant (its removal would leave a gap)
  ☐ Content hierarchy follows the defined priority order
  ☐ All required content is present in every section
  ☐ No section contains content that belongs elsewhere

NAVIGATION:
  ☐ Primary navigation works on all viewports (mobile, tablet, desktop)
  ☐ All anchor links resolve to the correct section
  ☐ Mobile navigation opens and closes correctly
  ☐ Active navigation state updates on scroll
  ☐ Booking CTA never becomes inaccessible

CONVERSION:
  ☐ Every conversion entry point leads to the booking flow
  ☐ Booking flow completes without errors
  ☐ Booking confirmation displays correctly
  ☐ Email/SMS confirmation sends correctly
  ☐ Error states display correctly for all failure modes

ACCESSIBILITY:
  ☐ All content is accessible via keyboard navigation
  ☐ All images have descriptive alt text
  ☐ Heading hierarchy is correct (H1 → H2 → H3, no skips)
  ☐ Focus indicators are visible on all interactive elements
  ☐ Screen reader can navigate the complete experience
  ☐ prefers-reduced-motion disables all animations

PERFORMANCE:
  ☐ LCP under 2.5 seconds
  ☐ CLS under 0.1
  ☐ All images optimized (WebP/AVIF)
  ☐ No layout shifts on page load
  ☐ 3G usability verified

SEO:
  ☐ Semantic HTML structure
  ☐ Meta tags and Open Graph tags present
  ☐ NAP consistency across website and external listings
  ☐ Schema markup implemented
  ☐ All pages have unique, descriptive titles
```

---

## 14. THE FINAL ARCHITECT'S NOTE

The information architecture of The Sovereign Artisor is not a sitemap. It is a narrative structure disguised as a sitemap. Every section exists because the story demands it. Every link has a purpose. Every hierarchy has been questioned. Every dependency has been mapped.

The architecture is invisible to the visitor — and that is exactly right. She does not think about the information architecture. She thinks about the experience. She thinks about the warmth. She thinks about the beauty. She thinks about the people she met and the transformation she imagined.

If she thinks about the architecture, the architecture has failed. If she feels that everything is exactly where it should be, the architecture has succeeded.

**The one thing to remember:**

The architecture serves the story. The story serves the visitor. The visitor is the main character. Every structural decision — every page, every link, every hierarchy — exists to make her journey from curiosity to commitment feel inevitable.

---

*This document is the structural blueprint of the digital experience. It should be consulted during site planning, during content strategy, during development, and during any conversation about adding, removing, or restructuring pages and sections. Every structural decision should be tested against the question: "Does this serve the visitor's journey?"*

*Document prepared: July 2026*
*Source documents: PRODUCT_VISION.md, COMPETITOR_RESEARCH.md, CREATIVE_DIRECTION.md, MOODBOARD.md, DESIGN_LANGUAGE.md, VISUAL_RULES.md, EXPERIENCE_STORYBOARD.md, SCROLL_STORY.md, EMOTIONAL_TIMELINE.md, INTERACTION_TIMELINE.md, SIGNATURE_MOMENTS.md, SECTION_PURPOSE.md, FEATURE_DEFINITION.md*
*Constraint: Information architecture only — no code, no design, no implementation*

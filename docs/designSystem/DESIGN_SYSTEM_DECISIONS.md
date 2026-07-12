# DESIGN_SYSTEM_DECISIONS.md
## Immutable Design Decisions — The Definitive Checklist

> "Every decision in this document is permanent until formally amended. These are the non-negotiable commitments of the design system. They are derived from the approved planning documents and represent the complete, immutable truth of this brand's visual identity."

---

## BRAND IDENTITY

- [ ] **Brand archetype:** The Sovereign Artisan — quietly authoritative, warm sophistication, sensorial intelligence, intentionally unhurried, culturally literate
- [ ] **Brand voice:** Warm, measured, editorial. Never urgent. Never loud.
- [ ] **Core values:** Sanctuary, Ritual, Presence, Stillness, Breath, Warmth, Glow, Artistry, Precision, Mastery
- [ ] **Target audience:** Women aged 25–40, urban professionals, beauty-savvy, willing to pay for quality
- [ ] **Emotional goal:** From the first pixel to the last — this brand earns trust, delivers beauty, and leaves the visitor longing for the experience
- [ ] **Primary conversion:** Online booking completion
- [ ] **Timelessness test:** Every design decision must pass: "Would someone in 2016 AND 2036 both think this is beautiful?"

---

## COLOR SYSTEM — Three Roles Only

- [ ] **Surface:** Warm off-white — creamy white, unbleached linen, NOT pure white (#FFFFFF)
- [ ] **Text:** Warm charcoal — deep, warm, NOT pure black (#000000)
- [ ] **Accent:** Muted gold — late afternoon sunlight hitting brass hardware. NOT yellow-gold. NOT rose-gold.
- [ ] **Warm undertones mandatory:** Every pixel carries warm undertones — amber, brown, cream
- [ ] **Shadows are warm-toned:** Brown-grey, never blue-grey
- [ ] **No additional chromatic roles:** No seasonal colors, no promotional colors, no fourth color
- [ ] **Gold used sparingly:** Interactive states, typographic accents, thin borders, micro-details. Never as a full background.
- [ ] **Hover states:** Luminosity shifts, NOT hue changes
- [ ] **Interactive color:** All buttons, all active states, all interactive accents use muted gold
- [ ] **Forbidden:** Pure white backgrounds, pure black text, cool grey, pastels, saturated primaries, rose gold

---

## TYPOGRAPHY — Two Families, Six Levels

- [ ] **Maximum two typeface families:** Serif for voice, sans-serif for function
- [ ] **Serif role:** Headlines, emotional moments, pull quotes — warm, editorial, magazine-like
- [ ] **Sans-serif role:** Body copy, navigation, UI elements, metadata — neutral but warm, humanist
- [ ] **Six-level hierarchy:** Display → Heading → Subheading → Body → Caption → Micro
- [ ] **No level skipping:** Display may be followed by Body as the sole exception
- [ ] **Weight decreases with size:** Larger text is heavier; smaller text is lighter
- [ ] **Line-height increases as size decreases**
- [ ] **Letter-spacing increases as size decreases**
- [ ] **Maximum line length:** 65–75 characters for body copy
- [ ] **Minimum body size:** 16px at any viewport
- [ ] **Headlines:** Title Case
- [ ] **Body copy:** Sentence case
- [ ] **Emphasis:** Italic weight, NOT underline. Underlines reserved for hyperlinks.
- [ ] **Pull quotes:** Serif typeface at 1.5–2× body size
- [ ] **Metadata:** Sans-serif typeface
- [ ] **ALL-CAPS:** Reserved for very short labels only (navigation items, section numbers), used sparingly
- [ ] **Maximum letter-spacing:** 0.15em
- [ ] **Forbidden:** Script fonts, decorative fonts, handwritten fonts, ALL-CAPS body copy

---

## SPACING — Five-Tier Scale

- [ ] **Tier 1 (Intimate):** Between tightly-coupled elements (label-value, image-caption)
- [ ] **Tier 2 (Personal):** Between related elements within a component (title-description)
- [ ] **Tier 3 (Social):** Between distinct elements within a section (heading-body, image-text)
- [ ] **Tier 4 (Formal):** Between sections of content (end of one service, start of the next)
- [ ] **Tier 5 (Public):** Between major page regions (hero to content, content to footer)
- [ ] **Breathing Principle:** Gap between elements > internal spacing of those elements
- [ ] **Vertical breathing:** Space above a headline ≥ space below it
- [ ] **Horizontal breathing:** Content never touches viewport edges
- [ ] **30% minimum negative space per viewport**

---

## GRID & LAYOUT

- [ ] **Content width:** 60–65% of viewport on desktop
- [ ] **Invisible architecture:** Grid lines are never visible
- [ ] **Alignment:** Center for hero moments, left for content, NEVER right-aligned body, NEVER justified
- [ ] **Baseline grid:** All vertical spacing derives from a consistent baseline rhythm
- [ ] **Desktop asymmetry:** Favor asymmetric compositions — large image + smaller text
- [ ] **Single-column mobile:** Single-column dominance on mobile
- [ ] **Baseline mobile:** 375px width minimum for all layouts

---

## BREAKPOINTS

- [ ] **Mobile:** 0–767px — single-column, touch-first
- [ ] **Tablet:** 768–1023px — transitional layout
- [ ] **Desktop:** 1024–1439px — full editorial layout with hover states
- [ ] **Wide:** 1440px+ — expanded desktop, proportional content width

---

## RADIUS

- [ ] **Radius-none (0px):** Full-bleed elements, sections
- [ ] **Radius-small (2–4px):** Form fields, small interactive elements
- [ ] **Radius-medium (6–8px):** Cards, buttons, containers
- [ ] **Radius-large (12–16px):** Large containers, modal dialogs
- [ ] **Radius-full (9999px):** Circular elements only
- [ ] **No custom radius values:** All corners use the defined scale
- [ ] **Maximum radius:** 16px (except radius-full). Values above this communicate playfulness.

---

## ELEVATION & SHADOWS

- [ ] **Shadow-none:** Full-bleed sections, flat elements
- [ ] **Shadow-subtle:** Cards at rest, form fields
- [ ] **Shadow-medium:** Cards on hover, dropdown menus
- [ ] **Shadow-elevated:** Modals, popovers, sticky elements
- [ ] **All shadows warm-toned:** Brown-grey, never blue-grey
- [ ] **Shadow changes, not border changes:** Interactive elements communicate state via shadow, not border

---

## BORDERS

- [ ] **No decorative borders between sections:** Separation comes from space
- [ ] **No card borders:** Cards are separated by spacing and background contrast
- [ ] **Form field borders:** Single-pixel warm-toned border in default state
- [ ] **Focus ring:** Gold accent, 2px minimum — always visible
- [ ] **Gold thin border (1px):** Permitted only on specific interactive elements
- [ ] **Borders are never decorative:** Functional borders only (focus, active, error, success)

---

## ICONOGRAPHY

- [ ] **Line-based icons:** Thin, consistent-weight strokes — not filled
- [ ] **Single-color:** Warm charcoal (default) or muted gold (interactive)
- [ ] **Minimum size:** 24×24px display size (not counting touch target)
- [ ] **Text labels mandatory** for navigation icons
- [ ] **No decorative icons:** Every icon communicates a specific concept
- [ ] **Weight matching:** Icons match the weight of surrounding typography
- [ ] **Brand icon follows separate guidelines**

---

## IMAGERY

- [ ] **All photography is original:** No stock. No AI-generated. No licensed third-party.
- [ ] **Six photography registers:** Atmospheric Portrait, Craft Close-Up, Environmental Still Life, Client Moment, Space Portrait, Detail Study
- [ ] **Warm color treatment:** All images share amber midtones, warm shadows, golden highlights
- [ ] **Consistent aspect ratios:** Hero (16:9 or wider), Service (4:3 or 3:2), Portrait (3:4 or 2:3), Detail (1:1)
- [ ] **No text over busy photography:** Text sits beside or below images
- [ ] **No hero carousels:** One hero image, composed perfectly
- [ ] **No hair-only photography:** Hair is always connected to a face
- [ ] **No over-retouched skin:** Pores, freckles, expression lines remain
- [ ] **Progressive image loading on mobile**
- [ ] **No hero image sliders**
- [ ] **No AI-enhanced photography** beyond standard color grading
- [ ] **Forbidden:** Stock photography, AI faces, blue-toned grading, harsh flash, wide-angle distortion, empty chairs, before-and-after grids

---

## MATERIALS

- [ ] **Material palette:** Aged brass (primary), unfinished wood, linen, warm-veined marble, terracotta, amber apothecary glass, botanicals
- [ ] **Real materials only:** Faux materials (faux marble, faux wood grain) are prohibited
- [ ] **No CGI-rendered materials:** Real materials, real light, real photography
- [ ] **Matte black metal:** Structural accent only, never primary material
- [ ] **Material references via photography,** not digital textures or CSS effects
- [ ] **Amber apothecary glass:** Signature material reference, appears in product photography and warm amber tones

---

## MOTION

- [ ] **Scroll-linked, not time-linked:** Animations tie to scroll position, not timers
- [ ] **Only exception:** Hero image reveal on initial page load (time-linked fade, 1200–1500ms)
- [ ] **Ease-out for entry:** Elements decelerate to rest
- [ ] **Ease-in for exit:** Elements accelerate away
- [ ] **Ease-in-out for state changes:** Symmetric transitions
- [ ] **No bouncing, no spring physics, no overshooting**
- [ ] **Maximum opacity change:** 0 to 1 (never starting at less than 0.8)
- [ ] **Maximum translation:** 30px vertical
- [ ] **Maximum reveal duration:** 600ms
- [ ] **Maximum hover scale:** 1.03
- [ ] **Parallax maximum:** 15–20% differential
- [ ] **Confirmation animation:** 800–1200ms
- [ ] **Hero reveal animation:** 1200–1500ms
- [ ] **Subtlety is standard:** Most visitors should not consciously notice the motion
- [ ] **Stillness is a choice:** Some sections have no animation at all
- [ ] **Forbidden:** Bouncing, rubber-banding, excessive parallax, text typing effects on long copy, auto-play video with sound, loading spinners, confetti, scroll-jacking, cursor-trailing on mobile, skeleton shimmer

---

## ACCESSIBILITY

- [ ] **Standard:** WCAG 2.1 Level AA minimum, aim for AAA where achievable
- [ ] **Text contrast:** Normal text 4.5:1 minimum (we achieve 7:1+), Large text 3:1 minimum
- [ ] **Keyboard accessible:** Every interactive element reachable via keyboard alone
- [ ] **Focus indicators:** Gold accent focus ring, 2px minimum, never removed
- [ ] **prefers-reduced-motion:** All motion disabled when active
- [ ] **No color-only communication:** Every color distinction has a secondary signal
- [ ] **Form labels:** All fields have associated labels (not placeholder text)
- [ ] **Error messages:** Specific and helpful — explain what and how
- [ ] **Screen reader landmarks:** Header, navigation, main, footer in landmark elements
- [ ] **No flashing content:** More than 3 flashes per second is an absolute prohibition
- [ ] **Alt text:** Descriptive and specific for meaningful images
- [ ] **Touch targets:** 44×44px minimum, 8px spacing
- [ ] **Content reflow:** 200% text zoom without horizontal scrolling
- [ ] **Heading levels:** Never skip (h1 → h2 → h3 is valid, h1 → h3 is not)
- [ ] **One h1 per page**

---

## DARK MODE (If Implemented)

- [ ] **Warm dark, never cold dark:** Deep warm charcoal background (brown-shifted), never blue-grey or navy
- [ ] **Text:** Warm off-white (not pure white #FFFFFF)
- [ ] **Gold accent:** Slightly brighter and warmer for dark mode contrast
- [ ] **Shadows:** Replaced with warm glow effects or border treatments
- [ ] **Photography:** Same warm color grading regardless of mode
- [ ] **Trigger:** `prefers-color-scheme: dark` + manual toggle
- [ ] **Transition:** Warm cross-fade (300–400ms)

---

## COMPONENTS

- [ ] **Service Card:** Primary component for service display
- [ ] **Artisan Profile:** Component for therapist/artisan profiles
- [ ] **Client Review:** Component for client testimonials with star ratings
- [ ] **CTA Button:** Three variants — Primary (gold accent), Secondary (outlined), Ghost (text only)
- [ ] **Navigation Link:** Top-level and sub-level variants
- [ ] **Section Header:** Numbered and unnumbered variants
- [ ] **Hero Section:** Image-based and video-based variants
- [ ] **Booking Flow:** Multi-step form experience
- [ ] **Gift Card:** Digital and physical variants
- [ ] **Footer:** Standard component

---

## STATES

- [ ] **Eight states:** Default, Hover, Focus, Active, Disabled, Loading, Error, Success
- [ ] **Default:** Full opacity, standard styling, warm palette
- [ ] **Hover:** Luminosity shift (200–300ms ease-in-out), no scale change
- [ ] **Focus:** Gold accent focus ring (2px minimum), always visible
- [ ] **Active:** Subtle inward press (0.97 scale, 100ms)
- [ ] **Disabled:** Reduced opacity (50–60%), no hover response, cursor: not-allowed
- [ ] **Loading:** Branded loading indicator or instant content, never generic spinner
- [ ] **Error:** Warm-toned error color (warm red-brown, not harsh red), specific message
- [ ] **Success:** Warm-toned success color, Warm Confirmation animation (800–1200ms)

---

## NAMING

- [ ] **Pattern:** `[Category]-[Variant]-[Modifier]`
- [ ] **Component names:** PascalCase
- [ ] **Variant separator:** Double-dash (`--`)
- [ ] **Modifier separator:** Single-underscore (`_`)
- [ ] **Singular names:** `ServiceCard`, not `ServiceCards`
- [ ] **Function over appearance:** `ArtisanProfile`, not `TeamMemberCard`
- [ ] **Cross-system consistency:** Design file names match code names exactly

---

## CONTENT

- [ ] **One Idea Per Viewport:** Each scroll position delivers exactly one clear idea
- [ ] **Visual-First, Text-Light:** Photography is primary; copy supports
- [ ] **Specific Over Generic:** "The gold dust from her fingertips" not "skilled service"
- [ ] **Sensory Over Technical:** "A silk-like finish that catches the light" not "long-lasting formula"
- [ ] **No keyword-stuffed copy**
- [ ] **No bullet-point service descriptions:** Service descriptions are narratives
- [ ] **Testimonials without names prohibited**
- [ ] **No marketing superlatives:** "best," "top-rated," "world-class" are prohibited
- [ ] **No discount language:** "affordable," "budget," "deal" are prohibited
- [ ] **No exclamation marks in brand copy**
- [ ] **No corporate buzzwords:** "synergy," "leverage," "cutting-edge" are prohibited
- [ ] **One h1 heading per page**
- [ ] **Testimonial count limit:** Max 3 on homepage, max 6 on about page
- [ ] **Service descriptions max:** 3–4 lines on cards

---

## PHOTOGRAPHY (Detailed)

- [ ] **No AI-generated or enhanced images** (beyond standard color grading)
- [ ] **No AI faces, limbs, hands, eyes, or composite figures**
- [ ] **No AI-generated salon interiors**
- [ ] **No AI-enhanced hair or skin textures**
- [ ] **No generic setups, stock-looking poses, or lifeless compositions**
- [ ] **No wide-angle distortion**
- [ ] **No harsh flash photography**
- [ ] **No blue-toned color grading**
- [ ] **No clinical before-and-after grids**

---

## PERFORMANCE

- [ ] **Progressive image loading:** Lightweight placeholder → full resolution
- [ ] **Deferred non-critical JavaScript**
- [ ] **Lazy loading below-fold imagery**
- [ ] **Image optimization:** Modern formats, appropriate sizes
- [ ] **Mobile shadows may be reduced** for performance
- [ ] **The experience is complete without animations**

---

## THE ANTI-PATTERN LIST

The following are absolute prohibitions. No exceptions. No "just this once."

### Visual
- [ ] No stock photography
- [ ] No AI-generated faces
- [ ] No pure black text (#000000)
- [ ] No pure white backgrounds (#FFFFFF)
- [ ] No cool grey
- [ ] No more than two typeface families
- [ ] No script, decorative, or handwritten fonts
- [ ] No ALL-CAPS body copy
- [ ] No text over busy photo backgrounds
- [ ] No decorative borders between sections
- [ ] No gradients as primary design element
- [ ] No faux materials

### Interaction
- [ ] No countdown timers or urgency tactics
- [ ] No pop-up overlays
- [ ] No auto-greeting chatbots
- [ ] No social media embeds
- [ ] No hero carousels >1 slide
- [ ] No image sliders
- [ ] No hidden pricing
- [ ] No bouncing or spring-physics effects
- [ ] No auto-play video with sound
- [ ] No scroll-jacking
- [ ] No confetti on confirmation

### Motion
- [ ] No parallax exceeding 15–20%
- [ ] No text typing effects on long copy
- [ ] No loading spinners
- [ ] No decorative particles
- [ ] No cursor-trailing on mobile
- [ ] No animations that block content interaction
- [ ] No animations that reverse on scroll-back
- [ ] No skeleton shimmer

### Content
- [ ] No keyword-stuffed copy
- [ ] No bullet-point service descriptions
- [ ] No anonymous testimonials
- [ ] No superlatives ("best," "top-rated," "world-class")
- [ ] No discount language ("affordable," "budget," "deal")
- [ ] No exclamation marks in brand copy
- [ ] No corporate buzzwords

---

*This document is the immutable checklist of all design decisions. Every decision herein is permanent until formally amended through a documented, intentional process. No team member may override, circumvent, or "creep" any decision in this document.*

*Document prepared: July 2026*
*Source: DESIGN_SYSTEM.md and all 15 approved planning documents*

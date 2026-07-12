# DESIGN_SYSTEM.md
## The Unified Design System

> "This document is the single source of truth for every visual, spatial, typographic, and interactive decision across the entire digital experience. It is derived from the approved planning documents — PRODUCT_VISION.md, CREATIVE_DIRECTION.md, DESIGN_LANGUAGE.md, VISUAL_RULES.md, MOODBOARD.md, COMPETITOR_RESEARCH.md, EXPERIENCE_STORYBOARD.md, SCROLL_STORY.md, EMOTIONAL_TIMELINE.md, INTERACTION_TIMELINE.md, SIGNATURE_MOMENTS.md, and SECTION_PURPOSE.md. All planning documents are treated as immutable. This design system does not question them — it synthesizes them."

---

## 1. DESIGN PRINCIPLES

### Why These Principles Exist

Design principles are the immutable DNA of the brand's visual identity. They exist because every design decision — from a 1px border to a full-viewport hero image — must trace back to a shared philosophy. Without principles, each page becomes an isolated exercise. With principles, every page is a chapter in the same book. These principles are not suggestions. They are the foundation upon which every token, every rule, and every component is built.

### The Eight Principles

**P1: Subtraction Over Addition.** Every element on the page must earn its place. The most powerful design decision is what you remove. If you cannot articulate precisely why something exists, it should not be there. Less is not less — it is the entire point.

**P2: One Idea Per Moment.** Each scroll position, each viewport, each section delivers exactly one clear idea. The visitor should never have to parse multiple competing elements simultaneously. A section that tries to say three things says nothing.

**P3: Restraint as Confidence.** Generous whitespace, limited color, typographic discipline, and minimal motion communicate that the brand knows exactly what it is. Only confident brands can afford whitespace. Every pixel of empty space is a declaration: "The product speaks for itself."

**P4: Visual-First, Text-Light.** Photography is the primary content. Copy supports the image; it does not compete with it. When a single photograph can convey the experience, no words are needed. When words are needed, they are few, considered, and beautiful.

**P5: Consistency as System.** Every page feels grown from a single seed. Consistent spacing, consistent type scale, consistent component behavior, consistent motion language. The visitor should never feel a seam.

**P6: Pacing as Rhythm.** Alternate between dense and sparse, fast and slow, visual and textual. The rhythm of the page should feel like breathing — inhale (absorb visual), exhale (read text). Never sustained monotony. Never sustained intensity.

**P7: The Peak-End Rule.** People judge experiences by their most intense moment and their ending. The hero section and the closing section must be the most considered, most beautiful, most emotionally resonant parts of the entire experience.

**P8: Authenticity Over Artifice.** Real photography of the real space, real therapists, real clients. No stock imagery. No generic setups. No AI-generated faces. Authenticity is the fastest path to trust, and trust is the fastest path to booking.

### When This Applies

Every design decision, every component specification, every animation timing, every copy choice. From the loading threshold to the footer. Without exception.

### When This Does Not Apply

Internal documentation, internal tools, or non-customer-facing interfaces. Even then, the principles inform — but do not dictate — the visual language of internal systems.

---

## 2. DESIGN TOKENS

### Why Tokens Exist

Design tokens are the atomic units of the design system — the named values that represent every visual property (color, spacing, typography, shadow, border). They exist because consistency cannot be maintained through manual application. Tokens ensure that every instance of a value is identical — a spacing value used in one component is the exact same value used in every other component. Tokens are the bridge between design intent and implementation reality.

### Token Categories

| Category | Purpose | Example |
|----------|---------|---------|
| **Color Tokens** | Named color values for surfaces, text, accents, and shadows | `color-surface`, `color-text`, `color-accent` |
| **Typography Tokens** | Named font families, sizes, weights, line-heights, and letter-spacings | `type-family-serif`, `type-size-body`, `type-weight-bold` |
| **Spacing Tokens** | Named spatial values that define all gaps, margins, and padding | `space-intimate`, `space-personal`, `space-social`, `space-formal`, `space-public` |
| **Border Tokens** | Named border widths, styles, and radii | `radius-none`, `radius-small`, `radius-medium` |
| **Shadow Tokens** | Named elevation values expressed as warm-toned box-shadows | `shadow-subtle`, `shadow-medium`, `shadow-elevated` |
| **Motion Tokens** | Named durations, easings, and transform values | `duration-fast`, `duration-medium`, `easing-out`, `ease-in-out` |
| **Breakpoint Tokens** | Named viewport widths that trigger layout changes | `breakpoint-mobile`, `breakpoint-tablet`, `breakpoint-desktop` |

### Token Naming Convention

Tokens follow a hierarchical naming pattern: `category-variant-property`

- `color-surface-primary` — the primary background color
- `color-text-primary` — the primary text color
- `spacing-section` — the spacing between sections
- `type-family-headline` — the serif typeface for headlines
- `duration-reveal` — the standard animation duration for content reveals

### Token Inheritance

Tokens are organized in a hierarchy. At the top are primitive tokens (raw values). Below are semantic tokens (purpose-driven names). Components reference semantic tokens, never primitives. This ensures that changing a primitive value cascades through the entire system.

### When This Applies

Every design specification, every component definition, every animation timing. Tokens are the language of the design system. All values are expressed as tokens.

### When This Does Not Apply

Photography art direction, copywriting tone, and emotional design decisions. These are qualitative, not quantitative — they cannot be reduced to tokens.

---

## 3. COLOR SYSTEM

### Why the Color System Exists

Color is the most emotionally immediate design element. The human brain processes color before it processes form, text, or motion. The color system exists to ensure that every chromatic decision — from a background to a text color to a shadow — communicates warmth, confidence, and considered restraint. The palette is not arbitrary. It is derived from the physical materials of the salon itself: the stone of the countertops, the warmth of the wood, the color of the linens, the gold of the fixtures, and the late afternoon light that fills the space.

### The Three-Role System

The palette has exactly three chromatic roles. No fourth role exists.

| Role | Description | Feeling |
|------|-------------|---------|
| **Surface** | A warm off-white — not the stark, blue-white of a hospital, but the creamy white of unbleached linen. The color of a freshly laundered towel held under warm light. | Clean but never clinical. Fresh but never sterile. |
| **Text** | A deep warm charcoal — not pure black (#000000), which reads as harsh and digital. Instead, a warm charcoal that carries the depth of wet earth or espresso beans. | Authoritative but never aggressive. Clear but never sharp. |
| **Accent** | One color — and only one. A muted, warm gold — not the yellow-gold of cheap jewelry, not the rose-gold of Instagram filters, but the actual tone of late afternoon sunlight hitting brass hardware. | Luxury expressed through warmth, not flash. |

### Color Rules

- **C1:** All colors carry warm undertones. Every surface, text, shadow, and accent is shifted toward warm (amber, brown, cream) rather than cool (blue, grey, green).
- **C2:** The accent color (muted gold) is used with extreme scarcity. It appears in interactive states, typographic accents, thin borders, and micro-details. It never appears as a full background, a massive headline, or a decorative gradient.
- **C3:** Text contrast meets WCAG AA minimum. Our palette achieves 7:1+ (AAA level) for warm charcoal on warm off-white.
- **C4:** No color appears that is not in the approved palette. No seasonal colors. No promotional colors. The palette is the palette.
- **C5:** Shadows are warm-toned. Every box-shadow carries warm undertones (brown-grey, not blue-grey).
- **C6:** Hover and interactive color shifts are luminosity changes, not hue changes. A button doesn't change from gold to red — it shifts from one warm luminosity to another.
- **C7:** The accent color on interactive elements is always gold. All buttons, all active states, all interactive accents use the same muted gold.

### Accent Usage Map

The gold appears the way a signature scent fills a room — pervasively but never overwhelmingly:

- In interactive states: hover color of booking button, active navigation item, link underline
- In typographic accents: the occasional word in a headline, a section number, a decorative rule
- In micro-details: a thin border on a card, the scrollbar color, a loading indicator
- In photography: the warm tones of golden-hour lighting, brass fixtures, warm skin tones

The gold **never** appears as: a full background color, a massive headline, a gradient, or a decorative element competing with photography.

### Forbidden Colors

| Color | Why It Is Forbidden |
|-------|---------------------|
| Pure white (#FFFFFF) | Clinical, sterile, blue-tinged on screens. Our background is warm off-white. |
| Pure black (#000000) | Harsh, aggressive, digital. Our text is warm charcoal. |
| Cool grey | Corporate default. Our neutrals carry warm undertones. |
| Pastels (millennial pink, lavender, mint) | Trend-dependent, era-specific. Our palette is timeless. |
| Saturated primary colors | Communicate energy and playfulness. Our palette is muted and warm. |
| Rose gold | Peaked as a trend. Our gold is timeless brass, not millennial rose. |

### When This Applies

Every pixel that carries color — backgrounds, text, borders, shadows, interactive states, image color grading, loading states, error states, success states.

### When This Does Not Apply

Photography art direction (which uses its own warm color grading guidelines), and third-party embeds (which may introduce their own colors — these should be contained within iframes or bounded regions).

---

## 4. TYPOGRAPHY SYSTEM

### Why the Typography System Exists

Typography is the voice of the design. Its hierarchy determines what the visitor reads first, what they read second, and what they skip. A well-designed typographic hierarchy creates a clear path for the eye: headline → subheadline → body → metadata. The typography system exists to ensure that this hierarchy is consistent across every page, every viewport, and every component — and that it communicates the brand's personality: warm, editorial, considered, and unhurried.

### Two Typeface Families

| Family | Role | Personality |
|--------|------|-------------|
| **Serif** | Voice: headlines, emotional moments, pull quotes | Warm, editorial, magazine-like authority. Slightly rounded serifs suggest craft, not machinery. |
| **Sans-serif** | Function: body copy, navigation, UI elements, metadata | Neutral but warm. Humanist proportions. Highly legible at small sizes. |

### The Six-Level Type Scale

| Level | Role | Weight | Line-Height | Letter-Spacing |
|-------|------|--------|-------------|----------------|
| **Display** | Hero headlines, section-openers | Semi-bold or Bold | 1.0–1.1× | Default or slightly tight |
| **Heading** | Section titles, service names | Regular or Semi-bold | 1.1–1.2× | Default |
| **Subheading** | Descriptions, introductions | Light or Regular | 1.3–1.4× | Default |
| **Body** | Primary content, narratives | Regular | 1.6–1.8× | Default |
| **Caption** | Image labels, service details, metadata | Light or Regular | 1.4–1.5× | Slightly loose |
| **Micro** | Timestamps, legal text, fine print | Light | 1.3–1.4× | Slightly loose |

### Typographic Rules

- **T1:** Two typeface families maximum. No exceptions.
- **T2:** The type scale has exactly six levels. No additional levels. No custom sizes.
- **T3:** No two consecutive levels may be skipped in sequence. Display may be followed directly by Body as the sole exception.
- **T4:** Weight decreases with size. Larger text is heavier; smaller text is lighter.
- **T5:** Line-height increases as size decreases.
- **T6:** Letter-spacing increases as size decreases.
- **T7:** Body copy maximum line length is 65–75 characters.
- **T8:** Body copy minimum font size is 16px at any viewport.
- **T9:** Headlines are Title Case. Body copy is Sentence case.
- **T10:** No text has letter-spacing wider than 0.15em.
- **T11:** No text uses underline for emphasis. Emphasis is communicated through italic weight. Underlines are exclusively for interactive hyperlinks.
- **T12:** Pull quotes use the serif typeface at 1.5–2× body size.
- **T13:** Metadata and captions use the sans-serif typeface.
- **T14:** ALL-CAPS is reserved for very short labels (navigation items, section numbers) at most — and even then, sparingly.

### Typography Anti-Patterns

- Decorative, script, or handwritten fonts
- More than two typeface families
- ALL-CAPS for body copy or service descriptions
- Center-aligned body copy
- Text over busy photographic backgrounds
- Drop shadows, outlines, or effects on text

### When This Applies

Every piece of rendered text — headlines, body copy, navigation labels, button labels, form labels, error messages, metadata, captions, legal text, pricing, testimonials.

### When This Does Not Apply

Third-party embedded content (iframes), system-level UI (browser chrome, OS dialogs), and brand mark/logo typography (which follows its own specifications).

---

## 5. SPACING SCALE

### Why the Spacing Scale Exists

Spacing is the invisible architecture of design. It is the silent majority of every composition — the space between elements that defines their relationship, creates hierarchy, and generates the feeling of considered design. The spacing scale exists because arbitrary spacing destroys consistency. When every gap is a different size, the layout becomes visually incoherent — even if the individual elements are well-designed. A defined scale ensures that every spatial relationship is deliberate, proportional, and consistent.

### The Five-Tier Scale

| Tier | Name | Role | When Used |
|------|------|------|-----------|
| **Tier 1** | Intimate | The smallest gap | Between tightly-coupled elements: label-value, image-caption, price-duration |
| **Tier 2** | Personal | A comfortable gap | Between related elements within a component: title-description, portrait-bio |
| **Tier 3** | Social | A noticeable gap | Between distinct elements within a section: heading-body, image-text block |
| **Tier 4** | Formal | A significant gap | Between sections of content: end of one service, start of the next |
| **Tier 5** | Public | The largest gap | Between major page regions: hero to content, content to footer |

### The Breathing Principle

- **The gap between two elements must be proportionally larger than the internal spacing of those elements.** If a text block has 1.6× line-height (internal spacing), the space before the next element is at minimum 4× that — creating clear visual separation.
- **Horizontal breathing:** Content never touches the viewport edge. Generous margins create a centered, considered composition.
- **Vertical breathing:** The space above a headline is equal to or greater than the space below it.
- **Component breathing:** Every component has internal padding that prevents content from touching its boundaries.

### Spacing Anti-Patterns

- Uniform spacing everywhere (destroys visual rhythm)
- Tight spacing to fit more content (communicates visual anxiety)
- Zero margin at viewport edges (communicates haste)
- Inconsistent spacing between similar elements (creates "something feels off")

### When This Applies

Every spatial relationship in the design — gaps between elements, padding within components, margins around content, spacing between sections, horizontal margins at viewport edges.

### When This Does Not Apply

Full-bleed photography (which extends to viewport edges by definition), and negative space compositions (which are intentionally non-uniform to create editorial tension).

---

## 6. GRID SYSTEM

### Why the Grid Exists

The grid is the invisible skeleton of every composition. It provides structure, alignment, and proportion without ever being visible. The grid exists because arbitrary placement destroys consistency across pages. When elements are positioned based on "it looks good here" without reference to a system, the result is inconsistency that the eye perceives as disorder — even when individual pages feel well-designed. The grid ensures that every placement derives from a consistent, invisible architecture.

### The Column System

| Viewport | Columns | Content Width | Margins |
|----------|---------|---------------|---------|
| **Desktop (1440px+)** | Generous column system | 60–65% of viewport | Substantial, symmetric |
| **Tablet (768–1439px)** | Adapted column system | Proportional to reading experience | Reduced, proportional |
| **Mobile (< 768px)** | Single column | Near-full viewport width with margins | Consistent horizontal margins |

### The Baseline Grid

All vertical spacing derives from a baseline rhythm — a consistent vertical increment that aligns all elements to an invisible horizontal grid. Headlines, body copy, images, and components all snap to this baseline, creating vertical alignment that the eye perceives as order and consistency.

### Alignment Rules

- **Center alignment** for hero moments, single-focus statements, and hero content. Communicates formality, importance, and singular focus.
- **Left alignment** for body copy, service descriptions, reviews, and informational content. Communicates readability, clarity, and editorial convention.
- **Never right-align** body text. Right-aligned text is difficult to read and creates visual disorientation.
- **Never justify** body text. Justified text creates uneven word spacing and rivers of whitespace.

### The Asymmetric Principle

Desktop layouts favor asymmetric compositions: large image paired with smaller text, wide portrait offset by generous negative space. Symmetry feels formal and stiff. Asymmetry feels considered and editorial. The eye is drawn through the composition by the weight of elements, not by their alignment.

### Grid Anti-Patterns

- Content stretching to full viewport width (unreadable line lengths)
- Mixed alignment within a single section
- Visible grid lines, borders, or dividers
- Arbitrary placement without reference to the grid

### When This Applies

Every layout on every page — homepage, service pages, about pages, booking flow, gift experience, confirmation page. The grid governs all spatial composition.

### When This Does Not Apply

Full-bleed photography (which intentionally breaks the grid to create atmospheric immersion), and the hero section (which may use a centered, non-columnar composition for maximum impact).

---

## 7. BREAKPOINTS

### Why Breakpoints Exist

Breakpoints define the viewport widths at which the layout adapts. They exist because the design must serve every device — from a 375px mobile phone to a 2560px ultrawide monitor — without compromising the brand experience. Breakpoints are not arbitrary; they are derived from the physical realities of how people hold, touch, and view screens. The design is mobile-first: it begins at the smallest viewport and expands gracefully, taking advantage of additional space without becoming sparse or disconnected.

### Breakpoint Definitions

| Token | Width | Description |
|-------|-------|-------------|
| `breakpoint-mobile` | 0–767px | Single-column, touch-first. The primary canvas. |
| `breakpoint-tablet` | 768–1023px | Transitional layout. Two-column compositions may appear. |
| `breakpoint-desktop` | 1024–1439px | Full editorial layout. Asymmetric compositions, multi-column grids, hover states. |
| `breakpoint-wide` | 1440px+ | Expanded desktop. Content width scales proportionally; margins grow. |

### Mobile-First Philosophy

Mobile is not a smaller version of desktop. Mobile is a different context — a different physical relationship between the user and the screen, a different mode of interaction (touch vs. cursor), and a different set of constraints. The mobile experience is designed natively for mobile:

- Single-column dominance
- Touch-first interaction (44×44px minimum targets)
- Content ruthlessly prioritized
- Thumb-zone optimization for critical interactive elements
- Performance as design (progressive image loading, deferred non-critical JavaScript)

### Desktop Enhancement Philosophy

Desktop is where the design language is expressed at its fullest — the widest canvas, the most generous composition, the most deliberate spatial relationships. Desktop adds:

- Asymmetric compositions (two-thirds/one-third splits)
- Hover states as enrichment (link underlines, card warmth, button luminosity)
- Multi-column service display
- More pronounced parallax effects (still subtle — maximum 15–20% differential)
- Richer scroll experience (pinned sections, wider spacing)

### When This Applies

Every layout, every component, every interaction. Responsive behavior is not optional — it is a core design requirement.

### When This Does Not Apply

Third-party embedded content (which may have its own responsive behavior), and system-level UI (browser chrome, OS dialogs).

---

## 8. RADIUS SYSTEM

### Why Radius Exists

Border radius is one of the most subtle yet emotionally impactful design properties. A sharp corner communicates precision, technology, and formality. A rounded corner communicates warmth, approachability, and organic form. The radius system exists to ensure that every corner radius across the design communicates the brand's personality: warm, considered, and human — not cold, mechanical, or overly playful.

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | Full-bleed elements, sections, elements where corners are not visible |
| `radius-small` | 2–4px | Subtle softening on form fields, small interactive elements |
| `radius-medium` | 6–8px | Cards, buttons, containers, moderate UI elements |
| `radius-large` | 12–16px | Large containers, modal dialogs, featured elements |
| `radius-full` | 9999px | Circular elements: avatars, round buttons, tags |

### Radius Rules

- **R1:** Radius values are limited to the defined scale. No custom values.
- **R2:** Cards and containers use `radius-medium`. The softness communicates warmth without becoming playful.
- **R3:** Buttons use `radius-small` or `radius-medium`. The slight rounding softens the interaction without undermining the button's authority.
- **R4:** Form fields use `radius-small`. The minimal rounding communicates precision while maintaining approachability.
- **R5:** Full-bleed sections and hero images use `radius-none`. The absence of rounding communicates editorial confidence.
- **R6:** Radius is never excessive. Values above 16px (except `radius-full` for circular elements) communicate playfulness — the opposite of our brand personality.

### When This Applies

Every component with visible corners — cards, buttons, form fields, modals, images in containers, tags, badges, avatars.

### When This Does Not Apply

Full-bleed sections, hero images without containers, text elements, and decorative elements that have no visible boundary.

---

## 9. ELEVATION & SHADOWS

### Why Elevation Exists

Elevation communicates spatial relationship — which elements sit above others, which elements are interactive, and which elements are at rest. In physical spaces, objects cast shadows that communicate their position in three-dimensional space. Our shadow system translates this into digital form — but with a critical constraint: our shadows are warm-toned, reflecting our palette's commitment to warmth. Cold, blue-grey shadows (the default of most design systems) would contradict our brand identity.

### Shadow Scale

| Token | Usage | Description |
|-------|-------|-------------|
| `shadow-none` | Flat elements, full-bleed sections | No shadow. The element rests at the baseline. |
| `shadow-subtle` | Cards at rest, form fields | A barely perceptible warm shadow. Communicates gentle lift — the element exists slightly above the surface. |
| `shadow-medium` | Cards on hover, dropdown menus | A noticeable warm shadow. Communicates interactive state or temporary elevation. |
| `shadow-elevated` | Modals, popovers, sticky elements | A prominent warm shadow. Communicates significant elevation — the element has been lifted for focused attention. |

### Shadow Rules

- **S1:** All shadows are warm-toned. Brown-grey, not blue-grey. The shadow color is derived from our surface palette, shifted toward warm.
- **S2:** Shadows are the primary method of communicating elevation. We do not use borders to separate layers — we use spatial depth.
- **S3:** Interactive elements use shadow changes (not border changes) to communicate state changes. A card on hover lifts via shadow deepening, not via border appearance.
- **S4:** Shadows never compete with content. If a shadow creates visual noise that distracts from the content, the shadow is reduced or removed.
- **S5:** On mobile, shadows may be reduced or eliminated to improve performance. The experience is complete without shadows.

### When This Applies

Interactive components (cards, buttons, dropdowns, modals), layered UI elements, and elements that need to communicate spatial depth.

### When This Does Not Apply

Full-bleed sections, background elements, decorative elements, and any element that should appear flat against the surface. Photography does not receive shadows.

---

## 10. BORDERS

### Why Borders Exist (And Why They Mostly Don't)

Borders are the most overused design element in digital interfaces — and the most counterproductive in an editorial, luxury context. Borders communicate structure, separation, and containment. In data-dense interfaces (dashboards, spreadsheets, forms), borders are essential. In editorial, content-driven experiences, borders communicate rigidity, visual noise, and a lack of confidence in spatial design.

Our design language uses **space** as the primary method of separation. Sections are separated by generous spacing, not by lines. Components are separated by proportional gaps, not by borders. The absence of visible structure IS the structure — it communicates: "This brand is so confident in its spatial design that it doesn't need visible boundaries."

### Border Rules

- **B1:** Decorative borders, rules, or dividers between sections are prohibited. Separation comes from space, not lines.
- **B2:** Card components have no visible border. Separation comes from spacing and background contrast.
- **B3:** Form fields use a single-pixel warm-toned border in their default state, transitioning to the accent gold on focus.
- **B4:** The accent gold may appear as a thin (1px) border on specific interactive elements — navigation underlines, active state indicators, focus rings.
- **B5:** Horizontal rules, when absolutely necessary for content separation within a text block, use a single-pixel warm-toned line with generous spacing above and below.
- **B6:** Borders are never decorative. If a border does not communicate a functional state (focus, active, error, success), it does not exist.

### When This Applies

Form fields (functional borders), focus rings (accessibility borders), active state indicators (interactive borders), and the rare content separator within dense text blocks.

### When This Does Not Apply

Cards, sections, content blocks, page regions, and any spatial composition where the design calls for separation. In those cases, the separator is **space** — always.

---

## 11. ICONOGRAPHY RULES

### Why Iconography Rules Exist

Icons are the visual shorthand of the interface — they communicate concepts, actions, and navigation at a glance. But in an editorial, content-driven experience, icons must be carefully constrained. Overly decorative, overly detailed, or overly playful icons would undermine the brand's typographic and photographic authority. The iconography system exists to ensure that every icon communicates with the same restraint, warmth, and clarity as every other design element.

### Icon Style

- **Line-based, not filled.** Our icons use thin, consistent-weight strokes — matching the weight of our lighter typographic elements. Filled icons feel heavy and corporate.
- **Single-color.** Every icon uses one color — either warm charcoal (default) or muted gold (interactive/accent). No multi-color icons. No gradient-filled icons.
- **Geometric and simplified.** No ornate, illustrative, or skeuomorphic icon styles. Simple geometric forms that communicate the concept at a glance.

### Icon Rules

- **IC1:** Icons are minimum 24×24px display size (not counting touch target). Below this, fine details collapse into illegibility.
- **IC2:** Icons always have a text label when used for navigation. Navigation icons (menu, booking, contact) always appear with their label. Icons without labels create ambiguity.
- **IC3:** Icons are not decorative. Every icon communicates a specific concept or function. Decorative icons (a flower next to "Spa Services") are removed.
- **IC4:** Icons match the weight of the surrounding typography. A bold headline paired with a hairline icon creates visual mismatch.
- **IC5:** Icons use the same color system as text — warm charcoal by default, muted gold for interactive states.
- **IC6:** The brand icon (logo mark) follows different rules than UI icons and is defined in the brand guidelines.

### When This Applies

Navigation elements, interactive controls, form indicators, status indicators, feature callouts, and any interface element where an icon communicates a concept.

### When This Does Not Apply

Decorative imagery, photography, illustrations, and any visual element that serves an aesthetic rather than functional purpose. Icons are functional; they are never ornamental.

---

## 12. IMAGERY RULES

### Why Imagery Rules Exist

Photography is the primary content of our design. It carries more emotional weight than any headline, more information than any description, and more persuasion than any call-to-action. When the photography is right, the design is 80% complete. When the photography is wrong, no amount of typographic or layout excellence can compensate. The imagery system exists to ensure that every photograph communicates the brand's visual identity: warm, authentic, editorial, and tactile.

### Photography Registers

| Register | Purpose | Composition |
|----------|---------|-------------|
| **Atmospheric Portrait** | Hero photography. Defines visual identity. | Subject at rule-of-thirds, generous negative space, selective depth of field. |
| **Craft Close-Up** | Expertise photography. Demonstrates skill. | Extreme close-up, razor-sharp on the point of contact, tactile detail. |
| **Environmental Still Life** | Atmosphere photography. Creates mood. | Objects arranged with intention, natural directional light, warm color palette. |
| **Client Moment** | Social proof photography. Builds trust. | Real clients in real moments, authentic, diverse, never posed. |
| **Space Portrait** | Environment photography. Shows physical salon. | Intimate views, actual lighting, implies human presence. |
| **Detail Study** | Quality photography. Communicates premium. | Extreme detail of materials and textures, macro-level sharpness. |

### Image Rules

- **I1:** Every image is original photography. No stock. No AI-generated. No licensed third-party.
- **I2:** All images share a consistent warm color treatment — amber midtones, warm shadows, golden highlights. No cool-toned grading.
- **I3:** Image aspect ratios are consistent per type: Hero (16:9 or wider), Service (4:3 or 3:2), Portrait (3:4 or 2:3), Detail (1:1).
- **I4:** Images are composed for their specific placement. Photography and layout are developed in parallel.
- **I5:** No image appears without narrative purpose. An image that exists only to "fill space" is removed.
- **I6:** No text overlays on busy photographic backgrounds. Text sits beside images, below images, or over solid/semi-transparent backgrounds.
- **I7:** Hero images are never cropped tight. Generous headroom, breathing room, and environmental context.
- **I8:** Client-facing images show faces. We never photograph the back of a head or an anonymous silhouette.
- **I9:** Skin is never over-retouched. Pores, freckles, expression lines, and natural texture remain.
- **I10:** No hair-only photography without a person. Hair is always connected to a face, a body, a person.
- **I11:** No hero image carousels or sliders. One hero image. Composed perfectly.
- **I12:** Photography is never AI-enhanced beyond standard color grading.
- **I13:** Image loading is progressive on mobile. A lightweight placeholder appears instantly; the full-resolution image replaces it.

### Photography Anti-Patterns

- Stock photography (catastrophic credibility cost)
- AI-generated faces (uncanny valley of beauty)
- Over-retouched skin (communicates insecurity)
- Wide-angle distortion (creates artificial sense of space)
- Harsh flash photography (destroys atmosphere)
- Blue-toned color grading (contradicts warm identity)
- Clinical before-and-after grids (we tell transformation stories, not comparison charts)
- Empty chairs (communicates absence)
- Image carousels and sliders (hide content, create uncertainty)

### When This Applies

Every photographic element in the design — hero images, service photography, artisan portraits, client moments, space portraits, detail studies, product photography, background textures.

### When This Does Not Apply

Illustrations, icons, and graphic elements. These follow their own rules (see Iconography and Design Tokens). Third-party embedded content (social media embeds, partner imagery) may introduce photography outside these rules — these should be contained within bounded regions.

---

## 13. GLASS / MATERIAL GUIDELINES

### Why Material Guidelines Exist

Our brand is material-referenced — its visual language draws from the physical materials of the salon itself. The material system exists to ensure that every material reference (brass, linen, marble, amber glass, terracotta, stone, botanicals) is used consistently and authentically. Faux materials, digital approximations, and trendy material treatments are prohibited because they contradict the brand's commitment to authenticity.

### The Material Palette

| Material | Communicates | Digital Expression |
|----------|--------------|-------------------|
| **Aged brass** | Heritage, warmth, time, beauty of use | Warm gold accent color, brass-toned interactive states, photography of real brass fixtures |
| **Unfinished wood** | Warmth, authenticity, craft, nature | Warm brown tones, wood-textured photography, warm shadow colors |
| **Linen** | Softness, natural luxury, breathability | Warm off-white surface color, linen-textured photography, gentle imperfection in composition |
| **Warm-veined marble** | Luxury without coldness, timelessness | Cream/amber tones, warm-veined photography, premium material references |
| **Terracotta** | Earthiness, Mediterranean warmth | Warm orange-brown tones, terracotta photography, grounded compositions |
| **Amber apothecary glass** | Trust, warmth, quality, heritage | Amber accent tones, apothecary-style product photography |
| **Botanicals** | Life, freshness, the natural world | Living plant photography, botanical ingredient references, organic compositions |

### Material Rules

- **M1:** If a material is referenced, it is the real material — or it is not referenced. Faux materials (faux marble, faux wood grain, faux leather textures) are prohibited.
- **M2:** CGI-rendered materials are prohibited. Real materials, real light, real photography.
- **M3:** Material references are communicated through photography, not through digital textures or CSS effects. We photograph brass; we do not simulate it with gradients.
- **M4:** The amber glass of apothecary bottles is our signature material reference. It appears in product photography and as a color reference for our warm amber tones.
- **M5:** Matte black metal is used sparingly as a structural accent — never as a primary material. It provides visual grounding without dominating the warm palette.

### Glassmorphism / Frosted Glass

Glassmorphism (frosted glass, blur effects, semi-transparent surfaces) is a trend-dependent visual treatment that has peaked in popularity. Our design language references physical materials through photography and color — not through CSS effects that simulate materials. Frosted glass effects may appear in limited, atmospheric contexts (e.g., a navigation overlay on mobile) but are never used as a primary design element at scale.

### When This Applies

Color palette decisions, photography art direction, material references in copy and imagery, product photography, spatial design references, and the overall sensory vocabulary of the brand.

### When This Does Not Apply

CSS-only material effects (simulated textures, digital gradients that mimic materials), icon design, and any context where the material reference would become the focal point rather than atmospheric support.

---

## 14. MOTION PRINCIPLES

### Why Motion Principles Exist

Motion serves content, never decorates it. Every animation exists to reveal, emphasize, or transition. If you removed all motion, the content would still be legible, beautiful, and well-structured. Motion is the difference between a printed editorial and a living one — but it is never the point. The motion principles exist to ensure that every animation communicates the brand's personality: unhurried, considered, and confident.

### The Five Laws of Motion

**Law 1: Scroll-Linked, Not Time-Linked.** Animations tie to scroll position, not to timers. The visitor controls the speed. Content does not auto-play. The only exception: the hero image reveal on initial page load, which uses a brief time-linked fade to create the threshold moment.

**Law 2: Ease and Weight.** Every element has apparent mass. Things do not snap into place — they arrive. Entry motions use ease-out (decelerate to rest). Exit motions use ease-in (accelerate away). State changes use ease-in-out (symmetric transition). Nothing bounces. No spring physics. No overshooting.

**Law 3: Subtlety Is the Standard.** Most visitors should not consciously notice the motion. They should notice the feeling — a sense that the experience is alive, responsive, and considered. If someone says "nice animation," the animation is too loud.

**Law 4: Progressive Revelation.** Content emerges gradually. Headlines reveal word by word. Images fade from slight opacity. Sections dissolve into one another. Nothing appears all at once. Nothing disappears abruptly.

**Law 5: Stillness as Choice.** Some sections have no animation at all — just pure, beautiful static composition. The contrast between motion sections and still sections creates rhythm. Silence is as important as sound.

### Motion Constraints

- Maximum opacity change: 0 to 1 (never starting at less than 0.8)
- Maximum translation distance: 30px vertical
- Maximum duration for content reveals: 600ms
- Maximum scale change on hover: 1.03
- Parallax maximum differential: 15–20%
- Confirmation animation is the longest: 800–1200ms
- Hero reveal animation: 1200–1500ms

### Motion Anti-Patterns (Absolute Prohibitions)

1. No bouncing, rubber-banding, or elastic spring effects
2. No parallax that induces dizziness
3. No text typing effects on long copy
4. No auto-playing video with sound
5. No loading spinners (branded loading moment or instant content)
6. No decorative particle effects, confetti, or fireworks
7. No scroll-jacking
8. No cursor-trailing effects on mobile

### When This Applies

Every animated element — content reveals, hover states, page transitions, scroll-linked animations, loading states, confirmation moments, and micro-interactions.

### When This Does Not Apply

Static content (text, images at rest), the booking flow's functional interactions (which prioritize speed over atmosphere), and any context where `prefers-reduced-motion` is active (all motion is disabled).

---

## 15. ACCESSIBILITY STANDARDS

### Why Accessibility Standards Exist

Accessibility is not a constraint on design — it is a quality standard. A design that works for everyone works better for everyone. Accessible design is not dumbed-down design; it is thoughtfully-designed design that considers the full range of human ability. Our accessibility standard is WCAG 2.1 AA compliance — the internationally recognized standard for digital accessibility. This is not a ceiling; it is a floor.

### The Accessibility Rules

- **AC1:** WCAG 2.1 Level AA is the minimum standard. We aim for AAA where achievable without compromising design.
- **AC2:** Color contrast meets or exceeds WCAG requirements. Normal text: 4.5:1 minimum (we achieve 7:1+). Large text: 3:1 minimum.
- **AC3:** All interactive elements are keyboard-accessible. Every button, link, form field, and interactive component can be reached and activated via keyboard alone.
- **AC4:** Focus indicators are visible and high-contrast. The focus ring uses our gold accent (2px minimum). It is never removed via `outline: none` without an equivalent alternative.
- **AC5:** `prefers-reduced-motion` is always respected. When active: all scroll-linked reveals become instant, all hover transitions become instant, all page transitions become instant. The experience is complete and satisfying without any motion.
- **AC6:** No information is conveyed through color alone. Every visual distinction that uses color also uses a secondary signal — text label, icon, position, or shape.
- **AC7:** All form fields have associated labels. Placeholder text is not a substitute for a label.
- **AC8:** Error messages are specific and helpful. They explain what went wrong and how to fix it.
- **AC9:** Page content is accessible via screen reader landmarks. Header, navigation, main content, and footer are wrapped in appropriate landmark elements.
- **AC10:** No content flashes more than three times per second. This is an absolute prohibition with no exceptions.
- **AC11:** Alternative text for meaningful images is descriptive and specific. Not "Image of a woman" but "A client examines her new balayage in the salon mirror, warm afternoon light catching the dimensional color."
- **AC12:** Touch targets meet or exceed 44×44px with 8px spacing. This applies to all interactive elements at all viewport widths.
- **AC13:** Content reflows at 200% text zoom. No horizontal scrolling. No content clipping.
- **AC14:** Heading levels never skip. h1 → h2 → h3 is valid. h1 → h3 is not.
- **AC15:** One `<h1>` heading per page. Only one.

### When This Applies

Every element of the design — every component, every interaction, every animation, every piece of content, every layout. Accessibility is not a separate concern; it is embedded in every design decision.

### When This Does Not Apply

Never. There is no context in which accessibility is optional.

---

## 16. DARK MODE PHILOSOPHY

### Why Dark Mode Philosophy Exists

Dark mode is not simply inverting colors. A well-designed dark mode requires a distinct emotional and chromatic philosophy — one that maintains the brand's identity while adapting to a low-light context. Our dark mode philosophy exists to ensure that if dark mode is implemented, it communicates the same warmth, confidence, and considered restraint as the light mode — and does not simply become a "dark theme" that loses the brand's personality.

### The Dark Mode Thesis

Our brand's identity is built on warmth — the warmth of late afternoon light, of aged brass, of unbleached linen. In dark mode, this warmth must be preserved. The dark mode is not "dark" in the way a nightclub is dark. It is "dark" in the way a candlelit room is dark — warm, intimate, enveloping. The darkness is the canvas; the warmth is the content.

### Dark Mode Color Mapping

| Light Mode Role | Dark Mode Role | Temperature |
|-----------------|----------------|-------------|
| Warm off-white surface | Deep warm charcoal surface | Warm, never blue-grey |
| Warm charcoal text | Warm off-white text | Warm, never pure white |
| Muted gold accent | Brighter, warmer gold accent | Increased luminosity for contrast |
| Warm shadows | Subtle warm glow (instead of shadows) | Warm edge lighting |

### Dark Mode Rules

- **DM1:** The dark background is warm charcoal — shifted toward brown, never toward blue. Cold dark backgrounds (navy, slate, blue-black) are prohibited.
- **DM2:** Text in dark mode is warm off-white — not pure white (#FFFFFF), which is harsh and fatiguing. The off-white maintains warmth.
- **DM3:** The gold accent becomes slightly brighter and warmer in dark mode to maintain contrast and visibility against the dark surface.
- **DM4:** Shadows are replaced with subtle warm glow effects or border treatments in dark mode. Shadows on dark surfaces are invisible; alternative elevation signals are required.
- **DM5:** Photography is not color-graded differently in dark mode. Images retain their warm treatment.
- **DM6:** Dark mode respects `prefers-color-scheme: dark` as the trigger, supplemented by a manual toggle.
- **DM7:** The transition between light and dark mode is animated with a smooth, warm-toned cross-fade (300–400ms).

### When This Applies

If and when dark mode is implemented across the site. Dark mode is not currently a primary requirement but the philosophy is defined here to ensure future implementation consistency.

### When This Does Not Apply

Photography (which maintains its own warm color grading regardless of mode), third-party embeds (which may not support dark mode), and system-level UI (browser chrome, OS dialogs).

---

## 17. COMPONENT NAMING CONVENTIONS

### Why Naming Conventions Exist

A design system is only as maintainable as its vocabulary. When every team member refers to the same component by the same name, communication is efficient, documentation is clear, and implementation is consistent. Naming conventions exist to eliminate ambiguity — when someone says "Service Card," everyone knows exactly which component is being discussed, what it looks like, what it does, and where it appears.

### Component Naming Pattern

Components are named using a `[Category]-[Variant]-[Modifier]` pattern:

| Pattern Element | Purpose | Examples |
|----------------|---------|---------|
| **Category** | The base component type | `Card`, `Button`, `Navigation`, `Section`, `Form` |
| **Variant** | The functional variant within the category | `Card--Service`, `Card--Artisan`, `Card--Review` |
| **Modifier** | A visual or behavioral modification | `Button--Primary`, `Button--Secondary`, `Button--Ghost` |

### Component Inventory

| Component Name | Category | Variants |
|---------------|----------|----------|
| **Service Card** | Card | Service, Color, Bridal, Spa, Facial, Nails |
| **Artisan Profile** | Card | Portrait (with availability) |
| **Client Review** | Card | Star-rated, Quote-only |
| **CTA Button** | Button | Primary (gold accent), Secondary (outlined), Ghost (text only) |
| **Navigation Link** | Navigation | Top-level, Sub-level |
| **Section Header** | Section | Numbered, Unnumbered |
| **Hero Section** | Section | Image, Video |
| **Booking Flow** | Form | Multi-step |
| **Gift Card** | Card | Digital, Physical |
| **Footer** | Section | Standard |

### Naming Rules

- **N1:** Component names are PascalCase (e.g., `ServiceCard`, `ArtisanProfile`, `ClientReview`).
- **N2:** Variants use double-dash separator (e.g., `Button--Primary`, `Card--Service`).
- **N3:** Modifiers use single-underscore separator (e.g., `Card--Service_Large`).
- **N4:** Component names are singular, not plural (e.g., `ServiceCard`, not `ServiceCards`).
- **N5:** Names describe function, not appearance (e.g., `ArtisanProfile`, not `TeamMemberCard`).
- **N6:** Names are consistent across design files and code. The design file component name matches the code component name exactly.

### When This Applies

Every component in the design system, every component in the codebase, every reference to a component in documentation, design reviews, and team communication.

### When This Does Not Apply

Page-level templates (which are composed of multiple components), content types (which are data structures, not design components), and third-party components (which follow their own naming conventions).

---

## 18. STATE PHILOSOPHY

### Why State Philosophy Exists

Every interactive element exists in multiple states — default, hover, focus, active, disabled, loading, error, success. Without a defined state philosophy, each element invents its own state behavior, creating inconsistency. The visitor learns one interaction language and applies it everywhere. If one button behaves differently from another, the visitor's confidence in the interaction language erodes. The state philosophy ensures that every interactive element communicates the same emotional quality in every state.

### The Eight States

| State | Purpose | Emotional Quality | Visual Treatment |
|-------|---------|-------------------|-----------------|
| **Default** | The element at rest. Not being interacted with. | Quiet confidence. Present but not demanding. | Full opacity, standard styling, warm palette applied. |
| **Hover** | The element acknowledges the visitor's attention. | Warmth. "I see you. I am here." | Luminosity shift (200–300ms ease-in-out). No scale change. |
| **Focus** | The element is keyboard-navigated to. | Accessibility. "You can reach me." | Gold accent focus ring (2px minimum). Always visible. |
| **Active** | The element is being pressed/clicked. | Commitment. "Your action has been received." | Subtle inward press (0.97 scale, 100ms). Returns to default on release. |
| **Disabled** | The element is present but not interactive. | Patience. "Not yet." | Reduced opacity (50–60%). No hover response. Cursor: not-allowed. |
| **Loading** | The element is processing an action. | Processing. "I am working on it with care." | Branded loading indicator or content replacement. Never generic spinner. |
| **Error** | The element's state is invalid. | Helpfulness. "Here is what happened and how to fix it." | Warm-toned error color (not aggressive red). Specific error message. |
| **Success** | The element's action completed successfully. | Satisfaction. "Your action was completed beautifully." | Warm-toned success color. Calm confirmation animation. |

### State Rules

- **ST1:** All states use warm-toned colors. Error states use warm red-brown (not harsh red). Success states use warm green-gold (not clinical green).
- **ST2:** State transitions are animated with consistent timing (200–300ms for hover/focus, 100ms for active).
- **ST3:** Disabled elements are visible, not hidden. They remain in the layout at reduced opacity.
- **ST4:** Focus indicators are never removed. Keyboard accessibility is non-negotiable.
- **ST5:** Loading states use our branded animation or instant content appearance. Never generic spinners. Never shimmer skeletons.
- **ST6:** Error states are specific and helpful. "This field is required" is acceptable. "Invalid input" without context is not.
- **ST7:** Success states use the Warm Confirmation animation — our signature interaction expressed at its most generous timing (800–1200ms).

### When This Applies

Every interactive element — buttons, links, form fields, navigation items, cards, toggles, dropdowns, modals, and any element that responds to user input.

### When This Does Not Apply

Static content (text, images at rest), decorative elements, and any element that does not respond to user interaction.

---

## 19. CONSISTENCY RULES

### Why Consistency Rules Exist

Consistency is the invisible thread that ties every page, every section, and every component into a single, coherent brand experience. Without consistency, each page is an isolated design exercise. With consistency, every page is a chapter in the same book. The consistency rules exist because human perception is exquisitely sensitive to inconsistency — the eye detects it even when the mind cannot articulate it. Two service cards with different padding, two pages with different spacing rhythms, two buttons with different hover timings — each inconsistency erodes the visitor's confidence in the brand.

### The Six Consistency Rules

**Rule 1: Structural Consistency.** Every page follows the same structural pattern: header → hero/intro → content sections → booking CTA → footer. The specific content varies, but the skeleton is consistent.

**Rule 2: Typographic Consistency.** The type scale is applied identically across all pages. A Level 2 heading is the same size, weight, and spacing on every page.

**Rule 3: Spacing Consistency.** The spacing scale is applied consistently across all pages. The gap between a heading and its body text is the same everywhere. The gap between sections is the same everywhere.

**Rule 4: Component Consistency.** Every instance of a component type is visually identical. Service cards on the homepage look exactly like service cards on the services page.

**Rule 5: Color Consistency.** The color palette is applied identically across all pages. No page introduces a new color, a new gradient, or a new background treatment.

**Rule 6: Motion Consistency.** The animation library is applied identically across all pages. A section reveal animates the same way everywhere. A hover response behaves the same way everywhere.

### Consistency Anti-Patterns

- "This page is special" syndrome (every page follows the same rules)
- Seasonal/theme exceptions (seasonal content exists within the same framework)
- "Brand refresh" creep (every design decision is measured against the system)
- Inconsistent spacing between identical structures
- Inconsistent animation timing across similar components
- Inconsistent component behavior across pages

### When This Applies

Every page, every component, every interaction, every animation. Consistency is the system's integrity — without it, the design system is merely a collection of suggestions.

### When This Does Not Apply

The hero section (which is intentionally unique on each page to create the threshold moment), and the booking flow (which has its own distinct interaction language optimized for conversion).

---

## 20. ANTI-PATTERNS

### Why Anti-Patterns Exist

Anti-patterns are the specific design decisions, interaction patterns, and visual treatments that are **absolutely prohibited** — not because they are inherently bad, but because they contradict the brand's values, undermine the design system's integrity, or break the emotional contract with the visitor. Anti-patterns exist because knowing what NOT to do is as important as knowing what to do. They are the boundaries of the system — the lines that, once crossed, transform the brand from what it is into something it is not.

### Visual Anti-Patterns

| # | Anti-Pattern | Why It Is Prohibited |
|---|-------------|---------------------|
| V1 | Stock photography | Every stock image is a stolen moment from someone else's brand. Authenticity is non-negotiable. |
| V2 | AI-generated faces | AI-generated beauty is an oxymoron. Beauty is real. Our images must be too. |
| V3 | Pure black text (#000000) | Harsh, clinical, digital. Our text is warm charcoal. |
| V4 | Pure white backgrounds (#FFFFFF) | Clinical, sterile. Our backgrounds are warm off-white. |
| V5 | Cool grey neutrals | Corporate default. Our neutrals carry warm undertones. |
| V6 | More than two typeface families | Visual noise. Two create harmony. |
| V7 | Script, decorative, or handwritten fonts | The most overused "luxury" cliché in salon branding. We differentiate by refusing. |
| V8 | ALL-CAPS for body copy | Reads as shouting. Our voice is warm and measured. |
| V9 | Text over busy photographic backgrounds | Destroys legibility and communicates poor design consideration. |
| V10 | Decorative borders, rules, or dividers between sections | Separation comes from space, not lines. Borders communicate spreadsheets, not editorial. |
| V11 | Gradients as primary design element | Trend-dependent. Our design is built on solid, warm tones. |
| V12 | Faux materials (faux marble, faux wood grain) | Faux materials are lies. Our brand is built on authenticity. |
| V13 | Over-retouched skin | Over-retouching communicates insecurity. Authentic skin communicates confidence. |

### Interaction Anti-Patterns

| # | Anti-Pattern | Why It Is Prohibited |
|---|-------------|---------------------|
| I1 | Countdown timers or urgency tactics | Urgency is the opposite of our brand. We attract through quality; we never chase through pressure. |
| I2 | Pop-up overlays that interrupt browsing | Pop-ups communicate "our needs are more important than your experience." |
| I3 | Auto-greeting chatbots | Auto-greeting communicates desperation, not confidence. |
| I4 | Embedded social media feeds | The website IS the experience. Social media supports the website. |
| I5 | Hero carousels with more than one slide | Carousels hide content and communicate indecision. |
| I6 | Image sliders or carousels for content | Content is displayed once, composed perfectly. Not hidden behind "swipe to see more." |
| I7 | Hidden pricing behind "contact us" | Hiding prices communicates insecurity. Pricing is transparent and unapologetic. |
| I8 | Bouncing, rubber-banding, or spring-physics effects | Playful, not premium. Our elements have weight and precision. |
| I9 | Auto-playing video with sound | The single most hostile thing a website can do. |
| I10 | Scroll-jacking | Breaks the most fundamental web interaction. Never acceptable. |
| I11 | Confetti or celebration animations on confirmation | The confirmation is calm, beautiful, and satisfying — not a party. |
| I12 | Skeleton loading screens with shimmer | Generic pattern. Our loading experience is designed, not defaulted. |
| I13 | Onboarding tutorials or walkthrough overlays | If a tutorial is needed, the interface has failed. |

### Motion Anti-Patterns

| # | Anti-Pattern | Why It Is Prohibited |
|---|-------------|---------------------|
| M1 | Parallax effects exceeding 15–20% differential | Induces dizziness. Depth should be felt, not seen. |
| M2 | Text typing effects on long copy | Readability first, always. |
| M3 | Loading spinners | A luxury brand does not use the same loading indicator as every other website. |
| M4 | Decorative particle effects, confetti, or fireworks | Motion is communication, not celebration. |
| M5 | Cursor-trailing effects on mobile | Desktop-only interaction. On mobile, rely on native touch feedback. |
| M6 | Animations that block content interaction | The visitor always has control. Always. |
| M7 | Animations that reverse on scroll-back | The narrative is forward-moving. Backward scrolling is for review. |

### Content Anti-Patterns

| # | Anti-Pattern | Why It Is Prohibited |
|---|-------------|---------------------|
| C1 | Keyword-stuffed copy | Content written for search engines, not humans. |
| C2 | Bullet-point lists for service descriptions | Service descriptions are narratives, not inventories. |
| C3 | Testimonials without names | Anonymous testimonials communicate doubt, not trust. |
| C4 | Marketing superlatives ("best," "top-rated," "world-class") | Unsubstantiated superlatives communicate insecurity. |
| C5 | Discount language ("affordable," "budget," "deal") | We compete on experience, never price. |
| C6 | Exclamation marks in brand copy | The most luxurious brands speak quietly. |
| C7 | Corporate buzzwords ("synergy," "leverage," "cutting-edge") | We are artisans, not corporations. |

### When Anti-Patterns Apply

Every design decision, every component specification, every animation timing, every copy choice, every photography selection, every interaction behavior. These prohibitions are absolute — no exceptions, no "just this once."

### When Anti-Patterns Do Not Apply

Internal documentation, internal tools, or non-customer-facing interfaces — where the brand's visual standards are informed but not strictly enforced. Even then, the anti-patterns serve as guidelines for maintaining brand consistency across all touchpoints.

---

## THE DESIGN SYSTEM SYNTHESIS

### The Five Words

If the entire design system must be compressed into five words:

**Warm · Restrained · Considered · Editorial · Enduring**

Every design decision — every pixel, every proportion, every animation, every word — should feel warm (never cold), restrained (never cluttered), considered (never arbitrary), editorial (never commercial), and enduring (never trendy).

### The One-Sentence Summary

Our design system is the visual equivalent of a well-designed room: everything has a reason, nothing is accidental, and the feeling of the space is greater than the sum of its parts.

### The Timelessness Test

Before any design decision is made, apply this test:

**"If I showed this design to someone in 2016 and someone in 2036, would both of them think it is beautiful?"**

If yes — the decision is timeless. Proceed.
If the 2016 person would think it is "futuristic" or the 2036 person would think it is "dated" — the decision is trend-dependent. Reconsider.

---

*This design system is the unified specification for the brand's visual identity. It is derived from all approved planning documents and supersedes individual document preferences when conflicts arise. It is reviewed quarterly and updated only through a formal amendment process.*

*Document prepared: July 2026*
*Sources: All 15 approved planning documents*
*Constraint: Design system only — no code, no implementation details*

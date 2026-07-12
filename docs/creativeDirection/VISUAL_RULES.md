# VISUAL_RULES.md
## The Constitution of Our Visual System

> "This document is the final authority. If a design decision contradicts these rules, the design is incorrect. No exceptions. No workarounds. No 'just this once.'"

---

## DOCUMENT PURPOSE

This is the constitution. Not a guideline. Not a suggestion. Not a "best practices" document. This is the set of laws that govern every visual decision across the entire digital presence — every page, every component, every animation, every pixel.

**How to use this document:**

- During design reviews, every proposed element is measured against these rules
- During development, every implementation is verified against these rules
- During content creation, every piece of copy is checked against these rules
- When disputes arise, this document is the final arbiter
- When a rule seems inconvenient, it is still followed — the inconvenience is the point

**Relationship to other documents:**

- PRODUCT_VISION.md → Why we exist (strategy)
- CREATIVE_DIRECTION.md → What we feel like (artistry)
- MOODBOARD.md → What we reference (inspiration)
- DESIGN_LANGUAGE.md → How we compose (structure)
- **VISUAL_RULES.md → What we must and must not do (law)**

---

## THE ABSOLUTE RULES

### Things We Always Do

These are non-negotiable. Every design must include these. Omission is a violation.

| # | Rule | Reason |
|---|------|--------|
| A1 | **Warm color temperature across all elements.** Every background, every text color, every accent, every shadow carries warm undertones. No cool, no blue, no neutral-grey-without-warmth. | Our palette IS warmth. A cool element in our system is a contradiction. |
| A2 | **Generous whitespace around every content element.** No content element touches another without a proportional gap. The minimum gap between distinct elements is always visually significant. | Whitespace is our luxury signal. Compressed space is our enemy. |
| A3 | **Consistent type scale across all pages.** The six-level hierarchy (Display → Micro) is applied identically on every page. No page introduces a new scale or overrides an existing level. | Inconsistent type hierarchy creates visual chaos and destroys brand coherence. |
| A4 | **Photography is original and authentic.** Every image is a real photograph of the real salon, real artisans, and real clients. No stock. No AI-generated. No third-party imagery. | Authenticity is our credibility. Stock photography is a lie. |
| A5 | **Every interactive element has a visible hover/focus state.** Buttons, links, navigation items, and form fields all respond to hover (desktop) and focus (keyboard). The response communicates interactivity. | Interactive elements without visual feedback feel broken and inaccessible. |
| A6 | **Focus indicators are always visible.** Keyboard-navigated elements show a clear focus ring (our gold accent, minimum 2px). Focus is never removed via outline:none without providing an alternative. | Accessibility is not optional. Keyboard users must be able to navigate. |
| A7 | **Every page has one `<h1>` heading.** Only one. The h1 is the page's primary heading and is never used for decorative or secondary text. | Screen readers and assistive technologies depend on correct heading hierarchy. |
| A8 | **Heading levels never skip.** h1 → h2 → h3 is valid. h1 → h3 is not. Every heading level nests under its parent without gaps. | Heading hierarchy is the structural skeleton of content accessibility. |
| A9 | **Touch targets are minimum 44×44px.** Every tappable element (button, link, nav item, form field) meets or exceeds this size. Spacing between adjacent targets is minimum 8px. | Motor accessibility requires targets large enough for all finger sizes. |
| A10 | **Content reflows at 200% text zoom.** No horizontal scrolling occurs. No content is clipped. Layouts adapt gracefully to enlarged text. | Users with low vision must be able to zoom without losing access to content. |
| A11 | **Meaningful images have descriptive alt text.** Alt text communicates the image's content and purpose in the brand voice. Decorative images have empty alt attributes. | Screen reader users must have equivalent access to visual content. |
| A12 | **The booking CTA is always accessible.** From any point on any page, the visitor can reach the booking flow within one interaction. No dead-ends. No content-only pages without a booking path. | Booking is the primary conversion. Every path must lead there. |
| A13 | **Every design decision is documented.** When a creative choice is made that could be questioned, the reasoning is recorded. "Because it looks nice" is not reasoning. | Unrecorded decisions become inconsistencies. Documented decisions become brand standards. |

---

### Things We Never Do

These are absolute prohibitions. Inclusion in a design is a violation. No exceptions. No "just this once."

| # | Rule | Reason |
|---|------|--------|
| N1 | **Never use stock photography.** Not for hero images. Not for blog posts. Not for social proof. Not for team photos. Not for "placeholder" during development. | Every stock image is a stolen moment from someone else's brand. We create our own moments. |
| N2 | **Never use AI-generated faces or images.** No Midjourney. No DALL-E. No Stable Diffusion. No "enhanced" AI outputs. Every face is a real human being. | AI-generated beauty is an oxymoron. Beauty is real. Our images must be too. |
| N3 | **Never use pure black (#000000) for text.** Our text color is warm charcoal — shifted toward brown. Pure black is harsh, clinical, and digital. | Pure black reads as aggressive. Our voice is confident but warm. |
| N4 | **Never use pure white (#FFFFFF) for backgrounds.** Our backgrounds are warm off-white — shifted toward cream or paper. Pure white is clinical, sterile, and blue-tinged on screens. | Pure white is a hospital, not a sanctuary. Our warmth starts with the background. |
| N5 | **Never use cool grey as a neutral.** Every grey in our system carries warm undertones — shifted toward brown, taupe, or stone. | Cool grey communicates "corporate default." Our neutrals are warm and considered. |
| N6 | **Never use more than two typeface families.** One serif for voice (headlines, emotional moments). One sans-serif for function (body, navigation, UI). That is the complete typographic vocabulary. | More than two typefaces create visual noise. Two create harmony. |
| N7 | **Never use script, decorative, or handwritten fonts.** Not for headlines. Not for accents. Not for "personality." Our typography is editorial, not ornamental. | Script fonts are the most overused "luxury" cliché in salon branding. We differentiate by refusing. |
| N8 | **Never use ALL-CAPS for body copy, service descriptions, or paragraphs.** ALL-CAPS is reserved for very short labels (navigation items, section numbers) at most — and even then, sparingly. | ALL-CAPS reads as shouting. Our voice is warm and measured. |
| N9 | **Never use text over busy photographic backgrounds.** Text always appears over solid, semi-transparent, or compositionally clean areas that ensure legibility. | Text over busy images destroys readability and communicates poor design consideration. |
| N10 | **Never animate without purpose.** Every animation exists to reveal, emphasize, or transition. Decorative animation (particles, confetti, bouncing elements) is prohibited. | Animation that serves no function is noise. Our motion communicates; it never decorates. |
| N11 | **Never use bouncing, rubber-banding, or spring-physics effects.** These communicate playfulness and casualness. Our elements have weight, damping, and precision. | Spring physics are for messaging apps, not luxury experiences. |
| N12 | **Never use countdown timers or urgency tactics.** No "only X left," no "offer ends in," no "someone just booked this." Urgency is the opposite of our brand. | We attract through quality. We never chase through pressure. |
| N13 | **Never use pop-up overlays that interrupt browsing.** No email capture pop-ups. No exit-intent pop-ups. No promotional overlays. The only acceptable overlay is the booking flow — and it slides in, not pops up. | Pop-ups communicate "our needs are more important than your experience." |
| N14 | **Never use chatbots that auto-greet visitors.** No "Hi! How can I help you?" after 10 seconds. No chat widget that covers content. We are available when the visitor is ready — not before. | Auto-greeting chatbots communicate desperation, not confidence. |
| N15 | **Never embed social media feeds on the website.** The website is the experience. Social media supports the website; the website never defers to social media. | An Instagram feed on the website says "our website isn't enough." Our website IS enough. |
| N16 | **Never use hero carousels with more than one slide.** A single, extraordinary hero image communicates more confidence than a rotating gallery of five. | Carousels hide content, confuse visitors, and communicate indecision. |
| N17 | **Never use image sliders or carousels for content.** Content is displayed once, composed perfectly, given its full moment. Not hidden behind "swipe to see more." | Sliders are a symptom of too much content and too little editorial courage. |
| N18 | **Never hide pricing behind "contact us" or "inquire."** Pricing is transparent, visible, and presented without apology. | Hiding prices communicates "if you have to ask, you can't afford it." That is not our brand. |
| N19 | **Never use parallax effects that exceed 15-20% differential.** Parallax is subtle depth — not a visual earthquake. At higher rates, it induces dizziness and motion sickness. | Subtle depth communicates atmosphere. Excessive parallax communicates a tech demo. |
| N20 | **Never auto-play video with sound.** The visitor controls all media playback. Always. | Auto-playing sound is the single most hostile thing a website can do. |
| N21 | **Never use scroll-jacking.** We enhance scroll behavior; we never override it. Native scroll physics (momentum, keyboard control, accessibility) are always preserved. | Scroll-jacking breaks the most fundamental web interaction. It is never acceptable. |
| N22 | **Never display content that requires hover to access critical information.** Pricing, duration, inclusions, and contact details are always visible. Tooltips are for supplementary details only. | Critical information must be accessible to all input methods — touch, keyboard, cursor. |
| N23 | **Never use skeleton loading screens with shimmer effects.** Our loading states are either instant (content appears) or branded (our signature animation). Never generic shimmer. | Shimmer skeletons are a generic pattern. Our loading experience is ours. |
| N24 | **Never use onboarding tutorials or walkthrough overlays.** If a tutorial is needed, the interface has failed. Our interface is intuitive enough to not require instruction. | Tutorials communicate "this is complex." Our design communicates "this is considered." |
| N25 | **Never use confetti or celebration animations on booking confirmation.** The confirmation is calm, beautiful, and satisfying — not a party. | Confetti says "you did something hard!" Our booking flow says "this was effortless." |
| N26 | **Never use faux materials.** Faux marble, faux wood grain, faux leather textures. If we reference a material, it is the real material — or we do not reference it. | Faux materials are lies. Our brand is built on authenticity. |
| N27 | **Never use right-aligned body text.** Right alignment is used only for specific metadata (dates, numbers) within otherwise left-aligned compositions. | Right-aligned text is difficult to read and visually disorienting for left-to-right languages. |
| N28 | **Never use justified body text.** Justified text creates uneven word spacing and rivers of white space. All body text is left-aligned with a natural ragged right edge. | Readability is non-negotiable. Justification damages it. |
| N29 | **Never use decorative borders, rules, or dividers between sections.** Separation comes from space, not lines. Borders between content sections communicate spreadsheets, not editorial. | The best design needs no visible structure. Space is the divider. |
| N30 | **Never use gradients as a primary design element.** Background gradients may appear as subtle atmospheric treatments in limited contexts. Gradients are never applied to buttons, cards, text, or icons. | Gradients are a trend-dependent visual treatment. Our design is built on solid, warm tones. |

---

## TYPOGRAPHY RULES

### The Typographic Constitution

| # | Rule | Standard |
|---|------|----------|
| T1 | **Two typeface families maximum.** One serif (voice: headlines, emotional moments). One sans-serif (function: body, navigation, UI). | Non-negotiable. |
| T2 | **The type scale has exactly six levels.** Display → Heading → Subheading → Body → Caption → Micro. No additional levels. No custom sizes. | The scale is the scale. |
| T3 | **Level hierarchy is never skipped in sequence.** A Heading must be followed by Subheading or Body — never Caption. Display may be followed directly by Body as the sole exception. | Visual discontinuity is a design failure. |
| T4 | **Weight decreases with size.** Larger text is heavier (semi-bold or bold). Smaller text is lighter (regular or light). The visual weight always corresponds to the visual size. | Reversing weight-to-size creates confusion. |
| T5 | **Line-height increases as size decreases.** Headlines: 1.0-1.2×. Body: 1.6-1.8×. Captions: 1.4-1.5×. Micro: 1.3-1.4×. | Tight line-height on small text destroys readability. |
| T6 | **Letter-spacing increases as size decreases.** Headlines: default or slightly tight. Body: default. Captions/Micro: slightly loose. | Small text benefits from breathing room between characters. |
| T7 | **Body copy maximum line length is 65-75 characters.** On wider viewports, the text column does not expand beyond this limit. | Lines longer than 75 characters are difficult to track. Lines shorter than 50 feel choppy. |
| T8 | **Body copy minimum font size is 16px.** At any viewport, at any zoom level, body text never drops below 16px equivalent. | Below 16px, text becomes difficult to read on mobile devices. |
| T9 | **Headlines are title case.** Not sentence case, not ALL-CAPS. Title Case For Every Word. | Title case communicates editorial authority. |
| T10 | **Body copy is sentence case.** First word capitalized. Proper nouns capitalized. Everything else lowercase. | Sentence case communicates warmth and approachability. |
| T11 | **No text has letter-spacing wider than 0.15em.** Wide-tracked text reads as luxury automotive, not luxury salon. | Wide letter-spacing is a specific trend that dates quickly. |
| T12 | **No text uses underline for emphasis.** Emphasis in body copy is communicated through italic weight. Underlines are exclusively for interactive hyperlinks. | Underlines in non-interactive text create confusion about what is clickable. |
| T13 | **Pull quotes use the serif typeface at 1.5-2× body size.** Pull quotes break the body-copy flow with typographic impact. They are always in the voice (serif) typeface. | Pull quotes create visual rhythm within dense text sections. |
| T14 | **Metadata and captions use the sans-serif typeface.** The smallest text levels are always in the functional (sans-serif) typeface, never the voice (serif) typeface. | Small serif text loses its character at small sizes; sans-serif maintains clarity. |

---

## ANIMATION RULES

### The Motion Constitution

| # | Rule | Standard |
|---|------|----------|
| M1 | **All content animations are scroll-linked, not time-linked.** The visitor controls the pace. Content does not auto-play its reveal based on a timer. | The scroll is the conductor. The content is the orchestra. |
| M2 | **The only time-linked animation is the hero reveal on initial page load.** This is the sole exception — a designed threshold moment. All other animations require scroll input. | The hero is the entrance. Everything else is discovered. |
| M3 | **Animation easing never uses overshoot or bounce.** Entry motions use ease-out. Exit motions use ease-in. State changes use ease-in-out. No elastic curves. No spring physics. | Our elements have the weight of well-made physical objects. They arrive precisely and stop precisely. |
| M4 | **Maximum animation duration for content reveals is 600ms.** Longer feels sluggish. Shorter (under 200ms) feels instantaneous and loses the sense of motion. | The sweet spot is 300-500ms — fast enough to feel responsive, slow enough to be perceived. |
| M5 | **Maximum opacity translation distance is 30px vertical.** Elements entering the viewport translate upward (or downward) by a maximum of 30px. More than this feels like the element is "flying in." | Subtle translation creates depth. Excessive translation creates spectacle. |
| M6 | **Maximum scale change on hover is 1.03.** A service card that scales to 1.05 or 1.1 on hover has too much movement. The scale change should be almost subliminal. | Hover scale communicates acknowledgment, not excitement. |
| M7 | **No animation plays without the visitor having scrolled to it.** Animations are triggered by viewport entry — they do not play in the background or before the visitor reaches the section. | The visitor controls the experience. Animations serve the scroll. |
| M8 | **When the visitor scrolls backward, previously-revealed content remains revealed.** Animations do not reverse. The narrative is forward-moving; backward scrolling is for review. | Re-hiding content on scroll-back is disorienting and breaks the narrative. |
| M9 | **Animations are consistent within component types.** Every service card animates identically. Every artisan profile animates identically. No per-instance variation. | Consistency creates learnability. Variation creates confusion. |
| M10 | **If an animation drops below 30fps on mobile, it is simplified or removed.** Performance is part of the experience. A janky animation damages the brand more than no animation. | A luxury experience never stutters. |
| M11 | **The `prefers-reduced-motion` preference is always respected.** When active: all scroll-linked reveals become instant, all hover transitions become instant, all page transitions become instant. The experience is complete without animation. | Accessibility is not a suggestion. |
| M12 | **Maximum animation on any single page is a gentle breeze, not a storm.** The cumulative motion across all sections should feel calm and considered — never busy, never overwhelming, never competing for attention. | The sum of all animations should feel like one coherent breath, not twenty separate performances. |
| M13 | **Loading states use our branded animation or instant content appearance.** Never generic spinners. Never shimmer skeletons. Our loading experience is designed, not defaulted. | A luxury brand does not use the same loading indicator as every other website. |
| M14 | **Confirmation animation is our longest (800-1200ms).** The booking confirmation moment receives the most generous animation timing — marking it as the emotional peak of the booking journey. | The most important moment gets the most considered motion. |

---

## SPACING RULES

### The Spatial Constitution

| # | Rule | Standard |
|---|------|----------|
| S1 | **The spacing scale has five tiers.** Intimate → Personal → Social → Formal → Public. Every gap in the design maps to one of these tiers. | Five tiers provide sufficient variation without creating inconsistency. |
| S2 | **The gap between two elements is always proportionally larger than the internal spacing within those elements.** If a text block has 1.6× line-height, the gap before the next element is at minimum 4× that internal spacing. | Clear separation requires inter-element gaps to dominate intra-element spacing. |
| S3 | **Section spacing (between sections) uses the Formal or Public tier.** Sections are clearly separated — the visitor feels the transition from one to the next. | Section spacing creates the chapter-break effect in our narrative. |
| S4 | **No two elements of the same structural type have different spacing.** If two service cards have different vertical gaps between title and description, the design is incorrect. | Inconsistent spacing between identical structures is the most common cause of "something feels off." |
| S5 | **Content never touches the viewport edge.** Minimum horizontal margins exist at every viewport width. The content area is always surrounded by breathing room. | Edge-to-edge content (except full-bleed images) communicates haste. |
| S6 | **Above a headline, spacing is equal to or greater than below it.** The headline has room to breathe before the content beneath it. It is encountered with space above, then space below leading to the next element. | This ensures the headline is the first thing the eye encounters in the section — not the element above it. |
| S7 | **Every component has internal padding that prevents content from touching its boundaries.** The padding creates a visual cushion — content is nestled within the component. | Content pressed against a boundary feels cramped. Padding communicates care. |
| S8 | **The spacing rhythm alternates.** Dense sections are followed by breathing sections. Breathing sections are followed by dense sections. No two sections of the same density type appear consecutively. | Alternation creates rhythm. Consecutive same-density creates monotony. |

---

## COLOR RULES

### The Chromatic Constitution

| # | Rule | Standard |
|---|------|----------|
| C1 | **The color palette has three roles: Surface, Text, and Accent.** Surface is warm off-white. Text is warm charcoal. Accent is muted gold. These are the only three chromatic roles in the system. | Three roles prevent chromatic noise. Every color in the design maps to one of these roles. |
| C2 | **The accent color (muted gold) is used with extreme scarcity.** It appears in interactive states, typographic accents, thin borders, and micro-details. It never appears as a full background, a massive headline, or a decorative gradient. | The accent's power comes from scarcity. Ubiquitous accent is no accent. |
| C3 | **All colors carry warm undertones.** Every surface, text, shadow, and accent color is shifted toward warm (amber, brown, cream) rather than cool (blue, grey, green). | Our palette IS warmth. A cool element violates the palette's identity. |
| C4 | **Text contrast meets WCAG AA minimum (4.5:1 for normal text, 3:1 for large text).** Our palette is designed to exceed these thresholds — the warm charcoal on warm off-white achieves 7:1+ (AAA level). | Accessibility contrast requirements are legal and ethical obligations. |
| C5 | **No color appears in the design that is not in the approved palette.** No seasonal colors. No promotional colors. No "just for this page" colors. The palette is the palette. | Unapproved colors create inconsistency. The palette is immutable. |
| C6 | **Shadows are warm-toned.** Every box-shadow, every drop-shadow, every shadow in the design carries warm undertones (brown-grey, not blue-grey). | Shadows communicate atmosphere. Cold shadows contradict our warm identity. |
| C7 | **Photography color grading is consistently warm.** All images share a warm color treatment — amber midtones, warm shadows, golden highlights. Cool-toned images are re-graded or rejected. | Photography carries the palette into the experience. Inconsistent grading creates visual discord. |
| C8 | **Hover and interactive color shifts are luminosity changes, not hue changes.** A button doesn't change from gold to red — it shifts from one warm luminosity to another. | Hue shifts create visual noise. Luminosity shifts create subtle, considered feedback. |
| C9 | **No color gradient spans more than two tonal values.** Gradients, when used, transition between two adjacent warm tones — never across the spectrum. | Multi-stop gradients create visual complexity that contradicts our restraint. |
| C10 | **The accent color on interactive elements is our gold.** All buttons, all active states, all interactive accents use the same muted gold. No other accent color for interactive elements. | Consistency in interactive color creates a learnable interaction language. |

---

## BUTTON RULES

### The Interactive Constitution

| # | Rule | Standard |
|---|------|----------|
| B1 | **There are exactly three button variants: Primary, Secondary, and Ghost.** Primary is the most prominent (gold accent). Secondary is moderately prominent (outlined). Ghost is the least prominent (text only). No additional variants. | Three variants provide sufficient hierarchy without visual confusion. |
| B2 | **Button labels are sentence case.** Not title case, not ALL-CAPS. "Book your appointment" not "Book Your Appointment" not "BOOK NOW." | Sentence case communicates warmth. Title case communicates formality. ALL-CAPS communicates urgency. |
| B3 | **Button labels are verbs or verb phrases.** "Book now" "Explore services" "Meet the team." The label tells the visitor what will happen when they tap. | Vague labels ("Learn more" "Click here") force the visitor to guess. Specific labels communicate with confidence. |
| B4 | **Button hover state is a luminosity shift.** The button becomes slightly warmer/brighter over 150-250ms. No scale change (except the subtle 0.97 press on click). No color change. No border change. | The hover response acknowledges presence without creating spectacle. |
| B5 | **Button click state is a subtle inward press.** The button compresses to approximately 0.97 scale over 100ms, then returns. The compression communicates physical weight. | The click response confirms the action was registered with tactile feedback. |
| B6 | **Button minimum touch target is 44×44px.** At any viewport width, no button is smaller than this. Padding expands to meet the minimum. | Touch accessibility is non-negotiable. |
| B7 | **The booking CTA button uses the Primary variant.** It is the most prominent interactive element on every page. It uses the accent gold. It is always visible (sticky or fixed on scroll). | Booking is the primary conversion. Its button must be the most prominent. |
| B8 | **Button width adapts to content.** Buttons are not fixed-width. They expand or contract to fit their label with consistent horizontal padding. | Fixed-width buttons create awkward proportions with varying label lengths. |
| B9 | **Disabled buttons are visually muted, not hidden.** When a button is disabled (e.g., form not yet valid), it is visibly present but at reduced opacity (50-60%) with no hover response. | Hiding a disabled button removes it from the visitor's mental model. Muting communicates "not yet." |
| B10 | **No button label contains exclamation marks.** "Book now" not "Book now!" "Reserve your spot" not "Reserve your spot!!" | Exclamation marks communicate urgency and excitement — the opposite of our calm brand voice. |

---

## CARD RULES

### The Component Constitution

| # | Rule | Standard |
|---|------|----------|
| CR1 | **Cards have no visible border.** Separation comes from spacing and background contrast, not borders. A visible border around a card creates a "boxed" look that contradicts our editorial aesthetic. | Borders between sections communicate spreadsheets. Space between sections communicates editorial. |
| CR2 | **Cards have no drop shadow.** Elevation is communicated through spacing, not shadow. Shadows create visual weight that competes with the content. | Shadows are a Material Design convention. Our cards float through space, not through shadow. |
| CR3 | **Cards follow the internal rhythm: Visual Entry → Voice → Substance → Action.** Image (or visual element) at top, title below, description below that, interactive element at bottom. | This rhythm mirrors the page-level rhythm: orient → engage → release. |
| CR4 | **Cards of the same type are visually identical in structure.** Same aspect ratio for images. Same typography levels. Same internal spacing. Same component behavior. | Consistency between cards of the same type is the foundation of visual order. |
| CR5 | **Cards are never the sole content of a section.** A section containing only cards (with no heading, no introductory text, no breathing space) is a catalog, not a composition. | Every section has context. Cards exist within a narrative, not in isolation. |
| CR6 | **Card hover state is the Warm Reveal.** The card's image warms slightly (luminosity shift toward gold tones), the card lifts by 1-2px of shadow or translate, over 200-300ms. | The Warm Reveal is our signature interaction — it appears on every card type. |
| CR7 | **Cards in a grid maintain consistent gutter spacing.** The gap between cards in a multi-card layout is identical in both horizontal and vertical directions. | Consistent gutters create the invisible grid structure that the eye perceives as order. |
| CR8 | **Maximum cards in a single row is three.** More than three cards in a row creates cramped compositions with insufficient space for content. On mobile, cards stack to one per row. | Three cards per row is the maximum density that maintains readability and breathing room. |
| CR9 | **Card content is never truncated with ellipsis.** If the content is too long for the card, the content is edited — not truncated. The visitor should never have to "click to read more" of a card's core content. | Truncation communicates "we have too much to say." Editing communicates "we chose exactly what to say." |
| CR10 | **Card images use consistent aspect ratios.** Service cards: 4:3. Artisan profiles: 3:4. Detail images: 1:1. The aspect ratio is determined by the card type, not by the specific image. | Consistent aspect ratios create visual rhythm across card layouts. |

---

## IMAGE RULES

### The Photography Constitution

| # | Rule | Standard |
|---|------|----------|
| I1 | **Every image is original photography.** No stock. No AI-generated. No licensed third-party. Every image captures the real salon, real artisans, real clients, real products. | Authenticity is our most valuable asset. Stock imagery destroys it instantly. |
| I2 | **All images share a consistent warm color treatment.** Amber midtones, warm shadows, golden highlights. No cool-toned grading. No blue-shifted color. | Consistent grading creates the brand's visual signature — every photo feels like it was taken in the same light. |
| I3 | **Image aspect ratios are consistent per type.** Hero: 16:9 or wider. Service: 4:3 or 3:2. Portrait: 3:4 or 2:3. Detail: 1:1. The ratio is defined by content type, not by creative whim. | Consistent ratios create predictable visual rhythm. |
| I4 | **Images are composed for their specific placement.** They are not generic photographs cropped to fit a layout. The photographer knows the layout; the designer knows the photograph. | Composition and layout are collaborators, not sequentials. |
| I5 | **No image appears without narrative purpose.** Every image tells a story — explicit (transformation) or implicit (atmosphere). An image that exists only to "fill space" is removed. | Empty space is always preferable to meaningless imagery. |
| I6 | **No text overlays on busy photographic backgrounds.** Text sits beside images, below images, or over solid/semi-transparent backgrounds that ensure legibility. | Text over busy images is illegible and communicates poor design consideration. |
| I7 | **Hero images are never cropped tight.** The hero photograph has generous headroom, breathing room, and environmental context. The subject is framed by space, not crowded by the crop. | The hero is the threshold moment. It must breathe. |
| I8 | **Client-facing images show faces.** We never photograph the back of a head, a disembodied hand, or an anonymous silhouette. Our photography is frontal, intimate, and human. | Faces create connection. Anonymity creates distance. |
| I9 | **Skin is never over-retouched.** Pores, freckles, expression lines, and natural texture remain. The retouching standard is: "the best version of the real person in the best natural light." | Over-retouching communicates insecurity. Authentic skin communicates confidence. |
| I10 | **No hair-only photography without a person.** Hair is always connected to a face, a body, a person. We don't photograph hair as a product — we photograph it as part of a person's identity. | Hair in isolation is a product shot. Hair on a person is a story. |
| I11 | **No hero image carousels or sliders.** One hero image. Composed perfectly. Given its full moment. Not shared with four others behind a "swipe" gesture. | A single hero communicates confidence. Multiple heroes communicate indecision. |
| I12 | **Photography is never AI-enhanced beyond standard color grading.** No AI skin smoothing. No AI background replacement. No AI object removal. Standard color correction and exposure adjustment only. | AI enhancement is a form of inauthenticity. Our images are what the camera captured, refined by human hands. |
| I13 | **Image loading is progressive on mobile.** A lightweight placeholder (blurred low-resolution version or warm solid color) appears instantly; the full-resolution image replaces it as bandwidth allows. | The visitor should never stare at a blank rectangle. Something always appears first. |

---

## ICON RULES

### The Pictographic Constitution

| # | Rule | Standard |
|---|------|----------|
| IC1 | **Icons are line-based, not filled.** Our icon style uses thin, consistent-weight strokes — matching the weight of our lighter typographic elements. Filled icons feel heavy and corporate. | Line icons communicate refinement. Filled icons communicate utility. |
| IC2 | **Icons are single-color.** Every icon uses one color — either our warm charcoal (default) or our muted gold (interactive/accent). No multi-color icons. No gradient-filled icons. | Single-color icons integrate with our restrained palette. Multi-color icons create visual noise. |
| IC3 | **Icons are geometric and simplified.** No ornate, illustrative, or skeuomorphic icon styles. Simple geometric forms that communicate the concept at a glance. | Complex icons fail at small sizes. Simple icons scale. |
| IC4 | **Icons are minimum 24×24px display size (not counting touch target).** Below this size, fine details collapse into illegibility. Icons that need to be smaller are redesigned for that context. | Legibility at all sizes is non-negotiable. |
| IC5 | **Icons always have a text label when used for navigation.** Navigation icons (menu, booking, contact) always appear with their label. Icons without labels create ambiguity. | Ambiguity in navigation is a usability failure. Labels eliminate it. |
| IC6 | **Icons are not decorative.** Every icon communicates a specific concept or function. An icon that exists purely for visual embellishment — a flower next to "Spa Services," a star next to "Featured" — is removed. | Decorative icons add visual noise without adding meaning. |
| IC7 | **Icons match the weight of the surrounding typography.** A bold headline paired with a hairline icon creates visual mismatch. The icon weight corresponds to the typographic weight of its context. | Visual weight consistency between icons and text creates compositional harmony. |
| IC8 | **The brand icon (logo mark) follows different rules than UI icons.** The logo has its own specifications for size, spacing, and color treatment — defined in the brand guidelines, not this document. | The logo is a special case. It has its own rules. |

---

## 3D RULES

### The Dimensional Constitution

| # | Rule | Standard |
|---|------|----------|
| D1 | **3D is atmospheric, never the focus.** Any 3D element in our design (particle effects, volumetric light, depth simulation) exists to create atmosphere — never to showcase technical capability. | The moment a visitor notices "oh, that's 3D," the 3D has failed. It should be felt, not seen. |
| D2 | **3D effects on mobile are optional, not required.** If a 3D effect impacts mobile performance (frame rate drops, battery drain, data consumption), it is disabled on mobile. The experience is complete without it. | Mobile performance takes priority over visual flourish. Always. |
| D3 | **3D effects never obscure or compete with content.** Content is always legible, interactive elements are always tappable, and the 3D effect sits behind or around — never on top of — the primary content. | Content is king. 3D is atmosphere. Atmosphere never overrules content. |
| D4 | **No interactive 3D objects.** We do not use Three.js showcases, product configurators, or rotatable 3D models. Our brand is photography-first, material-referenced. 3D objects feel like tech demos. | Tech demos undermine the warm, human, editorial quality of our brand. |
| D5 | **No CGI-rendered materials.** Real materials are photographed. CGI marble, rendered brass, or simulated textures are prohibited. The uncanny quality of CGI materials undermines authenticity. | Real materials, real light, real photography. Always. |
| D6 | **3D-related effects respect `prefers-reduced-motion`.** When reduced motion is active, all atmospheric 3D effects (particles, volumetric light) are disabled. | Accessibility applies to 3D as it applies to all motion. |

---

## ACCESSIBILITY RULES

### The Inclusion Constitution

| # | Rule | Standard |
|---|------|----------|
| AC1 | **WCAG 2.1 Level AA is the minimum standard.** All content, all interactions, all layouts meet or exceed AA compliance. We aim for AAA where achievable without compromising design. | AA is a floor, not a ceiling. Accessibility is a quality standard. |
| AC2 | **Color contrast meets or exceeds WCAG requirements.** Normal text: 4.5:1 minimum (we achieve 7:1+). Large text: 3:1 minimum. Interactive elements: 3:1 against all states. | Our palette is designed for high contrast. Low contrast is a design failure. |
| AC3 | **All interactive elements are keyboard-accessible.** Every button, link, form field, and interactive component can be reached and activated via keyboard alone. No mouse required. | Keyboard accessibility is a fundamental right, not a feature. |
| AC4 | **Focus indicators are visible and high-contrast.** The focus ring uses our gold accent (2px minimum). It is never removed via outline:none without an equivalent alternative. | Invisible focus is the most common accessibility failure on the modern web. |
| AC5 | **`prefers-reduced-motion` is always respected.** When active: all scroll animations become instant, all hover transitions become instant, all page transitions become instant. The experience is complete and satisfying without any motion. | Motion sensitivity affects 30-40% of the population. Respecting it is not optional. |
| AC6 | **No information is conveyed through color alone.** Every visual distinction that uses color also uses a secondary signal — text label, icon, position, or shape. | Colorblind users must have equivalent access to all information. |
| AC7 | **All form fields have associated labels.** Every input, select, and textarea has a visible, programmatically associated label. Placeholder text is not a substitute for a label. | Placeholder text disappears on input. Labels are permanent. |
| AC8 | **Error messages are specific and helpful.** "This field is required" is acceptable. "Invalid input" without specifying what is invalid is not. Error messages explain what went wrong and how to fix it. | Frustrating error messages create barriers. Helpful error messages create trust. |
| AC9 | **Page content is accessible via screen reader landmarks.** Header, navigation, main content, and footer are wrapped in appropriate landmark elements. Screen reader users can navigate by region. | Structural semantics are the screen reader's equivalent of visual layout. |
| AC10 | **No content flashes more than three times per second.** Flashing content can trigger seizures in people with photosensitive epilepsy. This is an absolute prohibition with no exceptions. | Seizure-inducing content is dangerous. This is the most critical accessibility rule. |
| AC11 | **Alternative text for meaningful images is descriptive and specific.** Not "Image of a woman" but "A client examines her new balayage in the salon mirror, warm afternoon light catching the dimensional color." | Alt text is content. It deserves the same editorial care as body copy. |
| AC12 | **Touch targets meet or exceed 44×44px with 8px spacing.** This applies to all interactive elements at all viewport widths. | Touch accessibility accommodates the full range of human motor ability. |

---

## PERFORMANCE RULES

### The Speed Constitution

| # | Rule | Standard |
|---|------|----------|
| P1 | **Largest Contentful Paint (LCP) is under 2.5 seconds.** The hero image and primary headline must be visible within 2.5 seconds of page load on a 4G connection. | First impressions are formed in under 3 seconds. If the hero isn't loaded, the impression is lost. |
| P2 | **Cumulative Layout Shift (CLS) is under 0.1.** Content does not jump, shift, or reflow after initial render. All dimensions are reserved before content loads. | Layout shifts communicate instability and poor craftsmanship. |
| P3 | **Interaction to Next Paint (INP) is under 200ms.** Every interaction (tap, click, scroll) produces visible response within 200ms. Lag between input and response is perceived as slowness. | Responsive interfaces feel premium. Laggy interfaces feel broken. |
| P4 | **Total page weight on initial load is under 1MB.** Hero image, critical CSS, primary fonts, and essential JavaScript — all under 1MB combined. Additional content loads progressively. | 1MB is the threshold where most mobile connections begin to feel slow. |
| P5 | **Images are served in modern formats (WebP/AVIF) with fallbacks.** Modern formats reduce file size by 25-50% compared to JPEG/PNG. Fallbacks ensure compatibility. | Smaller files load faster. Modern formats are the most impactful performance optimization. |
| P6 | **Images are lazy-loaded below the fold.** Only the hero image and above-the-fold content load immediately. All other images load as they enter the viewport. | Loading everything at once wastes bandwidth on content the visitor hasn't reached. |
| P7 | **Fonts load without blocking text rendering.** Text is visible immediately in a system font; custom fonts replace it once loaded (font-display: swap). The visitor never waits for fonts to read text. | Invisible text during font loading creates a jarring flash. Swap ensures text is always visible. |
| P8 | **JavaScript is deferred for non-critical functionality.** Animation libraries, analytics, and secondary features load after the primary content is interactive. | Critical content loads first. Everything else loads after. |
| P9 | **Performance is tested on 3G connections.** The experience must be usable (not beautiful — usable) on a throttled 3G connection. If the experience breaks on 3G, performance is insufficient. | Our clients use mobile networks. Our performance must accommodate them. |
| P10 | **No layout thrashing from animation.** Animations use only GPU-accelerated properties (transform, opacity). No animations on layout properties (width, height, margin, padding, top, left). | Layout animations cause repaints that destroy frame rate. GPU properties are smooth. |

---

## LUXURY RULES

### The Premium Constitution

| # | Rule | Standard |
|---|------|----------|
| L1 | **Restraint is the primary luxury signal.** Fewer elements, each considered. More space, each purposeful. Less content, each exceptional. Restraint communicates: "We chose this over everything else." | The most expensive thing in design is the space you leave empty. |
| L2 | **Never persuade — present.** No urgency tactics, no social pressure, no countdown timers, no "only X remaining." We present our offering with confidence and let the visitor decide. | Luxury does not chase. It attracts. |
| L3 | **Pricing is transparent and unapologetic.** Every service has a visible price. The price is presented as a fact, not a selling point. No "starting at" ambiguity. No "call for pricing." | Transparency communicates confidence. Hidden pricing communicates insecurity. |
| L4 | **The booking CTA is confident but never aggressive.** It is always visible, always accessible, but never animated, never flashing, never louder than the content around it. | The most important button on the page should feel like the most considered — not the most desperate. |
| L5 | **Social proof is specific and authentic.** Every review has a real name, a real date, a real service, and a real story. No anonymous reviews. No generic praise. No fabricated testimonials. | Specificity is the signature of authenticity. Vague praise is indistinguishable from fabrication. |
| L6 | **No discount language.** "Affordable," "budget," "deal," "save," "discount" — these words never appear in our content. We compete on experience, never price. | Discount language undermines the premium positioning. Our value is in quality, not price. |
| L7 | **No exclamation marks in brand copy.** Our voice is warm, confident, and measured. Exclamation marks communicate excitement or urgency — neither of which aligns with our brand personality. | The most luxurious brands speak quietly. Exclamation marks are loud. |
| L8 | **No superlatives without evidence.** "Best," "top-rated," "world-class," "ultimate" — these words are prohibited unless backed by a specific, verifiable claim. | Unsubstantiated superlatives communicate insecurity. Specific claims communicate confidence. |
| L9 | **Every detail communicates consideration.** The quality of a design is determined by its smallest element — the corner radius, the line-height, the spacing between two characters. If the smallest element is considered, the whole design is considered. | Details are the evidence of care. Care is the evidence of quality. |
| L10 | **The digital experience matches the physical experience.** The warmth, the pacing, the material quality, the attention to detail — the website should feel like the salon feels. No disconnect between digital and physical. | Physical-digital coherence is the ultimate luxury signal. The brand is consistent everywhere. |

---

## THE ENFORCEMENT PRINCIPLE

### How This Document Is Used

**During design review:**

Every proposed design element, component, animation, and layout decision is measured against this document. If it violates a rule, it is corrected. There is no appeal process for rule violations. There is no "exception for this page." There is no "the client wants it this way." The rules are the rules.

**During development:**

Every implemented element is verified against these rules. If a developed component violates a rule that the approved design did not, the component is corrected before deployment. Design approval does not override these rules — the rules are the standard above any individual design.

**During content creation:**

Every piece of copy, every image selection, every headline and description is checked against these rules. If copy violates a typography rule, a content rule, or a luxury rule, it is rewritten. Content is not exempt from design standards.

**During disputes:**

When team members disagree about a design decision, this document is the arbiter. The rule that applies most directly determines the outcome. If no specific rule applies, the principles of restraint, warmth, and consideration guide the judgment.

**When the rules feel inconvenient:**

The inconvenience is the point. Rules that are easy to follow are rules that don't differentiate. Our visual rules are difficult precisely because they demand more consideration, more restraint, and more craft than the easy default. The difficulty is what makes the result luxurious.

---

## THE FINAL WORD

These rules exist for one reason: **to protect the brand.**

A brand is not a logo. A brand is not a color palette. A brand is the consistent, cumulative impression left on every person who encounters it. Every pixel, every animation, every word, every interaction either strengthens that impression or weakens it.

These rules ensure that every element strengthens the impression. Every design decision contributes to the feeling of: "This is a place that has been considered."

When a design follows these rules, it is correct.
When a design violates these rules, it is incorrect.

There is no middle ground. There are no grey areas. There are rules.

---

*This document is the constitutional authority of the brand's visual system. It supersedes all other design references when conflicts arise. It is reviewed quarterly and updated only through a formal amendment process.*

*Document prepared: July 2026*
*Source documents: PRODUCT_VISION.md, CREATIVE_DIRECTION.md, MOODBOARD.md, DESIGN_LANGUAGE.md, COMPETITOR_RESEARCH.md*
*Constraint: Rules only — no code, no implementation details*

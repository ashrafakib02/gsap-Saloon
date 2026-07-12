# INTERACTION_TIMELINE.md
## The Language of Touch

> "Every interaction is a conversation between the visitor and the brand. A hover is a greeting. A click is a handshake. A scroll is a step forward. The quality of these micro-moments determines whether the conversation feels warm and considered — or cold and mechanical."

---

## DOCUMENT PURPOSE

This document defines the complete interaction vocabulary of the digital experience — every moment where the visitor touches, moves through, or engages with the interface. Each interaction type is defined by its purpose, emotional intent, visual feedback, motion character, timing, and the expectation it creates or fulfills.

Interactions are not features. They are the personality of the brand made tactile. A luxury brand is defined not by its content but by the quality of its micro-moments — the weight of a button press, the warmth of a hover response, the patience of a scroll reveal. This document defines those micro-moments with the precision they deserve.

**Relationship to other documents:**
- CREATIVE_DIRECTION.md → The interaction philosophy (how interactions should feel)
- DESIGN_LANGUAGE.md → The compositional grammar (how elements are placed)
- VISUAL_RULES.md → The constitutional rules (what interactions must and must not do)
- EXPERIENCE_STORYBOARD.md → The cinematic structure (what the visitor encounters)
- SCROLL_STORY.md → The narrative pacing (how time moves)
- EMOTIONAL_TIMELINE.md → The emotional journey (what the visitor feels)
- **INTERACTION_TIMELINE.md → The tactile vocabulary (how the visitor touches)**

---

## THE INTERACTION THESIS

Every interaction on the website should feel like the digital equivalent of a well-considered physical gesture. The weight of a luxury car door closing. The smooth glide of a well-made drawer. The satisfying click of a quality pen. These micro-moments of quality communicate more about a brand than any headline or photograph.

Our interactions are:
- **Deliberate.** Every element responds to user input with intention. Not instant (which feels cheap) and not delayed (which feels broken) — but measured, with the slight weight of a physical object responding to touch.
- **Consistent.** Every button, every link, every hover state follows the same behavioral pattern. The visitor learns the interaction language once and applies it everywhere.
- **Sensory.** Interactions trigger sensory memory. A button hover should feel like pressing a soft surface. A page transition should feel like turning a page. A scroll reveal should feel like opening a curtain.

The standard is simple: **if someone says "nice interaction," the interaction is too loud.** The best interaction is the one you don't consciously notice — but you would notice its absence.

---

## 1. HOVER

### 1.1 Navigation Links — The Underline

**Purpose:** Acknowledge the visitor's attention and signal that the element is interactive. The hover transforms a static label into a living element — a subtle invitation to explore.

**Emotion:** Warmth. The visitor's cursor enters the link's space, and the link responds — not with a dramatic transformation, but with a gentle acknowledgment. The feeling is of a brand that notices your presence and responds with grace, not desperation.

**Visual feedback:** A thin gold underline draws itself from left to right beneath the link label. The line is our accent color (muted gold) at full opacity. The underline is the only visual change — no color shift on the text, no background change, no border. The simplicity of the response communicates: "I see you. I am here."

**Motion style:** The underline reveals with a left-to-right draw animation — a single stroke that appears to be drawn by an invisible pen. The motion uses an ease-out curve, decelerating slightly as it reaches the right edge. The draw feels like a whispered confirmation.

**Expected duration:** 200-300ms. Fast enough to feel responsive, slow enough to feel considered. The underline is visible for as long as the cursor remains, then disappears with a brief fade (150ms) when the cursor leaves.

**User expectation:** The visitor expects the link to be clickable. The hover confirms this expectation and builds confidence in the interaction language. After encountering two or three link hovers, the visitor learns: "Gold underline means clickable." This learnability is the hover's most important function.

**What should never happen:**
- The underline should never appear instantly (0ms). Instant feedback feels digital. The 200-300ms draw communicates craft.
- The underline should never be a thick or heavy stroke. It is a whisper, not a shout. The line weight should be thin — 1-2px — matching the delicacy of our typographic accents.
- The text color should never change on hover. The gold underline is the complete response. Adding a text color change creates two simultaneous responses, which splits attention and creates visual noise.
- The hover should never scale or move the link. Links do not jump. They do not grow. They respond in place, with the dignity of a still element that has been noticed.

---

### 1.2 CTA Buttons — The Warmth Shift

**Purpose:** Signal interactivity and build confidence in the booking action. The button hover is the digital equivalent of a concierge making eye contact — available, warm, and ready without being pushy.

**Emotion:** Invitation. The visitor's cursor approaches the button, and the button responds with a warmth that says: "When you are ready, I am here." The feeling is not excitement (which would feel desperate) but availability (which feels confident).

**Visual feedback:** A subtle luminosity shift — the button becomes slightly warmer and brighter. Not a color change (gold stays gold) but a luminosity increase, as if the button is gently glowing from within. The shift is almost subliminal — the visitor feels it more than sees it.

**Motion style:** The luminosity transitions with an ease-in-out curve — a symmetrical, balanced response that feels considered. The transition is smooth, not instant. The button appears to warm gradually, like a surface being slowly illuminated.

**Expected duration:** 200-300ms. The hover response is quick enough to feel responsive but slow enough to feel physical. The visitor perceives the button as an object with material properties — it does not snap to a new state; it transitions.

**User expectation:** The visitor expects the button to be tappable. The hover confirms this and builds toward the click. The hover is the greeting before the handshake. It says: "I acknowledge your interest. I am prepared for your action."

**What should never happen:**
- The button should never pulse, glow, or animate on hover. Pulsing communicates urgency ("Click me! Click me!"). Our button communicates availability ("I am here when you are ready").
- The button should never scale up on hover. Scaling creates movement that competes with the button's stillness. The button stays exactly where it is — only its warmth changes.
- The hover should never trigger a tooltip or popup. The button's message is in its label. The hover is about acknowledgment, not information delivery.
- The transition should never be instant (0ms). Instant state changes feel cheap — like a light switch. The 200-300ms transition feels physical — like a dimmer switch.

---

### 1.3 Service Cards — The Card Warmth

**Purpose:** Transform a static card into an inviting object of exploration. The card hover tells the visitor: "This card is alive. It has depth. There is more to discover here."

**Emotion:** Curiosity. The card responds to the visitor's attention by warming slightly — the image shifts toward golden tones, the card lifts almost imperceptibly. The feeling is of an object being brought closer by an invisible hand — "Come look at this."

**Visual feedback:** Two simultaneous but subtle changes:
1. The card's image warms by the same golden degree as the Warm Reveal — a subtle shift toward amber tones, as if the lighting on the image has just shifted to golden hour.
2. The card elevates slightly — 1-2px of shadow deepening or vertical translation, communicating a gentle lift. The elevation is so subtle it should be felt, not measured.

**Motion style:** Both the warmth shift and the elevation happen simultaneously with an ease-in-out curve. The card's response is unified — it does not split into separate animations for image and container. The entire card warms and lifts as one object.

**Expected duration:** 200-300ms. The hover response matches the link and button hovers — creating a consistent interaction timing across all interactive elements. When the cursor leaves, the card returns to its resting state with the same 200-300ms transition.

**User expectation:** The visitor expects the card to be tappable/clickable. The hover confirms the card is interactive and hints at the depth of content beneath. After hovering over one card, the visitor learns the pattern — all cards behave the same way.

**What should never happen:**
- The card should never scale beyond 1.03. Maximum scale change on hover is 1.03 — this is our constitutional limit. Anything more creates movement that feels bouncy, not considered.
- The card should never rotate, tilt, or skew on hover. Cards are flat, stable objects. They do not dance. They respond with warmth, not motion.
- The hover should never reveal hidden content. The card's content is always visible. Hover enriches (warming, slight lift); it does not reveal (no hidden text, no popup, no expand).
- The card should never cast a dramatic shadow on hover. The shadow deepens by a single degree — from no shadow to a whisper of elevation. Dramatic shadows belong to Material Design, not to editorial composition.

---

### 1.4 Artisan Portraits — The Still Presence

**Purpose:** The artisan portrait does NOT respond to hover. This is a deliberate interaction choice — the absence of hover feedback communicates: "This is a person, not a card."

**Emotion:** Respect. The visitor hovers over the portrait and nothing happens. This stillness is the response — it says: "This is not an interactive element. This is a human being. They are here to be seen, not to be manipulated." The absence of interaction IS the interaction.

**Visual feedback:** No visual change. The portrait remains exactly as it is — still, warm, present. The cursor passes over it without triggering any response. The stillness communicates dignity.

**Motion style:** No motion. Pure stillness. The portrait is the most still element in the experience — a held shot in cinematic terms. The camera does not move. The subject does not change. The composition holds.

**Expected duration:** N/A. No interaction occurs. The cursor moves freely over the portrait without triggering any response. When the cursor leaves, nothing changes — because nothing changed when it entered.

**User expectation:** The visitor may initially expect hover feedback (based on the card pattern). The absence of feedback creates a micro-moment of recognition: "Oh — this is different. This is a person." The absence teaches the visitor that the experience distinguishes between content cards (interactive) and human portraits (still).

**What should never happen:**
- The portrait should never zoom, crop, or scale on hover. Zoom-on-hover is a stock photography gallery behavior — the opposite of our editorial approach. Our portraits are composed once, composed perfectly, and held.
- The portrait should never reveal a tooltip with the artisan's name. The name is always visible below the portrait. Information is never hidden behind interaction.
- The portrait should never have a cursor change (pointer vs. default). The cursor remains the same whether over the portrait or the space around it. The portrait is not a link; it is an image.

---

### 1.5 Testimonial Quotes — The Text Stillness

**Purpose:** Testimonial text does NOT respond to hover. Like artisan portraits, the absence of interaction communicates: "This is a voice, not a button."

**Emotion:** Trustworthiness. The testimonial is presented as a fixed, unchanging statement — it does not wiggle, highlight, or respond to the cursor. Its stillness communicates permanence and authenticity: "These words were spoken. They stand on their own."

**Visual feedback:** No visual change. The testimonial text remains static regardless of cursor position. The words hold their position with the confidence of a published quote.

**Motion style:** No motion. Pure stillness. The text is the most functionally important element in the testimonials section — it must be readable, stable, and undistracted. Any hover animation on body text would reduce readability and break the reading flow.

**Expected duration:** N/A. No interaction occurs.

**User expectation:** The visitor reads the testimonial without interruption. The absence of hover effects on text is expected — text is for reading, not for interacting. The reading experience is unbroken.

**What should never happen:**
- Testimonial text should never highlight, underline, or change color on hover. Text that responds to hover creates the expectation that it is clickable. Testimonials are not clickable. They are statements.
- Testimonial names should never link to external profiles on hover. The attribution is self-contained within the experience. External links break the immersion.

---

## 2. CLICK

### 2.1 Primary CTA — The Press

**Purpose:** Confirm that the visitor's action has been registered. The click is the moment of commitment — the handshake that begins the booking conversation. The press feedback communicates: "Your action has been received. I am processing it with care."

**Emotion:** Satisfaction. The visitor commits to an action, and the button responds with a physical press — the slight compression communicates weight, materiality, and quality. The feeling is of pressing a well-made physical button — a satisfying, tactile confirmation.

**Visual feedback:** The button compresses slightly — scaling to approximately 97% of its resting size. The compression is accompanied by the luminosity shift from the hover state, maintaining continuity. The button appears to be physically pressed inward.

**Motion style:** The compression uses an ease-in-out curve — a quick, symmetrical press and release. The button compresses to 97% over 100ms, holds for a brief moment (50ms), then returns to 100% over 150ms. The total animation is 300ms — brief enough to feel responsive, long enough to be perceived as physical.

**Expected duration:** 300ms total (100ms compress, 50ms hold, 150ms release). After the press animation completes, the booking flow begins — sliding in from the edge of the viewport within 300-400ms.

**User expectation:** The visitor expects the booking flow to begin. The press confirms the click was registered; the flow beginning confirms the action was processed. The two feedback mechanisms — physical (press) and systemic (flow opening) — work together to create a complete response.

**What should never happen:**
- The button should never change color on click. The press (scale compression) is the click feedback. Adding a color change creates two simultaneous responses — one physical, one chromatic — that compete for attention.
- The button should never trigger a full-page redirect. The booking flow slides in from the edge — it does not replace the page. The visitor never loses context. She is still in our world.
- The press should never be bouncy or springy. No overshoot. No elastic return. The button compresses and returns — a clean, physical motion with the weight of a quality mechanism.
- The click should never trigger a loading spinner. The response is immediate — the press animation plays, and the booking flow begins. If the flow requires server communication, the flow itself handles the loading state — never the button.

---

### 2.2 Secondary Navigation Links — The Color Confirmation

**Purpose:** Confirm the navigation action and transition between pages. The click feedback communicates: "Your destination has been recognized. I am taking you there."

**Emotion:** Assuredness. The visitor clicks a navigation link and receives immediate feedback — the link's text shifts to the gold accent color, confirming the click was registered. The feeling is of a path being chosen and a guide beginning to walk.

**Visual feedback:** The link text immediately shifts to the muted gold accent color — the same gold used for hover states and interactive accents. The color shift is instantaneous (0ms transition), communicating that the action was registered the moment it occurred.

**Motion style:** The color shift is instant. Unlike hover (which uses a 200-300ms transition), the click response is immediate — because the page is already transitioning. The instant color shift provides closure: "You were here. Now you are going there."

**Expected duration:** 0ms for the color shift. The page transition begins within 100ms — a 300-400ms dissolve from the current page to the new page. The dissolve uses our Warm Transition — a brief golden wash that maintains atmospheric continuity across pages.

**User expectation:** The visitor expects a page transition. The color shift confirms the click; the dissolve confirms the transition. The visitor never experiences a blank screen between pages — the dissolve fills the transition with warmth.

**What should never happen:**
- The page transition should never be instant (no dissolve). An instant page change creates a jarring flash — the warm background disappears, the new page appears. The 300-400ms dissolve fills this moment with warmth.
- The page transition should never use a loading spinner. If the new page requires loading, the current page remains visible during the dissolve, maintaining visual continuity. The visitor never sees a spinner.
- The transition should never slide from left or right. Page transitions dissolve — they do not slide. Sliding implies spatial movement (this page is "to the left" of that page). Dissolving implies atmospheric transition (this moment is becoming that moment).
- The click should never trigger a full-screen overlay that obscures the current page before the new page loads. The dissolve is seamless — the current page fades as the new page fades in. There is never a moment where the visitor sees neither page.

---

### 2.3 Artisan Selection (Booking Flow) — The Portrait Tap

**Purpose:** Select an artisan for the booking. The tap feedback confirms the selection and transitions to the next step. The interaction must feel personal — the visitor is choosing a person, not selecting a product.

**Emotion:** Personal connection. The visitor taps a portrait and the portrait responds with a warm glow — the gold accent appears as a thin border around the selected portrait. The feeling is of choosing a guide, not checking a box.

**Visual feedback:** The selected portrait gains a thin gold border (2px, our accent color) that appears with a 200ms ease-in-out transition. The border communicates selection without obscuring the portrait. The gold border is the same gold used throughout the experience — consistent, warm, considered.

**Motion style:** The border appears with a 200ms ease-in-out transition — not instant (which would feel abrupt) and not slow (which would feel sluggish). The transition is smooth and considered, like a frame being gently placed around a photograph.

**Expected duration:** 200ms for the border transition. After selection, the booking flow advances to the next step within 400ms — a gentle cross-dissolve to the time selection view.

**User expectation:** The visitor expects the booking flow to advance. The border confirms the selection; the dissolve confirms the progression. The flow moves forward with the same warmth and consideration as the rest of the experience.

**What should never happen:**
- The portrait should never disappear, shrink, or transform on selection. The portrait remains visible and unchanged — only the border appears. The artisan is still a person, not a selected item.
- The selection should never trigger a checkbox or radio button. The portrait IS the selection mechanism. Adding form controls would reduce the personal moment to a transactional one.
- Multiple artisans should never be simultaneously selectable. One artisan per service. The selection is exclusive — it mirrors the real-world experience of choosing one person to work with you.

---

### 2.4 Time Slot Selection (Booking Flow) — The Slot Tap

**Purpose:** Select a time for the appointment. The tap feedback confirms the choice and advances the flow. The interaction must feel effortless — choosing a time should be as simple as pointing.

**Emotion:** Ease. The visitor taps a time slot and it responds with a warm selection state — the slot fills with the gold accent color at low opacity. The feeling is of a simple, clean decision — no friction, no complexity.

**Visual feedback:** The selected time slot fills with the muted gold accent at 15-20% opacity, with the text shifting to the warm charcoal. The unselected slots remain visible but muted — the visitor can see availability without distraction. The selected slot is clearly distinguished through color and weight.

**Motion style:** The selection state transitions over 200ms with an ease-in-out curve. The slot fills with warmth smoothly, not abruptly. The motion is the same speed as the artisan selection — consistent timing across all booking flow interactions.

**Expected duration:** 200ms for the selection state. After selection, the flow advances to the confirmation step within 400ms — a gentle cross-dissolve.

**User expectation:** The visitor expects the flow to advance after selecting a time. The selection confirms the choice; the dissolve confirms the progression. The flow continues its conversational rhythm.

**What should never happen:**
- The selected slot should never animate, bounce, or pulse. The selection is confirmed by the color state change — no additional animation is needed.
- Unavailable slots should never disappear. They remain visible but muted — the visitor can see that the artisan is in demand (social proof through scarcity) without artificial urgency.
- The time selection should never use a dropdown or scrolling picker. The calendar view presents all available times at a glance. Dropdowns hide options; the calendar reveals them.

---

### 2.5 Booking Confirmation — The Final Tap

**Purpose:** Confirm the completed booking. The confirmation response is the final interaction in the booking journey — it must be the most beautiful, most considered, most emotionally resonant moment in the entire interaction vocabulary.

**Emotion:** Completion. The visitor has committed, and the confirmation rewards that commitment with a moment of beauty. The feeling is of a journey completed — not a transaction processed, but a story resolved.

**Visual feedback:** The Warm Confirmation — our signature interaction at its most generous. A checkmark draws itself in the brand's gold accent, accompanied by a gentle warm fade that reveals the confirmation message. The checkmark is not a generic icon — it is a considered, hand-drawn-quality mark that communicates craft even in its simplest form.

**Motion style:** The checkmark draws over 800-1200ms — the longest animation in the booking journey. The extended duration marks the moment as significant. The warm fade reveals the confirmation text simultaneously, creating a unified moment of revelation. The motion uses an ease-in-out curve, arriving at the final state with the weight of a period at the end of a sentence.

**Expected duration:** 800-1200ms for the complete confirmation animation. After the animation completes, the confirmation holds in stillness — the visitor reads, absorbs, and internalizes. No further interaction is required or suggested.

**User expectation:** The visitor expects closure. The confirmation provides it — a warm, beautiful, unhurried moment that says: "You are welcome here. We are looking forward to seeing you." The confirmation is the last interaction the visitor has with the booking flow — it must leave her feeling satisfied, warm, and anticipatory.

**What should never happen:**
- The confirmation should never trigger confetti, fireworks, or celebration animations. Confetti says "you did something hard!" Our booking flow says "this was effortless." The confirmation is calm, not celebratory.
- The confirmation should never immediately redirect to a new page. The visitor stays on the confirmation, reading, absorbing. She controls when she leaves — not the system.
- The confirmation should never include an upsell. "While you're here, would you like to add a treatment?" The confirmation is a moment of resolution. Do not extend it with commercial prompts.
- The checkmark should never appear instantly. The 800-1200ms draw animation is the emotional peak of the booking journey. Replacing it with an instant appearance would reduce the most important moment to the same feedback as a checkbox.

---

## 3. SCROLL

### 3.1 The Primary Scroll — The Narrative Pacing

**Purpose:** Unfold the experience at the visitor's pace. The scroll is the visitor's agency — she controls the speed of the story. The scroll must feel effortless, unhurried, and rewarding at every velocity.

**Emotion:** Discovery. Each scroll movement reveals something new — a section, an image, a word, a face. The scroll transforms the page from a static composition into a living narrative. The visitor is not reading a page; she is entering a world.

**Visual feedback:** Content reveals as it enters the viewport — sections fade in, images emerge from warmth, headlines reveal word by word. The scroll is always rewarded with something worth seeing. There is never a moment where scrolling reveals empty space, broken content, or loading placeholders.

**Motion style:** The scroll is native — we never override the browser's scroll physics. Momentum, keyboard control, touch gestures, and accessibility features are always preserved. We enhance the scroll's visual consequences (reveal animations, parallax), but never the scroll's physical behavior.

The scroll-linked animations use ease-out curves — elements decelerate into their final positions, communicating the weight of content arriving, not snapping into place. The animations are tied to scroll position, not timers — when the visitor stops scrolling, the animations stop. When she scrolls backward, previously revealed content remains revealed.

**Expected duration:** The scroll has no fixed duration. The experience is designed for a contemplative pace of 3-5 minutes for a first-time visitor. But the visitor controls the duration — she may linger for 10 minutes or scan for 30 seconds. Both are valid. The design rewards both paces.

**User expectation:** The visitor expects to be rewarded for scrolling. Every scroll movement should reveal something — a new section, a new image, a new moment. The scroll should feel like opening doors in a beautiful building: each door reveals a room worth entering.

**What should never happen:**
- Scroll-jacking. We never override the native scroll behavior. No fixed scroll speeds, no scroll hijacking, no forced scroll snapping. The visitor controls the scroll. Always.
- Empty scroll regions. Every viewport of the page contains content or designed breathing space. The visitor should never scroll through a blank area that feels like a mistake.
- Scroll-linked animations that cause layout thrashing. All animations use GPU-accelerated properties (transform, opacity). No animations on layout properties (width, height, margin, padding). The scroll must remain smooth at 60fps.
- Backward scroll that re-hides content. When the visitor scrolls backward, previously revealed content stays revealed. The narrative is forward-moving; backward scrolling is for review, not for re-triggering animations.
- A scroll speed that feels too fast or too slow. The parallax differentials (10-15%) and animation durations (400-600ms) are calibrated for a natural scroll pace. If the content feels like it is flying past or dragging behind, the calibration is wrong.

---

### 3.2 The Transformation Dissolve — The Scroll as Author

**Purpose:** Give the visitor control over the most emotionally charged moment in the experience. The scroll becomes the author of the transformation — the before dissolves, the after emerges, and the visitor decides the pace.

**Emotion:** Agency. The visitor is no longer passively receiving content — she is actively creating a moment. The scroll-controlled dissolve puts her in the driver's seat of the transformation. She can pause at any point, scroll back to see the before again, or continue to the full reveal. She is the author of this moment.

**Visual feedback:** The before image fades to 0% opacity while the after image fades to 100% opacity — a scroll-linked cross-dissolve. The transition is mapped to scroll position across a full viewport of scroll distance. At 0% scroll, the before is fully visible. At 100% scroll, the after is fully visible. At 50%, both images are at 50% opacity — a ghostly, liminal state that is itself beautiful.

**Motion style:** The dissolve is the smoothest, most considered motion in the experience. The opacity transitions are linear (directly mapped to scroll position) — no easing curves, no acceleration. The visitor's scroll IS the timeline. The linearity ensures that the visitor feels in complete control.

**Expected duration:** The dissolve spans one full viewport of scroll. At a contemplative scroll pace, this takes 8-12 seconds. At a quick pace, it takes 3-5 seconds. The visitor controls the duration entirely.

**User expectation:** The visitor expects to control the transformation. The dissolve is scrubbed to scroll — she learns this within the first few pixels of scroll movement and immediately takes ownership. The expectation is: "I am creating this moment."

**What should never happen:**
- The dissolve should never auto-play. The transformation is scroll-controlled, not time-controlled. Auto-play would remove the visitor's agency — the most powerful element of this interaction.
- The dissolve should never be a split-screen comparison. Side-by-side is clinical. The dissolve is cinematic — one image becoming another, like a scene in a film.
- The dissolve should never be faster than one viewport of scroll. A shorter distance would make the transition too quick — the visitor would not have time to feel the transformation unfolding. The full viewport distance ensures the moment is savored.
- The dissolve should never have an easing curve. Easing would create moments where the dissolve accelerates or decelerates — breaking the visitor's sense of control. The linearity is the control.

---

### 3.3 Parallax Scroll — The Depth Layer

**Purpose:** Create the sensation of moving through a three-dimensional space. The parallax differential between foreground and background layers generates depth — the visitor feels like she is walking through the salon, not scrolling past images.

**Emotion:** Immersion. The parallax creates the feeling of physical presence — the foreground moves faster than the background, just as it would if the visitor were walking through a real space. The immersion bypasses rational evaluation and creates sensory memory.

**Visual feedback:** Background images move at 80% of the scroll speed — a 20% differential. The foreground content (text, UI elements) moves at 100%. The difference creates the perception that background images are further away, generating depth without 3D effects.

The parallax is applied selectively — only to atmospheric and hero images, not to every image. Selective application ensures the effect remains impactful. When every image parallaxes, the effect loses its power and creates visual monotony.

**Motion style:** The parallax is subtle — felt, not seen. The 20% differential is calibrated to create depth perception without inducing dizziness or motion sickness. The parallax uses no additional easing — it is a direct, linear mapping of scroll position to element position.

**Expected duration:** The parallax is continuous — it persists for as long as the parallax-eligible image is in the viewport. The effect is present during scrolling and absent during stillness, maintaining the "scroll is the conductor" principle.

**User expectation:** The visitor expects depth. The parallax creates a subtle spatial quality that the visitor perceives subconsciously — "This feels like a space, not a flat page." The expectation is not for parallax specifically, but for the atmospheric quality that parallax creates.

**What should never happen:**
- Parallax should never exceed 15-20% differential. This is a constitutional rule. Higher rates induce dizziness and break the immersive spell.
- Every image should never parallax. Parallax is selective — hero images, atmospheric images, key visual moments. Applying it to every image creates monotony and motion sickness.
- Parallax should never interact with scroll-jacking. The native scroll physics are always preserved. Parallax modifies element positions, not scroll behavior.
- Parallax should never be so subtle that it becomes invisible. The 15-20% differential is the minimum that creates perceptible depth. Below 10%, the effect is invisible — wasted engineering for no perceptual benefit.

---

## 4. FOCUS

### 4.1 Keyboard Focus — The Gold Ring

**Purpose:** Provide a visible, high-contrast indicator for keyboard-navigated elements. The focus ring communicates: "This element is currently selected. You can activate it with Enter or Space." The focus indicator is the keyboard user's equivalent of the cursor hover — it is how they navigate and interact.

**Emotion:** Accessibility and confidence. The keyboard user sees the focus ring and knows exactly where they are in the interface. The confidence of clear navigation creates trust — "I can use this experience fully." The focus ring is not a compromise or a concession — it is a considered design element that serves all visitors.

**Visual feedback:** A 2px outline in our muted gold accent, offset 2px from the element's boundary. The ring is immediately visible against our warm off-white background — the gold-on-cream combination provides high contrast without harshness. The focus ring matches the accent color used for interactive states, creating visual consistency between hover and focus.

**Motion style:** The focus ring appears instantly (0ms transition) when the element receives focus and disappears instantly when focus moves to the next element. The instant appearance ensures the keyboard user always knows their current position — any delay would create a moment of uncertainty.

**Expected duration:** The focus ring persists for as long as the element retains focus. It does not timeout, fade, or disappear while the element is active. The ring is permanent until focus moves.

**User expectation:** The keyboard user expects to see where they are at all times. The focus ring provides this continuously. After encountering the first focus ring, the keyboard user learns the pattern — gold outline means "you are here."

**What should never happen:**
- Focus should never be removed via `outline: none`. This is a constitutional violation with no exceptions. Every interactive element must have a visible focus indicator.
- The focus ring should never be a faint, barely-visible outline. It must be clearly visible — 2px minimum, high contrast, our gold accent. If a keyboard user cannot see where they are, the focus ring has failed.
- The focus ring should never animate (fade in, scale, pulse). The appearance is instant. Keyboard users need immediate feedback — any animation creates a gap between action and confirmation.
- The focus ring should never match the hover state exactly. While both use our gold accent, the focus ring is an outline (not an underline or luminosity shift). The visual distinction ensures keyboard and mouse users receive appropriate feedback for their input method.

---

### 4.2 Form Field Focus — The Active State

**Purpose:** Indicate which form field is currently active and ready for input. The focus state communicates: "This field is yours. Type here."

**Emotion:** Clarity. The visitor is filling out a booking form — the focus state eliminates ambiguity about which field is active. The clarity reduces cognitive load and prevents errors. The feeling is of a well-organized desk — each field is clearly marked, clearly labeled, clearly active.

**Visual feedback:** The form field's border shifts from our warm grey to our muted gold accent. The label above the field shifts from our warm grey to our warm charcoal — creating a visual hierarchy change that draws attention to the active field. The combination of border color and label weight change creates an unmistakable active state.

**Motion style:** The border and label transitions occur simultaneously over 200ms with an ease-in-out curve. The transition is smooth — the field warms into its active state, consistent with the Warm Reveal philosophy applied to form elements.

**Expected duration:** The focus state persists for as long as the field retains focus. When focus moves to the next field, the previous field transitions back to its resting state (200ms) and the new field transitions to its active state (200ms) — a smooth handoff of attention.

**User expectation:** The visitor expects the field to be ready for input. The focus state confirms this and provides a clear visual anchor for typing. The label remaining visible (not disappearing as placeholder text) ensures the visitor never loses context.

**What should never happen:**
- Field labels should never disappear on focus. Placeholder text that replaces labels is an accessibility failure — the visitor loses context when they begin typing. Labels are always visible.
- The focus state should never be a thick, heavy outline. The border color change is sufficient feedback. Adding a heavy outline would create visual noise in the form layout.
- The focus state should never trigger a tooltip or helper text. Help text, when needed, is always visible — not hidden behind focus states. Critical information is never gated behind interaction.

---

### 4.3 Navigation Focus — The Active Item

**Purpose:** Indicate the current page or section in the navigation. The active state communicates: "You are here. This is your current location."

**Emotion:** Orientation. The visitor knows where she is at all times. The active navigation item provides a constant geographic reference — like a "You Are Here" marker on a museum map. The orientation eliminates the anxiety of being lost.

**Visual feedback:** The active navigation item shows the gold underline (matching the hover underline) plus a slight weight increase (from regular to medium weight). The combination of underline and weight change creates an active state that is distinct from both the resting state and the hover state.

**Motion style:** The active state transitions instantly when the page loads — there is no animation on the active indicator. The indicator is a fact, not an event. It exists because the visitor is on this page — it does not need to announce its presence.

**Expected duration:** Persistent. The active indicator remains visible for the duration of the page visit. It does not timeout, fade, or change.

**User expectation:** The visitor expects to see where she is in the site's structure. The active indicator provides this at a glance — even without scrolling, the visitor knows which section or page she is viewing.

**What should never happen:**
- The active state should never be the only visible navigation indicator. All navigation items must be clearly labeled and visible — the active state distinguishes the current page, not the navigation itself.
- The active state should never use a different color than the hover state. Both use our gold accent. The distinction is in the combination (underline + weight for active; underline alone for hover) — not in color.
- The active state should never animate on scroll. The indicator should not change as the visitor scrolls through sections on a single page — that would create constant visual noise. The active state reflects the page, not the scroll position.

---

## 5. TOUCH

### 5.1 Mobile Tap — The Finger Press

**Purpose:** Serve as the mobile equivalent of the click — the primary interaction for activating buttons, links, and interactive elements on touch devices. The tap must feel responsive, reliable, and satisfying at the size of a fingertip.

**Emotion:** Assurance. The visitor taps a button and feels an immediate response — the button compresses, the action begins. The assurance of responsive touch interaction builds confidence in the mobile experience. The feeling is of a well-made physical button that responds to touch with precision.

**Visual feedback:** The same press feedback as the desktop click — the button compresses to 97% scale. On touch devices, the hover states are not visible (no cursor), so the press feedback is the primary interaction confirmation. The compression is the visitor's assurance that her tap was registered.

**Motion style:** The compression uses the same ease-in-out curve as the desktop click — 100ms compress, 50ms hold, 150ms release. The consistency ensures that the mobile and desktop experiences feel like the same brand, the same quality, the same consideration.

**Expected duration:** 300ms for the press animation. The same as desktop. No acceleration for mobile — the mobile experience is not a compromise; it is an equal.

**User expectation:** The mobile visitor expects every tap to produce an immediate response. The 300ms press animation provides this. If the tap produces no visible response within 200ms, the visitor perceives the interface as broken.

**What should never happen:**
- Touch targets should never be smaller than 44×44px. This is a constitutional rule. The tap target must be large enough for the largest finger, with 8px spacing between adjacent targets.
- Tap feedback should never be absent. Every tappable element must provide visual feedback on touch — without it, the visitor cannot confirm her action was registered.
- Tap feedback should never differ from click feedback. The press animation is identical across input methods — touch and mouse. The interaction language is unified.
- Double-tap should never trigger zoom on interactive elements. Interactive elements must handle single taps correctly, without allowing the browser's double-tap-to-zoom behavior to interfere.

---

### 5.2 Mobile Swipe — The Horizontal Gesture

**Purpose:** Enable horizontal navigation on mobile where horizontal scrolling would otherwise be required. Swipe replaces horizontal scroll with a native mobile gesture that feels natural and expected.

**Emotion:** Familiarity. Swipe is a gesture every mobile user knows. Using it for horizontal content (such as time slot calendars or image sequences) creates a sense of native comfort — the experience speaks the same language as the device.

**Visual feedback:** The swiped content translates horizontally with the finger's movement — a direct, 1:1 mapping of finger position to content position. The content moves smoothly, without lag or rubber-banding at the edges.

**Motion style:** The swipe follows the finger exactly — no momentum, no inertia, no spring physics. When the finger stops, the content stops. When the finger reverses, the content reverses. The direct mapping communicates control and precision.

**Expected duration:** The swipe duration is determined entirely by the visitor's gesture speed. Fast swipes move content quickly. Slow swipes move content slowly. The system responds; it does not predict or override.

**User expectation:** The mobile visitor expects swipe to work for horizontal content. The gesture is native — the visitor should not have to learn it. The swipe should feel identical to swiping in any other mobile application.

**What should never happen:**
- Swiping should never trigger rubber-banding or elastic effects. Rubber-banding communicates "you've reached the end" through playful physics. Our brand communicates the same through a subtle visual cue (the content stops, the edge is visible).
- Swiping should never conflict with the vertical scroll. Horizontal swipe zones must be clearly defined — the visitor should never accidentally swipe horizontally when she intends to scroll vertically, or vice versa.
- Swiping should never be required for critical content. Swipe-accessible content is supplementary — never essential. Critical content (pricing, booking, contact) is always directly visible, not hidden behind a swipe gesture.

---

### 5.3 Mobile Long-Press — The Contextual Gesture

**Purpose:** Provide access to supplementary information that would be available via hover on desktop. The long-press is the mobile equivalent of hover — it reveals additional context without navigating away.

**Emotion:** Discovery. The visitor long-presses an element and additional information appears — a subtle tooltip or detail panel that enriches the current view. The feeling is of uncovering a layer — a detail that was always there but only visible when sought.

**Visual feedback:** A warm-toned tooltip or detail panel appears near the pressed element. The panel uses our standard typography and spacing — it is not a browser-native tooltip but a designed element that matches the brand's visual language. The panel appears with a 200ms ease-in-out fade.

**Motion style:** The tooltip fades in over 200ms — fast enough to feel responsive, slow enough to feel considered. The tooltip fades out when the visitor taps elsewhere (200ms fade). The tooltip does not follow the finger — it is anchored to the element that triggered it.

**Expected duration:** The tooltip persists until the visitor taps elsewhere. It does not auto-dismiss. The visitor controls the duration — she reads the information at her own pace, then dismisses it with a tap.

**User expectation:** The mobile visitor expects long-press to reveal supplementary details. The gesture is well-established in mobile interfaces. The visitor may not discover it immediately — but once discovered, it becomes a natural part of the interaction vocabulary.

**What should never happen:**
- Long-press should never trigger a context menu (the browser's native right-click equivalent). The long-press is our custom interaction — not the browser's default behavior.
- Long-press should never be required for critical information. Pricing, duration, and inclusions are always visible. Long-press reveals supplementary details only — never essential ones.
- The tooltip should never obscure the content it describes. It appears adjacent to the element, not on top of it. The tooltip adds context without blocking content.

---

## 6. DRAG

### 6.1 The Booking Flow Swipe — The Conversational Drag

**Purpose:** Enable the visitor to navigate between steps in the booking flow on mobile through a swipe gesture. The drag creates a conversational rhythm — each swipe is like turning a page in a dialogue.

**Emotion:** Flow. The booking flow moves forward and backward with the visitor's gesture — a fluid, continuous conversation rather than a series of discrete pages. The drag communicates: "This is a dialogue, not a form. Move through it at your pace."

**Visual feedback:** The current step translates horizontally as the visitor drags, while the next (or previous) step enters from the edge. Both steps are visible during the transition — the visitor can see where she is coming from and where she is going. The visual overlap creates spatial continuity.

**Motion style:** The drag follows the finger with direct mapping (1:1). As the visitor drags past a threshold (50% of viewport width), the transition completes automatically — the current step exits and the next step enters. If the visitor releases before the threshold, the current step snaps back. The snap-back uses an ease-out curve, decelerating to rest.

**Expected duration:** The drag duration is determined by the visitor's gesture. The auto-complete transition (after threshold) takes 300ms with an ease-out curve. The snap-back (below threshold) takes 250ms with an ease-out curve.

**User expectation:** The mobile visitor expects to swipe between booking steps. The gesture is natural for multi-step flows on mobile. The visitor expects forward swipe to advance and backward swipe to return.

**What should never happen:**
- The drag should never be possible beyond the first and last steps. The first step cannot be swiped backward; the last step cannot be swiped forward. The boundary is communicated by a subtle resistance (the content moves slightly, then returns).
- The drag should never lose the visitor's progress. Swiping backward does not reset the form. The visitor's selections are preserved across all steps.
- The drag should never conflict with the vertical page scroll. The booking flow occupies the full viewport — vertical scroll is disabled within the flow, preventing gesture conflicts.

---

## 7. TRANSITION

### 7.1 Page Transition — The Warm Dissolve

**Purpose:** Move between pages while maintaining atmospheric continuity. The transition is the digital equivalent of walking from one room to another in the same building — the light is consistent, the warmth is consistent, the feeling is consistent.

**Emotion:** Continuity. The visitor never feels the seam between pages. The outgoing page fades through a brief golden warmth before the incoming page emerges. The warmth during the transition maintains the brand atmosphere — even in the moment between pages, the visitor is in our world.

**Visual feedback:** The outgoing page fades to a brief warm golden wash (100-200ms) before the incoming page fades in from the same warm wash. The golden wash is the same warm tone as our background color — not a dramatic gold overlay, but a subtle atmospheric continuity.

**Motion style:** The transition is a dissolve — not a slide, not a wipe, not a zoom. Dissolving is atmospheric; sliding is spatial. We are not moving between locations (which would justify sliding) — we are transitioning between moments (which justifies dissolving). The dissolve uses an ease-in-out curve, symmetric and considered.

**Expected duration:** 300-400ms total. The outgoing page fades over 150-200ms, the golden wash is visible for 50-100ms, the incoming page fades in over 150-200ms. The total transition is fast enough to not impede navigation but slow enough to maintain atmosphere.

**User expectation:** The visitor expects a smooth transition. The dissolve provides this — the warm wash during the transition reassures the visitor that the brand experience is continuous. She never feels she has left the salon's world.

**What should never happen:**
- The transition should never be instant (0ms). An instant page change creates a jarring flash — the brain perceives it as a discontinuity. The dissolve fills the transition with warmth.
- The transition should never show a loading spinner. If the new page requires loading, the current page remains visible during the dissolve. The visitor never sees a spinner.
- The transition should never use slide, wipe, zoom, or flip animations. These are spatial transitions — they imply physical movement between locations. Our pages are not locations; they are moments. Moments dissolve.
- The transition should never be longer than 500ms. Longer transitions feel sluggish — the visitor waits for the page to appear. The 300-400ms range is the sweet spot between atmosphere and responsiveness.

---

### 7.2 Section Transition — The Breathing Fade

**Purpose:** Create visual separation between content sections while maintaining scroll continuity. The section transition is the chapter break in the scroll narrative — it signals: "That section is complete. Breathe. The next is beginning."

**Emotion:** Rhythm. The section transitions create the scroll's breathing pattern — dense content → breathing space → dense content → breathing space. The rhythm is physiological: the visitor's attention inhales (sparse) and exhales (dense). The transitions calibrate this rhythm.

**Visual feedback:** The outgoing section fades slightly (opacity reduces by 10-20%) as the breathing space arrives, and the incoming section fades in from 80-90% opacity as it enters the viewport. The opacity differential is subtle — the sections feel like they are gently overlapping during the scroll, not snapping between discrete blocks.

**Motion style:** The section transitions are scroll-linked — they happen as the visitor scrolls, not on a timer. The opacity changes are linear (directly mapped to scroll position), giving the visitor complete control over the transition pace.

**Expected duration:** The transition is continuous — it spans the duration of the scroll through the breathing space. At a contemplative pace, the transition takes 5-8 seconds. At a quick pace, it takes 2-3 seconds. The visitor controls the duration.

**User expectation:** The visitor expects a visual break between sections. The breathing space provides this — the transition is gentle, unhurried, and atmospheric. The visitor uses the breathing space to process the previous section before encountering the next.

**What should never happen:**
- Section transitions should never be abrupt. Content sections should never appear to "snap" into place. The opacity differential creates a gentle overlap that prevents visual abruptness.
- Section transitions should never include decorative dividers. No lines, no borders, no rules between sections. Separation comes from space and opacity — never from decoration.
- The breathing space should never feel like a loading state. The warm background is the breathing space — it is not empty; it is full of warmth. The visitor feels the atmosphere even in the space between content.

---

### 7.3 Booking Flow Transition — The Conversational Step

**Purpose:** Advance through the booking flow steps while maintaining the conversational rhythm. Each transition is a beat in the dialogue — one question answered, the next question appearing.

**Emotion:** Progress. The visitor moves through the booking flow with a sense of forward motion — each step is a step closer to completion. The transitions are gentle and rhythmic, creating the feeling of a guided conversation rather than a form.

**Visual feedback:** The current step cross-fades with the next step — the outgoing step fades while the incoming step fades in. The cross-fade is smooth, continuous, and centered — the visitor's eye stays in the center of the viewport, where both the outgoing and incoming content converge.

**Motion style:** The cross-fade uses an ease-in-out curve over 300-400ms. The symmetry of the curve communicates balance — neither rushing forward nor dragging backward. The transition is the same timing as the page transition, creating consistency across all navigation.

**Expected duration:** 300-400ms. The same as page transitions. Consistency across transition types creates a unified interaction vocabulary.

**User expectation:** The visitor expects a smooth advance to the next step. The cross-fade provides this — the transition is gentle, considered, and unhurried. The visitor never feels rushed through the booking flow.

**What should never happen:**
- The transition should never show a loading state between steps. If a step requires server data (available times, for example), the data loads within the step — the visitor never sees a spinner between steps.
- The transition should never jump or snap. Every step transition is a cross-fade. No exceptions. The rhythm must be consistent.
- The transition should never lose the visitor's scroll position. The booking flow is not a scrollable page — each step occupies the full viewport. The transition replaces one full-viewport step with another.

---

## 8. LOADING

### 8.1 Page Load — The Threshold Moment

**Purpose:** Create a designed passage between the noise of the internet and the sanctuary of our experience. The loading moment is not a wait — it is a threshold. The visitor is arriving somewhere, and the loading moment is the journey.

**Emotion:** Anticipation. The visitor has clicked a link or typed a URL. She is in transit. The loading moment transforms the wait from dead time into a designed moment of expectation. The feeling is of standing at the entrance of a beautiful room, the door just having closed behind you.

**Visual feedback:** The warm background color appears first — the very first thing the visitor sees. Then a single atmospheric element materializes: a soft bloom of warmth, a gentle emergence of the brand mark, or a subtle particle of light. The element appears against the warm background with no other content on screen.

**Motion style:** The atmospheric element fades in over 1000-1500ms — the longest entrance animation in the experience. The duration marks this as the threshold, the passage from outside to inside. The fade uses an ease-out curve, decelerating into its final state like a curtain settling.

**Expected duration:** 1-3 seconds total. The atmospheric element appears over 1000-1500ms, then dissolves into the hero image within 500ms. The total loading moment is 1.5-2 seconds — long enough to be designed, short enough to not test patience.

**User expectation:** The visitor expects something to happen. The atmospheric element fulfills this expectation — something IS happening. She is arriving. The loading moment transforms the passive wait into an active experience of arrival.

**What should never happen:**
- A generic loading spinner. Spinners communicate "this website is loading." Our loading moment communicates "you are arriving somewhere."
- A blank white screen. Even a millisecond of pure white before content appears breaks the warmth contract. The warm background is the first thing.
- A progress bar. Progress bars communicate duration. Our loading moment communicates experience.
- Multiple animated elements. One element, one motion, one feeling. Splitting attention destroys the threshold moment.
- Text that says "Loading..." or "Please wait." These words break the fourth wall. The visitor should never be reminded that she is using a website.

---

### 8.2 Image Load — The Progressive Reveal

**Purpose:** Ensure the visitor never sees a blank rectangle where an image should be. Images load progressively — a lightweight placeholder appears instantly, the full-resolution image replaces it as bandwidth allows.

**Emotion:** Smoothness. The visitor scrolls through the experience without encountering empty spaces. Every viewport contains something warm, something considered, something designed. The progressive load creates the feeling of a space that is always complete, always present, always beautiful.

**Visual feedback:** Before the full image loads, a placeholder appears — either a blurred, low-resolution version of the image or a solid warm color matching our background. The placeholder occupies the exact dimensions of the final image, preventing layout shift. The full-resolution image replaces the placeholder with a gentle cross-fade (300ms).

**Motion style:** The cross-fade from placeholder to full image uses an ease-in-out curve. The transition is gentle — the visitor perceives a subtle clarification, not a dramatic appearance. The image seems to sharpen slightly, like eyes adjusting to focus.

**Expected duration:** The placeholder appears instantly (0ms). The full image replaces it within 500-2000ms depending on connection speed. The cross-fade between them is 300ms.

**User expectation:** The visitor expects images to be present. The placeholder fulfills this — there is always something to see. When the full image loads, the experience improves — the visitor perceives the image as "arriving" rather than "appearing."

**What should never happen:**
- A blank rectangle should never be visible. Even for a millisecond. The placeholder must appear instantly — before the layout renders. Layout shift caused by late-loading images is a performance violation (CLS < 0.1).
- A loading spinner should never appear in place of an image. The spinner communicates "something is broken." The placeholder communicates "something is coming."
- The full image should never snap into place. The 300ms cross-fade ensures the transition from placeholder to full image is smooth. Snapping creates a jarring visual discontinuity.
- Images should never load all at once below the fold. Only above-the-fold images load immediately. All other images load as they enter the viewport (lazy loading). Loading everything simultaneously wastes bandwidth and slows the initial experience.

---

### 8.3 Booking Flow Load — The Conversational Opening

**Purpose:** Open the booking flow as a seamless extension of the browsing experience. The flow slides in from the edge — it does not replace the page, redirect to a new URL, or open in a modal. The visitor never leaves the brand world.

**Emotion:** Continuity. The visitor clicks "Book your experience" and the booking flow appears as if it was always there, waiting behind the edge of the viewport. The transition from browsing to booking is seamless — the same typography, the same colors, the same spacing, the same warmth. The feeling is of a concierge appearing at your side, not a form being shoved in your face.

**Visual feedback:** The booking flow slides in from the right edge of the viewport — a full-height panel that occupies 100% of the viewport width. The current page remains visible behind the flow for the first 100-200ms of the slide, creating spatial continuity — the visitor sees the page she was browsing as the flow arrives.

**Motion style:** The slide-in uses an ease-out curve — the panel decelerates into its final position, communicating the weight of a well-made door sliding open. The curve starts fast (the panel enters quickly) and decelerates (the panel settles into position). The total animation is 300-400ms.

**Expected duration:** 300-400ms for the slide-in. The same as page transitions. The booking flow arrival is treated as a navigation event — same timing, same consideration, same weight.

**User expectation:** The visitor expects the booking flow to begin. The slide-in provides this — the flow arrives within half a second of the click. The visitor is never left waiting, wondering if her click was registered.

**What should never happen:**
- The booking flow should never open in a new tab or window. The visitor stays in the same tab, the same context, the same world.
- The flow should never be a pop-up modal with a dark overlay. The flow slides in from the edge — it does not obscure the page behind it with a dark curtain. The page remains visible, maintaining context.
- The flow should never redirect to a third-party platform (Fresha, Mindbody, etc.). The flow is embedded in our experience. The visual design is identical to the rest of the website. The visitor never leaves the brand.
- The slide-in should never be instant (0ms). An instant appearance would be jarring — the flow would suddenly replace the page. The 300-400ms slide provides a designed transition that maintains spatial awareness.
- The flow should never take more than 500ms to appear. Longer delays create uncertainty — "Did my click work?" The 300-400ms range is the maximum for maintaining responsive perception.

---

## 9. IDLE

### 9.1 The Resting State — The Held Shot

**Purpose:** Define what the experience looks like when the visitor is not interacting. The idle state is not empty — it is a composed stillness that maintains the brand atmosphere even in the absence of input.

**Emotion:** Presence. The experience holds its state with dignity. Nothing pulses, nothing animates, nothing demands attention. The stillness communicates: "We are here. We are not going anywhere. We will be here when you are ready." The idle state is the digital equivalent of a room that is beautiful even when no one is looking.

**Visual feedback:** All elements are in their resting states. Navigation links show their default typography. CTAs show their resting gold accent. Images are fully loaded and at full opacity. The page is complete, composed, and still.

**Motion style:** No motion. The idle state is pure stillness — the held shot in cinematic terms. The camera does not move. Nothing changes. The composition holds.

**Expected duration:** The idle state persists for the duration of the visitor's inattention. It does not timeout, fade, dim, or change. The experience waits with the patience of a well-designed room.

**User expectation:** The visitor expects the page to remain as she left it. When she returns her attention (moves the cursor, scrolls, taps), the page responds — but while she is idle, the page simply holds.

**What should never happen:**
- No element should pulse, animate, or blink to attract attention during idle. Attention-seeking animation communicates desperation — "Come back! Look at me!" Our brand communicates confidence — "We are here whenever you are ready."
- No auto-playing carousels or sliders. The hero is a single image. The page does not rotate content while the visitor is away. The content is fixed, composed, and certain.
- No countdown timers or session timeouts. The visitor's session does not expire during idle. There is no urgency to return. The experience waits.
- No scroll-to-top or auto-scroll behavior. The page stays exactly where the visitor left it. No element moves. No position changes. The stillness is absolute.
- No "Are you still there?" prompts. The experience never questions the visitor's presence. It simply holds.

---

### 9.2 The Scroll Pause — The Lingered Moment

**Purpose:** Define what happens when the visitor stops scrolling mid-section. The pause is a designed moment of rest — the visitor has chosen to linger, and the experience rewards that choice with stillness.

**Emotion:** Contemplation. The visitor stops scrolling because something caught her eye — an image, a word, a face. The experience holds its state, allowing the visitor to absorb the content at her own pace. The pause is not an interruption — it is a privilege. The content has earned the visitor's lingering attention.

**Visual feedback:** All scroll-linked animations reach their resting state and hold. Parallax elements are at their resting positions. Section reveals have completed. The viewport shows a static, composed frame — a designed composition that rewards lingering attention.

**Motion style:** Complete stillness. The scroll has stopped; therefore the animations have stopped. The experience is entirely static — a beautiful, composed frame that the visitor can study, absorb, and enjoy without distraction.

**Expected duration:** The pause lasts as long as the visitor chooses. Seconds or minutes. The experience does not催促 the visitor to continue. The stillness is infinite.

**User expectation:** The visitor expects to be able to linger without interruption. The experience provides this — no animations continue, no elements shift, no attention is demanded. The visitor's pause is respected.

**What should never happen:**
- No auto-scroll or gentle nudge to continue scrolling. The visitor pauses because she wants to. The experience does not manipulate her into continuing.
- No animation that plays on a timer during the pause. If an element was animating, it stops when the scroll stops. No element begins a new animation while the scroll is paused.
- No element that fades out or diminishes during a long pause. Content does not disappear because the visitor lingered. The composition holds indefinitely.

---

## 10. SECTION ENTRY

### 10.1 Content Section Entry — The Warm Reveal

**Purpose:** Introduce each new content section with a designed moment of arrival. The section enters the viewport and reveals itself with the Warm Reveal — our signature interaction that communicates: "This content has been presented to you with care."

**Emotion:** Welcome. Each section arrival is a small greeting — the content fades in from slight transparency, settles into position, and presents itself. The visitor feels welcomed into each new chapter of the narrative. The feeling is of doors opening gently as she walks through a beautiful building.

**Visual feedback:** The section content enters from 80-90% opacity and translates upward by 20-30px. The near-opacity means the content is almost visible before the animation begins — the reveal is a gentle clarification, not a dramatic appearance. The translation creates a subtle sense of the content "arriving" from below, as if rising into view.

**Motion style:** The reveal uses an ease-out curve — the content decelerates into its final position, communicating weight and deliberateness. The curve starts with momentum (the content enters with energy) and decelerates (the content settles into place). The motion feels natural — like an object sliding to rest on a surface.

**Expected duration:** 400-600ms. The standard section reveal timing. Fast enough to not impede scroll progress, slow enough to be perceived as a designed moment. The reveal is scroll-linked — it plays when the section enters the viewport, and it stops if the visitor stops scrolling.

**User expectation:** The visitor expects new content to appear as she scrolls. The reveal fulfills this — each new section arrives with a designed moment that rewards the scroll. The consistency of the reveal across all sections creates a learnable pattern.

**What should never happen:**
- The reveal should never start from 0% opacity (fully transparent). Starting from 0% creates a dramatic appearance — content materializing from nothing. The 80-90% starting opacity ensures the content is almost present before the animation begins — the reveal clarifies, not materializes.
- The reveal should never translate more than 30px. Larger translations feel like the content is "flying in" — a spectacle, not a subtle entrance. 20-30px is the maximum that creates depth without creating drama.
- The reveal should never take longer than 600ms. Longer durations feel sluggish — the visitor waits for the content to arrive. 400-600ms is the window where the reveal is perceived as "considered" without being "slow."
- The reveal should never be different for the same component type. Every service section reveals the same way. Every artisan profile reveals the same way. Consistency is the foundation of the interaction vocabulary.

---

### 10.2 Hero Entry — The First Arrival

**Purpose:** Mark the hero section as the most important moment in the experience. The hero entry is the longest, most considered entrance animation — the threshold moment that determines whether the visitor continues or leaves.

**Emotion:** Awe. The hero image materializes from warmth with the longest entrance animation in the experience. The duration communicates: "This is the most important moment. Give it your attention." The awe is the emotional foundation upon which everything else builds.

**Visual feedback:** The hero image fades from 80-90% opacity to full opacity — the Warm Reveal at its most generous scale. The image fills the entire viewport. No other elements are present. The image IS the composition.

**Motion style:** The reveal uses an ease-out curve over 800-1200ms — the longest duration of any content reveal. The extended duration marks the hero as the threshold, the passage from outside to inside. The curve is gentle, unhurried, and considered — the image arrives with the weight of a heavy curtain being drawn.

**Expected duration:** 800-1200ms. This is the only time-linked animation on the page (it plays on load, not on scroll). The duration is deliberate — it creates the pause between the loading moment and the first scroll, the pause during which the visitor forms her first impression.

**User expectation:** The visitor expects the first image to be extraordinary. The reveal delivers this — the image materializes slowly, giving the visitor time to absorb its composition, its lighting, its atmosphere. The extended duration ensures the first impression is considered, not glanced.

**What should never happen:**
- The hero should never use the standard 400-600ms section reveal. The hero deserves more time — 800-1200ms. The standard reveal would diminish the hero's significance.
- The hero should never translate upward. The hero fades only — no vertical movement. The fade communicates emergence (from warmth into visibility). Translation would communicate motion (sliding into place). The hero emerges; it does not slide.
- The hero should never auto-play a second animation after the reveal. Once the image is fully visible, it holds. Still. No parallax begins. No text appears. The stillness IS the hero's statement.

---

### 10.3 Testimonial Entry — The Cascade

**Purpose:** Introduce the social proof with a rhythm that mimics multiple people speaking. The staggered cascade creates the feeling of a chorus of voices — one after another, building a narrative of trust.

**Emotion:** Accumulation. Each testimonial arrives 200ms after the previous — the visitor perceives a building chorus, not individual statements. The accumulation creates the sense of community: "Many people have trusted this place. I can too."

**Visual feedback:** Each testimonial fades in from 80% opacity with no translation — a simple, clean entrance that respects the text's readability. The testimonials are large, named, and specific. Each one occupies its own compositional moment.

**Motion style:** The fade-in uses an ease-out curve over 400ms. The simplicity of the motion respects the content — the testimonials are powerful enough that they need no enhancement. The stagger (200ms between each) creates rhythm without creating spectacle.

**Expected duration:** Each testimonial fades in over 400ms, with 200ms between each. For six testimonials, the complete cascade takes approximately 2.2 seconds. The cascade is scroll-linked — it plays as the testimonials enter the viewport.

**User expectation:** The visitor expects the testimonials to appear as she scrolls. The staggered cascade fulfills this — each testimonial arrives with its own moment, creating a rhythm of voices.

**What should never happen:**
- Testimonials should never all appear simultaneously. Simultaneous appearance would create a wall of text — overwhelming and unreadable. The stagger creates a digestible rhythm.
- The testimonial entrance should never include translation, scale, or rotation. Text enters with opacity only. Any movement on body text reduces readability and creates visual noise.
- The stagger should never be less than 100ms. Shorter staggers would create a "machine gun" effect — testimonials appearing too quickly to be individually perceived. 200ms is the minimum for each testimonial to register as its own moment.

---

## 11. SECTION EXIT

### 11.1 Content Section Exit — The Gentle Dissolve

**Purpose:** Create a smooth departure from each content section as the visitor scrolls past. The exit is the mirror of the entry — where the entry welcomed the visitor, the exit releases her. The section does not disappear — it dissolves, maintaining its presence even as it recedes.

**Emotion:** Completion. The visitor has absorbed the section's content and is ready to move on. The exit confirms this readiness — the section recedes gently, giving the visitor a sense of having completed a chapter. The feeling is of turning a page — the previous page does not vanish; it simply gives way to the next.

**Visual feedback:** The section content fades to 80-90% opacity and translates downward by 10-15px as it exits the viewport above. The opacity reduction is subtle — the section becomes slightly transparent as it recedes, creating a sense of depth (the section is "behind" the scroll position). The translation is smaller than the entry translation (10-15px vs. 20-30px), creating an asymmetric rhythm — entries are more prominent than exits.

**Motion style:** The exit uses an ease-in curve — the content accelerates slightly as it leaves, like an object being gently pulled. The ease-in is the mirror of the ease-out entry — where entries decelerate into rest, exits accelerate into departure. The asymmetry creates natural rhythm.

**Expected duration:** The exit is scroll-linked — it happens as the section scrolls out of the viewport. The duration is determined by scroll speed. At a contemplative pace, the exit takes 2-4 seconds. At a quick pace, it takes 1-2 seconds.

**User expectation:** The visitor expects sections to recede as she scrolls past. The dissolve provides this — the section does not snap out of view but gently fades. The transition is smooth and continuous.

**What should never happen:**
- Sections should never snap out of view. An abrupt disappearance creates a visual discontinuity — the brain perceives it as a glitch. The dissolve ensures continuous visual flow.
- Previously revealed content should never re-hide on scroll-back. The exit is forward-facing only. When the visitor scrolls backward, the section is already revealed — it does not re-animate.
- The exit should never be more prominent than the entry. Entries are welcome moments (20-30px translation, 400-600ms). Exits are release moments (10-15px translation, scroll-linked). The asymmetry ensures arrivals feel more significant than departures.

---

### 11.2 Hero Exit — The Legacy Fade

**Purpose:** Transition the hero from the dominant visual element to the background of the narrative. The hero exit must be the most considered exit in the experience — the hero's departure sets the tone for everything that follows.

**Emotion:** Transition. The hero fades and translates upward as the visitor scrolls — the image recedes but does not disappear. The fading image creates a legacy — its warmth and atmosphere persist as a subliminal backdrop to the content below. The visitor carries the hero's impression forward.

**Visual feedback:** The hero image fades to lower opacity (60-70%) and translates upward at a parallax rate (80% of scroll speed). The image does not disappear — it becomes a background element, an atmospheric layer that the content scrolls over. The hero's warmth persists as a subliminal tone.

**Motion style:** The hero exit is parallax-linked — the image's upward translation is mapped to scroll position. The exit is slow and gradual — the hero takes a full viewport of scroll to fully recede. The extended exit ensures the hero's impression lingers.

**Expected duration:** The hero exit spans one full viewport of scroll. At a contemplative pace, this takes 8-12 seconds. The extended duration ensures the hero's impact is not cut short — the image fades with the same patience with which it arrived.

**User expectation:** The visitor expects the hero to give way to content below. The parallax fade provides this — the hero recedes but persists, creating depth and continuity. The visitor never experiences a sudden absence of the hero — it fades, it does not vanish.

**What should never happen:**
- The hero should never disappear abruptly. A sudden absence would create a visual void where the most impactful element was. The fade ensures continuity.
- The hero should never parallax at a different rate than other parallax elements. The 80% rate is consistent across the experience. Inconsistent rates create visual confusion.
- The hero exit should never be faster than one viewport of scroll. A faster exit would diminish the hero's lasting impression. The Peak-End Rule demands that the hero's impact persists.

---

## THE INTERACTION CONSISTENCY MAP

### How Interactions Behave Across Contexts

Every interaction type follows consistent rules across all contexts. The consistency ensures the visitor learns the interaction language once and applies it everywhere.

```
INTERACTION TYPE        │ HOVER              │ CLICK              │ FOCUS
════════════════════════╪════════════════════╪════════════════════╪════════════════════
Primary CTA Button      │ Luminosity shift   │ 97% press          │ Gold ring
                        │ 200-300ms          │ 300ms              │ Instant
────────────────────────┼────────────────────┼────────────────────┼────────────────────
Navigation Link         │ Gold underline     │ Color to gold      │ Gold ring
                        │ 200-300ms draw     │ Instant            │ Instant
────────────────────────┼────────────────────┼────────────────────┼────────────────────
Service Card            │ Warmth + 1-2px lift│ Navigate to page   │ Gold ring
                        │ 200-300ms          │ 300-400ms dissolve │ Instant
────────────────────────┼────────────────────┼────────────────────┼────────────────────
Artisan Portrait        │ None (still)       │ Navigate to page   │ Gold ring
                        │                    │ 300-400ms dissolve │ Instant
────────────────────────┼────────────────────┼────────────────────┼────────────────────
Testimonial Text        │ None (still)       │ None (not clickable)│ N/A
────────────────────────┼────────────────────┼────────────────────┼────────────────────
Form Field              │ Cursor change      │ N/A                │ Border to gold
                        │                    │                    │ Label weight increase
                        │                    │                    │ 200ms ease-in-out
────────────────────────┼────────────────────┼────────────────────┼────────────────────
Booking Artisan Card    │ Warmth shift       │ Gold border select │ Gold ring
                        │ 200-300ms          │ 200ms              │ Instant
────────────────────────┼────────────────────┼────────────────────┼────────────────────
Time Slot               │ Luminosity shift   │ Gold fill select   │ Gold ring
                        │ 200ms              │ 200ms              │ Instant
```

---

## THE INTERACTION TIMING FRAMEWORK

### How Fast Every Interaction Responds

```
INTERACTION CATEGORY          │ MIN       │ STANDARD  │ MAX       │ REASONING
══════════════════════════════╪═══════════╪═══════════╪═══════════╪════════════════════
Hover response                │ 150ms     │ 200-300ms │ 400ms     │ Responsive but physical
Click/press response          │ 100ms     │ 300ms     │ 400ms     │ Physical weight feel
Section reveal (entry)        │ 300ms     │ 400-600ms │ 600ms     │ Considered but not slow
Hero reveal                   │ 800ms     │ 1000ms    │ 1500ms    │ Threshold moment (longest)
Page transition               │ 250ms     │ 300-400ms │ 500ms     │ Atmospheric continuity
Booking flow transition       │ 250ms     │ 300-400ms │ 500ms     │ Consistent with pages
Confirmation animation        │ 800ms     │ 1000ms    │ 1200ms    │ Emotional peak (longest interaction)
Loading moment                │ 1000ms    │ 1250ms    │ 1500ms    │ Designed threshold
Image load cross-fade         │ 200ms     │ 300ms     │ 400ms     │ Subtle clarification
Focus indicator               │ 0ms       │ 0ms       │ 0ms       │ Instant (accessibility)
```

---

## THE INTERACTION ANTI-PATTERNS

### The Absolute Prohibitions

These interaction behaviors will never appear in our experience. Each prohibition is rooted in a specific brand value that the pattern would compromise.

| Prohibition | Pattern | Why We Refuse |
|---|---|---|
| **No bouncing, rubber-banding, or elastic effects** | Spring physics, elastic returns, overshoot | Communicates playfulness — appropriate for messaging apps, not luxury experiences |
| **No scroll-jacking** | Fixed scroll speeds, forced snapping, hijacked scroll behavior | Breaks the most fundamental web interaction. The visitor controls the scroll. Always. |
| **No auto-playing content** | Auto-advancing carousels, auto-playing video with sound, timed reveals | The visitor controls the experience. Always. Auto-play communicates desperation. |
| **No pop-up overlays** | Email capture, exit-intent, promotional overlays | Communicates "our needs are more important than your experience." |
| **No cursor-following effects** | Mouse trail, magnetic cursor, cursor-reactive elements | Desktop-only interactions that create visual noise. Our interactions are subtle. |
| **No decorative animation** | Particles, confetti, fireworks, spinning elements | Motion communicates; it never decorates. |
| **No forced tutorials** | Onboarding overlays, walkthrough tooltips, "how to use" prompts | If a tutorial is needed, the interface has failed. |
| **No countdown timers** | "Only X left," "Offer ends in," urgency mechanics | Urgency is the opposite of our brand. We attract; we never chase. |
| **No chatbot auto-greetings** | "Hi! How can I help you?" after 10 seconds | Communicates neediness, not confidence. We are available when the visitor is ready. |
| **No skeleton shimmer loaders** | Grey pulsing placeholder blocks | Generic loading pattern. Our loading experience is designed, not defaulted. |

---

## THE INTERACTION EMOTION MAP

### How Each Interaction Makes the Visitor Feel

```
INTERACTION              │ INTENDED FEELING              │ ANTI-FEELING (IF BROKEN)
═════════════════════════╪═══════════════════════════════╪═══════════════════════════════
Hover (link)             │ "I see you"                   │ Ignored, invisible
Hover (button)           │ "I am here"                   │ Desperate, loud
Hover (card)             │ "Come explore"                │ Aggressive, jumpy
Hover (portrait)         │ (stillness = respect)         │ Manipulated, objectified
Click (CTA)              │ "Your action is valued"       │ Disconnected, broken
Click (nav)              │ "You are going somewhere"     │ Lost, disoriented
Scroll                   │ "There is more to discover"   │ Exhausting, endless
Scroll (transformation)  │ "You are the author"          │ Helpless, passive
Focus (keyboard)         │ "You are here"                │ Lost, invisible
Touch (tap)              │ "Your touch is felt"          │ Unresponsive, broken
Touch (swipe)            │ "This flows naturally"        │ Conflicting, frustrating
Section entry            │ "Welcome to this chapter"     │ Abrupt, jarring
Section exit             │ "That chapter is complete"    │ Vanishing, discontinuous
Page transition          │ "You are still in our world"  │ Disconnected, lost
Loading                  │ "You are arriving"            │ Waiting, anxious
Idle                     │ "We are here when you are"    │ Demanding, urgent
Confirmation             │ "You are welcome here"        │ Transactional, cold
```

---

## THE FINAL DIRECTOR'S NOTE

Every interaction in this experience is a micro-conversation between the visitor and the brand. A hover is a greeting. A click is a handshake. A scroll is a step forward. A focus ring is a compass point. A loading moment is a threshold. A confirmation is a welcome.

The quality of these micro-conversations determines the quality of the overall experience. A brand that greets with warmth, confirms with precision, and welcomes with beauty is a brand that earns trust — not through its content, but through its conduct.

The visitor may not consciously notice any individual interaction. But she will notice the cumulative effect: an experience that feels considered, responsive, and warm. An experience where every touch is met with a response that communicates: "We thought about this. We cared about this. We made this for you."

That is the standard. Every interaction must meet it.

**The one thing to remember:**

If someone says "nice interaction," the interaction is too loud. The best interaction is the one you don't consciously notice — but you would absolutely notice its absence. Design for that absence. Make every interaction so considered, so consistent, so warm that the visitor never thinks about the interaction — she only thinks about the experience.

---

*This document defines the complete interaction vocabulary of the digital experience. It should be consulted during design, during development, during QA testing, and during design review. Every interaction decision should be tested against the question: "Does this interaction communicate warmth, consideration, and confidence?"*

*Document prepared: July 2026*
*Source documents: CREATIVE_DIRECTION.md, DESIGN_LANGUAGE.md, VISUAL_RULES.md, EXPERIENCE_STORYBOARD.md, SCROLL_STORY.md, EMOTIONAL_TIMELINE.md*
*Constraint: Interaction design only — no code, no implementation details*

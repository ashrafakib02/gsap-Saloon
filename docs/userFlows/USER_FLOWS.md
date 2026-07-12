# USER_FLOWS.md
## The Complete Journey Architecture

> "Every visitor arrives with a question. Every scroll answers it. Every flow resolves it. The user flow is not a diagram — it is the visitor's inner monologue made visible, their hesitation made navigable, their desire made inevitable."

---

## DOCUMENT PURPOSE

This document maps every significant journey a visitor can take through The Sovereign Artisan's digital presence. It is the behavioral architecture — the complete inventory of paths, decisions, emotional states, friction points, and recovery mechanisms that define how a visitor moves from arrival to commitment.

This is not a wireframe. This is not a prototype. This is the strategic layer that precedes every design and development decision — the understanding of *why* a visitor moves, *where* she hesitates, *what* she needs to see, and *how* the experience must respond to each moment of uncertainty.

**How to use this document:**

- During UX review, every user flow is measured against these paths
- During development, every interaction is verified against the expected journey
- During content creation, every piece of copy is evaluated for its role in the flow
- During conversion optimization, this document is the first reference
- When a new feature is proposed, it must be placed within an existing flow or justify a new one

**Relationship to other documents:**

- PRODUCT_VISION.md — Business goals, audience segments, conversion targets
- COMPETITOR_RESEARCH.md — Market landscape, competitive positioning
- CREATIVE_DIRECTION.md — Visual and emotional identity
- DESIGN_LANGUAGE.md — Compositional grammar, spacing, typography
- VISUAL_RULES.md — Constitutional rules (always-do, never-do)
- EXPERIENCE_STORYBOARD.md — Cinematic narrative structure (scene-by-scene)
- SCROLL_STORY.md — Pacing and emotional architecture
- EMOTIONAL_TIMELINE.md — Feeling at every step
- INTERACTION_TIMELINE.md — Tactile vocabulary
- SIGNATURE_MOMENTS.md — The 10 unforgettable moments
- SECTION_PURPOSE.md — Why every section exists
- FEATURE_DEFINITION.md — Product scope, feature priorities
- INFORMATION_ARCHITECTURE.md — The structural blueprint
- **USER_FLOWS.md — The behavioral architecture**

---

## 1. THE VISITOR PERSONAS

Before mapping flows, we must understand who is flowing. Three primary personas, each with distinct motivations, decision patterns, and emotional needs.

### Persona 1: The Intentional Woman (Primary)

**Who she is:** Professional, 28-50, household income $120K+, college-educated, urban or affluent suburban. She trades money for time, for quality, for the elimination of guesswork.

**How she arrives:**
- Instagram referral (40% estimated)
- Google search for "salon in Marrakech" or "best hairdresser near me" (25%)
- Word-of-mouth recommendation (20%)
- Direct URL / bookmark (10%)
- Social media exploration (5%)

**Her digital behavior:**
- 80%+ begin on mobile
- Forms first impression in 50 milliseconds
- Reads 7-12 reviews before booking
- Expects real-time online booking with stylist selection
- Will abandon booking if forced to call or use external platform
- Researches extensively before committing

**Her decision pattern:** Research > Compare > Validate > Decide > Book. She is methodical. She does not impulse-buy luxury services. She needs to feel certain before she commits.

**Her emotional needs:** Confidence that she is in expert hands. Proof that the quality matches the promise. Ease of booking that matches the premium positioning.

### Persona 2: The Bride (Secondary)

**Who she is:** 25-38, planning the most photographed day of her life. Simultaneously excited and overwhelmed. Needs to feel she is in expert hands.

**How she arrives:**
- Google search for "bridal makeup Marrakech" or "wedding hair stylist" (35%)
- Instagram bridal hashtag discovery (30%)
- Wedding planner recommendation (20%)
- Word-of-mouth from other brides (15%)

**Her decision pattern:** Discover > Validate expertise > Assess emotional partnership > Compare packages > Book consultation. She needs more emotional reassurance than the Intentional Woman.

**Her emotional needs:** Confidence that the salon has extensive bridal expertise. Visual proof of previous work. A sense of emotional partnership, not transactional service.

### Persona 3: The Gift Buyer (Tertiary)

**Who she is:** Any age, purchasing a gift card or package for someone they love. Needs clarity, simplicity, and a purchase experience that feels as considered as the gift itself.

**How she arrives:**
- Google search for "luxury gift card salon" (30%)
- Direct URL from a recommendation (25%)
- Instagram discovery (25%)
- Browsing the salon website and seeing the Gift section (20%)

**Her decision pattern:** Discover > Evaluate gift options > Assess presentation quality > Purchase > Deliver. She needs speed and simplicity — she is buying for someone else, not herself.

**Her emotional needs:** Confidence that the gift will feel premium. Clarity about what the recipient will receive. A purchase flow that takes under 60 seconds.

---

## 2. PRIMARY USER FLOW

### The Ideal Conversion Path

This is the single most important user flow in the entire experience. It represents the visitor who arrives, scrolls the complete experience, and books. Every design decision in the experience exists to make this flow feel inevitable.

```
PRIMARY USER FLOW: ARRIVAL TO BOOKING
======================================

ARRIVAL
  |  Source: Any (search, social, referral, direct)
  |  Device: Any (mobile, tablet, desktop)
  |  Intent: Low to moderate (exploring, not yet committed)
  |
  v
THRESHOLD (1-3 seconds)
  |  Action: Page loads, warm background appears, atmospheric element
  |  Emotion: Anticipation > Curiosity
  |  Trust Signal: First visual quality impression
  |  Friction Risk: Slow load > bounce (P0 performance requirement)
  |
  v
HERO IMAGE (8-12 seconds)
  |  Action: Full-viewport editorial photograph reveals
  |  Emotion: Awe > "This is different"
  |  Trust Signal: Extraordinary photography quality
  |  Conversion Signal: Halo Effect activated
  |
  v
NARRATIVE WHISPER (3-5 seconds)
  |  Action: Visitor reads the brand's thesis statement
  |  Emotion: Calm > Recognition > "They understand me"
  |  Trust Signal: Brand voice alignment
  |  Conversion Signal: Philosophical alignment established
  |
  v
ATMOSPHERE (10-15 seconds)
  |  Action: Visitor scrolls through immersive environmental images
  |  Emotion: Desire > "I want to be there"
  |  Trust Signal: Sensory immersion creates belief in the physical space
  |  Conversion Signal: Desire crystallizes
  |
  v
BREATHING SPACE (2-3 seconds)
  |  Action: Full viewport of warm background, no content
  |  Emotion: Rest > Processing
  |  Function: Cognitive reset before service chapters
  |
  v
SERVICE CHAPTERS (40-60 seconds total)
  |  Action: Visitor scrolls through Hair > Color > Bridal > Spa
  |  Emotion: Curiosity > Longing > Tenderness > Relief
  |  Trust Signal: Transparent pricing, editorial photography, artisan names
  |  Conversion Signal: "These people are extraordinary. I want that feeling."
  |  Key Moment: Transformation Dissolve (Color section) -- the emotional peak
  |
  v
ARTISANS (10-15 seconds)
  |  Action: Visitor meets the people behind the craft
  |  Emotion: Connection > "I know who I want to book with"
  |  Trust Signal: Faces, names, specialties, real people
  |  Conversion Signal: Parasocial connection formed
  |
  v
TESTIMONIALS (15-25 seconds)
  |  Action: Visitor reads authentic, named testimonials
  |  Emotion: Trust > "Real people love this place"
  |  Trust Signal: Specific, named, attributed social proof
  |  Conversion Signal: Remaining doubt eliminated
  |
  v
LONGEST BREATHING SPACE (8-12 seconds)
  |  Action: Full viewport of warm background, the longest pause
  |  Emotion: Trust > Certainty > Internal decision made
  |  Function: Decision settling before encountering the CTA
  |
  v
BOOKING INVITATION
  |  Action: Visitor encounters "Your chair is waiting" with booking CTA
  |  Emotion: Confidence > "I'm ready"
  |  Trust Signal: Radical simplicity communicates confidence
  |  Conversion Signal: The invitation confirms the internal decision
  |
  v
CTA CLICK
  |  Action: Visitor taps "Book your experience"
  |  Response: Booking flow slides in from edge
  |  Emotion: Ease > The experience continues seamlessly
  |
  v
BOOKING STEP 1: CHOOSE SERVICE (10-20 seconds)
  |  Action: Visitor selects service category
  |  Emotion: Clarity > "I know what I want"
  |  Friction Risk: Too many options (mitigated by 4 categories only)
  |
  v
BOOKING STEP 2: CHOOSE ARTISAN (10-15 seconds)
  |  Action: Visitor selects preferred artisan
  |  Emotion: Familiarity > "I remember her from the gallery"
  |  Trust Signal: Same portraits from the scroll, now interactive
  |
  v
BOOKING STEP 3: CHOOSE DATE (15-30 seconds)
  |  Action: Visitor selects available date from calendar
  |  Emotion: Commitment > "This is real"
  |  Friction Risk: No availability for preferred date
  |
  v
BOOKING STEP 4: CHOOSE TIME (5-10 seconds)
  |  Action: Visitor selects time slot
  |  Emotion: Completion > "Almost there"
  |  Friction Risk: Preferred time unavailable
  |
  v
BOOKING STEP 5: CONTACT DETAILS (20-40 seconds)
  |  Action: Visitor enters name, email, phone
  |  Emotion: Trust > "This feels safe"
  |  Friction Risk: Too many fields (mitigated by minimal required fields)
  |
  v
BOOKING STEP 6: CONFIRMATION
  |  Action: Booking confirmed, details displayed, warm animation
  |  Emotion: Completion > Satisfaction > Anticipation
  |  Trust Signal: Clear details, warm message, generous animation (800-1200ms)
  |
  v
POST-BOOKING
  |  Email confirmation sent (warm, specific, unhurried)
  |  SMS confirmation sent (if opted in)
  |  Visitor carries the warmth with her
```

**Total estimated duration:** 2-4 minutes (scroll + booking flow)

**Conversion probability:** This flow targets the 4-7% booking initiation rate — the visitor who arrives with moderate intent and is converted by the cumulative power of the experience.

---

## 3. USER FLOW CATALOG

### Flow 1: First-Time Visitor — The Discovery Journey

**Starting Point:** External source (Google search, Instagram referral, word-of-mouth link, or social media). Visitor has never encountered the brand before.

**User Goal:** Determine if this salon is worth her time and money. Answer the question: "Is this place legitimate and will I be taken care of?"

**Business Goal:** Create a Halo Effect that establishes premium positioning within the first 3 seconds. Build enough trust and desire to initiate a booking, or at minimum, create a memory that drives a return visit.

**Decision Points:**
1. **The 3-Second Decision (Threshold > Hero):** Does she stay or bounce? The first visual impression determines whether she continues scrolling. This is the most critical decision point in the entire flow — 50%+ of bounces occur here.
2. **The Alignment Decision (Narrative Whisper):** Does the brand's philosophy resonate? The thesis statement must create recognition: "Yes, this is what I have been looking for."
3. **The Desire Decision (Atmosphere > Services):** Does she want to be in this space? The atmospheric immersion must shift her from observer to participant.
4. **The Trust Decision (Artisans > Testimonials):** Does she trust these people? The human faces and authentic voices must eliminate doubt.
5. **The Commitment Decision (Booking Invitation > CTA Click):** Is she ready to book? The radical simplicity of the invitation must feel like the natural next breath.

**Trust Signals:**
- Extraordinary photography quality (no stock, no AI — immediately differentiated)
- Transparent pricing (no "call for pricing" — immediately trustworthy)
- Named artisans with faces (no anonymous staff — immediately human)
- Specific, attributed testimonials (no generic praise — immediately authentic)
- Warm, confident brand voice (no urgency, no desperation — immediately premium)

**Possible Friction:**
- Slow page load > bounce before seeing hero (performance is a UX issue)
- Unfamiliar brand > skepticism requires stronger proof
- Price perception > if prices are higher than expected, visitor may need the gift flow instead
- No immediate availability > visitor may not book on first visit
- Mobile navigation confusion > hamburger menu must be immediately intuitive

**Emotional State:**
- Arrival: Skepticism / Guarded curiosity
- Hero: Awe > "Oh, this is different"
- Whisper: Recognition > "They understand what I value"
- Atmosphere: Desire > "I want to be there"
- Services: Longing > "I need this feeling"
- Artisans: Connection > "I could trust these people"
- Testimonials: Trust > "Others have felt what I am feeling"
- Booking: Confidence > "I am ready to commit"

**Required Information:**
- What services are offered (Hair, Color, Bridal, Spa)
- What the experience feels like (sensory descriptions)
- What the prices are (transparent, visible)
- Who performs the services (artisan names and faces)
- What others have experienced (specific testimonials)
- How to book (clear, always accessible CTA)

**Exit Points:**
- Scroll down (continue through experience)
- Navigation link (jump to specific section)
- External link (social media, back to search)
- Booking CTA (initiate booking flow)
- Service page link (explore specific service in depth)
- Browser back/exit (leave the experience)

**Recovery Paths:**
- If visitor bounces at threshold: Performance optimization is the only recovery — the experience must load in under 2.5 seconds
- If visitor bounces at hero: The hero image must be extraordinary enough to arrest attention — this is a content quality issue
- If visitor scrolls past booking invitation: Sticky CTA in navigation ensures the booking path is always accessible
- If visitor abandons booking flow: The overlay design means she returns to exactly where she was — no data loss
- If visitor leaves without booking: Return visit flow (Flow 2) handles re-engagement

**Success Criteria:**
- Visitor scrolls through at least 70% of the experience
- Visitor spends 3+ minutes on the page
- Visitor initiates a booking (primary) OR bookmarks the page / follows on social media (secondary)

---

### Flow 2: Returning Visitor — The Decision Path

**Starting Point:** Direct URL or bookmark. Visitor has been to the site before and remembers the brand. She arrives with higher intent than the first-time visitor.

**User Goal:** Re-experience enough of the brand to feel confident in her decision, then book. She is not re-exploring — she is confirming.

**Business Goal:** Convert the return visit into a booking. The first visit created memory; the second visit must create commitment.

**Decision Points:**
1. **The Re-Affirmation Decision (Hero):** Does the hero image confirm what she remembered? The first impression must be as powerful the second time.
2. **The Quick-Path Decision (Navigation):** Does she scroll the full experience or jump directly to booking? Returning visitors may use navigation links to skip to booking or to a specific section.
3. **The Confirmation Decision (Services > Booking CTA):** Has enough trust accumulated to book? The returning visitor may scroll faster but still needs the trust signals.

**Trust Signals:**
- Consistent brand experience (the site looks exactly as she remembered)
- The thesis still resonates (reinforcement of philosophical alignment)
- She remembers an artisan (personal connection from first visit)

**Possible Friction:**
- Content feels redundant > the scroll must feel rewarding, not repetitive
- She cannot remember which artisan she wanted > search or filter capability
- She wants a different service > easy service switching in booking flow

**Emotional State:**
- Arrival: Recognition > "Yes, this is the place"
- Quick scroll: Nodding > "I remember this"
- Booking: Determination > "I am doing this today"

**Required Information:**
- Same as Flow 1, but the visitor may skip most content
- Booking flow must be immediately accessible
- Service and artisan information must be easily scannable

**Exit Points:**
- Same as Flow 1
- Sticky CTA > immediate booking flow access
- Direct section jump via navigation

**Recovery Paths:**
- If she cannot find a specific artisan: Navigation to Artisans section
- If she wants a different service: Easy service switching in booking Step 1
- If she leaves again: Third visit typically converts — the brand has established enough memory

**Success Criteria:**
- Visitor initiates a booking within the visit
- Visitor spends less time scrolling but more time in the booking flow
- Booking completion rate is higher than first-time visitors

---

### Flow 3: Mobile Visitor — The Touch Journey

**Starting Point:** Any external source, on a mobile device. The primary viewport — 60%+ of all visitors arrive here.

**User Goal:** Same as Flow 1 or Flow 2, but optimized for the constraints and opportunities of mobile. She needs to scroll, read, and book entirely by touch.

**Business Goal:** The mobile experience must be identical in quality to the desktop experience — not a degraded version. Mobile booking share target: 60%+ of all bookings.

**Decision Points:**
1. **The Scroll Decision (Hero > Services):** Does the mobile scroll feel as cinematic as the desktop scroll? The pacing must be maintained despite the smaller viewport.
2. **The Navigation Decision (Hamburger Menu):** Can she reach any section from any point? The hamburger menu must be immediately intuitive.
3. **The Touch Decision (Booking Flow):** Can she complete the booking flow entirely by touch? Every tap target must be 44x44px minimum, every field must be thumb-accessible.

**Trust Signals:**
- The hero image fills the viewport (no cropping, no loss of impact)
- Typography remains readable (minimum 16px body text)
- Pricing is visible without horizontal scrolling
- Booking CTA is always accessible (sticky)
- Touch targets are generous (no mis-taps)

**Possible Friction:**
- Hamburger menu not intuitive > must be clearly designed and labeled
- Calendar interaction difficult on small screen > date selection must be touch-optimized
- Time slot selection requires scrolling > grouping by morning/afternoon/evening helps
- Text input difficult > minimize fields, use appropriate mobile keyboards
- 3D effects impact performance > disabled on mobile (Rule D2)

**Emotional State:**
- Same emotional arc as Flow 1, but:
- Awe may be amplified (full-viewport hero on mobile is more immersive)
- Friction creates frustration faster (mobile users have lower tolerance)
- Booking feels more personal (the phone is a personal device)

**Required Information:**
- Same as Flow 1, but:
- Content must be more concise on mobile (fewer words, more images)
- Service chapters may be condensed
- Booking flow must be full-screen (not side panel)

**Exit Points:**
- Same as Flow 1
- Phone call (click-to-call on phone number in footer)
- App switching (copying information to share with a friend)

**Recovery Paths:**
- If touch interaction fails: 44x44px minimum targets prevent most failures
- If calendar is difficult: Show available dates in a list view as alternative
- If booking flow is abandoned on mobile: Sticky CTA allows re-entry from any point

**Success Criteria:**
- Mobile engagement parity within 10% of desktop metrics
- Mobile booking share 60%+
- Mobile LCP under 2.5 seconds
- All touch targets meet 44x44px minimum
- Zero layout shifts on mobile (CLS under 0.1)

---

### Flow 4: Bridal Customer — The Ceremony Journey

**Starting Point:** Google search for bridal services, Instagram bridal hashtag, wedding planner recommendation, or word-of-mouth from another bride.

**User Goal:** Determine if this salon can handle the most important beauty day of her life. She needs expertise, emotional understanding, and proof of bridal competence.

**Business Goal:** Capture the highest-value service category. Generate premium bridal bookings and referral traffic (bridesmaids, family, friends).

**Decision Points:**
1. **The Expertise Decision (Hero > Bridal Section):** Does the salon demonstrate bridal expertise? The visitor needs to see bridal-specific content early in the scroll.
2. **The Emotional Partnership Decision (Bridal Section):** Does the salon understand the emotional weight of a wedding day? The bridal section must communicate tenderness, not just skill.
3. **The Proof Decision (Testimonials):** Are there real brides who have been taken care of? Bridal testimonials must be specific and emotional.
4. **The Package Decision (Booking Flow):** Are bridal packages transparent and comprehensive? The visitor needs to understand what is included.

**Trust Signals:**
- Bridal-specific editorial photography (real brides, not stock)
- Bridal testimonials from named, real brides
- Transparent bridal package pricing
- The slowest section in the scroll (50% speed) — communicates that the salon treats bridal as a ceremony, not an appointment
- Morning Light lighting mood in the bridal section

**Possible Friction:**
- Bridal section not visually distinct from other services > must have its own emotional weight
- Pricing not transparent > brides search for this specifically
- No bridal gallery or portfolio > need visual proof of previous work
- Booking flow does not distinguish bridal consultation from regular booking > bridal should have a dedicated path

**Emotional State:**
- Arrival: Overwhelm > "I need to find the right people for this"
- Hero: Hope > "This place might understand"
- Bridal Section: Tenderness > "They treat this day as special as I do"
- Testimonials: Relief > "Other brides felt the same way I do"
- Booking: Trust > "I can entrust my wedding day to them"

**Required Information:**
- Bridal-specific services and packages
- Transparent bridal pricing
- Before/after bridal photography
- Artisan bridal expertise (who does bridal work)
- Bridal testimonials from real brides
- Consultation booking process
- What to expect on the wedding day

**Exit Points:**
- Same as Flow 1
- Bridal consultation booking (may be different from standard booking)
- Phone inquiry (brides often prefer to talk before committing)
- Share with partner / wedding planner (social sharing)

**Recovery Paths:**
- If bridal section does not appear early enough: Navigation link to Bridal section
- If pricing concerns: Gift card flow as alternative for someone else to purchase bridal services
- If visitor is not ready to book: Email capture (non-intrusive, V2) for bridal follow-up

**Success Criteria:**
- Visitor scrolls to and through the Bridal section
- Visitor reads bridal testimonials
- Visitor initiates bridal consultation booking
- Bridal booking value is 2-3x standard booking value

---

### Flow 5: Hair Service Customer — The Craft Journey

**Starting Point:** Google search for hair services, Instagram hair portfolio discovery, or referral from a friend who is a client.

**User Goal:** Assess the salon's hair expertise. She wants to see the craft, understand the experience, and determine if this is the right place for her hair needs.

**Business Goal:** Capture the widest audience segment (hair is the most universal service). Establish quality standards that apply to all subsequent services.

**Decision Points:**
1. **The Craft Decision (Hair Section):** Does the hair work look extraordinary? The editorial photography must communicate mastery.
2. **The Experience Decision (Sensory Copy):** Does the description make her feel the experience? The copy must be sensory, not technical.
3. **The Price Decision (Pricing Display):** Is the pricing transparent and appropriate? She needs to see the price without searching.
4. **The Artisan Decision (Artisan Section):** Who will work on her hair? The artisan gallery must help her choose.

**Trust Signals:**
- Editorial-quality hair photography (not stock, not generic)
- Transparent pricing (visible, no "call for pricing")
- Artisan names connected to hair expertise
- Hair-specific testimonials
- Service duration displayed (helps her plan)

**Possible Friction:**
- Hair photography does not match her style > need to show range and diversity
- Pricing feels high without context > sensory descriptions must justify the investment
- No before/after examples > need visual proof of transformation
- Cannot find the right artisan > artisan specialties must be clear

**Emotional State:**
- Arrival: Curiosity > "Let me see what they can do"
- Hair Section: Appreciation > "That work is beautiful"
- Pricing: Evaluation > "Is this worth it?"
- Artisans: Selection > "I want her to do my hair"
- Booking: Confidence > "I am booking with her"

**Required Information:**
- Hair service descriptions (sensory, specific)
- Transparent pricing for all hair services
- Hair-specific editorial photography
- Artisan specialties related to hair
- Service duration
- Hair testimonials

**Exit Points:**
- Same as Flow 1
- /services/hair detail page (optional deeper exploration)
- Booking CTA with hair pre-selected

**Recovery Paths:**
- If hair photography does not resonate: Show variety across different hair types and styles
- If pricing concerns: Emphasize the experience, not just the service
- If she cannot decide on an artisan: "Ask us" path (contact information in footer)

**Success Criteria:**
- Visitor reads through the Hair section completely
- Visitor views at least one artisan profile
- Visitor initiates a hair service booking

---

### Flow 6: Spa Customer — The Sanctuary Journey

**Starting Point:** Google search for spa services, wellness-related discovery, or referral from someone seeking relaxation.

**User Goal:** Find a spa experience that provides genuine rest and restoration. She is seeking sensory relief — she wants to feel the spa before she experiences it.

**Business Goal:** Broaden the salon's addressable audience to wellness-seeking clients. Increase average transaction value through service bundling.

**Decision Points:**
1. **The Sensory Decision (Spa Section):** Does the spa imagery make her body respond? The sensory imagery must create physical desire.
2. **The Sanctuary Decision (Emotional Tone):** Does this feel like a genuine sanctuary? The section must communicate rest, not just services.
3. **The Treatment Decision (Service Details):** What treatments are available and what do they include?
4. **The Duration Decision (Time Investment):** How much time will this take? Spa clients specifically need to know the duration.

**Trust Signals:**
- Evening Warmth lighting mood in spa section
- Sensory imagery (warm towels, candle glow, hands on skin)
- Transparent pricing for all spa treatments
- Treatment duration displayed
- The gentlest motion in the entire experience (communicates rest)

**Possible Friction:**
- Spa section feels like an afterthought > must be given equal weight
- Treatment descriptions too clinical > must be sensory and experiential
- No pricing visible > immediate trust violation (Rule N18)
- Booking flow does not accommodate spa-specific needs > treatment selection must be clear

**Emotional State:**
- Arrival: Seeking > "I need to find a place that understands rest"
- Spa Section: Physical response > "I can almost feel it"
- Pricing: Valuation > "Is this investment in my well-being worth it?"
- Booking: Anticipation > "I need this"

**Required Information:**
- Spa treatment descriptions (sensory, experiential)
- Transparent pricing for all treatments
- Treatment duration
- Evening Warmth atmosphere
- Spa-specific imagery
- Artisan connection (who performs spa treatments)

**Exit Points:**
- Same as Flow 1
- /services/spa detail page
- Booking CTA with spa pre-selected
- Phone inquiry (spa clients may want to discuss specific needs)

**Recovery Paths:**
- If spa content feels insufficient: /services/spa detail page for deeper exploration
- If pricing concerns: Package deals that offer value
- If she has specific wellness needs: Contact information for pre-booking consultation

**Success Criteria:**
- Visitor scrolls to and through the Spa section
- Visitor lingers on spa imagery (longer dwell time)
- Visitor initiates a spa service booking

---

### Flow 7: Customer Browsing Only — The Window Shopper

**Starting Point:** Any external source. Low intent — she is exploring, comparing, or simply admiring. She may not book today, but she is forming an impression that may lead to a future booking.

**User Goal:** Explore the salon's offering without commitment. She wants to see the quality, understand the pricing, and decide if this is a place she might visit in the future.

**Business Goal:** Create a memory strong enough to drive a return visit. Even if she does not book today, she must leave with: (1) a clear impression of the brand's quality, (2) a specific thought about which service she wants, and (3) an easy path back to book when she is ready.

**Decision Points:**
1. **The Impression Decision (Hero > Thesis):** Does the brand create a lasting impression?
2. **The Exploration Decision (Services):** Does she find a service that resonates?
3. **The Memory Decision (Closing Image):** Does the experience end memorably? The Peak-End Rule says she will remember the most intense moment and the ending.

**Trust Signals:**
- The entire scroll experience IS the trust signal
- Transparent pricing removes the anxiety of "how much does this cost?"
- The absence of pressure (no countdown timers, no urgency) communicates confidence

**Possible Friction:**
- She feels she is wasting time > every section must provide value even to browsers
- She wants to save something > no bookmark/save functionality in V1
- She wants to share with a friend > social sharing must be frictionless
- She feels guilty for not booking > the brand never pressures, which alleviates guilt

**Emotional State:**
- Arrival: Idle curiosity > "Let me see what this is"
- Hero: Pleasant surprise > "This is actually beautiful"
- Services: Interest > "They do some impressive work"
- Booking Invitation: Consideration > "Maybe I should book"
- Closing Image: Warmth > "That was a lovely experience"
- Exit: Memory > "I will remember this place"

**Required Information:**
- Complete experience (the full scroll IS the information)
- Transparent pricing for all services
- Contact information (for future reference)
- Social media links (for ongoing relationship)

**Exit Points:**
- All standard exit points
- Social media links > ongoing brand relationship
- Email / phone > future inquiry
- Bookmark / share > future return

**Recovery Paths:**
- If she leaves without booking: She carries the brand memory — return visit flow (Flow 2) handles re-engagement
- If she wants to share: Social sharing must be frictionless
- If she wants to save: Browser bookmark is the only V1 option (V2 could add "Save for later")

**Success Criteria:**
- Visitor scrolls through at least 50% of the experience
- Visitor spends 2+ minutes on the page
- Visitor remembers the brand (measured by return visit rate within 30 days)
- Visitor takes at least one secondary action (social follow, bookmark, share)

---

### Flow 8: Customer Comparing Prices — The Value Evaluator

**Starting Point:** Google search for salon pricing, or comparison between multiple salon websites. She is price-aware and looking for the best value for her budget.

**User Goal:** Understand exactly what each service costs and what is included. She is comparing this salon against 2-4 competitors. She needs transparent, detailed pricing.

**Business Goal:** Demonstrate that premium pricing is justified by premium experience. The pricing must be transparent (Rule N18, L3) and the value proposition must be clear. Never compete on price — compete on experience.

**Decision Points:**
1. **The Transparency Decision (Pricing Visibility):** Can she see prices without searching or calling? Hidden pricing is an immediate disqualification.
2. **The Value Decision (Service Descriptions):** Do the descriptions justify the price?
3. **The Comparison Decision (Service Range):** How does the offering compare to competitors?
4. **The Quality Decision (Photography + Testimonials):** Does the quality justify the premium?

**Trust Signals:**
- Transparent pricing on every service (visible, no "call for pricing")
- Service descriptions that communicate depth and quality
- Editorial photography that demonstrates craft quality
- Named testimonials that describe specific value received
- Duration information (she can calculate value per minute)

**Possible Friction:**
- Pricing feels high without adequate context
- No comparison with competitors (by design)
- She wants a discount > the brand never offers discounts (Rule L6)
- Cannot see all pricing at once > pricing must be scannable within service chapters

**Emotional State:**
- Arrival: Analytical > "Let me see what they charge"
- Services: Evaluation > "Is this worth the price?"
- Photography: Impression > "The quality is clearly high"
- Testimonials: Validation > "Others found this worth the price"
- Booking: Decision > "The value matches the cost"

**Required Information:**
- Transparent pricing for ALL services
- Service duration (value per minute calculation)
- Service descriptions that communicate what is included
- Before/after photography (proof of results)
- Specific testimonials describing value received

**Exit Points:**
- All standard exit points
- Comparison with other salon websites (she will leave and come back)
- Share pricing with a friend for input
- Save/bookmark for later comparison

**Recovery Paths:**
- If pricing feels too high: The experience must communicate value beyond the service
- If she leaves to compare: The memory of the experience is the competitive advantage
- If she returns with a comparison question: Contact information for direct inquiry

**Success Criteria:**
- Visitor views pricing on at least 2 service categories
- Visitor reads at least one service description in full
- Visitor initiates a booking OR returns within 7 days to book

---

### Flow 9: Customer Ready to Book — The Direct Path

**Starting Point:** Any page on the site (direct URL, return visit, or arriving from the scroll). She has already decided. She knows what she wants. She is here to book.

**User Goal:** Book an appointment as quickly and easily as possible. She does not need more information — she needs a frictionless booking flow.

**Business Goal:** Convert high-intent visitors into bookings with maximum efficiency. Every second between decision and booking is a risk of abandonment.

**Decision Points:**
1. **The CTA Decision (Booking Entry):** Where does she click? The sticky CTA must be immediately visible and accessible.
2. **The Flow Decision (Booking Steps):** Does each step feel effortless?
3. **The Confirmation Decision (Booking Completion):** Does the confirmation reassure her?

**Trust Signals:**
- The booking flow maintains the brand's warmth and typography
- No account creation required (guest booking)
- Real-time availability (no phantom slots)
- Clear confirmation with all details
- Email/SMS confirmation follows immediately

**Possible Friction:**
- Booking flow is too long > 6 steps maximum, each single-question
- Required fields are excessive > minimize to essential information only
- No real-time availability > must show actual available slots
- Booking flow feels disconnected from the experience > must slide in, not redirect
- Error states are confusing > every error must be specific and helpful
- Network errors > retry must be immediately available

**Emotional State:**
- CTA Click: Determination > "I am doing this"
- Step 1 (Service): Clarity > "I know what I want"
- Step 2 (Artisan): Familiarity > "I remember her"
- Step 3 (Date): Commitment > "This is happening"
- Step 4 (Time): Completion > "Almost there"
- Step 5 (Contact): Trust > "This feels safe"
- Step 6 (Confirmation): Satisfaction > "That was effortless"

**Required Information:**
- All service options (Step 1)
- All artisan options with portraits (Step 2)
- Available dates (Step 3)
- Available times for selected date (Step 4)
- Name, email, phone fields (Step 5)
- Complete booking details (Step 6)

**Exit Points:**
- Booking completion (primary success)
- Close overlay (abandonment — returns to previous page state)
- Network error (retry or exit)
- Validation error (correct and continue)

**Recovery Paths:**
- If booking flow is abandoned at any step: No data loss — the overlay closes and returns to the page
- If preferred date/time is unavailable: Show nearby alternatives, offer waitlist (V2)
- If network error occurs: Retry button with specific error message
- If validation error: Inline error on the specific field with clear guidance

**Success Criteria:**
- Booking flow completes in under 3 minutes
- Booking completion rate 80%+ of initiated bookings
- Confirmation screen displays within 2 seconds of submission
- Email/SMS confirmation arrives within 60 seconds

---

### Flow 10: Customer After Booking — The Anticipation Journey

**Starting Point:** Booking confirmation screen. The visitor has completed the booking flow and is now a confirmed client.

**User Goal:** Feel reassured that her booking is confirmed, understand what to expect, and carry the warmth of the experience into anticipation of her appointment.

**Business Goal:** Extend the digital relationship beyond the booking. Reduce no-shows through confirmation and preparation guidance. Create the positive final impression that drives word-of-mouth and return visits.

**Decision Points:**
1. **The Confirmation Decision (Immediate):** Does the confirmation feel satisfying? The warm animation (800-1200ms) must communicate completion.
2. **The Preparation Decision (Post-Booking):** Does she know what to expect?
3. **The Anticipation Decision (Email/SMS):** Does the confirmation message reinforce the brand?

**Trust Signals:**
- Clear, complete appointment details on confirmation screen
- Warm, unhurried confirmation message
- Generous confirmation animation (the longest in the experience)
- Immediate email confirmation with brand-quality design
- SMS confirmation for quick reference

**Possible Friction:**
- Confirmation feels generic > must be specific and warm
- No preparation guidance > what should she do before the appointment?
- Confirmation email is delayed > must arrive within 60 seconds
- She wants to change the booking > modification path must be clear
- She is anxious about the appointment > preparation content reduces anxiety

**Emotional State:**
- Confirmation: Satisfaction > "That was easy"
- Details: Reassurance > "I have everything I need"
- Email: Warmth > "They care about my experience"
- Anticipation: Excitement > "I cannot wait"

**Required Information:**
- Complete appointment details (service, artisan, date, time)
- Salon address and directions
- What to bring / preparation guidance
- Cancellation/modification policy
- Contact information for questions

**Exit Points:**
- Return to homepage (continue browsing)
- Close overlay (end of interaction)
- Share with friend (word-of-mouth)
- Add to calendar (V2)

**Recovery Paths:**
- If she wants to modify: Contact information and modification process
- If she did not receive confirmation: "Resend confirmation" option
- If she has questions: Contact information prominently displayed

**Success Criteria:**
- Confirmation screen displays correctly with all details
- Email confirmation arrives within 60 seconds
- Visitor feels satisfied and confident about the appointment
- No-show rate below 10% (measured post-launch)

---

## 4. SECONDARY USER FLOWS

### Flow 11: Gift Buyer — The Generosity Journey

**Starting Point:** Google search for gift cards, browsing the site and seeing the Gift section, or referral from someone suggesting a gift idea.

**User Goal:** Purchase a gift card or package that feels premium and considered. The purchase experience must be as elegant as the gift itself.

**Business Goal:** Capture the secondary conversion stream. Gift cards represent 15-25% of premium salon revenue. The purchase must take under 60 seconds.

**Decision Points:**
1. **The Gift Discovery Decision (Gift Section):** Does the gift option feel like a natural extension of the brand?
2. **The Presentation Decision:** Will the gift feel premium to the recipient?
3. **The Purchase Decision:** Is the purchase flow simple and fast? Under 60 seconds, minimal fields.

**Trust Signals:**
- The gift section uses the same warm aesthetic as the rest of the experience
- Gift card presentation is brand-quality (not a generic PDF)
- Purchase flow is secure and straightforward
- Clear information about what the recipient will receive

**Possible Friction:**
- Gift section not prominent enough > must be discoverable within 2 clicks from any page
- Purchase flow requires account creation > must allow guest purchase
- Digital delivery quality unclear > show a preview of the gift card design
- No denomination options > must offer flexible amounts

**Emotional State:**
- Discovery: Warmth > "This is a beautiful idea"
- Purchase: Generosity > "They will love this"
- Confirmation: Satisfaction > "That was effortless"

**Success Criteria:**
- Gift purchase completes in under 60 seconds
- Gift card digital delivery is brand-quality
- Gift card recipient books an appointment

---

### Flow 12: Service Detail Explorer — The Deep Investigator

**Starting Point:** Link from homepage service section, Google search for specific service, or direct URL to a service detail page.

**User Goal:** Explore a specific service in greater depth than the homepage provides. She wants detailed descriptions, more imagery, and comprehensive pricing.

**Business Goal:** Serve visitors with deeper intent. The service detail page must provide the additional information needed to convert a high-intent visitor.

**Decision Points:**
1. **The Depth Decision:** Does the service page provide enough additional information?
2. **The Continuity Decision:** Does the service page feel like a continuation of the homepage?
3. **The Booking Decision:** Is the booking CTA prominent on the service page?

**Trust Signals:**
- Same visual quality and brand voice as the homepage
- Detailed service descriptions with transparent pricing
- Artisan information specific to this service
- Client quotes specific to this service
- Consistent three-act mini-film structure

**Emotional State:**
- Arrival: Investigative > "Tell me more about this specific service"
- Content: Deepening understanding > "Now I really understand what this involves"
- Booking: Confidence > "I have all the information I need"

**Success Criteria:**
- Visitor reads through the complete service page
- Visitor initiates a booking from the service page
- Visitor returns to homepage after exploring (no dead-end)

---

### Flow 13: Keyboard-Only User — The Accessibility Journey

**Starting Point:** Any page. The visitor uses keyboard navigation exclusively (no mouse, no touch). She may have a motor disability, visual impairment, or simply prefer keyboard navigation.

**User Goal:** Navigate the complete experience, read all content, and book an appointment — entirely via keyboard.

**Business Goal:** WCAG 2.1 AA compliance (Rule AC1-AC12). Every interactive element must be keyboard-accessible. Focus indicators must be visible. The experience must be complete and satisfying without a mouse or touch screen.

**Decision Points:**
1. **The Tab Order Decision:** Does the tab order follow the visual reading order?
2. **The Focus Decision:** Is every focus indicator visible (gold accent, 2px minimum)?
3. **The Booking Decision:** Can the booking flow be completed entirely via keyboard?
4. **The Skip Decision:** Can she skip directly to main content, bypassing the threshold animation?

**Trust Signals:**
- Visible focus indicators on every interactive element
- Logical tab order that follows the visual hierarchy
- Skip navigation link for screen reader users
- All content accessible without hover states (Rule N22)
- All form fields have associated labels (Rule AC7)

**Emotional State:**
- Arrival: Confidence > "This site respects my way of navigating"
- Navigation: Ease > "I can reach everything I need"
- Booking: Trust > "This works for me"

**Success Criteria:**
- Complete experience navigable via keyboard alone
- All interactive elements reachable and activatable via keyboard
- Focus indicators visible on every element
- Booking flow completable without mouse/touch

---

### Flow 14: Screen Reader User — The Assistive Journey

**Starting Point:** Any page. The visitor uses a screen reader (VoiceOver, NVDA, JAWS) for navigation. She may be blind or have low vision.

**User Goal:** Experience the complete brand — visual content described through alt text, content organized through semantic HTML, navigation through landmarks and headings.

**Business Goal:** Screen reader users receive equivalent access to all content and functionality. Alt text is written in the brand voice — descriptive, specific, and warm (Rule AC11).

**Decision Points:**
1. **The Heading Decision:** Is the heading hierarchy correct (H1 > H2 > H3, no skips)?
2. **The Landmark Decision:** Are landmark regions (header, main, footer) properly defined?
3. **The Image Decision:** Do all images have descriptive alt text?
4. **The Booking Decision:** Can the booking flow be completed via screen reader?

**Trust Signals:**
- Semantic HTML structure with proper heading hierarchy
- Descriptive alt text for every meaningful image
- Landmark regions enable navigation by region
- Form fields have programmatically associated labels
- Error messages are announced by the screen reader

**Emotional State:**
- Arrival: Confidence > "This site is built for everyone"
- Content: Connection > "I can see through their words"
- Booking: Trust > "I can book independently"

**Success Criteria:**
- Complete experience navigable by screen reader
- All images have descriptive alt text
- Heading hierarchy is correct
- Booking flow completable via screen reader

---

## 5. EDGE CASES

### Edge Case 1: Visitor Arrives During Slow Network (3G/2G)

**Scenario:** The visitor is on a throttled 3G connection (Rule P9). Images load slowly, JavaScript may be delayed, the threshold animation may not complete smoothly.

**Expected Behavior:**
- Hero image loads progressively (blurred placeholder > full image) (Rule I13)
- Text is immediately visible (font-display: swap prevents FOIT) (Rule P7)
- Non-critical JavaScript is deferred (Rule P8)
- The experience is usable (not beautiful — usable) on 3G
- Booking flow remains functional even if images have not loaded

**Business Impact:** Many of the salon's clients may be on mobile networks with variable speeds. Performance degradation must never prevent booking.

---

### Edge Case 2: All Artisans Fully Booked for Selected Service

**Scenario:** The visitor selects a service in the booking flow, but no artisans have availability for the next 2+ weeks.

**Expected Behavior:**
- Calendar shows available dates clearly (even if distant)
- A warm message explains availability: "Our artisans are in high demand. The earliest availability is [date]. Would you like to book then, or check back sooner?"
- Alternative artisans with earlier availability are suggested
- The visitor is never left without options

**Business Impact:** Scarcity communicates demand, which communicates quality. But frustration must be mitigated with alternatives.

---

### Edge Case 3: Visitor Abandons Booking Flow Mid-Process

**Scenario:** The visitor starts the booking flow, reaches Step 3 (Date), and closes the overlay without completing.

**Expected Behavior:**
- The overlay closes gracefully
- No data is lost (but nothing is persisted in V1)
- The visitor returns to exactly where she was in the scroll
- The sticky CTA remains accessible for re-entry
- No error states or broken UI

**Business Impact:** Every abandoned booking is a missed conversion. The experience must make re-entry effortless. V2 could persist partial booking data.

---

### Edge Case 4: Visitor Clicks Booking CTA from Service Detail Page

**Scenario:** The visitor is on /services/hair and clicks "Book this service."

**Expected Behavior:**
- The booking flow opens with Hair pre-selected in Step 1
- The visitor does not need to re-select the service
- The flow feels like a natural continuation of her exploration
- If she closes the flow, she returns to the service page

**Business Impact:** Pre-selection reduces friction for service-specific bookers. The booking flow must be contextually aware of its entry point.

---

### Edge Case 5: Visitor Shares a Specific Section via URL

**Scenario:** A visitor shares a link to a specific section (e.g., the Bridal section) with her partner or wedding planner.

**Expected Behavior:**
- The URL includes a section anchor (e.g., /#bridal)
- The page loads and scrolls to the specified section
- The visitor can then scroll up to see earlier sections or down to continue
- The hero and thesis still load (the threshold > hero experience is preserved)

**Business Impact:** Deep linking enables word-of-mouth sharing of specific content. The single-page architecture supports this via anchor links.

---

### Edge Case 6: Visitor Uses Browser Back Button

**Scenario:** The visitor navigates to a service detail page, then clicks the browser back button.

**Expected Behavior:**
- The visitor returns to the homepage at the scroll position she was at before
- No broken states, no error pages
- The scroll position is restored (V2 consideration)
- If the booking overlay was open, it closes

**Business Impact:** Browser navigation is unpredictable. The experience must handle every navigation state gracefully.

---

### Edge Case 7: Visitor Changes Language Preference

**Scenario:** The visitor speaks Arabic or French but the site is in English (V1).

**Expected Behavior (V1):**
- The site is in English only
- Contact information is clear for Arabic/French speakers (phone number is universal)
- The visual experience transcends language (photography communicates across languages)

**Expected Behavior (V2):**
- Language switcher in navigation
- Full content available in Arabic, French, and English
- RTL layout support for Arabic

**Business Impact:** The salon is in Marrakech, Morocco. Many clients speak Arabic or French. V1's visual-first approach mitigates the language barrier, but V2 must address it.

---

### Edge Case 8: Visitor Arrives from a Competitor's Website

**Scenario:** The visitor has been comparing salons and arrives from a competitor's website.

**Expected Behavior:**
- The Halo Effect (Hero) must immediately differentiate from the competitor
- The thesis must communicate a distinct brand position
- The absence of competitor-mimicking elements (no carousels, no countdown timers) must be immediately noticeable
- The pricing must be visible for comparison

**Business Impact:** Competitor arrivals are the most comparison-oriented visitors. The brand's differentiation must be immediately apparent.

---

### Edge Case 9: Visitor Wants to Book for Multiple People

**Scenario:** The visitor wants to book appointments for herself and a friend (e.g., a mother-daughter spa day or bridesmaid group).

**Expected Behavior (V1):**
- The booking flow handles one appointment at a time
- Contact information is available for group booking inquiries
- A warm message could note: "Booking for a group? Contact us and we will arrange something special."

**Expected Behavior (V2):**
- Multi-appointment booking capability
- Group booking inquiry form

**Business Impact:** Group bookings are high-value. V1 must not prevent them — it must route them to direct contact.

---

### Edge Case 10: Visitor Has a Visual Impairment Requiring High Contrast

**Scenario:** The visitor has low vision and uses a high-contrast mode or OS-level accessibility settings.

**Expected Behavior:**
- The warm palette meets WCAG AA minimum contrast (4.5:1 for normal text) (Rule C4)
- The warm charcoal on warm off-white achieves 7:1+ (AAA level)
- If the visitor uses OS high-contrast mode, the site adapts gracefully
- Focus indicators remain visible

**Business Impact:** Accessibility is non-negotiable (Rule AC1). The warm palette is designed for high contrast.

---

### Edge Case 11: Visitor Arrives During Maintenance or Outage

**Scenario:** The site is temporarily unavailable due to maintenance or an unexpected outage.

**Expected Behavior:**
- A branded maintenance page appears (warm background, warm message)
- The message maintains the brand voice: "We will be back shortly. Your chair is waiting."
- Expected return time is displayed if known
- Contact information is available

**Business Impact:** Even the error state must communicate the brand. A generic 503 page destroys the premium positioning.

---

### Edge Case 12: Visitor Wants to Book a Service Not Listed

**Scenario:** The visitor wants a service that is not among the four service categories.

**Expected Behavior:**
- The booking flow shows the four available categories
- A "Not sure which service?" or "Other" option routes to contact information
- The footer includes a phone number and email for special inquiries

**Business Impact:** The salon may offer additional services not in V1. The booking flow must never be a dead end.

---

## 6. CONVERSION FUNNELS

### Primary Funnel: Scroll to Booking

```
SCROLL TO BOOKING CONVERSION FUNNEL
=====================================

AWARENESS (100% of visitors)
  |  Visitor arrives at the page
  |  v 50% bounce within 3 seconds (industry average)
  |
  v
ENGAGEMENT (50% of visitors)
  |  Visitor scrolls past the hero
  |  v 30% leave during Act I
  |
  v
IMMERSION (35% of visitors)
  |  Visitor scrolls through the Atmosphere
  |  v 20% leave during service chapters
  |
  v
CONSIDERATION (28% of visitors)
  |  Visitor scrolls past Artisans and Testimonials
  |  v 40% leave without clicking CTA
  |
  v
INTENT (17% of visitors)
  |  Visitor clicks "Book your experience"
  |  v 20% abandon booking flow
  |
  v
COMPLETION (14% of visitors)
  |  Visitor completes booking
  |
  v
CONFIRMATION (14% of visitors)
  Booking confirmed, email/SMS sent
```

**Target metrics:**
- Bounce rate: Below 35% (vs. industry average 50%+)
- Scroll depth: 70%+ reach service sections
- Booking initiation: 4-7% of visitors
- Booking completion: 80%+ of initiated bookings
- Overall conversion: 3-6% of visitors complete booking

**Funnel optimization priorities:**
1. Reduce bounce rate (performance + hero quality)
2. Increase scroll depth (pacing + content quality)
3. Increase booking initiation (CTA visibility + trust building)
4. Reduce booking abandonment (flow simplicity + error handling)

---

### Secondary Funnel: Scroll to Gift Purchase

```
SCROLL TO GIFT PURCHASE FUNNEL
================================

AWARENESS (100% of visitors)
  |
  v
GIFT DISCOVERY (8% of visitors)
  |  Visitor reaches the Gift section
  |  v 60% continue scrolling past
  |
  v
GIFT CONSIDERATION (3.2% of visitors)
  |  Visitor clicks "Explore gift options"
  |  v 50% abandon gift flow
  |
  v
GIFT PURCHASE (1.6% of visitors)
  |  Visitor completes gift purchase
  |
  v
GIFT DELIVERY (1.6% of visitors)
  Gift card/package delivered to recipient
```

**Target metrics:**
- Gift section discovery: 8%+ of visitors
- Gift purchase conversion: 2%+ of visitors

---

### Tertiary Funnel: First Visit to Return Visit

```
FIRST VISIT TO RETURN VISIT FUNNEL
====================================

FIRST VISIT (100% of visitors)
  |  Visitor experiences the scroll
  |  v 60% never return (industry average)
  |
  v
MEMORY RETENTION (40% of visitors)
  |  Visitor remembers the brand
  |  v 37.5% do not return within 30 days
  |
  v
RETURN VISIT (25% of visitors)
  |  Visitor returns within 30 days
  |  v 40% do not book on return visit
  |
  v
RETURN CONVERSION (15% of visitors)
  Visitor books on return visit
```

**Target metrics:**
- Return visitor rate: 25%+ within 30 days
- Return visit conversion: 60%+ of return visitors initiate booking

---

## 7. DROP-OFF RISKS

### Risk Map: Where Visitors Leave

| Risk Point | Section | Est. Drop-off | Cause | Mitigation |
|------------|---------|---------------|-------|------------|
| Threshold | Loading | 10-15% | Slow load, blank screen | Designed loading threshold, LCP under 2.5s |
| Hero | Act I | 15-20% | Image not compelling | Extraordinary editorial photography |
| Thesis | Act I | 5-8% | Voice does not resonate | Specific, authentic brand voice |
| Atmosphere | Act I | 3-5% | Too many images | 2-4 images maximum, parallax |
| Hair | Act II | 5-8% | Photography quality | Editorial photography, transparent pricing |
| Color | Act II | 3-5% | Transformation not compelling | Scroll-controlled dissolve |
| Bridal | Act II | 5-10% | Not relevant to all visitors | Clearly labeled, emotionally distinct |
| Spa | Act II | 3-5% | Content feels thin | Sensory imagery, Evening Warmth mood |
| Artisans | Act II | 5-8% | Portraits feel corporate | Editorial portraits, warm reveal |
| Testimonials | Act II | 5-10% | Feel generic or fabricated | Named, specific, attributed |
| Booking Invitation | Act III | 8-12% | Not ready to book | Stillness, no pressure, sticky CTA |
| Booking Step 1 | Booking | 5-8% | Too many options | 4 categories only |
| Booking Step 2 | Booking | 3-5% | Cannot decide on artisan | "No preference" option |
| Booking Step 3 | Booking | 8-15% | No availability | Show nearby dates, suggest alternatives |
| Booking Step 4 | Booking | 3-5% | Time unavailable | Grouping by morning/afternoon/evening |
| Booking Step 5 | Booking | 10-15% | Too many fields | Minimal fields, no account creation |
| Booking Step 6 | Booking | 1-3% | Technical error | Error handling, retry, network resilience |

### Critical Drop-Off Prevention Strategies

**1. The First 3 Seconds (Threshold > Hero)**
This is where 50%+ of bounces occur.
- Prevention: Designed threshold transforms loading into arrival
- Prevention: Hero image must be extraordinary — not good, extraordinary
- Prevention: LCP under 2.5 seconds (non-negotiable)

**2. The Commitment Gap (Booking Invitation > CTA Click)**
This is where interested visitors become non-bookers.
- Prevention: The longest breathing space allows decision settling
- Prevention: Sticky CTA ensures re-entry is effortless
- Prevention: The invitation is confident but never aggressive

**3. The Booking Abandonment Zone (Step 3 > Step 5)**
This is where initiated bookings are lost.
- Prevention: Real-time availability (no phantom slots)
- Prevention: Minimal contact fields (name, email, phone only)
- Prevention: No account creation required
- Prevention: Graceful error handling with specific guidance

---

## 8. TRUST BUILDING STRATEGY

### The Trust Architecture

Trust is not built in a single moment. It is accumulated across the entire scroll, each section adding a layer of evidence. By the time the visitor reaches the booking invitation, she has been given seven distinct reasons to trust.

```
TRUST BUILDING PROGRESSION
===========================

STAGE 1: VISUAL TRUST (Hero — First 3 seconds)
  Signal: Extraordinary photography quality
  Message: "This place is beautiful and considered"
  Investment: 3 seconds of attention
  Trust Level: 15%

STAGE 2: PHILOSOPHICAL TRUST (Thesis — Seconds 3-8)
  Signal: Brand voice alignment
  Message: "This place understands what I believe"
  Investment: 5 seconds of reading
  Trust Level: 30%

STAGE 3: SENSORY TRUST (Atmosphere — Seconds 8-23)
  Signal: Immersive environmental photography
  Message: "This place is real and I want to be there"
  Investment: 15 seconds of scrolling
  Trust Level: 45%

STAGE 4: CRAFT TRUST (Service Chapters — Seconds 23-83)
  Signal: Editorial work photography + transparent pricing
  Message: "These people are extraordinary at what they do"
  Investment: 60 seconds of exploration
  Trust Level: 65%

STAGE 5: PERSONAL TRUST (Artisans — Seconds 83-98)
  Signal: Faces, names, specialties, real people
  Message: "These are real people I could trust"
  Investment: 15 seconds of meeting
  Trust Level: 80%

STAGE 6: SOCIAL TRUST (Testimonials — Seconds 98-123)
  Signal: Authentic, named, specific social proof
  Message: "Real people love this place. I can too."
  Investment: 25 seconds of reading
  Trust Level: 90%

STAGE 7: CONFIDENCE (Booking Invitation — Seconds 123-135)
  Signal: Radical simplicity and absence of pressure
  Message: "They have nothing left to prove. I am ready."
  Investment: 12 seconds of settling
  Trust Level: 100% — Ready to book
```

### Trust by Persona

| Trust Stage | Intentional Woman | Bride | Gift Buyer |
|-------------|------------------|-------|------------|
| Visual Trust | Portfolio quality | Bridal work quality | Presentation quality |
| Philosophical Trust | Brand values alignment | Emotional understanding | Gift experience quality |
| Sensory Trust | Space desirability | Wedding day atmosphere | Recipient's future experience |
| Craft Trust | Service expertise | Bridal expertise | Service range for recipient |
| Personal Trust | Artisan selection | Lead bridal artisan | N/A (buying for others) |
| Social Trust | Client testimonials | Bride testimonials | Gift recipient testimonials |
| Confidence | "I am booking for me" | "I am entrusting my day" | "They will love this"

---

## 9. DECISION MATRIX

### When a Visitor Must Choose

Every decision point in the experience requires the visitor to make a choice. The following matrix maps each decision to the information she needs, the emotional state she is in, and the design response required.

| Decision | Info Needed | Emotional State | Design Response | Default |
|----------|------------|-----------------|-----------------|---------|
| Stay or bounce | Extraordinary first impression | Skepticism | Hero image must arrest attention | N/A |
| Scroll or navigate | Clear section labels | Curiosity | Minimal nav with section links | Scroll |
| Which service | Service descriptions + pricing | Exploration | 4 clear categories with imagery | N/A |
| Which artisan | Artisan portraits + specialties | Connection | Full-viewport portraits, one at a time | "No preference" |
| Which date | Available dates | Commitment | Calendar with clear availability | Next available |
| Which time | Available time slots | Completion | Grouped by morning/afternoon/evening | Earliest available |
| Book or browse | Confidence in the brand | Deciding | Stillness, no pressure, sticky CTA | N/A |
| Gift or self | Personal need vs. generosity | Considering | Gift section after booking invitation | Self

---

## 10. JOURNEY MAPS

### Journey Map: The Intentional Woman (Complete)

```
STAGE:      ARRIVAL  > EXPLORATION > CONSIDERATION > COMMITMENT > POST-BOOKING
TIME:       0:00      0:03         0:30            2:00         3:30           Days later
SECTION:    Threshold > Hero > Whisper > Atmosphere > Services > Artisans > Testimonials > Booking > Confirmation > Email
EMOTION:    Nervous   > Awe   > Calm    > Desire     > Longing   > Connection > Trust        > Confidence > Satisfaction > Anticipation
TRUST:      0%        > 15%  > 30%     > 45%        > 65%       > 80%       > 90%          > 100%      > Maintained   > Reinforced
ACTION:     Waits     > Sees  > Reads   > Scrolls    > Explores  > Meets     > Validates    > Books     > Confirms     > Prepares
FRICTION:   Loading   > None  > None    > None       > Pacing    > None      > None         > Booking   > None         > None
OPTIMIZE:   Speed     > Image > Copy    > Photography> Content   > Portraits > Authenticity > Flow      > Animation    > Email quality
```

### Journey Map: The Bride (Complete)

```
STAGE:      ARRIVAL  > DISCOVERY   > VALIDATION   > EMOTIONAL ALIGNMENT > INVESTIGATION  > COMMITMENT
TIME:       0:00      0:03         0:30           1:00                   2:00            3:30
SECTION:    Threshold > Hero        > Services     > Bridal Section       > Testimonials   > Booking
EMOTION:    Overwhelm > Hope        > Assessment   > Tenderness           > Relief         > Trust
TRUST:      0%        > 15%        > 45%          > 60%                  > 85%           > 100%
ACTION:     Arrives   > Sees        > Evaluates    > Feels understood     > Validates      > Books consultation
FRICTION:   Network   > None        > Price        > Emotional weight     > None           > Package clarity
OPTIMIZE:   Speed     > Quality     > Detail       > Sensory copy          > Real brides   > Transparent packages
```

### Journey Map: The Mobile Visitor (Complete)

```
STAGE:      ARRIVAL  > SCROLL  > NAVIGATION > CONTENT > BOOKING  > CONFIRMATION
TIME:       0:00      0:03     0:15         0:30      2:00       3:30
DEVICE:     Phone     Phone    Phone        Phone     Phone      Phone
EMOTION:    Urgency   > Awe    > Ease       > Interest> Ease     > Satisfaction
TRUST:      0%        > 15%   > 25%        > 60%     > 90%     > 100%
ACTION:     Loads     > Sees   > Opens menu > Scrolls > Books    > Confirms
FRICTION:   Loading   > Touch  > Menu       > Reading > Fields   > None
OPTIMIZE:   Speed     > Image  > Hamburger  > Size    > Touch   > Animation
CRITICAL:   44x44px targets, full-screen booking, no 3D, no layout shifts
```

---

## 11. TOP 20 UX RISKS

| # | Risk | Severity | Impact | Likelihood | Mitigation |
|---|------|----------|--------|------------|------------|
| 1 | Slow page load causes bounce before hero appears | Critical | Visitor never sees the brand | High | LCP under 2.5s, designed threshold, image optimization |
| 2 | Hero image does not arrest attention | Critical | Halo Effect never activates | Medium | Extraordinary editorial photography, no stock |
| 3 | Mobile navigation is confusing | High | 60%+ visitors cannot reach key sections | Medium | Full-screen overlay, clear labels, generous touch targets |
| 4 | Booking flow abandonment at Step 3 (Date) | High | Initiated bookings are lost | High | Real-time availability, show nearby dates, suggest alternatives |
| 5 | Pricing not visible or requires inquiry | High | Trust violation, immediate disqualification | Medium | Transparent pricing on every service, Rule N18 |
| 6 | Testimonials feel generic or fabricated | High | Social trust never established | Medium | Named, specific, attributed, real stories |
| 7 | Artisan portraits feel corporate | Medium | Personal trust never forms | Low | Editorial portraits, warm reveal, human language |
| 8 | Booking flow feels disconnected from experience | Medium | Immersion is broken at conversion point | Medium | Slide-in overlay, brand typography/colors maintained |
| 9 | Form validation errors are confusing | Medium | Booking abandonment from frustration | Medium | Inline errors, specific messages, brand voice |
| 10 | Scroll pacing is too fast or too slow | Medium | Visitor loses interest or feels overwhelmed | Medium | Breathing spaces, density alternation, tempo shifts |
| 11 | 3D effects cause frame drops on mobile | Medium | Mobile experience feels janky | Medium | Disable 3D on mobile if performance impacted (Rule D2) |
| 12 | prefers-reduced-motion not respected | Medium | Motion-sensitive visitors have adverse reactions | Low | CSS media query gates all animations |
| 13 | Content requires hover to access critical info | Medium | Touch/keyboard users cannot access pricing | Low | All critical info always visible (Rule N22) |
| 14 | Service chapters feel repetitive | Low | Visitor skips or bounces during Act II | Medium | Each chapter has unique emotional treatment and imagery |
| 15 | Bridal section feels like an afterthought | Low | High-value bridal audience is lost | Low | Slowest section, Morning Light mood, unique treatment |
| 16 | Email confirmation is delayed or generic | Low | Post-booking trust is undermined | Low | Immediate send (under 60s), brand-quality template |
| 17 | Focus indicators not visible | Low | Keyboard users cannot navigate | Low | Gold accent, 2px minimum, Rule AC4 |
| 18 | Alt text is generic or missing | Low | Screen reader users receive degraded experience | Low | Descriptive, specific, warm alt text for all images |
| 19 | Guest assumes the site is broken during loading | Low | Bounce before content appears | Medium | Designed threshold, warm background first |
| 20 | No path back from 404 page | Low | Lost visitor is truly lost | Low | Branded 404 with navigation and booking CTA

---

## 12. TOP 20 CONVERSION OPPORTUNITIES

| # | Opportunity | Potential Impact | Implementation | Priority |
|---|-------------|-----------------|----------------|----------|
| 1 | Sticky booking CTA always visible | +15-20% booking initiation | Persistent header element | P0 |
| 2 | Pre-selection from service pages | +10-15% booking completion | Booking flow reads entry context | P0 |
| 3 | Real-time availability display | +10-15% booking confidence | Live calendar integration | P0 |
| 4 | No account creation required | +8-12% booking completion | Guest booking only | P0 |
| 5 | Artisan selection in booking flow | +8-12% booking trust | Portraits in Step 2 | P0 |
| 6 | Slide-in booking overlay (not redirect) | +5-10% booking completion | Overlay preserves context | P0 |
| 7 | Mobile-optimized booking flow | +5-10% mobile conversion | Full-screen, touch-optimized | P0 |
| 8 | Transparent pricing throughout | +5-8% booking confidence | Prices on every service | P0 |
| 9 | Instant confirmation with animation | +3-5% post-booking satisfaction | Warm confirmation (800-1200ms) | P0 |
| 10 | Immediate email/SMS confirmation | +3-5% booking trust | Under 60 seconds delivery | P0 |
| 11 | Gift section positioning | +2-3% secondary conversion | After booking invitation | P1 |
| 12 | Service detail pages | +2-3% deep-intent conversion | /services/* pages | P1 |
| 13 | Returning visitor recognition | +15-20% return conversion | Pre-filled data (V2) | P2 |
| 14 | Calendar integration | +2-3% no-show reduction | Add to Google/Apple Calendar (V2) | P2 |
| 15 | Availability notifications | +3-5% missed booking recovery | "Get notified" (V2) | P2 |
| 16 | Video testimonials | +2-3% social proof strength | Short client videos (V2) | P2 |
| 17 | Before/after gallery | +3-5% visual proof | Transformation pairs (V2) | P2 |
| 18 | FAQ section | +2-3% friction reduction | Common questions answered (V2) | P2 |
| 19 | Language switcher | +5-10% addressable audience | Arabic/French/English (V2) | P2 |
| 20 | Map integration | +1-2% visit likelihood | Styled map embed (V2) | P2

---

## 13. TOP 20 TRUST OPPORTUNITIES

| # | Opportunity | Trust Stage | Impact | Implementation |
|---|-------------|-------------|--------|----------------|
| 1 | Original photography (no stock, no AI) | Visual Trust | Eliminates #1 trust killer | Professional photo production |
| 2 | Transparent pricing on every service | Craft Trust | Eliminates "call for pricing" anxiety | Pricing data from business |
| 3 | Named artisan portraits with faces | Personal Trust | Creates human connection | Editorial portrait photography |
| 4 | Specific, attributed testimonials | Social Trust | Proves real people are satisfied | Client testimonials with names |
| 5 | Consistent warm color temperature | Visual Trust | Creates cohesive premium impression | Warm palette across all elements |
| 6 | Confident brand voice (no urgency) | Philosophical Trust | Differentiates from pushy competitors | Voice guidelines enforced |
| 7 | Service duration displayed | Craft Trust | Shows thoroughness and transparency | Duration data from business |
| 8 | Booking flow within the brand world | All stages | Maintains immersion during conversion | Slide-in overlay with brand design |
| 9 | Error messages in brand voice | All stages | Even failures feel considered | Error state design |
| 10 | Real-time availability (no phantom slots) | Booking Trust | Prevents double-booking frustration | Live scheduling system |
| 11 | Immediate confirmation response | Post-Booking Trust | Reduces booking anxiety | Under 2-second confirmation |
| 12 | Warm, detailed email confirmation | Post-Booking Trust | Reinforces brand beyond website | Brand-quality email template |
| 13 | Loading states that match the brand | All stages | No generic spinners break immersion | Branded loading animations |
| 14 | Accessible to all abilities | All stages | Demonstrates care for every visitor | WCAG 2.1 AA compliance |
| 15 | Privacy-respecting analytics | Philosophical Trust | No cookie banners, no tracking anxiety | Plausible/Fathom, no cookies |
| 16 | Consistent component behavior | All stages | Predictability builds trust | Same card, same animation |
| 17 | Before/after photography | Craft Trust | Visual proof of transformation | Real client images |
| 18 | Artisan specialties clearly stated | Personal Trust | Helps visitors choose with confidence | One sentence per artisan |
| 19 | Contact information always findable | All stages | Salon is reachable, not hidden | Footer with phone, email, address |
| 20 | No pop-ups, no interruptions | All stages | Respects the visitor's experience | Rule N13 enforced

---

## 14. FLOW DEPENDENCIES

### Cross-Flow Interactions

Flows do not exist in isolation. A visitor may traverse multiple flows during a single session.

```
FLOW INTERACTION MAP
====================

Flow 1 (First Visit) -----------> Flow 9 (Ready to Book)
       |                                  |
       |                                  +--> Flow 10 (After Booking)
       |
       +--> Flow 7 (Browsing Only) --> Flow 2 (Return) --> Flow 9
       |
       +--> Flow 8 (Comparing) --> Flow 2 (Return) --> Flow 9
       |
       +--> Flow 4 (Bridal) --> Flow 9 (Bridal Booking)
       |
       +--> Flow 5 (Hair) --> Flow 9 (Hair Booking)
       |
       +--> Flow 6 (Spa) --> Flow 9 (Spa Booking)
       |
       +--> Flow 11 (Gift Purchase)

Flow 3 (Mobile) --> Any other flow (mobile is a viewport modifier)

Flow 13 (Keyboard) --> Any other flow (accessibility is a modifier)

Flow 14 (Screen Reader) --> Any other flow (accessibility is a modifier)
```

---

## 15. VALIDATION CRITERIA

### Per-Flow Validation

Before launch, every user flow must pass these validation checks:

```
FLOW VALIDATION CHECKLIST
==========================

FOR EVERY FLOW:
  [ ] Starting point is reachable (all entry points work)
  [ ] Every decision point has a clear design response
  [ ] Every trust signal is present and functioning
  [ ] Every friction point has a mitigation strategy
  [ ] Emotional state matches the expected arc
  [ ] Required information is available and accessible
  [ ] All exit points are functional (no broken links)
  [ ] All recovery paths work (error recovery, re-entry)
  [ ] Success criteria are measurable

FOR PRIMARY FLOW:
  [ ] Complete scroll experience is functional
  [ ] Booking flow completes without errors
  [ ] Confirmation displays correctly
  [ ] Email/SMS confirmation arrives within 60 seconds

FOR MOBILE FLOWS:
  [ ] All touch targets meet 44x44px minimum
  [ ] Booking flow is full-screen on mobile
  [ ] Navigation overlay opens and closes correctly
  [ ] No horizontal scrolling at any point
  [ ] No layout shifts on any viewport

FOR ACCESSIBILITY FLOWS:
  [ ] Complete experience navigable via keyboard
  [ ] All images have descriptive alt text
  [ ] Heading hierarchy is correct
  [ ] Focus indicators visible on all interactive elements
  [ ] prefers-reduced-motion disables all animations
  [ ] Screen reader can navigate all content
```

---

## 16. THE FINAL NOTE

The user flows of The Sovereign Artisan are not mechanical paths through a website. They are the visitor's inner monologue made visible — every hesitation answered, every question anticipated, every fear dissolved. The flows exist to make the visitor feel that she is not navigating a website but being guided through an experience that was designed specifically for her.

If the visitor thinks about the user flow, the user flow has failed. If she feels that every section appeared at exactly the right moment, every piece of information arrived when she needed it, and every decision felt effortless — the user flow has succeeded.

The flows serve the story. The story serves the visitor. The visitor is the main character. Every decision point, every trust signal, every recovery path exists to make her journey from curiosity to commitment feel inevitable.

**The one thing to remember:**

We do not optimize for clicks. We do not optimize for speed. We do not optimize for metrics. We optimize for the feeling the visitor carries with her when she closes the browser — the feeling that she was taken care of, that she was understood, and that she cannot wait to experience the physical space that the digital experience so beautifully represented.

If she feels that, she will book. Not because we optimized the conversion funnel. Because we earned her trust.

---

*This document is the behavioral architecture of the digital experience. It should be consulted during UX review, during development, during content creation, during conversion optimization, and during any conversation about adding features or changing interactions. Every design decision should be tested against the question: "Does this serve the visitor's journey from curiosity to commitment?"*

*Document prepared: July 2026*
*Source documents: PRODUCT_VISION.md, COMPETITOR_RESEARCH.md, CREATIVE_DIRECTION.md, MOODBOARD.md, DESIGN_LANGUAGE.md, VISUAL_RULES.md, EXPERIENCE_STORYBOARD.md, SCROLL_STORY.md, EMOTIONAL_TIMELINE.md, INTERACTION_TIMELINE.md, SIGNATURE_MOMENTS.md, SECTION_PURPOSE.md, FEATURE_DEFINITION.md, INFORMATION_ARCHITECTURE.md*
*Constraint: User flows only — no code, no UI, no implementation*

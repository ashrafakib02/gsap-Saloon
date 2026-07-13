/**
 * Z-Index Layer System
 *
 * From DESIGN_SYSTEM §9 (Elevation & Shadows):
 * "Elevation communicates spatial relationship — which elements sit above others."
 *
 * From DESIGN_SYSTEM §6 (Grid System):
 * "The grid is the invisible skeleton of every composition."
 *
 * This layer system ensures consistent, predictable stacking order.
 * Components MUST use these tokens — never raw z-index values.
 *
 * Layer hierarchy (ascending):
 *   base (0)      — Content, images, default layer
 *   sticky (100)  — Sticky navigation, scroll-aware headers
 *   dropdown (200) — Dropdown menus, select overlays
 *   floating (300) — Floating action buttons, scroll-to-top
 *   overlay (900)  — Modal backdrops, dimming overlays
 *   modal (1000)   — Modal content, booking overlays
 *   toast (1100)   — Toast notifications (always above modals)
 *   skip (9999)    — Skip-to-content link (highest, for accessibility)
 */

export const Z_INDEX = {
  /** Default layer — content, images, normal flow */
  base: 0,

  /** Sticky elements — navigation headers, sticky sidebars */
  sticky: 100,

  /** Dropdown menus, select overlays, popover content */
  dropdown: 200,

  /** Floating elements — FABs, scroll-to-top buttons */
  floating: 300,

  /** Modal backdrops, dimming overlays, loading overlays */
  overlay: 900,

  /** Modal content — booking overlays, dialogs, lightboxes */
  modal: 1000,

  /** Toast notifications — always above modals for visibility */
  toast: 1100,

  /** Skip-to-content link — highest for keyboard accessibility (WCAG 2.1) */
  skip: 9999,
} as const;

export type ZIndexToken = typeof Z_INDEX[keyof typeof Z_INDEX];

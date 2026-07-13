// ── Navigation Types ───────────────────────────────────────
// TypeScript types for the Global Navigation System.

/**
 * A single navigation link entry.
 *
 * From PROJECT_BLUEPRINT §Navigation Components:
 * "Minimal navigation links (Services, Artisans, Contact)
 *  with anchor scroll behavior"
 */
export interface NavItem {
  /** Display label — uppercase per VISUAL_RULES T14 */
  label: string;
  /** Section ID to scroll to (e.g., 'services', 'artisans') */
  sectionId: string;
}

/**
 * Navigation configuration — the complete list of nav items.
 *
 * From PROJECT_BLUEPRINT:
 * "NavLinks: Services, Artisans, Contact (minimal)"
 * From VISUAL_RULES N8:
 * "ALL-CAPS reserved for very short labels (navigation items) at most"
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Services', sectionId: 'services' },
  { label: 'Artisans', sectionId: 'artisans' },
  { label: 'Contact', sectionId: 'contact' },
] as const;

/**
 * The section ID for the booking anchor (CTA scrolls here).
 */
export const BOOKING_SECTION_ID = 'booking' as const;

/**
 * Props for the NavLink component.
 */
export interface NavLinkProps {
  /** The navigation item to render */
  item: NavItem;
  /** Whether this link's section is currently active */
  isActive: boolean;
  /** Callback when the link is clicked */
  onClick: (sectionId: string) => void;
  /** Optional: render as a different element */
  className?: string;
}

/**
 * Props for the Navigation (site header) component.
 */
export interface NavigationProps {
  /** Section IDs to track for active section detection */
  sectionIds?: string[];
}

/**
 * Props for the MobileMenu component.
 */
export interface MobileMenuProps {
  /** Whether the mobile menu is open */
  isOpen: boolean;
  /** Callback to close the mobile menu */
  onClose: () => void;
  /** Callback when a nav link is clicked */
  onNavigate: (sectionId: string) => void;
}

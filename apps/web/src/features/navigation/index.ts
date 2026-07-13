// ── Navigation Feature ─────────────────────────────────────
// Public API for the Global Navigation System.
// From TECHNICAL_ARCHITECTURE §3.5:
// "Each feature has a single entry point. The index.ts file
//  exports the feature's public API."

export { Navigation } from './navigation';
export { MobileMenu } from './mobile-menu';
export { NavLink } from './nav-link';
export { NAV_ITEMS, BOOKING_SECTION_ID } from './navigation.types';
export type { NavItem, NavLinkProps, NavigationProps, MobileMenuProps } from './navigation.types';

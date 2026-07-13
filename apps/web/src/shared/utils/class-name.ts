import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names with conflict resolution.
 *
 * Combines clsx (conditional classes) with tailwind-merge
 * (deduplicates conflicting Tailwind utilities).
 *
 * This is the standard class name utility for the entire project.
 * From TECHNICAL_ARCHITECTURE §20.6:
 * "Utility-first: All styling via Tailwind utility classes."
 *
 * @example
 * ```tsx
 * <div className={cn('p-4 bg-surface', isActive && 'bg-accent', className)}>
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

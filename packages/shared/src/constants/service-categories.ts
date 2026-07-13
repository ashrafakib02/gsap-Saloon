export const SERVICE_CATEGORIES = {
  hair: { label: 'Hair', slug: 'hair' },
  color: { label: 'Color', slug: 'color' },
  bridal: { label: 'Bridal', slug: 'bridal' },
  spa: { label: 'Spa', slug: 'spa' },
} as const;

export type ServiceCategorySlug = keyof typeof SERVICE_CATEGORIES;

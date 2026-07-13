export interface Testimonial {
  id: string;
  clientName: string;
  clientImageSrc?: string;
  content: string;
  rating: number; // 1-5
  serviceSlug?: string;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
}

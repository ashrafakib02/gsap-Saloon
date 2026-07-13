export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  duration: number; // minutes
  price: number; // cents
  category: ServiceCategory;
  imageSrc?: string;
  imageAlt?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 'hair' | 'color' | 'bridal' | 'spa';

export interface ServiceSummary {
  id: string;
  name: string;
  slug: string;
  duration: number;
  price: number;
  category: ServiceCategory;
  imageSrc?: string;
}

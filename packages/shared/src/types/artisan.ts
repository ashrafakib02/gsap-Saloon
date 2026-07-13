export interface Artisan {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio?: string;
  imageSrc?: string;
  imageAlt?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArtisanSummary {
  id: string;
  name: string;
  title: string;
  specialty: string;
  imageSrc?: string;
}

export type User = {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  favorites?: string[];
};

export type PropertyImage = {
  url: string;
  filename?: string;
};

export type PropertyLocation = {
  city?: string;
  state?: string;
  address?: string;
  landmark?: string;
  pincode?: string;
  coordinates?: {
    lat?: number | null;
    lng?: number | null;
  };
};

export type Property = {
  _id: string;
  id?: string;
  slug?: string;
  title: string;
  description?: string;
  listingType?: 'sale' | 'rent' | string;
  category?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  images?: PropertyImage[];
  media?: { type: 'image' | 'video' | 'youtube'; url: string; label?: string }[];
  location?: PropertyLocation;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  postedBy?: Partial<User>;
  isFeatured?: boolean;
  featuredUntil?: string | null;
  createdAt?: string;
  views?: number;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type PropertyListResponse = {
  success: boolean;
  data: Property[];
  pagination: Pagination;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  token: string;
  user: User;
};

export type InquiryPayload = {
  propertyId?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: 'property' | 'homepage' | 'book_visit' | 'contact';
  location?: string;
  budget?: string;
};

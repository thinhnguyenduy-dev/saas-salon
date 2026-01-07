import apiClient from './api-client';

export interface Shop {
  id: string;
  name: string;
  slug: string;
  street: string;
  city: string;
  district: string;
  ward: string;
  businessHours: any[];
  subscriptionPlan: string;
  // Computed/Joined fields potentially
  rating?: number;
  reviewCount?: number;
  image?: string;
  category?: string; // We might need to fetch this or infer
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const fetchShops = async (params: any): Promise<PaginatedResult<Shop>> => {
  const response = await apiClient.get('/shops', { params });
  // Unwrap response if wrapped in { success: true, data: ... }
  return response.data.data || response.data;
};

export const fetchShopBySlug = async (slug: string) => {
    const response = await apiClient.get(`/shops/${slug}/public`);
    return response.data.data || response.data;
};

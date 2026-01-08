
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface Category {
  id: string; // TypeORM uses 'id', check if it's '_id' or 'id'. Entity usually 'id'. backend service uses 'id'.
  name: string;
  description?: string;
  color?: string;
  shopId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  color?: string;
}

export const useCategories = (page = 1, limit = 100, search?: string) => {
  return useQuery({
    queryKey: ['categories', page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);

      const { data } = await apiClient.get(`/categories?${params.toString()}`);
      return data; // { docs: Category[], totalDocs, ... }
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategory: CategoryFormData) => {
      const { data } = await apiClient.post('/categories', newCategory);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Add other hooks if needed (update, delete)

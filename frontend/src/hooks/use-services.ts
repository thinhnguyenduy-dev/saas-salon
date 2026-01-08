import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  isActive: boolean;
  categoryId: string;
}

export const useServices = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['services', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/services?page=${page}&limit=${limit}`);
      return data.data; // Assuming standardized response: { success: true, data: { docs: [], ... } }
    },
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newService: Partial<Service>) => {
      const { data } = await apiClient.post('/services', newService);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Service> }) => {
      const res = await apiClient.patch(`/services/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

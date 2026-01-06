import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export enum MembershipTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

export interface Customer {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  membershipTier: MembershipTier;
  loyaltyPoints: number;
  tags: string[];
  stats?: {
    totalBookings: number;
    totalRevenue: number;
    lastVisit?: Date;
    averageTicketSize: number;
  };
}

export const useCustomers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['customers', page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/customers?page=${page}&limit=${limit}`);
      return data.data; // Assuming standardize response: { success: true, data: { docs: [], ... } }
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCustomer: Partial<Customer>) => {
      const { data } = await apiClient.post('/customers', newCustomer);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
      const res = await apiClient.patch(`/customers/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

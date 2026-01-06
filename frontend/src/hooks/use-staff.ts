import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface WorkShift {
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface Staff {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  skills: string[];
  isActive: boolean;
  workSchedule: WorkShift[];
  baseSalary: number;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormData {
  fullName: string;
  email?: string;
  phone?: string;
  skills?: string[];
  isActive?: boolean;
  workSchedule?: WorkShift[];
  baseSalary?: number;
  commissionRate?: number;
}

export const useStaff = (page = 1, limit = 10, search?: string) => {
  return useQuery({
    queryKey: ['staff', page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);
      
      const { data } = await apiClient.get(`/staff?${params.toString()}`);
      return data.data; // { docs: [], totalDocs, page, limit, ... }
    },
  });
};

export const useStaffById = (id: string) => {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/staff/${id}`);
      return data.data as Staff;
    },
    enabled: !!id,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStaff: StaffFormData) => {
      const { data } = await apiClient.post('/staff', newStaff);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StaffFormData> }) => {
      const res = await apiClient.patch(`/staff/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/staff/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

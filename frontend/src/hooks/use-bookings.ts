import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface Booking {
  id: string;
  bookingCode: string;
  customer?: { id: string; fullName: string; email?: string; phone?: string }; 
  staff?: { id: string; fullName: string };
  services: { id: string; name: string; price: number; duration: number }[];
  appointmentDate: string; // ISO date
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  totalDuration: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
}

export const useBookings = (params?: { date?: Date; startDate?: Date; endDate?: Date; status?: string; staffId?: string }) => {
  const queryDate = params?.date ? params.date.toISOString().split('T')[0] : undefined;
  const queryStartDate = params?.startDate ? params.startDate.toISOString().split('T')[0] : undefined;
  const queryEndDate = params?.endDate ? params.endDate.toISOString().split('T')[0] : undefined;
  
  return useQuery({
    queryKey: ['bookings', queryDate, queryStartDate, queryEndDate, params?.status, params?.staffId],
    queryFn: async () => {
      let url = `/bookings?page=1&limit=100`; // Increased limit for calendar
      if (queryDate) url += `&date=${queryDate}`;
      if (queryStartDate && queryEndDate) url += `&startDate=${queryStartDate}&endDate=${queryEndDate}`;
      if (params?.status) url += `&status=${params.status}`;
      if (params?.staffId) url += `&staffId=${params.staffId}`;
      
      const { data } = await apiClient.get(url);
      return data.data; 
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBooking: any) => {
      const { data } = await apiClient.post('/bookings', newBooking);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Booking> }) => {
      const res = await apiClient.patch(`/bookings/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

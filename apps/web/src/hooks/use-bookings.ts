import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface Booking {
  _id: string;
  bookingCode: string;
  customerId: any; // Expand ref if needed
  staffId?: any;   // Expand ref
  services: any[]; // Expand ref
  appointmentDate: string; // ISO date
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  totalDuration: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
}

export const useBookings = (date?: Date, status?: string) => {
  const queryDate = date ? date.toISOString().split('T')[0] : undefined;
  
  return useQuery({
    queryKey: ['bookings', queryDate, status],
    queryFn: async () => {
      let url = `/bookings?page=1&limit=50`; // Get more for calendar
      if (queryDate) url += `&date=${queryDate}`;
      if (status) url += `&status=${status}`;
      
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

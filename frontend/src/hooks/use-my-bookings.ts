import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Booking } from './use-bookings'; // Reuse type

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/bookings/my-bookings');
      // The backend returns an array directly, based on my implementation: 
      // return this.bookingRepository.find(...)
      // So no data.data structure?
      // Wait, axios response object has data. 
      // If NestJS returns array, then res.data is array.
      // If using standardized interceptor??
      // Let's assume standard Axios behavior first, but check apiClient.
      return data; 
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
};

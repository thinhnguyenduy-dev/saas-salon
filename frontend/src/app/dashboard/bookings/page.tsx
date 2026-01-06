'use client';

import { useBookings } from '@/hooks/use-bookings';
import { BookingCalendar } from '@/components/bookings/booking-calendar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function BookingsPage() {
  const { data, isLoading } = useBookings(); // Fetch all for now, optimize with date range later
  
  const bookings = data?.docs || [];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Manage appointments and staff schedules.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Booking
        </Button>
      </div>

      <div className="flex-1">
        {isLoading ? (
            <div>Loading calendar...</div>
        ) : (
            <BookingCalendar bookings={bookings} />
        )}
      </div>
    </div>
  );
}

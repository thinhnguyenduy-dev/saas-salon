'use client';

import { useBookings } from '@/hooks/use-bookings';
import { BookingCalendar } from '@/components/bookings/booking-calendar';
import { BookingModal } from '@/components/dashboard/booking-modal';
import { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';

export default function BookingsPage() {
  const [view, setView] = useState('week'); // Default to week view
  const [date, setDate] = useState(new Date());

  // Calculate range for query
  let startDate: Date, endDate: Date;
  
  if (view === 'month') {
      startDate = startOfMonth(date);
      endDate = endOfMonth(date);
  } else if (view === 'week') {
      startDate = startOfWeek(date);
      endDate = endOfWeek(date);
  } else {
      // day or agenda
      startDate = startOfDay(date);
      endDate = endOfDay(date);
  }

  // Adjust for calendar overflow (previous/next month days visible in month view) - optional but nice
  // For simplicity, strict month/week matches for now.
  
  const { data, isLoading } = useBookings({ startDate, endDate });
  
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
        <BookingModal />
      </div>

      <div className="flex-1 min-h-[600px]">
        {isLoading ? (
            <div className="flex items-center justify-center h-full">Loading calendar...</div>
        ) : (
            <BookingCalendar 
                bookings={bookings} 
                view={view}
                date={date}
                onView={setView}
                onNavigate={setDate}
            />
        )}
      </div>
    </div>
  );
}

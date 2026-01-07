'use client';

import { useBookings } from '@/hooks/use-bookings';
import { useStaff } from '@/hooks/use-staff';
import { BookingCalendar } from '@/components/bookings/booking-calendar';
import { BookingModal } from '@/components/dashboard/booking-modal';
import { StaffFilter } from '@/components/bookings/staff-filter';
import { CalendarToolbar } from '@/components/bookings/calendar-toolbar';
import { BookingDetailModal } from '@/components/bookings/booking-detail-modal';
import { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Booking } from '@/hooks/use-bookings';

export default function BookingsPage() {
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [location, setLocation] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch staff members
  const { data: staffData, isLoading: isLoadingStaff } = useStaff(1, 100);
  const staff = staffData?.docs || [];

  // Calculate range for query
  let startDate: Date, endDate: Date;
  
  if (view === 'month') {
    startDate = startOfMonth(date);
    endDate = endOfMonth(date);
  } else if (view === 'week') {
    startDate = startOfWeek(date);
    endDate = endOfWeek(date);
  } else {
    startDate = startOfDay(date);
    endDate = endOfDay(date);
  }

  const { data, isLoading } = useBookings({ startDate, endDate });
  
  // Filter bookings by selected staff
  let bookings = data?.docs || [];
  if (selectedStaffIds.length > 0) {
    bookings = bookings.filter((booking: any) => 
      booking.staff && selectedStaffIds.includes(booking.staff.id)
    );
  }

  const handleToday = () => {
    setDate(new Date());
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    // Small delay before clearing to allow smooth close animation
    setTimeout(() => setSelectedBooking(null), 200);
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            Manage appointments and staff schedules
          </p>
        </div>
        <BookingModal />
      </div>

      {/* Staff Filter */}
      {isLoadingStaff ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading staff...</span>
        </div>
      ) : (
        <StaffFilter
          staff={staff}
          selectedStaffIds={selectedStaffIds}
          onSelectionChange={setSelectedStaffIds}
        />
      )}

      {/* Calendar Toolbar */}
      <CalendarToolbar
        date={date}
        view={view}
        onNavigate={setDate}
        onViewChange={setView}
        onToday={handleToday}
        location={location}
        onLocationChange={setLocation}
      />

      {/* Calendar */}
      <div className="flex-1 min-h-[600px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full border rounded-lg bg-muted/10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading calendar...</p>
            </div>
          </div>
        ) : (
          <BookingCalendar 
            bookings={bookings} 
            view={view}
            date={date}
            onView={setView}
            onNavigate={setDate}
            onSelectEvent={handleSelectBooking}
          />
        )}
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        open={isDetailModalOpen}
        onOpenChange={handleCloseDetailModal}
      />
    </div>
  );
}

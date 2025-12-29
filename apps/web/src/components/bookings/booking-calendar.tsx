"use client"

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Booking } from '@/hooks/use-bookings'
import { useState } from 'react'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

interface BookingCalendarProps {
  bookings: Booking[];
  onSelectEvent?: (booking: Booking) => void;
  onSelectSlot?: (slotInfo: any) => void;
}

export function BookingCalendar({ bookings, onSelectEvent, onSelectSlot }: BookingCalendarProps) {
  const [view, setView] = useState<any>('week') // 'month', 'week', 'day', 'agenda'

  // Transform bookings to calendar events
  const events = bookings.map(booking => {
     const startDate = new Date(booking.appointmentDate);
     const [startH, startM] = booking.startTime.split(':').map(Number);
     startDate.setHours(startH, startM, 0);

     const endDate = new Date(booking.appointmentDate);
     const [endH, endM] = booking.endTime.split(':').map(Number);
     endDate.setHours(endH, endM, 0);

     return {
         id: booking._id,
         title: `${booking.customerId?.fullName || 'Customer'} - ${booking.status}`,
         start: startDate,
         end: endDate,
         resource: booking,
         allDay: false
     }
  });

  return (
    <div className="h-[700px] bg-background text-foreground p-4 rounded-md border">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        view={view}
        onView={setView}
        onSelectEvent={(event) => onSelectEvent?.(event.resource)}
        onSelectSlot={onSelectSlot}
        selectable
        step={15} // 15 min slots
        timeslots={4}
      />
    </div>
  )
}

"use client"

import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '@/styles/calendar-custom.css'
import { Booking } from '@/hooks/use-bookings'

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
  view: any;
  date: Date;
  onNavigate: (date: Date) => void;
  onView: (view: any) => void;
  onSelectEvent?: (booking: Booking) => void;
  onSelectSlot?: (slotInfo: any) => void;
}

// Service name to color mapping
const getServiceColor = (serviceName: string): string => {
  const serviceColors: Record<string, string> = {
    'Traditional Balinese Massage': 'teal',
    'Hot Stone Massage': 'purple',
    'Aromatherapy Massage': 'blue',
    'Deep Tissue Massage': 'pink',
    'Facial Treatment': 'orange',
    'Swedish Massage': 'green',
    'Thai Massage': 'yellow',
    'Sports Massage': 'red',
  };

  // Find matching service or return default
  for (const [key, color] of Object.entries(serviceColors)) {
    if (serviceName.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }

  // Default colors based on hash of service name
  const colors = ['teal', 'purple', 'blue', 'pink', 'orange', 'green', 'yellow'];
  const hash = serviceName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Get status color class
const getStatusClass = (status: string): string => {
  switch (status) {
    case 'CONFIRMED': return 'confirmed';
    case 'PENDING': return 'pending';
    case 'CANCELLED': return 'cancelled';
    default: return 'pending';
  }
};

export function BookingCalendar({ 
  bookings, 
  view,
  date,
  onNavigate,
  onView,
  onSelectEvent, 
  onSelectSlot 
}: BookingCalendarProps) {

  // Transform bookings to calendar events
  const events = bookings.map(booking => {
     const startDate = new Date(booking.appointmentDate);
     const [startH, startM] = booking.startTime.split(':').map(Number);
     startDate.setHours(startH, startM, 0);

     const endDate = new Date(booking.appointmentDate);
     const [endH, endM] = booking.endTime.split(':').map(Number);
     endDate.setHours(endH, endM, 0);

     const serviceName = booking.services?.[0]?.name || 'Service';
     const customerName = booking.customer?.fullName || 'Guest';

     return {
         id: booking.id,
         title: `${format(startDate, 'HH:mm')} ${customerName} - ${serviceName}`,
         start: startDate,
         end: endDate,
         resource: booking,
         allDay: false
     }
  });

  // Custom event style getter
  const eventStyleGetter = (event: any) => {
    const booking: Booking = event.resource;
    const serviceName = booking.services?.[0]?.name || 'Service';
    const colorClass = getServiceColor(serviceName);

    return {
      className: `event-${colorClass}`,
    };
  };

  // Custom event component
  const EventComponent = ({ event }: { event: any }) => {
    const booking: Booking = event.resource;
    const serviceName = booking.services?.[0]?.name || 'Service';
    const customerName = booking.customer?.fullName || 'Guest';
    const statusClass = getStatusClass(booking.status);

    return (
      <div className="booking-event-content">
        <div className="booking-event-time">
          {format(event.start, 'HH:mm')}
        </div>
        <div className="booking-event-customer">
          <span className={`booking-event-status ${statusClass}`}></span>
          {customerName}
        </div>
        <div className="booking-event-service">
          {serviceName}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-background text-foreground rounded-lg border overflow-hidden">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', minHeight: '600px' }}
        view={view}
        date={date}
        onNavigate={onNavigate}
        onView={onView}
        onSelectEvent={(event) => onSelectEvent?.(event.resource)}
        onSelectSlot={onSelectSlot}
        selectable
        step={15}
        timeslots={4}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent,
        }}
        min={new Date(0, 0, 0, 8, 0, 0)} // Start at 8 AM
        max={new Date(0, 0, 0, 22, 0, 0)} // End at 10 PM
        defaultView="week"
      />
    </div>
  )
}

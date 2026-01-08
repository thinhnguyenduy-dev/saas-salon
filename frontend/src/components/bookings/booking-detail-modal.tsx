"use client"

import { Booking } from '@/hooks/use-bookings';
import { useUpdateBooking } from '@/hooks/use-bookings';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookingStatusSelector } from './booking-status-selector';
import { format } from 'date-fns';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Scissors,
  UserCircle,
  DollarSign,
  FileText,
  XCircle,
  CalendarClock
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface BookingDetailModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailModal({ booking, open, onOpenChange }: BookingDetailModalProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const updateBooking = useUpdateBooking();

  if (!booking) return null;

  const appointmentDate = new Date(booking.appointmentDate);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = `${booking.startTime} - ${booking.endTime}`;

  const handleCancelBooking = async () => {
    try {
      await updateBooking.mutateAsync({
        id: booking.id,
        data: { status: 'CANCELLED' },
      });
      
      toast.success('Booking cancelled successfully');
      setShowCancelDialog(false);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error('Error cancelling booking:', error);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle className="text-2xl">Booking Details</SheetTitle>
                <SheetDescription className="text-base font-mono">
                  #{booking.bookingCode}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Status Selector */}
            <BookingStatusSelector 
              booking={booking} 
              onStatusChange={() => {}} 
            />

            <Separator />

            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {booking.customer?.fullName || 'Guest'}
                      </p>
                    </div>
                  </div>
                  
                  {booking.customer?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{booking.customer.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {booking.customer?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{booking.customer.phone}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                Services
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {booking.services.map((service, index) => (
                      <div key={service.id || index}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {service.duration} minutes
                            </p>
                          </div>
                          <p className="font-semibold">
                            ${Number(service.price || 0).toFixed(2)}
                          </p>
                        </div>
                        {index < booking.services.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Staff Member */}
            {booking.staff && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Staff Member
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <p className="font-medium">{booking.staff.fullName}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Appointment Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CalendarClock className="w-4 h-4" />
                Appointment Details
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{formattedTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{booking.totalDuration} minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notes
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {booking.notes}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Payment */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Payment
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold">
                        ${Number(booking.totalPrice || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium text-amber-600">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3 pb-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setShowCancelDialog(true)}
                disabled={booking.status === 'CANCELLED' || booking.status === 'COMPLETED'}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Booking
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking for{' '}
              <span className="font-semibold">{booking.customer?.fullName || 'Guest'}</span>?
              This action cannot be undone and the customer may need to be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

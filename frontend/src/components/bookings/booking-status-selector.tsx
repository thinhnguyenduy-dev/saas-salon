"use client"

import { Booking } from '@/hooks/use-bookings';
import { useUpdateBooking } from '@/hooks/use-bookings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'sonner';
import { BookingStatusBadge } from './booking-status-badge';

interface BookingStatusSelectorProps {
  booking: Booking;
  onStatusChange?: () => void;
}

export function BookingStatusSelector({ booking, onStatusChange }: BookingStatusSelectorProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Booking['status'] | null>(null);
  const updateBooking = useUpdateBooking();

  const statusOptions: Array<{ value: Booking['status']; label: string }> = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'NO_SHOW', label: 'No Show' },
  ];

  const handleStatusChange = (newStatus: Booking['status']) => {
    // Show confirmation for destructive actions
    if (newStatus === 'CANCELLED' || newStatus === 'NO_SHOW') {
      setPendingStatus(newStatus);
      setShowConfirmDialog(true);
    } else {
      updateStatus(newStatus);
    }
  };

  const updateStatus = async (newStatus: Booking['status']) => {
    try {
      await updateBooking.mutateAsync({
        id: booking.id,
        data: { status: newStatus },
      });
      
      toast.success(`Booking status updated to ${newStatus.toLowerCase()}`);
      onStatusChange?.();
    } catch (error) {
      toast.error('Failed to update booking status');
      console.error('Error updating booking:', error);
    }
  };

  const handleConfirm = () => {
    if (pendingStatus) {
      updateStatus(pendingStatus);
      setPendingStatus(null);
    }
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={booking.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <BookingStatusBadge status={booking.status} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <BookingStatusBadge status={option.value} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatus === 'CANCELLED' && (
                <>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                  The customer may need to be notified.
                </>
              )}
              {pendingStatus === 'NO_SHOW' && (
                <>
                  Are you sure you want to mark this booking as a no-show? This will be recorded
                  in the customer's history.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

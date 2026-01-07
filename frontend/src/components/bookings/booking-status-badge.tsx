"use client"

import { Booking } from '@/hooks/use-bookings';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  UserX 
} from 'lucide-react';

interface BookingStatusBadgeProps {
  status: Booking['status'];
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    variant: 'secondary' as const,
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmed',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'secondary' as const,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
  NO_SHOW: {
    label: 'No Show',
    variant: 'secondary' as const,
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    icon: UserX,
  },
};

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, 'gap-1.5 font-medium', className)}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}

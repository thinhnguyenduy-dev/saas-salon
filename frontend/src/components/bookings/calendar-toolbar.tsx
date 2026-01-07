"use client"

import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CalendarToolbarProps {
  date: Date;
  view: string;
  onNavigate: (date: Date) => void;
  onViewChange: (view: string) => void;
  onToday: () => void;
  location?: string;
  onLocationChange?: (location: string) => void;
}

export function CalendarToolbar({
  date,
  view,
  onNavigate,
  onViewChange,
  onToday,
  location,
  onLocationChange,
}: CalendarToolbarProps) {
  const goToPrevious = () => {
    const newDate = new Date(date);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    onNavigate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(date);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onNavigate(newDate);
  };

  const getDateLabel = () => {
    if (view === 'month') {
      return format(date, 'MMMM yyyy');
    } else if (view === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return format(weekStart, 'MMMM d') + ' - ' + format(weekEnd, 'd, yyyy');
      } else {
        return format(weekStart, 'MMM d') + ' - ' + format(weekEnd, 'MMM d, yyyy');
      }
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Left Section: Location & Date Navigation */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Location Selector */}
        {onLocationChange && (
          <Select value={location} onValueChange={onLocationChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="london">London</SelectItem>
              <SelectItem value="manchester">Manchester</SelectItem>
              <SelectItem value="birmingham">Birmingham</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="font-medium"
          >
            TODAY
          </Button>
          
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="px-3 py-1 text-sm font-medium border-x min-w-[200px] text-center">
              {getDateLabel()}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section: View Toggles */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant={view === 'week' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "rounded-r-none",
              view === 'week' && "bg-primary text-primary-foreground"
            )}
            onClick={() => onViewChange('week')}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            WEEK
          </Button>
          
          <Button
            variant={view === 'day' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "rounded-none border-x",
              view === 'day' && "bg-primary text-primary-foreground"
            )}
            onClick={() => onViewChange('day')}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            DAY
          </Button>
          
          <Button
            variant={view === 'agenda' ? 'default' : 'ghost'}
            size="sm"
            className={cn(
              "rounded-l-none",
              view === 'agenda' && "bg-primary text-primary-foreground"
            )}
            onClick={() => onViewChange('agenda')}
          >
            LIST
          </Button>
        </div>
      </div>
    </div>
  );
}

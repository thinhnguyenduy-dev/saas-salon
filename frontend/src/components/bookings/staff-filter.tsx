"use client"

import { Staff } from '@/hooks/use-staff';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StaffFilterProps {
  staff: Staff[];
  selectedStaffIds: string[];
  onSelectionChange: (staffIds: string[]) => void;
}

export function StaffFilter({ staff, selectedStaffIds, onSelectionChange }: StaffFilterProps) {
  const isAllSelected = selectedStaffIds.length === 0;

  const toggleStaff = (staffId: string) => {
    if (selectedStaffIds.includes(staffId)) {
      onSelectionChange(selectedStaffIds.filter(id => id !== staffId));
    } else {
      onSelectionChange([...selectedStaffIds, staffId]);
    }
  };

  const toggleAll = () => {
    onSelectionChange([]);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      {/* All Staff Option */}
      <button
        onClick={toggleAll}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full border transition-all shrink-0",
          isAllSelected
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background hover:bg-accent border-border"
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
          isAllSelected ? "bg-primary-foreground/20" : "bg-muted"
        )}>
          All
        </div>
        <span className="text-sm font-medium">All Staff</span>
        {isAllSelected && <Check className="w-4 h-4" />}
      </button>

      {/* Individual Staff */}
      {staff.map((member) => {
        const isSelected = isAllSelected || selectedStaffIds.includes(member.id);
        
        return (
          <button
            key={member.id}
            onClick={() => toggleStaff(member.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full border transition-all shrink-0",
              isSelected
                ? "bg-primary/10 border-primary"
                : "bg-background hover:bg-accent border-border"
            )}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {getInitials(member.fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{member.fullName}</span>
            {isSelected && !isAllSelected && <Check className="w-4 h-4 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}

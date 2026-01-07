"use client"

import { useBookingStore } from "@/hooks/use-booking-store"
import { Users, User } from "lucide-react"

interface StepStaffProps {
  staffList: any[];
}

export function StepStaff({ staffList }: StepStaffProps) {
  const { staff, setStaff } = useBookingStore()

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Choose Professional</h2>
        <p className="text-muted-foreground">Select a specialist or choose any available</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Any Professional Option */}
        <div 
          className={`p-4 border rounded-xl cursor-pointer flex items-center gap-4 transition-all hover:bg-muted/50 ${!staff ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}
          onClick={() => setStaff(null)}
        >
          <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bold">Any Professional</h3>
            <p className="text-sm text-muted-foreground">Maximum availability</p>
          </div>
        </div>

        {/* Staff List */}
        {staffList.map((member) => {
          const isSelected = staff?.id === member.id
          return (
            <div 
              key={member.id} 
              className={`p-4 border rounded-xl cursor-pointer flex items-center gap-4 transition-all hover:bg-muted/50 ${isSelected ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}
              onClick={() => setStaff({ id: member.id, name: member.fullName || member.name, image: member.image })}
            >
              <div className="h-14 w-14 rounded-full bg-muted overflow-hidden relative flex items-center justify-center">
                 {member.image ? 
                    <img src={member.image} alt={member.name} className="object-cover w-full h-full" /> 
                    : <span className="text-xs font-bold">{member.fullName?.[0] || member.name?.[0]}</span>
                 }
              </div>
              <div>
                <h3 className="font-bold">{member.fullName || member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role || 'Staff'}</p>
                <p className="text-xs font-medium mt-0.5 flex items-center gap-1">
                  ⭐ {member.rating || '5.0'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

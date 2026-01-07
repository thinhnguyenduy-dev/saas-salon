"use client"

import { useBookingStore } from "@/hooks/use-booking-store"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import apiClient from "@/lib/api-client"

interface StepTimeProps {
    shopId: string;
}

export function StepTime({ shopId }: StepTimeProps) {
  const { timeSlot, setTimeSlot, setStep, services, staff } = useBookingStore()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSlots = async () => {
        if (!date || services.length === 0) return;
        
        setLoading(true);
        try {
            const formattedDate = format(date, "yyyy-MM-dd");
            const serviceIds = services.map(s => s.id).join(',');
            
            const params: any = {
                date: formattedDate,
                serviceIds,
                shopId // Although backend assumes serviceIds belong to a shop, sending shopId helps if needed or validation
            };
            
            if (staff) params.staffId = staff.id;

            const res = await apiClient.get('/bookings/slots', { params });
            // API wraps response in { success: true, data: [...] }
            const slotsData = res.data?.data || res.data || [];
            setSlots(Array.isArray(slotsData) ? slotsData : []);
        } catch (error) {
            console.error("Failed to fetch slots", error);
            setSlots([]); 
        } finally {
            setLoading(false);
        }
    };

    fetchSlots();
  }, [date, services, staff, shopId]);

  const handleSlotValues = (time: string) => {
    if (date) {
       setTimeSlot({ date, time })
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Select time</h2>
        <p className="text-muted-foreground">Choose a date and time for your appointment</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="flex justify-center border rounded-xl p-4">
             <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                initialFocus
                className="rounded-md border-0"
             />
        </div>

        {/* Time Slots */}
        <div className="space-y-4">
          <h3 className="font-semibold text-center md:text-left">Available Slots on {date ? format(date, "MMMM do") : "Selected Date"}</h3>
          
          {loading ? (
              <div className="flex justify-center py-10"><span className="loading-spinner">Loading slots...</span></div>
          ) : slots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                  No slots available for this date.
              </div>
          ) : (
              <div className="grid grid-cols-3 gap-3">
                 {slots.map((time) => {
                    const isSelected = timeSlot?.time === time && timeSlot?.date?.toDateString() === date?.toDateString()
                    return (
                      <Button 
                        key={time} 
                        variant={isSelected ? "default" : "outline"}
                        className={`w-full ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
                        onClick={() => handleSlotValues(time)}
                      >
                        {time}
                      </Button>
                    )
                 })}
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

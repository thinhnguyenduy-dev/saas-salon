"use client"

import { useBookingStore } from "@/hooks/use-booking-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { MapPin, Calendar, User } from "lucide-react"
import { useState } from "react"
import apiClient from "@/lib/api-client"
import { useRouter } from "next/navigation"

interface StepCheckoutProps {
    shop: any;
}

export function StepCheckout({ shop }: StepCheckoutProps) {
  const router = useRouter()
  const { services, staff, timeSlot, reset } = useBookingStore()
  const total = services.reduce((acc, s) => acc + s.price, 0)

  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleBooking = async () => {
    if (!guestName || !guestPhone) {
        setError("Name and Phone are required.")
        return;
    }
    if (!timeSlot?.date || !timeSlot?.time) {
        setError("Time slot is missing.")
        return;
    }
    
    setLoading(true);
    setError("");

    try {
         const payload = {
             shopId: shop.id,
             services: services.map(s => s.id),
             staffId: staff?.id,
             appointmentDate: format(timeSlot.date, "yyyy-MM-dd"), // ensure date obj
             startTime: timeSlot.time,
             guestName,
             guestPhone,
             guestEmail
         };

         await apiClient.post('/bookings/public', payload);
         alert("Booking Successful!");
         reset();
         router.push('/'); 
    } catch (err: any) {
        console.error(err);
        const msg = err.response?.data?.message;
        setError(Array.isArray(msg) ? msg.join(', ') : (msg || "Booking failed. Please try again."));
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Review and Confirm</h2>
        <p className="text-muted-foreground">Please review your booking details</p>
      </div>

      <div className="grid md:grid-cols-[1fr_380px] gap-8">
        {/* Helper / Login Section */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Log in to proceed with your booking or continue as guest.</p>
                     
                     <div className="grid gap-2">
                        <label className="text-sm font-medium">Full Name *</label>
                        <input 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                            placeholder="John Doe" 
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                        />
                     </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Phone Number *</label>
                        <input 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                            placeholder="+1 234 567 890" 
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                        />
                     </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Email (Optional)</label>
                        <input 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" 
                            placeholder="john@example.com" 
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                        />
                     </div>
                     {error && <p className="text-red-500 text-sm">{error}</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Cancel for free up to 24 hours in advance. Late cancellations may incur a 50% fee.</p>
                </CardContent>
            </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
             <Card className="shadow-lg border-primary/20">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-bold">{shop.name}</p>
                            <p className="text-sm text-muted-foreground">{shop.street}, {shop.city}</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-bold">
                                {timeSlot?.date ? format(timeSlot.date, "MMMM do, yyyy") : "Date not selected"}
                            </p>
                            <p className="text-sm text-muted-foreground">{timeSlot?.time || "Time not selected"}</p>
                        </div>
                    </div>

                    {staff && (
                        <div className="flex items-start gap-3">
                             <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0 relative overflow-hidden">
                                {staff.image ? <img src={staff.image} className="w-full h-full object-cover" /> : <User className="h-5 w-5 text-muted-foreground" />}
                             </div>
                             <div>
                                <p className="font-bold">{staff.name}</p>
                                <p className="text-sm text-muted-foreground">Professional</p>
                             </div>
                        </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                        {services.map(service => (
                            <div key={service.id} className="flex justify-between text-sm">
                                <span className="flex-1">{service.name}</span>
                                <span className="font-medium">${service.price}</span>
                            </div>
                        ))}
                    </div>

                     <Separator />

                    <div className="flex justify-between font-bold text-lg">
                        <span>Total to pay</span>
                        <span>${total}</span>
                    </div>

                    <Button className="w-full h-12 text-base font-bold mt-4" onClick={handleBooking} disabled={loading}>
                        {loading ? "Confirming..." : "Confirm Booking"}
                    </Button>
                </CardContent>
             </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useMyBookings, useCancelBooking } from "@/hooks/use-my-bookings"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, Clock, MapPin } from "lucide-react"
import { toast } from "sonner"
import { Booking } from "@/hooks/use-bookings"

export default function MyBookingsPage() {
  const { data: bookings, isLoading } = useMyBookings()
  const cancelBooking = useCancelBooking()

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  const bookingList = (Array.isArray(bookings) ? bookings : []) as Booking[]

  const now = new Date()
  
  const upcoming = bookingList.filter(b => {
      // Logic: if status is not CANCELLED/COMPLETED/NO_SHOW? 
      // And date is future?
      // Simple logic: Status based + Date based.
      const isPastStatus = ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(b.status)
      if (isPastStatus) return false
      
      const appointmentTime = new Date(b.appointmentDate) // might be YYYY-MM-DD
      // appointmentDate is YYYY-MM-DD? Let's check entity. It's Date type, so typeorm returns string ISO or Date object.
      // Frontent interface says string.
      return new Date(b.appointmentDate) >= new Date(now.setHours(0,0,0,0))
  })

  const past = bookingList.filter(b => !upcoming.includes(b))

  const handleCancel = async (id: string) => {
      try {
          await cancelBooking.mutateAsync(id)
          toast.success("Booking cancelled")
      } catch (err) {
          toast.error("Failed to cancel booking")
      }
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past / Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
            <div className="grid gap-4">
                {upcoming.length === 0 && <p className="text-muted-foreground text-center py-8">No upcoming bookings.</p>}
                {upcoming.map(booking => (
                    <BookingCard key={booking.id} booking={booking} onCancel={() => handleCancel(booking.id)} isUpcoming />
                ))}
            </div>
        </TabsContent>
        
        <TabsContent value="past">
            <div className="grid gap-4">
                {past.length === 0 && <p className="text-muted-foreground text-center py-8">No past bookings.</p>}
                {past.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookingCard({ booking, onCancel, isUpcoming }: { booking: Booking, onCancel?: () => void, isUpcoming?: boolean }) {
    const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        CONFIRMED: "bg-green-100 text-green-800",
        COMPLETED: "bg-blue-100 text-blue-800",
        CANCELLED: "bg-red-100 text-red-800",
        NO_SHOW: "bg-gray-100 text-gray-800",
    }
  
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">
                            {booking.services.map(s => s.name).join(", ")}
                        </CardTitle>
                        <CardDescription>
                             Booking #{booking.bookingCode}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className={statusColors[booking.status]}>
                        {booking.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pb-2 grid gap-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(booking.appointmentDate), "PPP")}
                </div>
                <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {booking.startTime} - {booking.endTime}
                </div>
                {/* Shop info if available in relation */}
                {/* booking.shop is not in explicit interface but potentially returned */}
                <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {(booking as any).shop?.name || "Shop"}
                </div>
                <div className="font-medium mt-2">
                    Total: ${booking.totalPrice}
                </div>
            </CardContent>
            {isUpcoming && onCancel && (
                <CardFooter>
                    <Button variant="destructive" size="sm" onClick={onCancel} className="w-full sm:w-auto">
                        Cancel Booking
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

"use client"

import { useEffect, useState } from "react"
import apiClient from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Users, Star } from "lucide-react"

interface DashboardOverview {
  revenue: number
  occupancyRate: number
  satisfactionRate: number
  totalBookings: number
}

interface Booking {
  id: string
  customer: { fullName: string }
  appointmentDate: string
  startTime: string
  services: { name: string }[]
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, bookingsRes] = await Promise.all([
          apiClient.get('/analytics/dashboard-overview'),
          apiClient.get('/bookings?limit=5')
        ])
        
        // Unwrap data if it's wrapped in a success/data structure
        const overviewData = overviewRes.data?.data || overviewRes.data
        const bookingsData = bookingsRes.data?.data || bookingsRes.data
        
        setOverview(overviewData)
        setUpcomingBookings(bookingsData.docs || bookingsData || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6 p-4 md:p-8 pt-4 md:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Today's Overview</h2>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          Quick Book
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">${(overview?.revenue ?? 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Today's earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{overview?.occupancyRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Booking capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{overview?.satisfactionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Customer rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{overview?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">Today's appointments</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments & Bookings */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">
                      {booking.customer?.fullName || 'Guest'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {booking.services?.[0]?.name || 'Service'}
                    </p>
                  </div>
                  <div className="text-sm font-medium ml-2">{booking.startTime}</div>
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingBookings.slice(0, 4).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between gap-2">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">
                      {booking.customer?.fullName || 'Guest'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {new Date(booking.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    Confirm
                  </Button>
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming bookings</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Invoices Table - Placeholder for now */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Staff Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Staff performance tracking coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

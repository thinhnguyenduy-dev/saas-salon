"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { DayScheduleEditor } from '@/components/dashboard/business-hours/day-schedule-editor'
import { Loader2, Copy, Save, Clock, Info } from 'lucide-react'
import apiClient from '@/lib/api-client'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BreakPeriod {
  start: string
  end: string
}

interface BusinessHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
  breaks: BreakPeriod[]
}

const defaultBusinessHours: BusinessHour[] = [
  { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [] },
  { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [] },
  { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [] },
  { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [] },
  { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [] },
  { day: 'saturday', isOpen: true, openTime: '10:00', closeTime: '17:00', breaks: [] },
  { day: 'sunday', isOpen: false, openTime: null, closeTime: null, breaks: [] },
]

export default function BusinessHoursPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(defaultBusinessHours)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchBusinessHours()
  }, [])

  const fetchBusinessHours = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/shops/my-shop')
      const shop = response.data.data.shop
      
      if (shop.businessHours && shop.businessHours.length > 0) {
        setBusinessHours(shop.businessHours)
      }
    } catch (error: any) {
      console.error('Error fetching business hours:', error)
      toast({
        title: 'Error',
        description: 'Failed to load business hours',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDayChange = (index: number, updatedDay: BusinessHour) => {
    const newHours = [...businessHours]
    newHours[index] = updatedDay
    setBusinessHours(newHours)
  }

  const copyToAllDays = () => {
    const monday = businessHours[0]
    const newHours = businessHours.map((day) => ({
      ...day,
      isOpen: monday.isOpen,
      openTime: monday.openTime,
      closeTime: monday.closeTime,
      breaks: [...monday.breaks],
    }))
    setBusinessHours(newHours)
    toast({
      title: 'Success',
      description: 'Monday schedule copied to all days',
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await apiClient.put('/shops/my-shop/business-hours', {
        businessHours,
      })
      
      toast({
        title: 'Success',
        description: 'Business hours updated successfully',
      })
    } catch (error: any) {
      console.error('Error saving business hours:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save business hours',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading business hours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Hours</h1>
            <p className="text-muted-foreground">
              Set your weekly schedule and break times
            </p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Your business hours will be displayed to customers on your shop page and used to calculate available booking slots.
        </AlertDescription>
      </Alert>

      {/* Schedule Editor */}
      <div className="space-y-4">
        {businessHours.map((day, index) => (
          <DayScheduleEditor
            key={day.day}
            schedule={day}
            onChange={(updated) => handleDayChange(index, updated)}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t sticky bottom-0 bg-background pb-6">
        <Button
          type="button"
          variant="outline"
          onClick={copyToAllDays}
          disabled={saving}
          className="gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Monday to All Days
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="sm:ml-auto gap-2"
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

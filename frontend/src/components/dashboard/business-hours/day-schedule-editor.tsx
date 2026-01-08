"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { X, Plus, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface BreakPeriod {
  start: string
  end: string
}

interface DaySchedule {
  day: string
  isOpen: boolean
  openTime: string | null
  closeTime: string | null
  breaks: BreakPeriod[]
}

interface DayScheduleEditorProps {
  schedule: DaySchedule
  onChange: (schedule: DaySchedule) => void
}

export function DayScheduleEditor({ schedule, onChange }: DayScheduleEditorProps) {
  const dayNames: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  }

  const handleToggle = (isOpen: boolean) => {
    onChange({
      ...schedule,
      isOpen,
      openTime: isOpen && !schedule.openTime ? '09:00' : schedule.openTime,
      closeTime: isOpen && !schedule.closeTime ? '18:00' : schedule.closeTime,
    })
  }

  const handleTimeChange = (field: 'openTime' | 'closeTime', value: string) => {
    onChange({
      ...schedule,
      [field]: value,
    })
  }

  const addBreak = () => {
    onChange({
      ...schedule,
      breaks: [...schedule.breaks, { start: '12:00', end: '13:00' }],
    })
  }

  const removeBreak = (index: number) => {
    onChange({
      ...schedule,
      breaks: schedule.breaks.filter((_, i) => i !== index),
    })
  }

  const updateBreak = (index: number, field: 'start' | 'end', value: string) => {
    const newBreaks = [...schedule.breaks]
    newBreaks[index] = { ...newBreaks[index], [field]: value }
    onChange({
      ...schedule,
      breaks: newBreaks,
    })
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        {/* Day Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-12 rounded-full ${schedule.isOpen ? 'bg-primary' : 'bg-gray-200'}`} />
            <div>
              <h3 className="text-lg font-semibold text-foreground">{dayNames[schedule.day]}</h3>
              <p className="text-sm text-muted-foreground">
                {schedule.isOpen ? 'Open for business' : 'Closed'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${schedule.isOpen ? 'text-primary' : 'text-muted-foreground'}`}>
              {schedule.isOpen ? 'Open' : 'Closed'}
            </span>
            <Switch
              id={`${schedule.day}-toggle`}
              checked={schedule.isOpen}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>

        {/* Hours */}
        {schedule.isOpen && (
          <div className="space-y-6 pl-5">
            {/* Opening Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${schedule.day}-open`} className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Opening Time
                </Label>
                <Input
                  id={`${schedule.day}-open`}
                  type="time"
                  value={schedule.openTime || ''}
                  onChange={(e) => handleTimeChange('openTime', e.target.value)}
                  className="w-full font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${schedule.day}-close`} className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Closing Time
                </Label>
                <Input
                  id={`${schedule.day}-close`}
                  type="time"
                  value={schedule.closeTime || ''}
                  onChange={(e) => handleTimeChange('closeTime', e.target.value)}
                  className="w-full font-medium"
                />
              </div>
            </div>

            {/* Breaks Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Break Times</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBreak}
                  className="h-8 gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Break
                </Button>
              </div>

              {schedule.breaks.length > 0 ? (
                <div className="space-y-2">
                  {schedule.breaks.map((breakPeriod, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Input
                        type="time"
                        value={breakPeriod.start}
                        onChange={(e) => updateBreak(index, 'start', e.target.value)}
                        className="flex-1 bg-background"
                      />
                      <span className="text-sm text-muted-foreground font-medium">to</span>
                      <Input
                        type="time"
                        value={breakPeriod.end}
                        onChange={(e) => updateBreak(index, 'end', e.target.value)}
                        className="flex-1 bg-background"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBreak(index)}
                        className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic py-2">No breaks scheduled</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

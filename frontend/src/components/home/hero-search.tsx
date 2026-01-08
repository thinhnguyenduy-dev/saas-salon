"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function HeroSearch() {
  const router = useRouter()
  const [treatment, setTreatment] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('Anytime')
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (treatment) params.append('search', treatment)
    if (location) params.append('city', location)
    // Pass coordinates if available
    if (userCoords) {
      params.append('lat', userCoords.lat.toString())
      params.append('lng', userCoords.lng.toString())
    }
    router.push(`/search?${params.toString()}`)
  }

  const detectLocation = () => {
    setIsDetectingLocation(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserCoords(coords)
          setLocation('Current Location')
          setIsDetectingLocation(false)
        },
        (error) => {
          console.error('Error detecting location:', error)
          setLocation('Location unavailable')
          setIsDetectingLocation(false)
        }
      )
    } else {
      setLocation('Geolocation not supported')
      setIsDetectingLocation(false)
    }
  }

  const popularTimes = [
    'Anytime',
    'This Morning',
    'This Afternoon',
    'This Evening',
    'Tomorrow',
    'This Weekend',
  ]

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center bg-white p-2 rounded-3xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 gap-2 md:gap-0">
        {/* Treatment Field */}
        <div className="flex-1 w-full relative group px-2">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <Input
            className="pl-10 border-0 bg-transparent shadow-none focus-visible:ring-0 text-foreground font-medium h-12 text-base placeholder:text-gray-500 placeholder:font-normal"
            placeholder="All treatments and venues"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
          />
        </div>

        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2" />

        {/* Location Field */}
        <div className="flex-1 w-full relative group px-2">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1">
            <Input
              className="pl-10 border-0 bg-transparent shadow-none focus-visible:ring-0 text-foreground font-medium h-12 text-base placeholder:text-gray-500 placeholder:font-normal flex-1"
              placeholder="Current location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={detectLocation}
              disabled={isDetectingLocation}
              className="text-xs text-primary hover:text-primary/80"
            >
              {isDetectingLocation ? 'Detecting...' : 'Use my location'}
            </Button>
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2" />

        {/* Date Field */}
        <div className="flex-1 w-full relative group px-2">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Calendar className="w-5 h-5" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="w-full justify-start pl-10 h-12 text-base font-medium text-foreground hover:bg-transparent"
              >
                {date}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-1">
                {popularTimes.map((time) => (
                  <Button
                    key={time}
                    variant={date === time ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setDate(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          size="lg"
          className="w-full md:w-auto px-8 h-12 rounded-full font-bold text-base transition-all hover:scale-105"
        >
          Search
        </Button>
      </div>
    </form>
  )
}

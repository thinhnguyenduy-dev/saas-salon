"use client"

import dynamic from 'next/dynamic'

// Dynamically import the map to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(
  () => import('./interactive-map').then((mod) => mod.InteractiveMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }
)

interface Shop {
  id: string
  name: string
  slug: string
  city: string
  district: string
  street: string
}

interface UserLocation {
  lat: number
  lng: number
}

interface CityCenter {
  lat: number
  lng: number
  city: string
}

interface MapViewProps {
  shops: Shop[]
  userLocation?: UserLocation | null
  cityCenter?: CityCenter | null
}

export function MapView({ shops, userLocation, cityCenter }: MapViewProps) {
  return (
    <div className="w-full h-full">
      <InteractiveMap shops={shops} userLocation={userLocation} cityCenter={cityCenter} />
    </div>
  )
}

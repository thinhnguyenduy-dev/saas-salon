"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom user location icon
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
})

interface Shop {
  id: string
  name: string
  slug: string
  city: string
  district: string
  street: string
  lat?: number
  lng?: number
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

interface InteractiveMapProps {
  shops: Shop[]
  userLocation?: UserLocation | null
  cityCenter?: CityCenter | null
  onShopClick?: (shop: Shop) => void
}

// Component to fit map bounds to markers
function FitBounds({ shops, userLocation, cityCenter }: { shops: Shop[], userLocation?: UserLocation | null, cityCenter?: CityCenter | null }) {
  const map = useMap()
  
  useEffect(() => {
    const validShops = shops.filter(s => s.lat && s.lng)
    
    if (userLocation) {
      // If user location exists, center on it and zoom in
      map.setView([userLocation.lat, userLocation.lng], 13)
    } else if (cityCenter) {
      // If city filter is active, center on that city
      map.setView([cityCenter.lat, cityCenter.lng], 12)
    } else if (validShops.length > 0) {
      // Otherwise fit bounds to all shops
      const bounds = L.latLngBounds(
        validShops.map(s => [s.lat!, s.lng!])
      )
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [shops, userLocation, cityCenter, map])
  
  return null
}

export function InteractiveMap({ shops, userLocation, cityCenter, onShopClick }: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false)

  // Only render map on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading map...</p>
      </div>
    )
  }

  // Generate mock coordinates for shops (in a real app, these would come from the database)
  const shopsWithCoords = shops.map((shop, index) => {
    // Use user location, city center, or default NYC coordinates
    const baseLat = userLocation?.lat || cityCenter?.lat || 40.7128
    const baseLng = userLocation?.lng || cityCenter?.lng || -74.0060
    
    return {
      ...shop,
      lat: baseLat + (Math.random() - 0.5) * 0.1,
      lng: baseLng + (Math.random() - 0.5) * 0.1,
    }
  })

  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng]
    : [40.7128, -74.0060]

  return (
    <MapContainer
      center={center}
      zoom={userLocation ? 13 : 12}
      className="w-full h-full"
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <FitBounds shops={shopsWithCoords} userLocation={userLocation} />
      
      {/* User Location Marker */}
      {userLocation && (
        <>
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">Your Location</h3>
                <p className="text-xs text-gray-600">You are here</p>
              </div>
            </Popup>
          </Marker>
          {/* Accuracy circle */}
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={500}
            pathOptions={{
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              color: '#3b82f6',
              weight: 1,
            }}
          />
        </>
      )}
      
      {/* Shop Markers */}
      {shopsWithCoords.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.lat!, shop.lng!]}
          eventHandlers={{
            click: () => onShopClick?.(shop),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-sm">{shop.name}</h3>
              <p className="text-xs text-gray-600">{shop.street}</p>
              <p className="text-xs text-gray-600">{shop.district}, {shop.city}</p>
              <a
                href={`/salon/${shop.slug}`}
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                View Details →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

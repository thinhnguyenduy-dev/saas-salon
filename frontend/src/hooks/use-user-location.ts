"use client"

import { useState, useEffect } from 'react'

interface UserLocation {
  lat: number
  lng: number
}

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)

  const detectLocation = () => {
    setIsDetecting(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsDetecting(false)
        },
        (error) => {
          console.error('Error detecting location:', error)
          setIsDetecting(false)
        }
      )
    } else {
      setIsDetecting(false)
    }
  }

  return { userLocation, isDetecting, detectLocation }
}

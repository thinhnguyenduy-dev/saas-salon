// City coordinates for map centering
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Main shop city
  'Metropolis': { lat: 40.7128, lng: -74.0060 }, // NYC coordinates as placeholder
  
  // Additional shop cities from seed data
  'Downtown': { lat: 40.7589, lng: -73.9851 },
  'Riverside': { lat: 40.7614, lng: -73.9776 },
  'Uptown': { lat: 40.7829, lng: -73.9654 },
  'Midtown': { lat: 40.7549, lng: -73.9840 },
  'Eastside': { lat: 40.7614, lng: -73.9598 },
  'Westend': { lat: 40.7589, lng: -74.0014 },
  'Northgate': { lat: 40.7829, lng: -73.9712 },
  'Southside': { lat: 40.7282, lng: -73.9942 },
  'Central Park': { lat: 40.7829, lng: -73.9654 },
  'Royal Heights': { lat: 40.7689, lng: -73.9800 },
  'Green Valley': { lat: 40.7489, lng: -73.9680 },
  'Pearl Bay': { lat: 40.7389, lng: -74.0120 },
  'Metro Center': { lat: 40.7549, lng: -73.9900 },
  'Desert Springs': { lat: 40.7429, lng: -73.9780 },
  'Fashion Valley': { lat: 40.7629, lng: -73.9720 },
  'Tropical Bay': { lat: 40.7329, lng: -74.0080 },
  'Silver Lake': { lat: 40.7529, lng: -73.9820 },
  'Garden City': { lat: 40.7429, lng: -73.9920 },
  'Horizon Hills': { lat: 40.7729, lng: -73.9660 },
  'Diamond District': { lat: 40.7589, lng: -73.9780 },
}

// Get coordinates for a city, with fallback to NYC
export function getCityCoordinates(city: string): { lat: number; lng: number } {
  return CITY_COORDINATES[city] || { lat: 40.7128, lng: -74.0060 }
}

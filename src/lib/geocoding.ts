/**
 * Geocoding service using OpenStreetMap's Nominatim
 */

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  boundingbox: [number, number, number, number];
}

/**
 * Geocode an address to get coordinates
 */
export async function geocodeAddress(address: string): Promise<LocationData | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'ChurchManagementSystem/1.0'
        }
      }
    );
    
    if (!response.ok) return null;
    
    const data: GeocodeResult[] = await response.json();
    
    if (data.length === 0) return null;
    
    const result = data[0];
    return {
      address: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'ChurchManagementSystem/1.0'
        }
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    return data.display_name || null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Search for places by name (e.g., church name, area name)
 */
export async function searchPlaces(query: string, limit: number = 10): Promise<LocationData[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'ChurchManagementSystem/1.0'
        }
      }
    );
    
    if (!response.ok) return [];
    
    const data: GeocodeResult[] = await response.json();
    
    return data.map(result => ({
      address: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    }));
  } catch (error) {
    console.error('Place search error:', error);
    return [];
  }
}

/**
 * Get current device location using browser geolocation API
 */
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}
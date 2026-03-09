# OpenFreeMap Integration Guide

This document provides guidance on implementing OpenFreeMap as the mapping solution for the Church Management System, replacing Google Maps.

## Overview

OpenFreeMap is an open-source mapping solution that provides mapping services without requiring API keys or paid subscriptions. It's ideal for church management systems that need location services for family visits, event planning, and geographical coordination.

## Implementation Requirements

### 1. Install Dependencies
```bash
npm install leaflet react-leaflet @types/leaflet
# Or for other mapping libraries:
npm install openlayers ol @types/ol
```

### 2. Create Map Component
**File**: `src/components/shared/map-display.tsx`

```typescript
"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

interface MapDisplayProps {
  center: LatLngExpression;
  zoom: number;
  markers?: Array<{
    position: LatLngExpression;
    popup: string;
  }>;
}

export default function MapDisplay({ center, zoom, markers }: MapDisplayProps) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers?.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

### 3. Geocoding Service
**File**: `src/lib/geocoding.ts`

```typescript
interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export async function geocodeAddress(address: string): Promise<LocationData | null> {
  try {
    // Using Nominatim (OpenStreetMap's geocoding service)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
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
```

### 4. Route Planning
**File**: `src/lib/route-planning.ts`

```typescript
interface RoutePoint {
  lat: number;
  lng: number;
  address?: string;
}

export async function calculateRoute(points: RoutePoint[]): Promise<{
  distance: number; // in kilometers
  duration: number; // in minutes
  geometry: RoutePoint[];
}> {
  try {
    // Using OSRM (Open Source Routing Machine)
    const coordinates = points.map(p => `${p.lng},${p.lat}`).join(';');
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
    );
    
    if (!response.ok) throw new Error('Route calculation failed');
    
    const data = await response.json();
    
    return {
      distance: data.routes[0].distance / 1000, // Convert to km
      duration: data.routes[0].duration / 60, // Convert to minutes
      geometry: data.routes[0].geometry.coordinates.map(([lng, lat]: number[]) => ({
        lat,
        lng
      }))
    };
  } catch (error) {
    console.error('Route planning error:', error);
    throw error;
  }
}
```

## Role-Specific Implementations

### 1. Priest Role
**Components to Update**:
- `src/components/priest/family-map.tsx`
- `src/components/priest/visitation-route-planner.tsx`

**Features**:
- Family location visualization
- Route optimization for visitation planning
- Distance calculation between families
- Map-based family searching

### 2. Visitation Servant Role
**Components to Update**:
- `src/components/visitation-servant/family-map-display.tsx`
- `src/components/visitation-servant/route-optimizer.tsx`

**Features**:
- Family addresses on map
- Turn-by-turn directions
- Travel time estimation
- Offline map caching for field work

### 3. Cross-Role Features
**Components to Update**:
- `src/components/shared/location-picker.tsx`
- `src/components/shared/address-autocomplete.tsx`

## API Integration

### 1. Family Management API
**Endpoint**: `GET /api/families/[id]/location`
```typescript
// Response format
{
  "address": "123 Church Street, City",
  "latitude": 30.0444,
  "longitude": 31.2357,
  "formattedAddress": "123 Church Street, City, Country"
}
```

### 2. Route Planning API
**Endpoint**: `POST /api/routes/calculate`
```typescript
// Request body
{
  "waypoints": [
    { "address": "123 Church Street" },
    { "address": "456 Faith Avenue" },
    { "address": "789 Hope Boulevard" }
  ]
}

// Response format
{
  "distance": 12.5,
  "duration": 25,
  "geometry": [...],
  "instructions": [...]
}
```

## Mobile Optimization

### 1. Offline Maps
```typescript
// Cache map tiles for offline use
export async function cacheMapTiles(bounds: LatLngBounds, zoom: number): Promise<void> {
  // Implementation for caching map tiles
  // Useful for visitation servants in areas with poor connectivity
}
```

### 2. GPS Integration
```typescript
// Get current device location
export async function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
```

## Styling and Customization

### 1. Map Styling
```typescript
// Custom map tile layers
const mapTiles = {
  standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  humanitarian: 'https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
};
```

### 2. Custom Markers
```typescript
// Custom marker icons for different locations
const markerIcons = {
  family: customFamilyIcon,
  church: customChurchIcon,
  school: customSchoolIcon
};
```

## Performance Considerations

### 1. Tile Caching
- Implement client-side tile caching
- Cache frequently viewed areas
- Preload tiles for planned routes

### 2. Data Optimization
- Lazy load map data
- Implement clustering for multiple markers
- Use viewport-based marker loading

## Accessibility Features

### 1. Keyboard Navigation
- Arrow keys for map navigation
- Tab order for map controls
- Screen reader support

### 2. Alternative Text
- Alt text for map markers
- Text-based directions alongside visual map
- High contrast map options

## Security Considerations

### 1. Rate Limiting
- Implement request throttling for geocoding
- Cache geocoding results to reduce API calls
- Queue route calculations for batch processing

### 2. Data Privacy
- Don't store location data unnecessarily
- Encrypt stored location information
- Provide opt-out options for location tracking

## Testing Strategy

### 1. Unit Tests
- Map component rendering
- Geocoding function accuracy
- Route calculation correctness

### 2. Integration Tests
- End-to-end location workflow
- Mobile GPS functionality
- Offline map behavior

### 3. Manual Testing
- Test with real addresses
- Verify route accuracy
- Test in various network conditions

## Migration from Google Maps

### 1. Component Replacement
```typescript
// Old Google Maps implementation
<GoogleMap
  center={center}
  zoom={zoom}
  markers={markers}
/>

// New OpenFreeMap implementation
<MapDisplay
  center={center}
  zoom={zoom}
  markers={markers}
/>
```

### 2. API Updates
- Replace Google Maps API calls
- Update response format handling
- Maintain backward compatibility during transition

This implementation provides a complete mapping solution using OpenFreeMap while maintaining the functionality required by the Church Management System.
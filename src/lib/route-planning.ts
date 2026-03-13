/**
 * Route planning service using OSRM (Open Source Routing Machine)
 */

interface RoutePoint {
  lat: number;
  lng: number;
  address?: string;
}

interface RouteResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  geometry: RoutePoint[];
  instructions?: RouteInstruction[];
}

interface RouteInstruction {
  instruction: string;
  distance: number;
  duration: number;
}

interface OSRMRouteResponse {
  routes: Array<{
    distance: number;
    duration: number;
    geometry: string | any;
    legs: Array<{
      steps: Array<{
        maneuver: {
          instruction: string;
        };
        distance: number;
        duration: number;
      }>;
    }>;
  }>;
}

interface OSRMTableResponse {
  durations: number[][];
  distances: number[][];
  sources: Array<{ name: string; location: [number, number] }>;
  destinations: Array<{ name: string; location: [number, number] }>;
}

/**
 * Calculate route between multiple waypoints
 */
export async function calculateRoute(waypoints: RoutePoint[]): Promise<RouteResult | null> {
  if (waypoints.length < 2) {
    return null;
  }

  try {
    const coordinates = waypoints.map(p => `${p.lng},${p.lat}`).join(';');
    
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`
    );
    
    if (!response.ok) {
      throw new Error('Route calculation failed');
    }
    
    const data: OSRMRouteResponse = await response.json();
    
    if (data.routes.length === 0) {
      return null;
    }
    
    const route = data.routes[0];
    
    // Parse GeoJSON geometry
    let geometry: RoutePoint[] = [];
    if (route.geometry) {
      if (typeof route.geometry === 'string') {
        // If it's encoded polyline (older OSRM versions)
        geometry = waypoints; // Fallback
      } else {
        // If it's GeoJSON object
        if (Array.isArray(route.geometry) && route.geometry.length >= 2) {
          geometry = route.geometry.map((coord: any[]) => ({
            lat: coord[1],
            lng: coord[0]
          }));
        } else if (route.geometry.coordinates) {
          geometry = route.geometry.coordinates.map((coord: number[]) => ({
            lat: coord[1],
            lng: coord[0]
          }));
        }
      }
    }
    
    // Parse instructions
    const instructions: RouteInstruction[] = [];
    if (route.legs && route.legs.length > 0) {
      route.legs.forEach(leg => {
        if (leg.steps) {
          leg.steps.forEach(step => {
            if (step.maneuver?.instruction) {
              instructions.push({
                instruction: step.maneuver.instruction,
                distance: step.distance,
                duration: step.duration
              });
            }
          });
        }
      });
    }
    
    return {
      distance: route.distance / 1000, // Convert to km
      duration: route.duration / 60, // Convert to minutes
      geometry: geometry.length > 0 ? geometry : waypoints,
      instructions
    };
  } catch (error) {
    console.error('Route planning error:', error);
    throw error;
  }
}

/**
 * Calculate distance matrix between multiple points
 * Returns distances and durations between all pairs
 */
export async function calculateDistanceMatrix(points: RoutePoint[]): Promise<{
  distances: number[][];
  durations: number[][];
} | null> {
  if (points.length < 2) {
    return null;
  }

  try {
    const coordinates = points.map(p => `${p.lng},${p.lat}`).join(';');
    
    const response = await fetch(
      `https://router.project-osrm.org/table/v1/driving/${coordinates}?annotations=duration,distance`
    );
    
    if (!response.ok) {
      throw new Error('Distance matrix calculation failed');
    }
    
    const data: OSRMTableResponse = await response.json();
    
    return {
      distances: data.distances.map(row => row.map(d => d / 1000)), // Convert to km
      durations: data.durations.map(row => row.map(d => d / 60)) // Convert to minutes
    };
  } catch (error) {
    console.error('Distance matrix error:', error);
    return null;
  }
}

/**
 * Find optimal route visiting multiple locations (TSP approximation)
 * Uses nearest neighbor algorithm for route optimization
 */
export async function optimizeRoute(points: RoutePoint[], startAtZero: boolean = true): Promise<{
  route: RoutePoint[];
  totalDistance: number;
  totalDuration: number;
} | null> {
  if (points.length < 2) {
    return null;
  }

  // If we have 2-3 points, just return them
  if (points.length <= 3) {
    const result = await calculateRoute(points);
    if (!result) return null;
    
    return {
      route: points,
      totalDistance: result.distance,
      totalDuration: result.duration
    };
  }

  try {
    const matrix = await calculateDistanceMatrix(points);
    if (!matrix) return null;
    
    const { distances, durations } = matrix;
    const n = points.length;
    const visited = new Set<number>();
    const route: RoutePoint[] = [];
    
    // Start from first point (church or starting location)
    let current = startAtZero ? 0 : 0;
    visited.add(current);
    route.push(points[current]);
    
    let totalDistance = 0;
    let totalDuration = 0;
    
    // Nearest neighbor algorithm
    while (visited.size < n) {
      let nearest = -1;
      let nearestDist = Infinity;
      let nearestDur = Infinity;
      
      for (let i = 0; i < n; i++) {
        if (!visited.has(i)) {
          if (distances[current][i] < nearestDist) {
            nearest = i;
            nearestDist = distances[current][i];
            nearestDur = durations[current][i];
          }
        }
      }
      
      if (nearest !== -1) {
        visited.add(nearest);
        route.push(points[nearest]);
        totalDistance += nearestDist;
        totalDuration += nearestDur;
        current = nearest;
      }
    }
    
    return {
      route,
      totalDistance,
      totalDuration
    };
  } catch (error) {
    console.error('Route optimization error:', error);
    return null;
  }
}

/**
 * Calculate straight-line distance between two points (Haversine formula)
 * Useful for quick calculations without routing
 */
export function calculateStraightLineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in km
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get travel estimate based on average speed
 */
export function estimateTravelTime(distanceKm: number, speedKmh: number = 40): number {
  return (distanceKm / speedKmh) * 60; // Return in minutes
}
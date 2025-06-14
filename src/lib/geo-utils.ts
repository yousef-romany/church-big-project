
// src/lib/geo-utils.ts
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function getGeoLocation(): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error("الموقع الجغرافي غير مدعوم في هذا المتصفح."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let message = "حدث خطأ أثناء محاولة تحديد موقعك.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "تم رفض إذن الوصول إلى الموقع الجغرافي.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "معلومات الموقع الجغرافي غير متاحة.";
            break;
          case error.TIMEOUT:
            message = "انتهت مهلة طلب الموقع الجغرافي.";
            break;
        }
        reject(new Error(message));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 } // Options: high accuracy, 15s timeout, allow cached position up to 1 min
    );
  });
}

// Haversine formula to calculate distance between two points on Earth
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number { // returns distance in meters
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Example Church Location and Radius (move to a config file or admin settings later)
export const CHURCH_LOCATION: GeoCoordinates = {
  // Example: St. Mark's Coptic Orthodox Cathedral, Cairo
  // latitude: 30.059581, 
  // longitude: 31.276914

  // Example: Virgin Mary & St. Athanasius Coptic Orthodox Church, Mississauga, Canada (example for testing)
  latitude: 43.5890, 
  longitude: -79.6441 
};
// It's recommended to allow a slightly larger radius for GPS inaccuracies.
export const ALLOWED_RADIUS_METERS = 300; // 300 meters, adjust as needed

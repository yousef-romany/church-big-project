
// src/types/trips.ts

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string; // ISO Date String
  endDate: string; // ISO Date String
  price: number;
  capacity: number;
  overview: string;
  itinerary: string;
  included: string;
  excluded: string;
}

export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  bookingCode: string;
  status: 'booked' | 'paid';
  bookedAt: string; // ISO Date String
}

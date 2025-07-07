import { PriestProfile } from "./priest-profile";
import { Booking } from "./booking";

export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  price: number;
  capacity: number;
  overview: string;
  itinerary: string;
  included: string;
  excluded: string;
  createdAt: Date;
  creatorId: string;
  creator: PriestProfile;
  bookings: Booking[];
};
import { BookingStatus } from "./enums";
import { Trip } from "./trip";
import { User } from "./user";

export type Booking = {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  bookedAt: Date;
  tripId: string;
  trip: Trip;
  userId: string;
  user: User;
};
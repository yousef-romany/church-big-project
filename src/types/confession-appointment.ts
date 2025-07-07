import { ConfessionStatus } from "./enums";
import { User } from "./user";
import { PriestProfile } from "./priest-profile";

export type ConfessionAppointment = {
  id: string;
  datetime: Date;
  durationMinutes: number;
  status: ConfessionStatus;
  notes?: string | null;
  bookedBySystem: boolean;
  userId: string;
  user: User;
  priestId: string;
  priest: PriestProfile;
};
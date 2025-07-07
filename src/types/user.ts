import {
  Role,
  FamilyRole,
} from "./enums";
import { PriestProfile } from "./priest-profile";
import { ServantProfile } from "./servant-profile";
import { Family } from "./family";
import { ConfessionAppointment } from "./confession-appointment";
import { ParentChildLink } from "./parent-child-link";
import { Booking } from "./booking";
import { SundaySchoolChildAttendance } from "./sunday-school-child-attendance";

export type User = {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  role: Role;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  bloodType?: string | null;
  lastConfessionDate?: Date | null;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  priestProfile?: PriestProfile | null;
  servantProfile?: ServantProfile | null;
  familyId?: string | null;
  family?: Family | null;
  roleInFamily?: FamilyRole | null;
  confessionFatherId?: string | null;
  confessionFather?: PriestProfile | null;
  confessionsAsPenitent: ConfessionAppointment[];
  parentLinks: ParentChildLink[];
  childLinks: ParentChildLink[];
  bookings: Booking[];
  attendanceAsChild: SundaySchoolChildAttendance[];
};
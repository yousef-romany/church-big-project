import { ServingDay } from "./enums";
import { User } from "./user";
import { ServantProfile } from "./servant-profile";

export type SundaySchoolChildAttendance = {
  id: string;
  date: Date;
  serviceDay: ServingDay;
  pointsAwarded: number;
  childId: string;
  child: User;
  recordedByServantId?: string | null;
  recordedByServant?: ServantProfile | null;
};
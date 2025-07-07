import { ServingDay, AttendanceStatus, RecordedBy } from "./enums";
import { ServantProfile } from "./servant-profile";

export type SundaySchoolServantAttendance = {
  id: string;
  date: Date;
  serviceDay: ServingDay;
  status: AttendanceStatus;
  notes?: string | null;
  recordedBy: RecordedBy;
  selfRecordedAt?: Date | null;
  isGeoVerified?: boolean | null;
  servantId: string;
  servant: ServantProfile;
};
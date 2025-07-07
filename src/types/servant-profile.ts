import { ServantType, ServingDay } from "./enums";
import { User } from "./user";
import { VisitationTask } from "./visitation-task";
import { SundaySchoolServantAttendance } from "./sunday-school-servant-attendance";
import { WeeklyContent } from "./weekly-content";
import { SundaySchoolChildAttendance } from "./sunday-school-child-attendance";

export type ServantProfile = {
  id: string;
  userId: string;
  user: User;
  type: ServantType;
  servingDays: ServingDay[];
  isActive: boolean;
  visitationTasks: VisitationTask[];
  attendanceRecords: SundaySchoolServantAttendance[];
  createdContent: WeeklyContent[];
  childAttendanceTaken: SundaySchoolChildAttendance[];
};
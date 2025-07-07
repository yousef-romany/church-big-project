import { PriestStatus } from "./enums";
import { User } from "./user";
import { ConfessionAppointment } from "./confession-appointment";
import { VisitationTask } from "./visitation-task";
import { Trip } from "./trip";
import { Announcement } from "./announcement";
import { Event } from "./event";
import { Family } from "./family";

export type PriestProfile = {
  id: string;
  userId: string;
  user: User;
  status: PriestStatus;
  ordinationDate?: Date | null;
  diocese?: string | null;
  familiesManaged: Family[];
  confessionsGiven: ConfessionAppointment[];
  tasksAssigned: VisitationTask[];
  tripsCreated: Trip[];
  announcementsCreated: Announcement[];
  eventsCreated: Event[];
};
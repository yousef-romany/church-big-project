import { VisitationStatus } from "./enums";
import { User } from "./user";
import { PriestProfile } from "./priest-profile";
import { VisitationTask } from "./visitation-task";

export type Family = {
  id: string;
  name: string;
  address: string;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  visitationStatus: VisitationStatus;
  lastVisited?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  priestId?: string | null;
  priest?: PriestProfile | null;
  members: User[];
  visitationTasks: VisitationTask[];
};
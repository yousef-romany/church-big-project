import { TaskStatus } from "./enums";
import { Family } from "./family";
import { PriestProfile } from "./priest-profile";
import { ServantProfile } from "./servant-profile";

export type VisitationTask = {
  id: string;
  status: TaskStatus;
  assignedAt: Date;
  completedAt?: Date | null;
  notesFromPriest?: string | null;
  servantNotes?: string | null;
  familyId: string;
  family: Family;
  priestId: string;
  priest: PriestProfile;
  servantId: string;
  servant: ServantProfile;
};
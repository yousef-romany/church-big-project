import { ContentType } from "./enums";
import { ServantProfile } from "./servant-profile";

export type WeeklyContent = {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  points: number;
  options: string[];
  correctAnswer?: string | null;
  isActive: boolean;
  createdAt: Date;
  creatorId: string;
  creator: ServantProfile;
};
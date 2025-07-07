import { PriestProfile } from "./priest-profile";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author: PriestProfile;
};
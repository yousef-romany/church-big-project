import { PriestProfile } from "./priest-profile";

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  datetime: Date;
  points: number;
  creatorId: string;
  creator: PriestProfile;
};

export type PriestStatus = "active" | "stressed" | "sanctioned";

export interface Priest {
  id: string;
  name: string;
  status: PriestStatus;
  assignedFamilies: number;
  missingVisits: number;
  avatarUrl?: string;
}

export type FamilyStatus = "normal" | "widowed" | "poor" | "divorced" | "other";

export interface Family {
  id: string;
  fatherName: string;
  motherName: string;
  childrenCount: number;
  status: FamilyStatus;
  region: string;
  phoneNumber: string;
  details?: string; // Additional details for expanded view
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface ChurchInformation {
  name: string;
  address: string;
  contactNumber: string;
  mapCoordinates?: { lat: number; lng: number }; // Optional: for Google Maps
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  datetime: Date;
  location: string;
  points: number;
}

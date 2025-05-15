
import type { LucideIcon } from 'lucide-react';

export interface ConfessionRequestFormInput {
  fullName: string;
  mobileNumber: string;
  selectedPriestId: string;
}

export interface ConfessionRequest extends ConfessionRequestFormInput {
  id: string;
  submittedAt: Date;
  status: 'pending' | 'scheduled' | 'completed'; // For priest panel to manage
  scheduledAt?: Date; // Optional: if priest schedules it
  priestNotes?: string; // Optional: notes from priest
}

export interface ChurchInstruction {
  id:string;
  title: string;
  content: string;
  icon: LucideIcon; // Or specific icon name string if preferred
  category: string; // e.g., "Spiritual Life", "Church Activities"
}

export interface PriestData {
    id: string;
    name: string;
    churchName: string;
}

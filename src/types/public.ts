
import type { LucideIcon } from 'lucide-react';

export interface ConfessionRequestFormInput {
  fullName: string;
  mobileNumber: string;
  selectedPriestId: string; // Changed from affiliatedChurch
}

export interface ConfessionRequest extends ConfessionRequestFormInput {
  id: string;
  submittedAt: Date;
  status: 'pending' | 'scheduled' | 'completed'; // For priest panel to manage
}

export interface ChurchInstruction {
  id:string;
  title: string;
  content: string;
  icon: LucideIcon;
  category: string; // e.g., "Spiritual Life", "Church Activities"
}


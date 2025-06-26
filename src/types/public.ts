
import type { LucideIcon } from 'lucide-react';

export interface ConfessionRequestFormInput {
  fullName: string;
  mobileNumber: string;
  selectedPriestId?: string; 
  notes?: string; 
  userId?: string; // For identifying the user making the request
}

export interface ConfessionRequest extends ConfessionRequestFormInput {
  id: string;
  submittedAt: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled_by_user' | 'cancelled_by_priest';
  scheduledAt?: Date; 
  priestNotes?: string; 
  bookedBySystem?: boolean; 
  lastConfessionRequestedAt?: string; // ISO string for client-side check
}

export interface ChurchInstruction {
  id:string;
  title: string;
  content: string;
  icon: LucideIcon; 
  category: string; 
}

export interface PriestData {
    id: string;
    name: string;
    churchName: string; // e.g., "كنيسة السيدة العذراء مريم بالزيتون"
}

// Types for Parent-Child Linking
export interface LinkRequest {
  id: string;
  parentId: string;
  parentName: string;
  childId: string;
  childName: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string; // ISO date string
}

export interface LinkedChild {
    id: string; // child's id
    name: string;
    avatarUrl: string;
    points: number;
}

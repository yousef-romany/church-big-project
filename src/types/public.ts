
import type { LucideIcon } from 'lucide-react';

export interface ConfessionRequestFormInput {
  fullName: string;
  mobileNumber: string;
  selectedPriestId?: string; // Optional for now, assuming one priest or default
  notes?: string; // Optional notes from the requester
}

export interface ConfessionRequest extends ConfessionRequestFormInput {
  id: string;
  submittedAt: Date;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled_by_user' | 'cancelled_by_priest';
  scheduledAt?: Date; 
  priestNotes?: string; 
  bookedBySystem?: boolean; // Flag to indicate if booked by system
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
    churchName: string;
}


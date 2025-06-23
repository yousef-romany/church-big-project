
import type { LucideIcon } from 'lucide-react';

export type ServantTaskStatus = 'pending' | 'completed';

export interface ServantTask {
  id: string;
  familyId: string; 
  familyName: string; 
  address: string; 
  mapLocationImageUrl: string; 
  notesFromPriest?: string;
  status: ServantTaskStatus;
  assignedAt: Date;
  servantId: string; // The ID of the servant this task is assigned to
  servantNotes?: string; // Notes can be added before completion
}

export interface CompletedServantTask extends ServantTask {
  status: 'completed';
  completedAt: Date;
  servantNotes?: string;
}

// New types for servant points
export interface ServantPointsEntry {
    id: string;
    reason: string;
    points: number;
    date: Date;
}

export interface ServantBadge {
    name: string;
    icon: LucideIcon;
    date: Date;
}

export interface ServantPointsData {
    totalPoints: number;
    level: string;
    pointsToNextLevel: number;
    history: ServantPointsEntry[];
    badges: ServantBadge[];
}

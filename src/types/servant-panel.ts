
export type ServantTaskStatus = 'pending' | 'completed';

export interface ServantTask {
  id: string;
  familyId: string; // To potentially link back to full family details if needed by system, not for servant display
  familyName: string; // "اسم رب الأسرة أو الأرملة"
  address: string; // Full address for context, servant might only see map pin
  mapLocationImageUrl: string; // URL for a static map image or placeholder
  notesFromPriest?: string; // Optional notes from the priest
  status: ServantTaskStatus;
  assignedAt: Date;
}

export interface CompletedServantTask extends ServantTask {
  completedAt: Date;
  servantNotes?: string; // Notes added by the servant upon completion
}

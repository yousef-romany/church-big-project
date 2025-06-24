

export type ConfessionStatus = 'تم' | 'لم يحضر' | 'قادم' | 'ملغى';

export interface ConfessionAppointment {
  id: string;
  name: string; 
  day: string; 
  time: string; 
  status: ConfessionStatus;
  datetime: Date; 
  notes?: string; 
  originalDatetime?: Date; 
  durationMinutes?: number; 
  priestId?: string; // ID of the priest for this appointment
  bookedBySystem?: boolean; 
  userId?: string; // ID of the user who requested/booked this appointment
}

export type VisitationFamilyStatus = 'عاجل' | 'عادي' | 'تواصل فقط' | 'تمت الزيارة' | 'لم تتم الزيارة';

export interface FamilyMember {
  id: string;
  name: string;
  age: number | string; 
  gender: 'ذكر' | 'أنثى' | '';
  educationLevel?: string; 
}

export interface PriestPanelFamily {
  id: string;
  fatherName: string;
  motherName: string;
  members: FamilyMember[];
  address: string;
  phoneNumber: string;
  region?: string;
  visitationStatus?: VisitationFamilyStatus;
  lastVisited?: Date;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface PriestAvailabilitySlot {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  enabled?: boolean; 
}

export interface PriestAvailability {
  [dayOfWeek: string]: PriestAvailabilitySlot | null;
}

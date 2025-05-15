
export type ConfessionStatus = 'تم' | 'لم يحضر' | 'قادم' | 'ملغى';

export interface ConfessionAppointment {
  id: string;
  name: string;
  day: string; // e.g., "الأحد"
  time: string; // e.g., "17:00" in HH:mm format
  status: ConfessionStatus;
  datetime: Date; // For sorting and alerts
  notes?: string; // For rescheduling info or other notes
  originalDatetime?: Date; // To track if rescheduled
}

export type VisitationFamilyStatus = 'عاجل' | 'عادي' | 'تواصل فقط' | 'تمت الزيارة' | 'لم تتم الزيارة';

export interface FamilyMember {
  id: string;
  name: string;
  age: number | string; // age can be string initially from form input
  gender: 'ذكر' | 'أنثى' | '';
  educationLevel: string;
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
}

export interface PriestAvailabilitySlot {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface PriestAvailability {
  // Key is day name e.g., "الأحد", "الاثنين"
  [dayOfWeek: string]: PriestAvailabilitySlot | null;
}


export type ConfessionStatus = 'تم' | 'لم يحضر' | 'قادم' | 'ملغى';

export interface ConfessionAppointment {
  id: string;
  name: string;
  day: string; // e.g., "الأحد"
  time: string; // e.g., "٠٥:٠٠ م"
  status: ConfessionStatus;
  datetime: Date; // For sorting and alerts
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
  // mapLocation: { lat: number; lng: number }; // For future Google Maps integration
  phoneNumber: string;
  region?: string;
  visitationStatus?: VisitationFamilyStatus;
  lastVisited?: Date;
  notes?: string;
}

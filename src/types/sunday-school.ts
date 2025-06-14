
export type ServingDay = 'Thursday' | 'Friday';

export interface SundaySchoolServant {
  id: string;
  name: string;
  contactNumber?: string;
  birthDate?: string; // ISO string YYYY-MM-DD
  servingDays: ServingDay[]; // Array can contain 'Thursday', 'Friday', or both
  isActive: boolean; // To allow deactivating servants without deleting
}

export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface SundaySchoolAttendance {
  id: string; // Unique ID for the attendance record
  servantId: string;
  date: string; // ISO string YYYY-MM-DD of the service day
  serviceDay: ServingDay; // The specific day of service (Thursday or Friday)
  status: AttendanceStatus;
  notes?: string; // e.g., reason for absence if provided by priest
  recordedBy?: 'priest' | 'servant'; // Who recorded this
  selfRecordedAt?: string; // ISO timestamp if servant recorded
  isGeoVerified?: boolean; // True if servant was within geo-fence when self-recording
}


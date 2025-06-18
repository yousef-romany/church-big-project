
'use client';
import type { SundaySchoolServant, SundaySchoolAttendance, ServingDay, AttendanceStatus } from '@/types/sunday-school';
import { format, parseISO, getDay } from 'date-fns';
import { arSA } from 'date-fns/locale';

const SERVANTS_KEY = 'sundaySchoolServants_v2'; // Version bump
const ATTENDANCE_KEY = 'sundaySchoolAttendance_v2'; // Version bump

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

let localDefaultServantIds: string[] = []; // Used to link default attendance to default servants

const defaultServantsData: Omit<SundaySchoolServant, 'id' | 'isActive'>[] = [
  { name: 'الخادم مينا جرجس', contactNumber: '01012345678', birthDate: '1990-05-15', servingDays: ['Thursday', 'Friday'] },
  { name: 'الخادمة تريزا فايز', contactNumber: '01298765432', birthDate: '1995-09-22', servingDays: ['Friday'] },
  { name: 'الخادم بيشوي كامل', contactNumber: '01155500112', birthDate: '1988-02-10', servingDays: ['Thursday'] },
  { name: 'الخادمة مارينا عادل', birthDate: '2000-11-03', servingDays: ['Friday'], contactNumber: '01000000001' },
  { name: 'الخادم كيرلس أنطون', birthDate: '1998-07-01', servingDays: ['Thursday', 'Friday'], contactNumber: '01212121212' },
];

export const getSundaySchoolServants = (): SundaySchoolServant[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SERVANTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default servants
    localDefaultServantIds = []; // Clear before repopulating
    const initialServants = defaultServantsData.map(sData => {
      const newServant = { ...sData, id: generateId(), isActive: true };
      localDefaultServantIds.push(newServant.id);
      return newServant;
    });
    saveSundaySchoolServants(initialServants);
    return initialServants;
  } catch (e) {
    console.error("Failed to parse servants from localStorage", e);
    return [];
  }
};

export const saveSundaySchoolServants = (servants: SundaySchoolServant[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SERVANTS_KEY, JSON.stringify(servants));
};

export const addSundaySchoolServant = (servantData: Omit<SundaySchoolServant, 'id' | 'isActive'>): SundaySchoolServant => {
  const servants = getSundaySchoolServants();
  const newServant: SundaySchoolServant = { ...servantData, id: generateId(), isActive: true };
  saveSundaySchoolServants([...servants, newServant]);
  return newServant;
};

export const updateSundaySchoolServant = (updatedServant: SundaySchoolServant): SundaySchoolServant | null => {
  let servants = getSundaySchoolServants();
  const index = servants.findIndex(s => s.id === updatedServant.id);
  if (index > -1) {
    servants[index] = updatedServant;
    saveSundaySchoolServants(servants);
    return updatedServant;
  }
  return null;
};


const populateDefaultAttendance = (): SundaySchoolAttendance[] => {
  const defaultAttendanceRecords: Omit<SundaySchoolAttendance, 'id'>[] = [];
  // Ensure localDefaultServantIds is populated if it's empty (e.g., first call)
  if (localDefaultServantIds.length === 0) {
     getSundaySchoolServants(); // This will populate localDefaultServantIds
  }
  if (localDefaultServantIds.length === 0) return []; // Still no servants, can't create attendance

  const servants = getSundaySchoolServants(); // Get the full servant list to access servingDays

  const today = new Date();
  const datesToConsider: Date[] = [];
  for (let i = 0; i < 7; i++) { // Last 7 days
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayOfWeek = getDay(d); // 0 for Sunday, ..., 4 for Thursday, 5 for Friday
    if (dayOfWeek === 4 || dayOfWeek === 5) { // Only Thursdays and Fridays
      datesToConsider.push(d);
    }
  }

  const statuses: AttendanceStatus[] = ['present', 'absent', 'excused'];
  
  localDefaultServantIds.forEach((servantId, servantIndex) => {
    const servant = servants.find(s => s.id === servantId);
    if (!servant) return;

    datesToConsider.forEach((dateObj, dateIndex) => {
      const dateStr = format(dateObj, 'yyyy-MM-dd');
      const serviceDayForRecord: ServingDay = getDay(dateObj) === 4 ? 'Thursday' : 'Friday';

      if (servant.servingDays.includes(serviceDayForRecord)) {
        const status = statuses[(servantIndex + dateIndex + dateObj.getDate()) % statuses.length]; // Add date for more variation
        defaultAttendanceRecords.push({
          servantId,
          date: dateStr,
          serviceDay: serviceDayForRecord,
          status: status,
          notes: status === 'absent' ? 'غائب لظرف شخصي' : (status === 'excused' ? 'معذور لطارئ صحي' : (status === 'present' && Math.random() < 0.2 ? 'حضر متأخراً قليلاً' : undefined)),
          recordedBy: 'priest', // Default recorded by priest
          selfRecordedAt: status === 'present' && Math.random() < 0.3 ? dateObj.toISOString() : undefined,
          isGeoVerified: status === 'present' && Math.random() < 0.7 ? true : undefined,
        });
      }
    });
  });
  return defaultAttendanceRecords.map(att => ({ ...att, id: generateId() }));
};

export const getSundaySchoolAttendance = (): SundaySchoolAttendance[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ATTENDANCE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const initialAttendance = populateDefaultAttendance();
    if (initialAttendance.length > 0) {
      saveSundaySchoolAttendance(initialAttendance);
      return initialAttendance;
    }
    return [];
  } catch (e) {
    console.error("Failed to parse attendance from localStorage", e);
    return [];
  }
};

export const saveSundaySchoolAttendance = (attendanceRecords: SundaySchoolAttendance[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceRecords));
};

export const recordAttendance = (
  servantId: string,
  date: string, // YYYY-MM-DD
  serviceDay: ServingDay,
  status: AttendanceStatus,
  notes?: string,
  recordedBy?: 'priest' | 'servant',
  selfRecordedAt?: string, // ISO string
  isGeoVerified?: boolean
): SundaySchoolAttendance => {
  const attendanceRecords = getSundaySchoolAttendance();
  const existingRecordIndex = attendanceRecords.findIndex(
    record => record.servantId === servantId && record.date === date && record.serviceDay === serviceDay
  );

  let newOrUpdatedRecord: SundaySchoolAttendance;

  if (existingRecordIndex > -1) {
    newOrUpdatedRecord = {
      ...attendanceRecords[existingRecordIndex],
      status,
      notes: notes !== undefined ? notes : attendanceRecords[existingRecordIndex].notes,
      recordedBy: recordedBy || attendanceRecords[existingRecordIndex].recordedBy,
      selfRecordedAt: selfRecordedAt || attendanceRecords[existingRecordIndex].selfRecordedAt,
      isGeoVerified: isGeoVerified !== undefined ? isGeoVerified : attendanceRecords[existingRecordIndex].isGeoVerified,
    };
    attendanceRecords[existingRecordIndex] = newOrUpdatedRecord;
  } else {
    newOrUpdatedRecord = {
      id: generateId(),
      servantId,
      date,
      serviceDay,
      status,
      notes,
      recordedBy,
      selfRecordedAt,
      isGeoVerified,
    };
    attendanceRecords.push(newOrUpdatedRecord);
  }

  saveSundaySchoolAttendance(attendanceRecords);
  return newOrUpdatedRecord;
};

export const getAttendanceForDay = (date: string, serviceDay: ServingDay): SundaySchoolAttendance[] => {
  const allRecords = getSundaySchoolAttendance();
  return allRecords.filter(record => record.date === date && record.serviceDay === serviceDay);
};

export const getAttendanceForServant = (servantId: string): SundaySchoolAttendance[] => {
  const allRecords = getSundaySchoolAttendance();
  return allRecords.filter(record => record.servantId === servantId)
                   .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
};

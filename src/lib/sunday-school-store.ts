
'use client';
import type { SundaySchoolServant, SundaySchoolAttendance, ServingDay, AttendanceStatus } from '@/types/sunday-school';
import { format, parseISO } from 'date-fns';

const SERVANTS_KEY = 'sundaySchoolServants_v1';
const ATTENDANCE_KEY = 'sundaySchoolAttendance_v1';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// --- Sunday School Servants ---
export const getSundaySchoolServants = (): SundaySchoolServant[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SERVANTS_KEY);
    return stored ? JSON.parse(stored) : [];
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

// --- Sunday School Attendance ---
export const getSundaySchoolAttendance = (): SundaySchoolAttendance[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ATTENDANCE_KEY);
    return stored ? JSON.parse(stored) : [];
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
    // Update existing record
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
    // Add new record
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

// Helper to get records for a specific date and service day
export const getAttendanceForDay = (date: string, serviceDay: ServingDay): SundaySchoolAttendance[] => {
  const allRecords = getSundaySchoolAttendance();
  return allRecords.filter(record => record.date === date && record.serviceDay === serviceDay);
};

// Helper to get attendance for a specific servant
export const getAttendanceForServant = (servantId: string): SundaySchoolAttendance[] => {
  const allRecords = getSundaySchoolAttendance();
  return allRecords.filter(record => record.servantId === servantId)
                   .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()); // Sort descending by date
};

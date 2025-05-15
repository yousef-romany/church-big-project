
'use client';
import type { ConfessionAppointment, PriestAvailability } from '@/types/priest-panel';
import { addMinutes, parse } from 'date-fns';

const AVAILABILITY_KEY = 'priestChurchAvailability'; // Changed key to avoid conflict
const APPOINTMENTS_KEY = 'churchConfessionAppointments'; // Changed key

// Helper to generate unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

// --- Priest Availability Store ---
export function getPriestAvailability(): PriestAvailability {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(AVAILABILITY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure datetime objects are correctly parsed if they were stored as strings
      // For availability, times are strings (HH:mm), so direct parse is fine.
      return parsed;
    }
    return { // Default availability if nothing is stored
      "الأحد": { startTime: "10:00", endTime: "12:00", enabled: true },
      "الاثنين": null,
      "الثلاثاء": null,
      "الأربعاء": { startTime: "17:00", endTime: "19:00", enabled: true },
      "الخميس": null,
      "الجمعة": null,
      "السبت": { startTime: "16:00", endTime: "20:00", enabled: true },
    };
  } catch (error) {
    console.error("Error reading availability from localStorage", error);
    return {};
  }
}

export function setPriestAvailability(availability: PriestAvailability): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(availability));
  } catch (error) {
    console.error("Error writing availability to localStorage", error);
  }
}

// --- Confession Appointments Store ---
export function getAppointments(): ConfessionAppointment[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(APPOINTMENTS_KEY);
    if (stored) {
      return JSON.parse(stored).map((appt: any) => ({
        ...appt,
        datetime: new Date(appt.datetime), // Ensure datetime is a Date object
        originalDatetime: appt.originalDatetime ? new Date(appt.originalDatetime) : undefined,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error reading appointments from localStorage", error);
    return [];
  }
}

export function saveAppointments(appointments: ConfessionAppointment[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  } catch (error) {
    console.error("Error writing appointments to localStorage", error);
  }
}

export function addAppointment(appointment: Omit<ConfessionAppointment, 'id'>): ConfessionAppointment {
  const appointments = getAppointments();
  const newAppointmentWithId: ConfessionAppointment = { ...appointment, id: generateId() };
  const updatedAppointments = [...appointments, newAppointmentWithId].sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
  saveAppointments(updatedAppointments);
  return newAppointmentWithId;
}

export function updateAppointment(updatedAppt: ConfessionAppointment): void {
  let appointments = getAppointments();
  appointments = appointments.map(appt => appt.id === updatedAppt.id ? updatedAppt : appt);
  saveAppointments(appointments.sort((a,b) => a.datetime.getTime() - b.datetime.getTime()));
}

export function deleteAppointment(appointmentId: string): void {
  let appointments = getAppointments();
  appointments = appointments.filter(appt => appt.id !== appointmentId);
  saveAppointments(appointments);
}


// Helper to combine Date object (date part) and time string (HH:mm) into a new Date object
export const combineDateAndTime = (dateObj: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(dateObj); // Create a new Date object to avoid mutating the original
  newDate.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, and milliseconds
  return newDate;
};

// Helper to check for overlaps
export function isSlotOverlapping(
  newSlotStart: Date,
  newSlotDurationMinutes: number,
  existingAppointments: ConfessionAppointment[]
): boolean {
  const newSlotEnd = addMinutes(newSlotStart, newSlotDurationMinutes);
  return existingAppointments.some(app => {
    const existingStart = new Date(app.datetime); // Ensure it's a Date object
    const existingEnd = addMinutes(existingStart, app.durationMinutes || 30); // Use stored duration or default
    // Check for overlap: (newStart < existingEnd) AND (newEnd > existingStart)
    return (newSlotStart < existingEnd) && (newSlotEnd > existingStart);
  });
}

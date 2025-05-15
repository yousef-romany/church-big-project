
'use client';
import type { ConfessionAppointment, PriestAvailability } from '@/types/priest-panel';
import { addMinutes, parse } from 'date-fns';

const AVAILABILITY_KEY = 'priestChurchAvailability'; 
const APPOINTMENTS_KEY = 'churchConfessionAppointments'; 

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

export function getPriestAvailability(): PriestAvailability {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(AVAILABILITY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed;
    }
    return { 
      "الأحد": { startTime: "10:00", endTime: "12:00", enabled: true },
      "الاثنين": { startTime: "", endTime: "", enabled: false },
      "الثلاثاء": { startTime: "", endTime: "", enabled: false },
      "الأربعاء": { startTime: "17:00", endTime: "19:00", enabled: true },
      "الخميس": { startTime: "", endTime: "", enabled: false },
      "الجمعة": { startTime: "", endTime: "", enabled: false },
      "السبت": { startTime: "16:00", endTime: "20:00", enabled: true },
    };
  } catch (error) {
    console.error("Error reading availability from localStorage", error);
    return { 
      "الأحد": { startTime: "10:00", endTime: "12:00", enabled: true }, "الاثنين": { startTime: "", endTime: "", enabled: false }, "الثلاثاء": { startTime: "", endTime: "", enabled: false }, "الأربعاء": { startTime: "17:00", endTime: "19:00", enabled: true }, "الخميس": { startTime: "", endTime: "", enabled: false }, "الجمعة": { startTime: "", endTime: "", enabled: false }, "السبت": { startTime: "16:00", endTime: "20:00", enabled: true },
    };
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

export function getAppointments(): ConfessionAppointment[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(APPOINTMENTS_KEY);
    if (stored) {
      return JSON.parse(stored).map((appt: any) => ({
        ...appt,
        datetime: new Date(appt.datetime), 
        originalDatetime: appt.originalDatetime ? new Date(appt.originalDatetime) : undefined,
        durationMinutes: appt.durationMinutes || 30, // Ensure default duration
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
  const newAppointmentWithId: ConfessionAppointment = { 
    ...appointment, 
    id: generateId(),
    durationMinutes: appointment.durationMinutes || 30 // Ensure default duration on add
  };
  const updatedAppointments = [...appointments, newAppointmentWithId].sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
  saveAppointments(updatedAppointments);
  return newAppointmentWithId;
}

export function updateAppointment(updatedAppt: ConfessionAppointment): void {
  let appointments = getAppointments();
  appointments = appointments.map(appt => appt.id === updatedAppt.id ? { ...updatedAppt, durationMinutes: updatedAppt.durationMinutes || 30 } : appt);
  saveAppointments(appointments.sort((a,b) => a.datetime.getTime() - b.datetime.getTime()));
}

export function deleteAppointment(appointmentId: string): void {
  let appointments = getAppointments();
  appointments = appointments.filter(appt => appt.id !== appointmentId);
  saveAppointments(appointments);
}


export const combineDateAndTime = (dateObj: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(dateObj); 
  newDate.setHours(hours, minutes, 0, 0); 
  return newDate;
};

export function isSlotOverlapping(
  newSlotStart: Date,
  newSlotDurationMinutes: number,
  existingAppointments: ConfessionAppointment[],
  excludeAppointmentId?: string // Optional: to exclude the current appointment being edited
): boolean {
  const newSlotEnd = addMinutes(newSlotStart, newSlotDurationMinutes);
  return existingAppointments.some(app => {
    if (excludeAppointmentId && app.id === excludeAppointmentId) {
      return false; // Skip self when checking for overlap during an update
    }
    const existingStart = new Date(app.datetime); 
    const existingEnd = addMinutes(existingStart, app.durationMinutes || 30); 
    return (newSlotStart < existingEnd) && (newSlotEnd > existingStart);
  });
}


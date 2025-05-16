
'use client';
import type { ConfessionAppointment, PriestAvailability } from '@/types/priest-panel';
import { addMinutes, isValid, parse } from 'date-fns'; // Added isValid

const AVAILABILITY_KEY = 'priestChurchAvailability'; 
const APPOINTMENTS_KEY = 'churchConfessionAppointments'; 

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

export function getPriestAvailability(): PriestAvailability {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(AVAILABILITY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure default structure for days that might be missing startTime/endTime/enabled
      const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      const completeAvailability: PriestAvailability = {};
      daysOfWeek.forEach(day => {
        if (parsed[day]) {
          completeAvailability[day] = {
            startTime: parsed[day].startTime || "",
            endTime: parsed[day].endTime || "",
            enabled: !!parsed[day].enabled,
          };
        } else {
          completeAvailability[day] = { startTime: "", endTime: "", enabled: false };
        }
      });
      return completeAvailability;
    }
    // Default availability if nothing is stored
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
      const parsedAppointments = JSON.parse(stored);
      if (!Array.isArray(parsedAppointments)) {
        console.warn("Stored appointments data is not an array, resetting.", parsedAppointments);
        return [];
      }
      return parsedAppointments.map((appt: any) => {
        let dt: Date | null = null;
        if (appt.datetime) {
          const parsedDate = new Date(appt.datetime);
          if (isValid(parsedDate)) {
            dt = parsedDate;
          } else {
            console.warn('Invalid datetime for stored appointment, skipping:', appt);
          }
        } else {
          console.warn('Missing datetime for stored appointment, skipping:', appt);
        }

        let origDt: Date | undefined = undefined;
        if (appt.originalDatetime) {
          const parsedOrigDate = new Date(appt.originalDatetime);
          if (isValid(parsedOrigDate)) {
            origDt = parsedOrigDate;
          }
        }
        
        return {
          ...appt,
          datetime: dt, // dt can be null if the original date was invalid
          originalDatetime: origDt,
          durationMinutes: Number(appt.durationMinutes) || 30, // Ensure duration is a number and defaults
        };
      }).filter((appt): appt is ConfessionAppointment & { datetime: Date } => appt.datetime !== null); // Filter out appointments where datetime became null
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
    // Before saving, ensure all datetime properties are valid Date objects or correctly stringifiable
    const appointmentsToSave = appointments.map(app => ({
      ...app,
      datetime: app.datetime instanceof Date && isValid(app.datetime) ? app.datetime.toISOString() : null,
      originalDatetime: app.originalDatetime instanceof Date && isValid(app.originalDatetime) ? app.originalDatetime.toISOString() : undefined,
    })).filter(app => app.datetime !== null); // Don't save appointments with invalid final datetimes

    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointmentsToSave));
  } catch (error) {
    console.error("Error writing appointments to localStorage", error);
  }
}

export function addAppointment(appointment: Omit<ConfessionAppointment, 'id'>): ConfessionAppointment {
  const appointments = getAppointments();
  const newAppointmentWithId: ConfessionAppointment = { 
    ...appointment, 
    id: generateId(),
    datetime: appointment.datetime, // Ensure datetime is a Date object
    durationMinutes: Number(appointment.durationMinutes) || 30,
  };
  const updatedAppointments = [...appointments, newAppointmentWithId].sort((a,b) => {
      // Assuming a.datetime and b.datetime are valid Date objects here due to getAppointments filter
      return (a.datetime as Date).getTime() - (b.datetime as Date).getTime();
  });
  saveAppointments(updatedAppointments);
  return newAppointmentWithId;
}

export function updateAppointment(updatedAppt: ConfessionAppointment): void {
  let appointments = getAppointments();
  appointments = appointments.map(appt => 
    appt.id === updatedAppt.id 
    ? { ...updatedAppt, datetime: updatedAppt.datetime, durationMinutes: Number(updatedAppt.durationMinutes) || 30 } 
    : appt
  );
  saveAppointments(appointments.sort((a,b) => {
      return (a.datetime as Date).getTime() - (b.datetime as Date).getTime();
  }));
}

export function deleteAppointment(appointmentId: string): void {
  let appointments = getAppointments();
  appointments = appointments.filter(appt => appt.id !== appointmentId);
  saveAppointments(appointments);
}


export const combineDateAndTime = (dateObj: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(dateObj); // Create a new Date object to avoid mutating the original
  newDate.setHours(hours, minutes, 0, 0); // Set hours and minutes
  return newDate;
};

export function isSlotOverlapping(
  newSlotStart: Date,
  newSlotDurationMinutes: number,
  existingAppointments: ConfessionAppointment[],
  excludeAppointmentId?: string 
): boolean {
  const newSlotEnd = addMinutes(newSlotStart, newSlotDurationMinutes);
  return existingAppointments.some(app => {
    if (excludeAppointmentId && app.id === excludeAppointmentId) {
      return false; 
    }
    // Ensure app.datetime is a valid Date. getAppointments should filter invalid ones.
    if (!(app.datetime instanceof Date) || !isValid(app.datetime)) return false;

    const existingStart = app.datetime; 
    const existingEnd = addMinutes(existingStart, Number(app.durationMinutes) || 30); 
    
    // Check for overlap: (StartA < EndB) and (EndA > StartB)
    return (newSlotStart < existingEnd) && (newSlotEnd > existingStart);
  });
}

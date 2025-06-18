
'use client';
import type { ConfessionAppointment, PriestAvailability } from '@/types/priest-panel';
import { addMinutes, isValid, parse, format, isBefore, isEqual, startOfDay } from 'date-fns';
import { arSA } from 'date-fns/locale';

const AVAILABILITY_KEY = 'priestChurchAvailability_v1'; // Added versioning
const APPOINTMENTS_KEY = 'churchConfessionAppointments_v1'; // Added versioning

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

export const combineDateAndTime = (dateObj: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(dateObj);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

const defaultAppointments: Omit<ConfessionAppointment, 'id' | 'datetime'> & { date: Date }[] = [
  { name: 'المعترف الأول (اليوم)', date: new Date(), time: '10:00', day: format(new Date(), 'EEEE', { locale: arSA }), status: 'قادم', durationMinutes: 30, notes: 'يطلب تأكيدًا هاتفيًا قبل الموعد.' },
  { name: 'المعترف الثاني (غدًا)', date: new Date(Date.now() + 24 * 60 * 60 * 1000), time: '17:30', day: format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'EEEE', { locale: arSA }), status: 'قادم', durationMinutes: 45, notes: 'سيحضر معه شخصًا آخر.' },
  { name: 'المعترف الثالث (أمس)', date: new Date(Date.now() - 24 * 60 * 60 * 1000), time: '11:00', day: format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'EEEE', { locale: arSA }), status: 'تم', durationMinutes: 30, notes: 'اعتراف جيد ومثمر.' },
  { name: 'المعترف الرابع (أول أمس)', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), time: '18:00', day: format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 'EEEE', { locale: arSA }), status: 'لم يحضر', durationMinutes: 30, notes: 'لم يحضر ولم يعتذر.' },
  { name: 'المعترف الخامس (اليوم - ملغى)', date: new Date(), time: '14:00', day: format(new Date(), 'EEEE', { locale: arSA }), status: 'ملغى', durationMinutes: 30, notes: 'تم الإلغاء بناءً على طلبه بسبب ظرف طارئ.' },
  { name: 'المعترف السادس (الأسبوع القادم)', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), time: '09:00', day: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'EEEE', { locale: arSA }), status: 'قادم', durationMinutes: 60 },
];


export function getPriestAvailability(): PriestAvailability {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(AVAILABILITY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      const completeAvailability: PriestAvailability = {};
      daysOfWeek.forEach(day => {
        completeAvailability[day] = {
          startTime: parsed[day]?.startTime || "",
          endTime: parsed[day]?.endTime || "",
          enabled: !!parsed[day]?.enabled,
        };
      });
      return completeAvailability;
    }
    return { 
      "الأحد": { startTime: "10:00", endTime: "12:00", enabled: true },
      "الاثنين": { startTime: "", endTime: "", enabled: false },
      "الثلاثاء": { startTime: "17:00", endTime: "19:00", enabled: true },
      "الأربعاء": { startTime: "", endTime: "", enabled: false },
      "الخميس": { startTime: "18:00", endTime: "20:00", enabled: true },
      "الجمعة": { startTime: "", endTime: "", enabled: false },
      "السبت": { startTime: "16:00", endTime: "20:00", enabled: true },
    };
  } catch (error) {
    console.error("Error reading availability from localStorage", error);
    return {}; // Return empty or default on error
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
        if (appt.datetime && typeof appt.datetime === 'string') {
          const parsedDate = new Date(appt.datetime);
          if (isValid(parsedDate)) {
            dt = parsedDate;
          }
        } else if (appt.datetime instanceof Date && isValid(appt.datetime)) {
          dt = appt.datetime; // Already a Date object
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
          datetime: dt,
          originalDatetime: origDt,
          durationMinutes: Number(appt.durationMinutes) || 30,
        };
      }).filter((appt): appt is ConfessionAppointment & { datetime: Date } => appt.datetime !== null && isValid(appt.datetime))
        .sort((a,b) => (a.datetime as Date).getTime() - (b.datetime as Date).getTime());
    } else {
      // Initialize with default appointments if localStorage is empty
      const initialAppointmentsWithIds = defaultAppointments.map(appt => ({
        ...appt,
        id: generateId(),
        datetime: combineDateAndTime(appt.date, appt.time),
      }));
      saveAppointments(initialAppointmentsWithIds);
      return initialAppointmentsWithIds.map(appt => ({...appt, datetime: new Date(appt.datetime)}))
               .sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
    }
  } catch (error) {
    console.error("Error reading appointments from localStorage", error);
    return [];
  }
}

export function saveAppointments(appointments: ConfessionAppointment[]): void {
  if (typeof window === 'undefined') return;
  try {
    const appointmentsToSave = appointments.map(app => ({
      ...app,
      datetime: app.datetime instanceof Date && isValid(app.datetime) ? app.datetime.toISOString() : null,
      originalDatetime: app.originalDatetime instanceof Date && isValid(app.originalDatetime) ? app.originalDatetime.toISOString() : undefined,
    })).filter(app => app.datetime !== null);

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
    datetime: appointment.datetime,
    durationMinutes: Number(appointment.durationMinutes) || 30,
  };
  const updatedAppointments = [...appointments, newAppointmentWithId].sort((a,b) => {
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
    if (!(app.datetime instanceof Date) || !isValid(app.datetime)) return false;

    const existingStart = app.datetime; 
    const existingEnd = addMinutes(existingStart, Number(app.durationMinutes) || 30); 
    
    return (newSlotStart < existingEnd) && (newSlotEnd > existingStart);
  });
}

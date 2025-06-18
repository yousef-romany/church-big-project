
'use client';
import type { ConfessionAppointment, PriestAvailability, PriestAvailabilitySlot } from '@/types/priest-panel';
import type { ConfessionRequestFormInput } from '@/types/public'; // Added for the new function
import { addMinutes, isValid, parse, format, isBefore, isEqual, startOfDay, addDays, getDay, setHours, setMinutes, isAfter } from 'date-fns';
import { arSA } from 'date-fns/locale';

const AVAILABILITY_KEY = 'priestChurchAvailability_v1';
const APPOINTMENTS_KEY = 'churchConfessionAppointments_v1';
const DEFAULT_CONFESSION_DURATION_MINUTES = 30;

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

export const combineDateAndTime = (dateObj: Date, timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  let newDate = new Date(dateObj); // Create a new Date object to avoid modifying the original
  newDate = setHours(newDate, hours);
  newDate = setMinutes(newDate, minutes);
  newDate = setHours(newDate, hours, minutes, 0, 0); // More robust way to set H, M, S, MS
  return newDate;
};


const defaultAppointments: Omit<ConfessionAppointment, 'id' | 'datetime'> & { date: Date }[] = [
  { name: 'المعترف الأول (اليوم)', date: new Date(), time: '10:00', day: format(new Date(), 'EEEE', { locale: arSA }), status: 'قادم', durationMinutes: 30, notes: 'يطلب تأكيدًا هاتفيًا قبل الموعد.' },
  { name: 'المعترف الثاني (غدًا)', date: addDays(new Date(),1), time: '17:30', day: format(addDays(new Date(),1), 'EEEE', { locale: arSA }), status: 'قادم', durationMinutes: 45, notes: 'سيحضر معه شخصًا آخر.' },
  { name: 'المعترف الثالث (أمس)', date: addDays(new Date(),-1), time: '11:00', day: format(addDays(new Date(),-1), 'EEEE', { locale: arSA }), status: 'تم', durationMinutes: 30, notes: 'اعتراف جيد ومثمر.' },
  { name: 'المعترف الرابع (أول أمس)', date: addDays(new Date(),-2), time: '18:00', day: format(addDays(new Date(),-2), 'EEEE', { locale: arSA }), status: 'لم يحضر', durationMinutes: 30, notes: 'لم يحضر ولم يعتذر.' },
  { name: 'المعترف الخامس (اليوم - ملغى)', date: new Date(), time: '14:00', day: format(new Date(), 'EEEE', { locale: arSA }), status: 'ملغى', durationMinutes: 30, notes: 'تم الإلغاء بناءً على طلبه بسبب ظرف طارئ.' },
  { name: 'المعترف السادس (الأسبوع القادم)', date: addDays(new Date(),7), time: '09:00', day: format(addDays(new Date(),7), 'EEEE', { locale: arSA }), status: 'قادم', durationMinutes: 60 },
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
    // Default availability if nothing is stored
    return { 
      "الأحد": { startTime: "10:00", endTime: "13:00", enabled: true },
      "الاثنين": { startTime: "", endTime: "", enabled: false },
      "الثلاثاء": { startTime: "17:00", endTime: "20:00", enabled: true },
      "الأربعاء": { startTime: "", endTime: "", enabled: false },
      "الخميس": { startTime: "18:00", endTime: "21:00", enabled: true },
      "الجمعة": { startTime: "", endTime: "", enabled: false },
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

export function getAppointments(): ConfessionAppointment[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(APPOINTMENTS_KEY);
    if (stored) {
      const parsedAppointments = JSON.parse(stored);
      if (!Array.isArray(parsedAppointments)) {
        console.warn("Stored appointments data is not an array, resetting.", parsedAppointments);
        localStorage.removeItem(APPOINTMENTS_KEY); // Clear invalid data
        return getAppointments(); // Retry to get initial defaults
      }
      return parsedAppointments.map((appt: any) => {
        let dt: Date | null = null;
        if (appt.datetime && typeof appt.datetime === 'string') {
          const parsedDate = new Date(appt.datetime);
          if (isValid(parsedDate)) {
            dt = parsedDate;
          }
        } else if (appt.datetime instanceof Date && isValid(appt.datetime)) {
          dt = appt.datetime;
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
          durationMinutes: Number(appt.durationMinutes) || DEFAULT_CONFESSION_DURATION_MINUTES,
        };
      }).filter((appt): appt is ConfessionAppointment & { datetime: Date } => appt.datetime !== null && isValid(appt.datetime))
        .sort((a,b) => (a.datetime as Date).getTime() - (b.datetime as Date).getTime());
    } else {
      const initialAppointmentsWithIds = defaultAppointments.map(appt => ({
        ...appt,
        id: generateId(),
        datetime: combineDateAndTime(appt.date, appt.time),
        durationMinutes: appt.durationMinutes || DEFAULT_CONFESSION_DURATION_MINUTES,
      }));
      saveAppointments(initialAppointmentsWithIds);
      return initialAppointmentsWithIds.map(appt => ({...appt, datetime: new Date(appt.datetime)}))
               .sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
    }
  } catch (error) {
    console.error("Error reading appointments from localStorage", error);
    localStorage.removeItem(APPOINTMENTS_KEY); // Attempt to clear potentially corrupted data
    return []; // Return empty on error to prevent further issues
  }
}

export function saveAppointments(appointments: ConfessionAppointment[]): void {
  if (typeof window === 'undefined') return;
  try {
    const appointmentsToSave = appointments.map(app => ({
      ...app,
      datetime: app.datetime instanceof Date && isValid(app.datetime) ? app.datetime.toISOString() : null,
      originalDatetime: app.originalDatetime instanceof Date && isValid(app.originalDatetime) ? app.originalDatetime.toISOString() : undefined,
      durationMinutes: app.durationMinutes || DEFAULT_CONFESSION_DURATION_MINUTES,
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
    datetime: appointment.datetime, // Should be a Date object
    durationMinutes: Number(appointment.durationMinutes) || DEFAULT_CONFESSION_DURATION_MINUTES,
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
    ? { ...updatedAppt, datetime: updatedAppt.datetime, durationMinutes: Number(updatedAppt.durationMinutes) || DEFAULT_CONFESSION_DURATION_MINUTES } 
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
    const existingEnd = addMinutes(existingStart, Number(app.durationMinutes) || DEFAULT_CONFESSION_DURATION_MINUTES); 
    
    // Check for overlap: (StartA < EndB) and (EndA > StartB)
    return (newSlotStart < existingEnd) && (newSlotEnd > existingStart);
  });
}

// New function to find and book the next available slot
export async function findAndBookNextAvailableSlot(
  requestData: ConfessionRequestFormInput,
  priestId?: string, // For future multi-priest support
  confessionDurationMinutes: number = DEFAULT_CONFESSION_DURATION_MINUTES,
  maxDaysToCheck: number = 30 // Check for availability within the next 30 days
): Promise<ConfessionAppointment | null> {
  const priestAvailability = getPriestAvailability();
  const existingAppointments = getAppointments();
  let currentDate = startOfDay(addDays(new Date(), 1)); // Start checking from tomorrow

  for (let i = 0; i < maxDaysToCheck; i++) {
    const dayName = format(currentDate, 'EEEE', { locale: arSA });
    const availabilityForDay = priestAvailability[dayName];

    if (availabilityForDay && availabilityForDay.enabled && availabilityForDay.startTime && availabilityForDay.endTime) {
      let slotTime = combineDateAndTime(currentDate, availabilityForDay.startTime);
      const dayEndTime = combineDateAndTime(currentDate, availabilityForDay.endTime);

      while (isBefore(addMinutes(slotTime, confessionDurationMinutes-1), dayEndTime)) { // -1 to ensure the slot ends AT or BEFORE dayEndTime
        if (!isSlotOverlapping(slotTime, confessionDurationMinutes, existingAppointments)) {
          // Found an available slot
          const newAppointmentData: Omit<ConfessionAppointment, 'id'> = {
            name: requestData.fullName,
            day: dayName,
            time: format(slotTime, 'HH:mm'),
            status: 'قادم',
            datetime: slotTime,
            durationMinutes: confessionDurationMinutes,
            notes: `طلب بواسطة: ${requestData.fullName} (${requestData.mobileNumber}). ${requestData.notes ? 'ملاحظات المستخدم: ' + requestData.notes : ''}`,
            bookedBySystem: true,
          };
          const bookedAppointment = addAppointment(newAppointmentData);
          return bookedAppointment;
        }
        slotTime = addMinutes(slotTime, 15); // Check every 15 minutes for a new slot start time
      }
    }
    currentDate = addDays(currentDate, 1);
  }
  return null; // No slot found within maxDaysToCheck
}

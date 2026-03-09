'use server';

import { prisma } from '@/lib/prisma';
import type { ConfessionAppointment, PriestAvailability } from '@/types/priest-panel';
import type { ConfessionRequestFormInput } from '@/types/public';
import { addMinutes, isValid, parse, format, isBefore, isEqual, startOfDay, addDays, getDay, setHours, setMinutes, isAfter } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { combineDateAndTime } from '@/lib/utils/date-helpers';

const DEFAULT_CONFESSION_DURATION_MINUTES = 30;
const PRIEST_AVAILABILITY_ID = 'singleton_priest_availability'; // Using a fixed ID for single priest for now

// --- Priest Availability ---

export async function getPriestAvailability(): Promise<PriestAvailability> {
  try {
    const availability = await prisma.priestAvailability.findUnique({
      where: { id: PRIEST_AVAILABILITY_ID },
    });
    if (availability) {
      return JSON.parse(availability.availabilityJson);
    }
    // Default availability if nothing is in the DB
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
    console.error("Error fetching priest availability:", error);
    return {};
  }
}

export async function setPriestAvailability(availability: PriestAvailability): Promise<void> {
  try {
    const availabilityJson = JSON.stringify(availability);
    await prisma.priestAvailability.upsert({
      where: { id: PRIEST_AVAILABILITY_ID },
      update: { availabilityJson, priestId: 'default_priest' }, // associate with a priest if needed
      create: { id: PRIEST_AVAILABILITY_ID, availabilityJson, priestId: 'default_priest' }, // associate with a priest if needed
    });
  } catch (error) {
    console.error("Error setting priest availability:", error);
  }
}

// --- Appointments ---

export async function getAppointments(): Promise<ConfessionAppointment[]> {
  try {
    const appointments = await prisma.confessionAppointment.findMany({
      orderBy: {
        datetime: 'asc',
      },
    });
    // This is a bit of a hack to reconcile the DB schema with the app's type expectations
    // A proper fix would be to align the types and schema more closely
    return appointments.map((appt: any) => ({
        ...appt,
        day: format(appt.datetime, 'EEEE', { locale: arSA }),
        time: format(appt.datetime, 'HH:mm'),
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function addAppointment(appointment: Omit<ConfessionAppointment, 'id' | 'day' | 'time'>): Promise<ConfessionAppointment> {
  // Assume a default priestId for now. In a multi-priest app, this would be dynamic.
  const DEFAULT_PRIEST_ID = 'clx0jw22g000108l4cyj07tc0'; // Replace with a real priestId from your DB
  const newAppointment = await prisma.confessionAppointment.create({
    data: {
      name: appointment.name,
      datetime: appointment.datetime,
      durationMinutes: Number(appointment.durationMinutes) || DEFAULT_CONFESSION_DURATION_MINUTES,
      status: appointment.status,
      notes: appointment.notes,
      bookedBySystem: appointment.bookedBySystem || false,
      priestId: appointment.priestId || DEFAULT_PRIEST_ID,
      userId: appointment.userId,
    },
  });
   return {
        ...newAppointment,
        day: format(newAppointment.datetime, 'EEEE', { locale: arSA }),
        time: format(newAppointment.datetime, 'HH:mm'),
    };
}

export async function updateAppointment(updatedAppt: ConfessionAppointment): Promise<void> {
  await prisma.confessionAppointment.update({
    where: { id: updatedAppt.id },
    data: {
      name: updatedAppt.name,
      datetime: updatedAppt.datetime,
      durationMinutes: Number(updatedAppt.durationMinutes) || DEFAULT_CONFESSION_DURATION_MINUTES,
      status: updatedAppt.status,
      notes: updatedAppt.notes,
    },
  });
}

export async function deleteAppointment(appointmentId: string): Promise<void> {
  await prisma.confessionAppointment.delete({
    where: { id: appointmentId },
  });
}

export async function bulkUpdateAppointments(
  appointmentIds: string[],
  updates: Partial<ConfessionAppointment>
): Promise<void> {
  try {
    await prisma.confessionAppointment.updateMany({
      where: { id: { in: appointmentIds } },
      data: {
        status: updates.status,
        notes: updates.notes,
      },
    });
  } catch (error) {
    console.error("Error in bulk update appointments:", error);
    throw error;
  }
}

export async function bulkDeleteAppointments(appointmentIds: string[]): Promise<void> {
  try {
    await prisma.confessionAppointment.deleteMany({
      where: { id: { in: appointmentIds } },
    });
  } catch (error) {
    console.error("Error in bulk delete appointments:", error);
    throw error;
  }
}

export async function exportAppointmentsToCalendar(): Promise<string> {
  try {
    const appointments = await getAppointments();
    
    // Create iCalendar format
    let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Church Management System//Confession Appointments//AR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:مواعيد الاعتراف
X-WR-CALDESC:مواعيد الاعتراف من نظام إدارة الكنيسة
`;

    appointments.forEach((appointment: any) => {
      const startTime = new Date(appointment.datetime);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + (appointment.durationMinutes || 30));
      
      const formatICalDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      };
      
      icalContent += `
BEGIN:VEVENT
UID:${appointment.id}@church-management.org
DTSTART:${formatICalDate(startTime)}
DTEND:${formatICalDate(endTime)}
SUMMARY:اعتراف - ${appointment.name}
DESCRIPTION:موعد اعتراف\\n\\nالحالة: ${appointment.status}\\n${appointment.notes ? `ملاحظات: ${appointment.notes}` : ''}
STATUS:CONFIRMED
END:VEVENT
`;
    });

    icalContent += `END:VCALENDAR`;
    
    return icalContent;
  } catch (error) {
    console.error("Error exporting appointments to calendar:", error);
    throw error;
  }
}

export async function sendAppointmentReminders(appointmentIds: string[]): Promise<void> {
  try {
    const appointments = await prisma.confessionAppointment.findMany({
      where: { id: { in: appointmentIds } },
      include: {
        user: true,
      },
    });

    // In a real implementation, this would send emails/SMS
    // For now, we'll just log that reminders were sent
    console.log(`Sending reminders for ${appointments.length} appointments:`, 
      appointments.map((app: any) => `${app.name} - ${app.datetime}`));
    
    // Here you would integrate with your email/SMS service
    // For example:
    // await emailService.sendReminders(appointments);
  } catch (error) {
    console.error("Error sending appointment reminders:", error);
    throw error;
  }
}

export async function isSlotOverlapping(
  newSlotStart: Date,
  newSlotDurationMinutes: number,
  excludeAppointmentId?: string,
  priestIdForSlot?: string
): Promise<boolean> {
  const newSlotEnd = addMinutes(newSlotStart, newSlotDurationMinutes);
  
  const overlappingAppointments = await prisma.confessionAppointment.count({
    where: {
      AND: [
        { id: { not: excludeAppointmentId } },
        { priestId: priestIdForSlot },
        {
          OR: [
            { // Case 1: Existing appointment starts during the new slot
              datetime: {
                gte: newSlotStart,
                lt: newSlotEnd,
              },
            },
            { // Case 2: Existing appointment ends during the new slot
              AND: [
                { datetime: { lt: newSlotStart } },
                {
                  // We need to calculate the end time in the query if possible, or fetch and filter.
                  // This is a simplification. For complex logic, you might need raw queries or fetch then filter.
                  // For now, we'll assume a fixed duration for checking, or fetch a broader range.
                  datetime: {
                      // This is tricky. Let's fetch a slightly larger window and filter in code for accuracy.
                      gte: addMinutes(newSlotStart, -120), // check appointments starting up to 2 hours before
                      lt: newSlotEnd,
                  }
                }
              ]
            }
          ]
        },
      ],
    },
  });

  // A more accurate check after fetching potential overlaps
    const potentialOverlaps = await prisma.confessionAppointment.findMany({
     where: {
       priestId: priestIdForSlot,
       id: { not: excludeAppointmentId },
       datetime: {
         gte: addMinutes(newSlotStart, -120),
         lt: addMinutes(newSlotEnd, 120),
       }
     }
    });
    
   const hasOverlap = potentialOverlaps.some((app: any) => {
        const existingStart = app.datetime;
        const existingEnd = addMinutes(existingStart, app.durationMinutes);
        return (newSlotStart < existingEnd) && (newSlotEnd > existingStart);
   });


  return hasOverlap;
}

export async function findAndBookNextAvailableSlot(
  requestData: ConfessionRequestFormInput,
  priestIdToBookWith?: string,
  confessionDurationMinutes: number = DEFAULT_CONFESSION_DURATION_MINUTES,
  maxDaysToCheck: number = 30
): Promise<ConfessionAppointment | null> {
    const DEFAULT_PRIEST_ID = 'clx0jw22g000108l4cyj07tc0'; // Replace with a real priestId from your DB
    const targetPriestId = priestIdToBookWith || DEFAULT_PRIEST_ID;

    const priestAvailability = await getPriestAvailability();
    let currentDate = startOfDay(addDays(new Date(), 1));

    for (let i = 0; i < maxDaysToCheck; i++) {
        const dayName = format(currentDate, 'EEEE', { locale: arSA });
        const availabilityForDay = priestAvailability[dayName];
        
        if (availabilityForDay && availabilityForDay.enabled && availabilityForDay.startTime && availabilityForDay.endTime) {
            let slotTime = combineDateAndTime(currentDate, availabilityForDay.startTime);
            const dayEndTime = combineDateAndTime(currentDate, availabilityForDay.endTime);

            while (isBefore(addMinutes(slotTime, confessionDurationMinutes -1), dayEndTime)) {
                if (!(await isSlotOverlapping(slotTime, confessionDurationMinutes, undefined, targetPriestId))) {
                    const newAppointmentData: Omit<ConfessionAppointment, 'id' | 'day' | 'time'> = {
                        name: requestData.fullName,
                        status: 'قادم',
                        datetime: slotTime,
                        durationMinutes: confessionDurationMinutes,
                        notes: `طلب بواسطة: ${requestData.fullName} (${requestData.mobileNumber}). ${requestData.notes ? 'ملاحظات المستخدم: ' + requestData.notes : ''}`,
                        bookedBySystem: true,
                        userId: requestData.userId,
                        priestId: targetPriestId,
                    };
                    const bookedAppointment = await addAppointment(newAppointmentData);
                    return bookedAppointment;
                }
                slotTime = addMinutes(slotTime, 15);
            }
        }
        currentDate = addDays(currentDate, 1);
    }
    return null;
}

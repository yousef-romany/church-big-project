'use client';
import type { ChurchEvent } from '@/types';
import { addDays } from 'date-fns';

const EVENTS_KEY = 'churchSpecialEvents_v1';
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// We need a robust way to combine date and time without timezone issues.
// Let's reuse the one from appointments-store for consistency.
// Since it's a small utility, it's okay to have it here as well for now.
// For a larger app, it should be in a shared utils/date file.
const combineDateAndTime = (dateObj: Date, timeStr: string): Date => {
  const newDate = new Date(dateObj);
  const [hours, minutes] = timeStr.split(':').map(Number);
  newDate.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds/ms
  return newDate;
};


const createDefaultEvents = (): ChurchEvent[] => {
  return [
    {
      id: generateId(),
      title: 'يوم صلاة خاص',
      description: 'يوم صلاة وتأمل في حياة القديس مارمرقس.',
      datetime: combineDateAndTime(addDays(new Date(), 3), '18:00'),
      location: 'الكنيسة الرئيسية',
      points: 25,
    },
    {
      id: generateId(),
      title: 'محاضرة عن الصوم الكبير',
      description: 'محاضرة روحية عن أهمية وفضائل الصوم الكبير.',
      datetime: combineDateAndTime(addDays(new Date(), 10), '19:30'),
      location: 'قاعة البابا كيرلس',
      points: 15,
    },
    {
      id: generateId(),
      title: 'يوم خدمة للمحتاجين',
      description: 'يوم لخدمة وتوزيع المساعدات على الأسر المحتاجة في المنطقة.',
      datetime: combineDateAndTime(addDays(new Date(), 20), '09:00'),
      location: 'مكتب الخدمة',
      points: 50,
    },
  ];
}


export function getEvents(): ChurchEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (stored) {
      return JSON.parse(stored).map((event: any) => ({
        ...event,
        datetime: new Date(event.datetime),
      })).sort((a: ChurchEvent, b: ChurchEvent) => a.datetime.getTime() - b.datetime.getTime());
    }
    const defaultEvents = createDefaultEvents();
    saveEvents(defaultEvents);
    return defaultEvents;
  } catch (error) {
    console.error("Error reading events from localStorage", error);
    return [];
  }
}

export function saveEvents(events: ChurchEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error("Error writing events to localStorage", error);
  }
}

export function addEvent(eventData: Omit<ChurchEvent, 'id'>): ChurchEvent {
  const events = getEvents();
  const newEvent: ChurchEvent = { ...eventData, id: generateId() };
  const updatedEvents = [...events, newEvent].sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
  saveEvents(updatedEvents);
  return newEvent;
}

export function deleteEvent(eventId: string): void {
  let events = getEvents();
  events = events.filter(event => event.id !== eventId);
  saveEvents(events);
}

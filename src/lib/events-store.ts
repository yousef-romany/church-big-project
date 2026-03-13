'use client';
import type { Event } from '@/types';
import { addDays } from 'date-fns';
import { combineDateAndTime } from './appointments-store';

const EVENTS_KEY = 'churchSpecialEvents_v1';
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const createDefaultEvents = (): Event[] => {
  return [
    {
      id: generateId(),
      title: 'يوم صلاة خاص',
      description: 'يوم صلاة وتأمل في حياة القديس مارمرقس.',
      datetime: combineDateAndTime(addDays(new Date(), 3), '18:00'),
      location: 'الكنيسة الرئيسية',
      points: 25,
      creatorId: '',
      creator: {
        id: '',
        userId: '',
        biography: '',
        specialization: '',
        experience: 0,
        education: '',
        phone: '',
        address: '',
        longitude: 0,
        latitude: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: generateId(),
      title: 'محاضرة عن الصوم الكبير',
      description: 'محاضرة روحية عن أهمية وفضائل الصوم الكبير.',
      datetime: combineDateAndTime(addDays(new Date(), 10), '19:30'),
      location: 'قاعة البابا كيرلس',
      points: 15,
      creatorId: '',
      creator: {
        id: '',
        userId: '',
        biography: '',
        specialization: '',
        experience: 0,
        education: '',
        phone: '',
        address: '',
        longitude: 0,
        latitude: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: generateId(),
      title: 'يوم خدمة للمحتاجين',
      description: 'يوم لخدمة وتوزيع المساعدات على الأسر المحتاجة في المنطقة.',
      datetime: combineDateAndTime(addDays(new Date(), 20), '09:00'),
      location: 'مكتب الخدمة',
      points: 50,
      creatorId: '',
      creator: {
        id: '',
        userId: '',
        biography: '',
        specialization: '',
        experience: 0,
        education: '',
        phone: '',
        address: '',
        longitude: 0,
        latitude: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ];
}

export function getEvents(): Event[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (stored) {
      return JSON.parse(stored).map((event: any) => ({
        ...event,
        datetime: new Date(event.datetime),
      })).sort((a: Event, b: Event) => a.datetime.getTime() - b.datetime.getTime());
    }
    const defaultEvents = createDefaultEvents();
    localStorage.setItem(EVENTS_KEY, JSON.stringify(defaultEvents));
    return defaultEvents;
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

export function addEvent(eventData: Omit<Event, 'id'>): Event {
  const events = getEvents();
  const newEvent: Event = { ...eventData, id: generateId() };
  const updatedEvents = [...events, newEvent].sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
  return newEvent;
}

export function updateEvent(id: string, updates: Partial<Event>): Event | null {
  const events = getEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  events[index] = { ...events[index], ...updates };
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return events[index];
}

export function deleteEvent(eventId: string): void {
  let events = getEvents();
  events = events.filter(event => event.id !== eventId);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}
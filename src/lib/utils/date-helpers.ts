import { setHours, setMinutes } from 'date-fns';

export function combineDateAndTime(dateObj: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  let newDate = new Date(dateObj);
  newDate = setHours(newDate, hours);
  newDate = setMinutes(newDate, minutes);
  return newDate;
}

"use client";
import type { ConfessionAppointment, ConfessionStatus } from '@/types/priest-panel';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Bell, CheckCircle, XCircle, Clock, CalendarDays, Search, ListFilter, XCircle as ClearFilterIcon, CalendarClock, CalendarPlus, CalendarRange } from 'lucide-react';
import { format, addMinutes, isWithinInterval, differenceInMinutes, isValid, startOfDay, parse, isBefore, isEqual, isAfter, endOfDay, addDays, isToday, isTomorrow } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { arSA } from 'date-fns/locale';

const statusStyles: Record<ConfessionStatus, string> = {
  'تم': 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200',
  'لم يحضر': 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200',
  'قادم': 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200',
  'ملغى': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
};

const statusIcons: Record<ConfessionStatus, JSX.Element> = {
    'تم': <CheckCircle className="h-4 w-4" />,
    'لم يحضر': <XCircle className="h-4 w-4" />,
    'قادم': <Clock className="h-4 w-4" />,
    'ملغى': <Bell className="h-4 w-4" />
};

interface AppointmentsListDisplayProps {
  appointments: ConfessionAppointment[];
  onEdit: (appointment: ConfessionAppointment) => void;
  onDelete: (id: string) => void;
  showUpcomingAlerts?: boolean;
}

export default function AppointmentsListDisplay({ 
  appointments, 
  onEdit, 
  onDelete,
  showUpcomingAlerts = false 
}: AppointmentsListDisplayProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ConfessionStatus | 'الكل'>('الكل');
  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const upcomingAlerts = useMemo(() => {
    if (!currentTime || !showUpcomingAlerts) return [];
    const now = currentTime;
    const alertWindowEnd = addMinutes(now, 30); 
    return appointments.filter(
      (app) => app.status === 'قادم' && isValid(new Date(app.datetime)) && isWithinInterval(new Date(app.datetime), { start: now, end: alertWindowEnd })
    );
  }, [appointments, currentTime, showUpcomingAlerts]);

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(app => {
        if (!app.datetime || !isValid(new Date(app.datetime))) return false;
        const appointmentDate = new Date(app.datetime);

        if (searchTerm && !app.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        if (filterStatus !== 'الكل' && app.status !== filterStatus) {
          return false;
        }
        if (filterDateRange?.from && isBefore(appointmentDate, startOfDay(filterDateRange.from))) {
          return false;
        }
        if (filterDateRange?.to && isAfter(appointmentDate, endOfDay(filterDateRange.to))) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  }, [appointments, searchTerm, filterStatus, filterDateRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('الكل');
    setFilterDateRange(undefined);
  };

  const upcomingSummary = useMemo(() => {
    const today = new Date();
    const todayStart = startOfDay(today);
    const tomorrowStart = startOfDay(addDays(today, 1));
    const next7DaysStart = todayStart;
    const next7DaysEnd = endOfDay(addDays(today, 6));

    let todayCount = 0;
    let tomorrowCount = 0;
    let next7DaysCount = 0;

    appointments.forEach(app => {
      if (app.status !== 'قادم' || !isValid(new Date(app.datetime))) return;
      const appDate = new Date(app.datetime);

      if (isToday(appDate)) {
        todayCount++;
      }
      if (isTomorrow(appDate)) {
        tomorrowCount++;
      }
      if (isWithinInterval(appDate, { start: next7DaysStart, end: next7DaysEnd })) {
        next7DaysCount++;
      }
    });
    return { todayCount, tomorrowCount, next7DaysCount };
  }, [appointments]);

  return (
    <>
      <AnimatePresence>
        {upcomingAlerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200 dark:border-yellow-600 rounded-md shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center">
              <Bell className="h-6 w-6 me-3 animate-pulse" />
              <div>
                <p className="font-bold">تنبيه موعد قريب!</p>
                <p>{alert.name} - {alert.day} الساعة {isValid(new Date(alert.datetime)) ? format(new Date(alert.datetime), 'hh:mm a', { locale: arSA }) : '--:--'} (بعد {currentTime && isValid(new Date(alert.datetime)) ? differenceInMinutes(new Date(alert.datetime), currentTime) : 'دقائق'} دقيقة)</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Card className="shadow-lg mb-6 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center"><CalendarClock className="me-2 h-6 w-6 text-primary" /> ملخص المواعيد القادمة</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-primary/10 rounded-lg">
            <CalendarDays className="h-8 w-8 text-primary me-3" />
            <div>
              <p className="text-2xl font-bold text-primary">{upcomingSummary.todayCount}</p>
              <p className="text-sm text-muted-foreground">موعد اليوم</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-primary/10 rounded-lg">
            <CalendarPlus className="h-8 w-8 text-primary me-3" />
            <div>
              <p className="text-2xl font-bold text-primary">{upcomingSummary.tomorrowCount}</p>
              <p className="text-sm text-muted-foreground">موعد غدًا</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-primary/10 rounded-lg">
            <CalendarRange className="h-8 w-8 text-primary me-3" />
            <div>
              <p className="text-2xl font-bold text-primary">{upcomingSummary.next7DaysCount}</p>
              <p className="text-sm text-muted-foreground">موعد خلال 7 أيام</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center"><ListFilter className="me-2 h-6 w-6"/> فلترة المواعيد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <Label htmlFor="searchTermInputAppointments">بحث بالاسم</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="searchTermInputAppointments"
                  placeholder="اسم المعترف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-10"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="filterStatusSelectAppointments">الحالة</Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ConfessionStatus | 'الكل')}>
                <SelectTrigger id="filterStatusSelectAppointments">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">الكل</SelectItem>
                  {(['قادم', 'تم', 'لم يحضر', 'ملغى'] as ConfessionStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="filterDateRangePickerAppointments">نطاق التاريخ</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button id="filterDateRangePickerAppointments" variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarDays className="me-2 h-4 w-4" />
                    {filterDateRange?.from ? (
                      filterDateRange.to ? (
                        <>
                          {format(filterDateRange.from, "PPP", { locale: arSA })} - {format(filterDateRange.to, "PPP", { locale: arSA })}
                        </>
                      ) : (
                        format(filterDateRange.from, "PPP", { locale: arSA })
                      )
                    ) : (
                      <span>اختر نطاقًا</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filterDateRange?.from}
                    selected={filterDateRange}
                    onSelect={setFilterDateRange}
                    numberOfMonths={2}
                    locale={arSA}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button onClick={clearFilters} variant="outline" size="sm">
            <ClearFilterIcon className="me-2 h-4 w-4" /> مسح الفلاتر
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
            <CardTitle>جدول مواعيد الاعتراف</CardTitle>
            <CardDescription>قائمة بجميع مواعيد الاعتراف المسجلة.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {appointments.length === 0 ? "لا توجد مواعيد حاليًا." : "لا توجد مواعيد تطابق الفلاتر المطبقة."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم المعترف</TableHead>
                    <TableHead>اليوم والتاريخ</TableHead>
                    <TableHead>الساعة</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>ملاحظات</TableHead>
                    <TableHead className="text-left">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredAppointments.map((appointment) => (
                      <motion.tr
                        key={appointment.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{appointment.name}</TableCell>
                        <TableCell>{isValid(new Date(appointment.datetime)) ? format(new Date(appointment.datetime), "EEEE, PPP", { locale: arSA }) : 'تاريخ غير صالح'}</TableCell>
                        <TableCell>{isValid(new Date(appointment.datetime)) ? format(new Date(appointment.datetime), 'hh:mm a', { locale: arSA }) : '--:--'}</TableCell>
                        <TableCell>{appointment.durationMinutes || 30} د</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center w-fit ${statusStyles[appointment.status]}`}>
                            {statusIcons[appointment.status]}
                            <span className="ms-1">{appointment.status}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={appointment.notes}>{appointment.notes || '-'}</TableCell>
                        <TableCell className="text-left space-x-1 rtl:space-x-reverse">
                          <Button variant="ghost" size="icon" onClick={() => onEdit(appointment)} className="text-blue-500 hover:text-blue-700">
                            <Edit2 className="h-4 w-4" /> <span className="sr-only">تعديل</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDelete(appointment.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" /> <span className="sr-only">حذف</span>
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

    
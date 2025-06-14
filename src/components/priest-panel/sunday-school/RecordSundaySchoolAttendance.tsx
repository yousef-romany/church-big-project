
"use client";
import type { SundaySchoolServant, ServingDay, SundaySchoolAttendance, AttendanceStatus } from '@/types/sunday-school';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CalendarCheck, ListChecks, User, X, Check, Edit2 } from 'lucide-react';
import { DatePickerWithPresets } from '@/components/ui/DatePickerWithPresets';
import { getSundaySchoolServants, recordAttendance, getAttendanceForDay } from '@/lib/sunday-school-store';
import { format, getDay, parseISO } from 'date-fns';
import { arSA } from 'date-fns/locale';

// Map JS day index (0=Sun, 1=Mon, ..., 4=Thu, 5=Fri) to ServingDay
const dayIndexToServingDay: { [key: number]: ServingDay | undefined } = {
  4: 'Thursday', // Thursday
  5: 'Friday',   // Friday
};

const statusOptions: { value: AttendanceStatus; label: string; icon: JSX.Element }[] = [
  { value: 'present', label: 'حاضر', icon: <Check className="h-4 w-4 text-green-500" /> },
  { value: 'absent', label: 'غائب', icon: <X className="h-4 w-4 text-red-500" /> },
  { value: 'excused', label: 'معذور', icon: <Edit2 className="h-4 w-4 text-yellow-500" /> },
];

export default function RecordSundaySchoolAttendance() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [servantsForSelectedDay, setServantsForSelectedDay] = useState<SundaySchoolServant[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: AttendanceStatus; notes?: string }>>({});
  const { toast } = useToast();

  const activeServants = useMemo(() => getSundaySchoolServants().filter(s => s.isActive), []);

  useEffect(() => {
    if (selectedDate) {
      const dayOfWeekJsIndex = getDay(selectedDate); // 0 for Sunday, ..., 6 for Saturday
      const currentServingDay = dayIndexToServingDay[dayOfWeekJsIndex];

      if (currentServingDay) {
        const filtered = activeServants.filter(s => s.servingDays.includes(currentServingDay));
        setServantsForSelectedDay(filtered);

        // Load existing attendance for this date and day
        const existingRecords = getAttendanceForDay(format(selectedDate, 'yyyy-MM-dd'), currentServingDay);
        const initialAttendance: Record<string, { status: AttendanceStatus; notes?: string }> = {};
        existingRecords.forEach(record => {
          initialAttendance[record.servantId] = { status: record.status, notes: record.notes };
        });
        filtered.forEach(servant => {
          if (!initialAttendance[servant.id]) {
             initialAttendance[servant.id] = { status: 'present' }; // Default to present if no record
          }
        });
        setAttendanceData(initialAttendance);

      } else {
        setServantsForSelectedDay([]);
        setAttendanceData({});
      }
    } else {
      setServantsForSelectedDay([]);
      setAttendanceData({});
    }
  }, [selectedDate, activeServants]);

  const handleStatusChange = (servantId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({ ...prev, [servantId]: { ...prev[servantId], status } }));
  };

  const handleNotesChange = (servantId: string, notes: string) => {
    setAttendanceData(prev => ({ ...prev, [servantId]: { ...prev[servantId], notes } }));
  };

  const handleSaveAttendance = () => {
    if (!selectedDate) {
      toast({ title: "خطأ", description: "يرجى اختيار تاريخ أولاً.", variant: "destructive" });
      return;
    }
    const dayOfWeekJsIndex = getDay(selectedDate);
    const currentServingDay = dayIndexToServingDay[dayOfWeekJsIndex];

    if (!currentServingDay) {
      toast({ title: "خطأ", description: "اليوم المختار ليس يوم خميس أو جمعة.", variant: "destructive" });
      return;
    }

    let recordsSaved = 0;
    servantsForSelectedDay.forEach(servant => {
      const servantAttendance = attendanceData[servant.id];
      if (servantAttendance && servantAttendance.status) {
        recordAttendance(
          servant.id,
          format(selectedDate, 'yyyy-MM-dd'),
          currentServingDay,
          servantAttendance.status,
          servantAttendance.notes
        );
        recordsSaved++;
      }
    });

    if (recordsSaved > 0) {
      toast({ title: "تم حفظ الحضور بنجاح!", description: `تم تسجيل/تحديث حضور ${recordsSaved} خدام.` });
    } else {
      toast({ title: "لا تغييرات", description: "لم يتم تحديد أي حالات حضور لحفظها.", variant: "default" });
    }
  };
  
  const currentSelectedServingDay = selectedDate ? dayIndexToServingDay[getDay(selectedDate)] : null;


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><ListChecks className="me-2 h-6 w-6 text-primary"/>تسجيل حضور خدام مدارس الأحد</CardTitle>
        <CardDescription>اختر التاريخ لتسجيل حضور الخدام المجدولين في هذا اليوم.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="attendance-date">اختر تاريخ الخدمة</Label>
          <DatePickerWithPresets
            date={selectedDate}
            setDate={setSelectedDate}
            className="mt-1"
            disabled={(date) => {
                const day = getDay(date);
                return day !== 4 && day !== 5; // Disable if not Thursday (4) or Friday (5)
            }}
          />
           {selectedDate && !currentSelectedServingDay && (
            <p className="text-sm text-red-500 mt-2">اليوم المختار ليس يوم خدمة (خميس أو جمعة).</p>
          )}
        </div>

        {selectedDate && currentSelectedServingDay && (
          <>
            <h3 className="text-lg font-semibold text-center text-primary pt-2">
              تسجيل حضور يوم: {format(selectedDate, "EEEE, d MMMM yyyy", { locale: arSA })}
            </h3>
            {servantsForSelectedDay.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                لا يوجد خدام مجدولون لهذا اليوم ({currentSelectedServingDay === 'Thursday' ? 'الخميس' : 'الجمعة'}).
              </p>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {servantsForSelectedDay.map(servant => (
                  <Card key={servant.id} className="p-4 bg-muted/30">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                      <Label htmlFor={`status-${servant.id}`} className="text-md font-medium flex items-center mb-2 sm:mb-0">
                        <User className="me-2 h-5 w-5"/> {servant.name}
                      </Label>
                      <RadioGroup
                        id={`status-${servant.id}`}
                        defaultValue={attendanceData[servant.id]?.status || "present"}
                        onValueChange={(value) => handleStatusChange(servant.id, value as AttendanceStatus)}
                        className="flex gap-x-3 gap-y-2"
                      >
                        {statusOptions.map(option => (
                          <div key={option.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                            <RadioGroupItem value={option.value} id={`${servant.id}-${option.value}`} />
                            <Label htmlFor={`${servant.id}-${option.value}`} className="flex items-center cursor-pointer">
                              {option.icon} <span className="ms-1">{option.label}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    {attendanceData[servant.id]?.status !== 'present' && (
                        <Input
                        type="text"
                        placeholder="ملاحظات (مثال: سبب الغياب)"
                        value={attendanceData[servant.id]?.notes || ''}
                        onChange={(e) => handleNotesChange(servant.id, e.target.value)}
                        className="mt-2 text-sm"
                        />
                    )}
                  </Card>
                ))}
              </div>
            )}
            {servantsForSelectedDay.length > 0 && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveAttendance} size="lg">
                  <CalendarCheck className="me-2 h-5 w-5"/> حفظ الحضور
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

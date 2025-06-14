
"use client";

import type { SundaySchoolServant, ServingDay, AttendanceStatus } from '@/types/sunday-school';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MapPin, CheckCircle, AlertTriangle, Loader2, CalendarDays, UserCheck } from 'lucide-react';
import { getGeoLocation, calculateDistance, CHURCH_LOCATION, ALLOWED_RADIUS_METERS } from '@/lib/geo-utils';
import { recordAttendance, getAttendanceForDay } from '@/lib/sunday-school-store';
import { format, getDay, isToday } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface SundaySchoolSelfAttendanceCardProps {
  servant: SundaySchoolServant | null;
}

const dayIndexToServingDay: { [key: number]: ServingDay | undefined } = {
  4: 'Thursday', // Thursday
  5: 'Friday',   // Friday
};

export default function SundaySchoolSelfAttendanceCard({ servant }: SundaySchoolSelfAttendanceCardProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [canRecordToday, setCanRecordToday] = useState(false);
  const [alreadyRecordedToday, setAlreadyRecordedToday] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const today = new Date();
  const todayDateString = format(today, 'yyyy-MM-dd');
  const todayServingDay = dayIndexToServingDay[getDay(today)];

  useEffect(() => {
    if (!servant || !todayServingDay) {
      setCanRecordToday(false);
      setStatusMessage("اليوم ليس يوم خدمة لك أو بيانات الخادم غير متوفرة.");
      return;
    }

    if (!servant.servingDays.includes(todayServingDay)) {
      setCanRecordToday(false);
      setStatusMessage(`اليوم (${format(today, "EEEE", { locale: arSA })}) ليس من أيام خدمتك المحددة (${servant.servingDays.map(d => d === 'Thursday' ? 'خميس' : 'جمعة').join(' أو ')}).`);
      return;
    }
    
    setCanRecordToday(true);
    setStatusMessage(null); // Clear previous messages

    // Check if already recorded for today
    const todaysAttendance = getAttendanceForDay(todayDateString, todayServingDay);
    const servantRecord = todaysAttendance.find(att => att.servantId === servant.id && att.status === 'present');
    if (servantRecord) {
      setAlreadyRecordedToday(true);
      setStatusMessage("لقد قمت بتسجيل حضورك بالفعل لهذا اليوم.");
    } else {
      setAlreadyRecordedToday(false);
    }

  }, [servant, todayDateString, todayServingDay, today]);


  const handleSelfRecordAttendance = async () => {
    if (!servant || !todayServingDay || !canRecordToday || alreadyRecordedToday) return;

    setIsProcessing(true);
    setStatusMessage("جاري تحديد موقعك وتسجيل الحضور...");

    try {
      const coords = await getGeoLocation();
      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        CHURCH_LOCATION.latitude,
        CHURCH_LOCATION.longitude
      );

      if (distance <= ALLOWED_RADIUS_METERS) {
        recordAttendance(
          servant.id,
          todayDateString,
          todayServingDay,
          'present',
          `تم التسجيل ذاتيًا (دقة الموقع: ${coords.accuracy?.toFixed(0) || 'غير معروفة'}م، المسافة: ${distance.toFixed(0)}م).`,
          'servant',
          new Date().toISOString(),
          true
        );
        toast({
          title: "تم تسجيل حضورك بنجاح!",
          description: `أنت ضمن نطاق الكنيسة (المسافة: ${distance.toFixed(0)}م).`,
          variant: "default",
        });
        setAlreadyRecordedToday(true);
        setStatusMessage(`تم تسجيل حضورك بنجاح ليوم ${format(today, "EEEE", { locale: arSA })}.`);
      } else {
        // Still record attendance but mark as not geo-verified if preferred,
        // or prevent recording entirely. For now, prevent.
        toast({
          title: "فشل تسجيل الحضور",
          description: `أنت بعيد جدًا عن الكنيسة لتسجيل الحضور (المسافة: ${distance.toFixed(0)}م). يجب أن تكون ضمن نطاق ${ALLOWED_RADIUS_METERS}م.`,
          variant: "destructive",
          duration: 7000,
        });
        setStatusMessage(`أنت خارج النطاق المسموح به (المسافة: ${distance.toFixed(0)}م).`);
      }
    } catch (error) {
      console.error("Geo-attendance error:", error);
      toast({
        title: "خطأ في تحديد الموقع",
        description: (error as Error).message || "لم نتمكن من تحديد موقعك الحالي. يرجى التأكد من تفعيل خدمات الموقع والمحاولة مرة أخرى.",
        variant: "destructive",
      });
      setStatusMessage(`خطأ: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!servant) {
    return (
      <Card className="shadow-md bg-muted/30">
        <CardContent className="pt-6 text-center text-muted-foreground">
          جاري تحميل بيانات الخادم...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
            <UserCheck className="me-2 h-6 w-6 text-primary"/> تسجيل الحضور الذاتي لمدارس الأحد
        </CardTitle>
        <CardDescription>
          اليوم: {format(today, "EEEE, d MMMM yyyy", { locale: arSA })}.
          {servant.servingDays.includes(todayServingDay as ServingDay) ? 
           ` يوم خدمتك هو ${todayServingDay === 'Thursday' ? 'الخميس' : 'الجمعة'}.` : 
           ` اليوم ليس من أيام خدمتك.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        {statusMessage && (
          <p className={`text-sm p-3 rounded-md ${alreadyRecordedToday ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400'}`}>
            {statusMessage}
          </p>
        )}
        
        {canRecordToday && !alreadyRecordedToday && (
          <Button
            onClick={handleSelfRecordAttendance}
            disabled={isProcessing}
            size="lg"
            className="w-full sm:w-auto transition-all duration-300 hover:shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="me-2 h-5 w-5 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <MapPin className="me-2 h-5 w-5" />
                تسجيل حضوري الآن (يتطلب الموقع)
              </>
            )}
          </Button>
        )}

        {canRecordToday && alreadyRecordedToday && (
           <div className="flex items-center justify-center text-green-600 dark:text-green-400 font-medium p-3 rounded-md bg-green-500/10">
             <CheckCircle className="me-2 h-5 w-5" /> تم تسجيل حضورك بنجاح لهذا اليوم.
           </div>
        )}

        {!canRecordToday && !statusMessage && (
             <div className="flex items-center justify-center text-muted-foreground font-medium p-3 rounded-md bg-muted/50">
                <AlertTriangle className="me-2 h-5 w-5" /> لا يمكن تسجيل الحضور الآن.
            </div>
        )}
         <p className="text-xs text-muted-foreground pt-2">
            ملاحظة: يجب أن تكون ضمن نطاق {ALLOWED_RADIUS_METERS} متر من موقع الكنيسة لتتمكن من تسجيل حضورك. تأكد من تفعيل خدمات الموقع في متصفحك.
        </p>
      </CardContent>
    </Card>
  );
}

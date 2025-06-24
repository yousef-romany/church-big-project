"use client";
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingDown, TrendingUp, Users, CalendarCheck, Percent, UserCheck, UserX } from 'lucide-react';
import { getSundaySchoolServants, getSundaySchoolAttendance } from '@/lib/sunday-school-store';
import type { SundaySchoolServant, SundaySchoolAttendance, ServingDay } from '@/types/sunday-school';
import { format, subDays, startOfWeek, endOfWeek, parseISO, isWithinInterval, getDay, eachDayOfInterval } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ServantStat {
  servant: SundaySchoolServant;
  present: number;
  possible: number;
  rate: number;
}

export default function ServantAttendanceReports() {
  const [servants, setServants] = useState<SundaySchoolServant[]>([]);
  const [attendance, setAttendance] = useState<SundaySchoolAttendance[]>([]);

  useEffect(() => {
    setServants(getSundaySchoolServants());
    setAttendance(getSundaySchoolAttendance());
  }, []);

  const stats = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { locale: arSA });
    const weekEnd = endOfWeek(today, { locale: arSA });

    const activeServants = servants.filter(s => s.isActive);

    const weeklyStats: ServantStat[] = activeServants.map(servant => {
      let presentCount = 0;
      let possibleCount = 0;
      
      const serviceDaysThisWeek = eachDayOfInterval({start: weekStart, end: weekEnd})
        .filter(d => {
          const dayIndex = getDay(d);
          const servingDay = dayIndex === 4 ? 'Thursday' : (dayIndex === 5 ? 'Friday' : undefined);
          return servingDay && servant.servingDays.includes(servingDay);
        });

      possibleCount = serviceDaysThisWeek.length;
      
      const attendanceThisWeek = attendance.filter(a => 
        a.servantId === servant.id &&
        isWithinInterval(parseISO(a.date), { start: weekStart, end: weekEnd })
      );
      
      presentCount = attendanceThisWeek.filter(a => a.status === 'present').length;

      return {
        servant,
        present: presentCount,
        possible: possibleCount,
        rate: possibleCount > 0 ? (presentCount / possibleCount) * 100 : 0
      };
    });
    
    const overallWeeklyPresent = weeklyStats.reduce((sum, s) => sum + s.present, 0);
    const overallWeeklyPossible = weeklyStats.reduce((sum, s) => sum + s.possible, 0);
    const overallWeeklyRate = overallWeeklyPossible > 0 ? (overallWeeklyPresent / overallWeeklyPossible) * 100 : 0;
    
    const mostConsistent = [...weeklyStats].sort((a, b) => b.rate - a.rate).slice(0, 5);
    const mostAbsent = [...weeklyStats].filter(s => s.possible > 0).sort((a, b) => a.rate - b.rate).slice(0, 5);

    return {
      totalActiveServants: activeServants.length,
      overallWeeklyRate,
      mostConsistent,
      mostAbsent,
    };
  }, [servants, attendance]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الخدام النشطون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActiveServants}</div>
            <p className="text-xs text-muted-foreground">إجمالي عدد الخدام في الخدمة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الحضور الأسبوعي</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overallWeeklyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">متوسط حضور جميع الخدام هذا الأسبوع</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="me-2 h-5 w-5 text-green-500" />
              الخدام الأكثر مواظبة (هذا الأسبوع)
            </CardTitle>
             <CardDescription>
              الخدام الأعلى نسبة حضور في خدمتهم هذا الأسبوع.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {stats.mostConsistent.map((stat) => (
                <div key={stat.servant.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{stat.servant.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {stat.servant.servingDays.map(d => d === 'Thursday' ? 'خميس' : 'جمعة').join(' و ')}
                    </p>
                  </div>
                  <div className="ms-auto font-medium text-lg text-green-500 flex items-center">
                      {stat.rate.toFixed(0)}%
                      <Badge variant="outline" className="ms-2">{stat.present}/{stat.possible}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
                 <TrendingDown className="me-2 h-5 w-5 text-red-500" />
                 الخدام الأقل حضورًا (للمتابعة)
            </CardTitle>
            <CardDescription>
                الخدام الأقل نسبة حضور هذا الأسبوع.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {stats.mostAbsent.length > 0 ? stats.mostAbsent.map((stat) => (
                <div key={stat.servant.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{stat.servant.name}</p>
                     <p className="text-sm text-muted-foreground">
                        {stat.servant.servingDays.map(d => d === 'Thursday' ? 'خميس' : 'جمعة').join(' و ')}
                    </p>
                  </div>
                   <div className="ms-auto font-medium text-lg text-red-500 flex items-center">
                      {stat.rate.toFixed(0)}%
                       <Badge variant="destructive" className="ms-2">{stat.present}/{stat.possible}</Badge>
                  </div>
                </div>
              )) : (
                 <p className="text-sm text-muted-foreground text-center py-4">لا يوجد خدام متغيبون حاليًا.</p>
              )}
            </div>
          </CardContent>
        </Card>
       </div>
    </div>
  );
}

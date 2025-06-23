
"use client";
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Award, TrendingDown, TrendingUp, Users, CalendarCheck, Percent, Star, UserCheck, UserX } from 'lucide-react';
import {
  getSundaySchoolChildren,
  getSundaySchoolChildrenAttendance,
} from '@/lib/sunday-school-store';
import type { SundaySchoolChild, SundaySchoolChildAttendance, ServingDay } from '@/types/sunday-school';
import { format, subDays, startOfWeek, endOfWeek, parseISO, isWithinInterval, getDay, eachDayOfInterval } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AttendanceStat {
  present: number;
  totalPossible: number;
}

export default function ChildrenAttendanceReports() {
  const [children, setChildren] = useState<SundaySchoolChild[]>([]);
  const [attendance, setAttendance] = useState<SundaySchoolChildAttendance[]>([]);

  useEffect(() => {
    setChildren(getSundaySchoolChildren());
    setAttendance(getSundaySchoolChildrenAttendance());
  }, []);

  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const todayServiceDay = getDay(today) === 4 ? 'Thursday' : (getDay(today) === 5 ? 'Friday' : undefined);

    const weekStart = startOfWeek(today, { locale: arSA });
    const weekEnd = endOfWeek(today, { locale: arSA });

    // Today's stats
    let todayPresent = 0;
    let todayPossible = 0;
    if (todayServiceDay) {
        todayPresent = attendance.filter(a => a.date === todayStr).length;
        todayPossible = children.length; // Simplified: assumes all children can attend
    }
    const todayAttendanceRate = todayPossible > 0 ? (todayPresent / todayPossible) * 100 : 0;
    
    // Weekly stats
    const serviceDaysThisWeek = eachDayOfInterval({start: weekStart, end: weekEnd}).filter(d => getDay(d) === 4 || getDay(d) === 5);
    let weeklyPresent = 0;
    let weeklyPossible = 0;

    serviceDaysThisWeek.forEach(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        weeklyPresent += attendance.filter(a => a.date === dayStr).length;
        weeklyPossible += children.length; // Simplified total
    });
    const weeklyAttendanceRate = weeklyPossible > 0 ? (weeklyPresent / weeklyPossible) * 100 : 0;


    const topStudents = [...children].sort((a, b) => b.points - a.points).slice(0, 5);

    const absentStudents = children.filter(child => {
        const lastTwoServiceDays = serviceDaysThisWeek.slice(-2);
        if (lastTwoServiceDays.length < 2) return false;

        const attendedLast = attendance.some(a => a.childId === child.id && a.date === format(lastTwoServiceDays[1], 'yyyy-MM-dd'));
        const attendedBeforeLast = attendance.some(a => a.childId === child.id && a.date === format(lastTwoServiceDays[0], 'yyyy-MM-dd'));
        
        return !attendedLast && !attendedBeforeLast;
    }).slice(0, 5);
    
    const totalPointsAwarded = children.reduce((sum, child) => sum + child.points, 0);

    return {
      todayAttendanceRate,
      weeklyAttendanceRate,
      topStudents,
      absentStudents,
      totalPointsAwarded,
      todayPresent,
      todayPossible
    };
  }, [children, attendance]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حضور اليوم</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayPresent}/{stats.todayPossible}</div>
            <p className="text-xs text-muted-foreground">بنسبة {stats.todayAttendanceRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حضور الأسبوع</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyAttendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">متوسط الحضور هذا الأسبوع</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأبناء النشطون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{children.length}</div>
            <p className="text-xs text-muted-foreground">إجمالي عدد الأبناء في الخدمة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي النقاط</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPointsAwarded}</div>
            <p className="text-xs text-muted-foreground">مجموع النقاط الممنوحة للأبناء</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="me-2 h-5 w-5 text-green-500" />
              أفضل الأبناء (حسب النقاط)
            </CardTitle>
             <CardDescription>
              قائمة بأكثر الأبناء تفاعلاً وجمعًا للنقاط.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {stats.topStudents.map((child, index) => (
                <div key={child.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child portrait" />
                    <AvatarFallback>{child.name.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <div className="ms-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{child.name}</p>
                    <p className="text-sm text-muted-foreground">آخر حضور: {format(parseISO(child.lastAttendance), 'd MMM', { locale: arSA })}</p>
                  </div>
                  <div className="ms-auto font-medium text-lg text-yellow-500 flex items-center">
                      {child.points} <Star className="h-4 w-4 ms-1"/>
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
                 الأبناء الأكثر غيابًا (للمتابعة)
            </CardTitle>
            <CardDescription>
                قائمة بالأبناء الذين تغيبوا عن آخر يومي خدمة.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {stats.absentStudents.length > 0 ? stats.absentStudents.map((child) => (
                <div key={child.id} className="flex items-center">
                  <Avatar className="h-9 w-9 opacity-70">
                    <AvatarImage src={child.avatarUrl} alt={child.name} />
                    <AvatarFallback>{child.name.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <div className="ms-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{child.name}</p>
                    <p className="text-sm text-muted-foreground">آخر حضور: {format(parseISO(child.lastAttendance), 'd MMM yyyy', { locale: arSA })}</p>
                  </div>
                </div>
              )) : (
                 <p className="text-sm text-muted-foreground text-center py-4">لا يوجد أبناء متغيبون بشكل متكرر حاليًا.</p>
              )}
            </div>
          </CardContent>
        </Card>
       </div>

       <Card>
        <CardHeader>
          <CardTitle>السجل التفصيلي لحضور الأبناء</CardTitle>
          <CardDescription>عرض كامل لجميع سجلات الحضور.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>يوم الخدمة</TableHead>
                    <TableHead>المسجل</TableHead>
                    <TableHead>النقاط</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendance.map(att => {
                         const child = children.find(c => c.id === att.childId);
                         return (
                            <TableRow key={att.id}>
                                <TableCell className="font-medium">{child?.name || 'ابن محذوف'}</TableCell>
                                <TableCell>{format(parseISO(att.date), 'd MMM yyyy', { locale: arSA })}</TableCell>
                                <TableCell>{att.serviceDay === 'Thursday' ? 'الخميس' : 'الجمعة'}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                        {att.recordedByPriest ? <UserCheck className="me-1 h-3 w-3 text-blue-500" /> : <UserX className="me-1 h-3 w-3 text-purple-500" />}
                                        {att.recordedByPriest ? 'الكاهن' : 'الخادم'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-green-600 font-medium">+{att.pointsAwarded}</TableCell>
                            </TableRow>
                         )
                    })}
                </TableBody>
                </Table>
            </div>
        </CardContent>
       </Card>
    </div>
  );
}

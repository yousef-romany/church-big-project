
"use client";
import type { SundaySchoolAttendance, AttendanceStatus, SundaySchoolServant } from '@/types/sunday-school';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Check, X, Edit2 as ExcusedIcon, CalendarDays, User } from 'lucide-react';
import { getAttendanceForServant, getSundaySchoolServants } from '@/lib/sunday-school-store';
import { format, parseISO } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface MySundaySchoolAttendanceTableProps {
  servantId: string;
}

const statusDisplay: Record<AttendanceStatus, { label: string; icon: JSX.Element; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  present: { label: 'حاضر', icon: <Check className="h-4 w-4 me-1" />, badgeVariant: 'default' }, // Greenish
  absent: { label: 'غائب', icon: <X className="h-4 w-4 me-1" />, badgeVariant: 'destructive' }, // Reddish
  excused: { label: 'معذور', icon: <ExcusedIcon className="h-4 w-4 me-1" />, badgeVariant: 'secondary' }, // Yellowish/Grayish
};


export default function MySundaySchoolAttendanceTable({ servantId }: MySundaySchoolAttendanceTableProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<SundaySchoolAttendance[]>([]);
  const [servantInfo, setServantInfo] = useState<SundaySchoolServant | null>(null);

  useEffect(() => {
    setAttendanceRecords(getAttendanceForServant(servantId));
    const allServants = getSundaySchoolServants();
    const currentServant = allServants.find(s => s.id === servantId);
    setServantInfo(currentServant || null);
  }, [servantId]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
            <CalendarDays className="me-2 h-6 w-6 text-primary" />
            سجل الحضور لـ: {servantInfo?.name || 'الخادم'}
        </CardTitle>
        <CardDescription>
            هنا يمكنك مراجعة تاريخ حضورك في خدمة مدارس الأحد.
            {servantInfo && <p className="text-xs mt-1">أيام خدمتك المسجلة: {servantInfo.servingDays.map(d => d === 'Thursday' ? 'الخميس' : 'الجمعة').join(' و ')}</p>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {attendanceRecords.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            لا توجد سجلات حضور مسجلة لك حتى الآن.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>تاريخ الخدمة</TableHead>
                  <TableHead>يوم الخدمة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>ملاحظات الكاهن</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(parseISO(record.date), 'EEEE, d MMMM yyyy', { locale: arSA })}</TableCell>
                    <TableCell>{record.serviceDay === 'Thursday' ? 'الخميس' : 'الجمعة'}</TableCell>
                    <TableCell>
                      <Badge variant={statusDisplay[record.status].badgeVariant} className="text-xs">
                        {statusDisplay[record.status].icon}
                        {statusDisplay[record.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{record.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Star, Award, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface PointsEntry {
  id: string;
  reason: string;
  points: number;
  date: Date;
}

interface UserPoints {
  name: string;
  totalPoints: number;
  level: string;
  pointsToNextLevel: number;
  history: PointsEntry[];
}

const mockUserPoints: UserPoints = {
  name: "الابن/الابنة: بيتر جورج",
  totalPoints: 125,
  level: "مواظب",
  pointsToNextLevel: 75,
  history: [
    { id: 'p1', reason: 'حضور مدارس الأحد', points: 10, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
    { id: 'p2', reason: 'المشاركة في مسابقة الألحان', points: 25, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
    { id: 'p3', reason: 'حضور القداس', points: 5, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
    { id: 'p4', reason: 'حفظ آية الأسبوع', points: 15, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8) },
    { id: 'p5', reason: 'المساعدة في يوم الخدمة', points: 50, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) },
    { id: 'p6', reason: 'حضور مدارس الأحد', points: 10, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
    { id: 'p7', reason: 'حضور القداس', points: 10, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
  ]
};

interface MyPointsDisplayProps {
  isParentView?: boolean;
}

export default function MyPointsDisplay({ isParentView = false }: MyPointsDisplayProps) {
  const [pointsData] = useState<UserPoints>(mockUserPoints);
  const [progressValue, setProgressValue] = useState(0);

  const pointsForNextLevel = pointsData.totalPoints + pointsData.pointsToNextLevel;
  const currentProgressPercentage = (pointsData.totalPoints / pointsForNextLevel) * 100;

  useEffect(() => {
    // Animate the progress bar on mount
    const timer = setTimeout(() => setProgressValue(currentProgressPercentage), 300);
    return () => clearTimeout(timer);
  }, [currentProgressPercentage]);

  return (
    <div className="space-y-6">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center text-primary">
            <Trophy className="me-3 h-8 w-8 text-yellow-500" />
            {isParentView ? `متابعة نقاط: ${pointsData.name}` : 'ملخص نقاطي'}
          </CardTitle>
           {!isParentView && <CardDescription>تابع تقدمك واعرف كيف يمكنك كسب المزيد من النقاط!</CardDescription>}
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
            className="flex flex-col items-center justify-center p-4 bg-yellow-400/20 rounded-lg text-yellow-700 dark:text-yellow-300"
          >
            <Star className="h-12 w-12" />
            <span className="text-4xl font-bold mt-2">{pointsData.totalPoints}</span>
            <span className="text-sm font-semibold">نقطة</span>
          </motion.div>
          <div className="md:col-span-2 space-y-3">
             <div className="flex justify-between items-baseline text-sm">
                <span className="font-semibold text-primary flex items-center">
                    <Award className="me-2 h-5 w-5"/> 
                    المستوى الحالي: {pointsData.level}
                </span>
                <span className="text-muted-foreground">
                    الهدف: {pointsForNextLevel} نقطة
                </span>
             </div>
            <Progress value={progressValue} className="h-3" />
            <p className="text-xs text-center text-muted-foreground">
              باقي لك {pointsData.pointsToNextLevel} نقطة للوصول إلى المستوى التالي!
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><CalendarCheck className="me-2 h-5 w-5" /> سجل النقاط</CardTitle>
          <CardDescription>تفاصيل النقاط التي حصلت عليها مؤخرًا.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>السبب</TableHead>
                  <TableHead className="text-center">النقاط</TableHead>
                  <TableHead className="text-left">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointsData.history.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.reason}</TableCell>
                    <TableCell className="text-center font-bold text-green-600">+{entry.points}</TableCell>
                    <TableCell className="text-left text-muted-foreground text-xs">{format(entry.date, 'd MMMM yyyy', { locale: arSA })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

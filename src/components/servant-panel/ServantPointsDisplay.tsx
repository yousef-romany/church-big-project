
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Star, Award, Shield, Medal, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import type { ServantPointsData } from '@/types/servant-panel';

const mockVisitationServantPoints: ServantPointsData = {
    totalPoints: 250,
    level: "خادم مثابر",
    pointsToNextLevel: 150,
    history: [
        { id: 'vp1', reason: 'إتمام زيارة افتقاد (أسرة عاجلة)', points: 25, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
        { id: 'vp2', reason: 'إتمام زيارة افتقاد', points: 15, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
        { id: 'vp3', reason: 'تقديم تقرير مفصل عن زيارة', points: 10, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
        { id: 'vp4', reason: 'مواظبة على الخدمة (شهري)', points: 50, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) },
        { id: 'vp5', reason: 'إتمام 5 زيارات في أسبوع', points: 100, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12) },
        { id: 'vp6', reason: 'إتمام زيارة افتقاد', points: 15, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
    ],
    badges: [
        { name: "خادم الشهر", icon: Medal, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) },
        { name: "ملاك الافتقاد", icon: Shield, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12) },
    ]
};
const mockSundaySchoolServantPoints: ServantPointsData = {
    totalPoints: 180,
    level: "خادم منتظم",
    pointsToNextLevel: 120,
    history: [
        { id: 'ssp1', reason: 'حضور خدمة مدارس الأحد', points: 10, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
        { id: 'ssp2', reason: 'تحضير درس مبتكر', points: 20, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) },
        { id: 'ssp3', reason: 'حضور خدمة مدارس الأحد', points: 10, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) },
        { id: 'ssp4', reason: 'مكافأة مواظبة شهرية', points: 50, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11) },
        { id: 'ssp5', reason: 'مساعدة خادم آخر في فصله', points: 15, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11) },
    ],
     badges: [
        { name: "نجم المواظبة", icon: Star, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11) },
    ]
};

interface ServantPointsDisplayProps {
  servantType: 'visitation' | 'sunday-school';
}

export default function ServantPointsDisplay({ servantType }: ServantPointsDisplayProps) {
  const [pointsData] = useState<ServantPointsData>(
      servantType === 'visitation' ? mockVisitationServantPoints : mockSundaySchoolServantPoints
  );
  const [progressValue, setProgressValue] = useState(0);

  const pointsForNextLevel = pointsData.totalPoints + pointsData.pointsToNextLevel;
  const currentProgressPercentage = (pointsData.totalPoints / pointsForNextLevel) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(currentProgressPercentage), 300);
    return () => clearTimeout(timer);
  }, [currentProgressPercentage]);

  return (
    <div className="space-y-6">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="flex items-center text-primary">
            <Trophy className="me-3 h-8 w-8 text-yellow-500" />
            ملخص نقاط الخدمة
          </CardTitle>
           <CardDescription>نقاطك هي تقدير لجهودك ومواظبتك في الخدمة. استمر في العطاء!</CardDescription>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center"><Briefcase className="me-2 h-5 w-5" /> سجل النقاط المكتسبة</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="overflow-y-auto max-h-72">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>السبب</TableHead>
                    <TableHead className="text-center">النقاط</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pointsData.history.map(entry => (
                    <TableRow key={entry.id}>
                        <TableCell>
                            <p className="font-medium">{entry.reason}</p>
                            <p className="text-xs text-muted-foreground">{format(entry.date, 'd MMM yyyy', { locale: arSA })}</p>
                        </TableCell>
                        <TableCell className="text-center font-bold text-green-600">+{entry.points}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center"><Medal className="me-2 h-5 w-5" /> الأوسمة المكتسبة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
            {pointsData.badges.map(badge => (
                <div key={badge.name} className="flex items-center p-3 bg-muted/50 rounded-md">
                    <badge.icon className="h-8 w-8 text-primary me-4"/>
                    <div>
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">مُنح في: {format(badge.date, 'd MMMM yyyy', { locale: arSA })}</p>
                    </div>
                </div>
            ))}
            {pointsData.badges.length === 0 && (
                <p className="text-center text-muted-foreground py-4">لم تحصل على أوسمة بعد. استمر في الخدمة!</p>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

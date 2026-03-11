"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, BookOpen, CheckCircle, Clock, TrendingUp, ChevronRight, Plus, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SundaySchoolClass {
  id: string;
  name: string;
  grade: string;
  servantId: string;
  servantName: string;
  description?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AttendanceRecord {
  id: string;
  childName: string;
  grade: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'EXCUSED';
  pointsEarned: number;
}

export default function SundaySchoolDashboard() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<SundaySchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<SundaySchoolClass | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classes' | 'attendance' | 'analytics'>('classes');

  useEffect(() => {
    fetchClasses();
    fetchAttendance();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sunday-school/classes');
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الفصول',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch('/api/sunday-school/attendance');
      const data = await response.json();
      setAttendance(data.attendances || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الحضور',
        variant: 'destructive',
      });
    }
  };

  const handleRecordAttendance = async (classId: string) => {
    try {
      const response = await fetch('/api/sunday-school/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId }),
      });

      if (response.ok) {
        toast({
          title: 'تم الحضور',
          description: 'تم تسجيل الحضور بنجاح',
        });
        fetchAttendance();
      }
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تسجيل الحضور',
        variant: 'destructive',
      });
    }
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[dayOfWeek - 1] || '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>مدارس الأحد</span>
            </CardTitle>
            <Button onClick={() => {}} variant="outline" size="sm">
              <Settings className="h-4 w-4" />
              الإعدادات
            </Button>
          </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v as 'classes' | 'attendance' | 'analytics')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="classes">الفصولي</TabsTrigger>
                <TabsTrigger value="attendance">الحضور</TabsTrigger>
                <TabsTrigger value="analytics">الإحصائيات</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <Card>
              <CardContent>
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              </CardContent>
            </Card>
          ) : classes.length === 0 ? (
            <Card>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  لا توجد فصول حالياً
                </div>
              </CardContent>
          ) : (
            <>
              {classes.map((cls, index) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">
                          {cls.name}
                        </CardTitle>
                        <Badge className="ml-2">
                          {cls.grade}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{getDayName(cls.dayOfWeek)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{cls.startTime} - {cls.endTime}</span>
                        </div>
                        {cls.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Settings className="h-4 w-4" />
                            <span>{cls.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {cls.description || 'لا يوجد وصف للفصل'}
                      </div>
                      <div>
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{cls.servantName}</span>
                      </div>
                      <div className="flex justify-end pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRecordAttendance(cls.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          تسجيل الحضور
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedClass(cls)}
                        >
                          تفاصيل الفصل
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === 'attendance' && (
        <Card>
          <CardHeader>
            <CardTitle>
              <BookOpen className="h-5 w-5" inline-block ml-2" />
              سجل الحضور
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : attendance.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                لا توجد سجلات حضور
              </div>
            ) : (
              <div className="space-y-4">
                {attendance.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div>
                        <p className="font-medium">{record.childName}</p>
                        <p className="text-sm text-muted-foreground">{record.grade}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {record.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-green-600 font-medium">+{record.pointsEarned} نقطة</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={
                        record.status === 'PRESENT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }>
                        {record.status === 'PRESENT' ? 'حاضر' : 'غائب'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {}}
                      >
                        ملاحظات
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>نسبة الحضور الشهري</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-4xl font-bold text-primary mb-2">85%</div>
                <p className="text-muted-foreground">معدل الحضور الكلي</p>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>إحضور الشهر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">هذا الشهر</span>
                  <span className="text-2xl font-bold">42</span>
                </div>
                <span className="text-sm text-muted-foreground">من 50 طالب</span>
              </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">الشهر الماضي</span>
                  <span className="text-2xl font-bold">38</span>
                </div>
                  <span className="text-sm text-green-600">+10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">عدد الحضور</span>
                  <span className="text-2xl font-bold">180</span>
                </div>
                <span className="text-sm text-green-600">من 240 طالب</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>أكثر الحضور</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-4xl font-bold text-primary mb-2">سارة</div>
                <p className="text-muted-foreground">مثل: أحمد</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Class Details Modal */}
      {selectedClass && (
        <Dialog open={!!selectedClass} onOpenChange={(open) => !open ? setSelectedClass(null) : null}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تفاصيل الفصل</DialogTitle>
              <DialogDescription>
                معلومات تفاصيلية عن الفصل
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">اسم الفصل</label>
                  <div className="text-lg font-semibold">{selectedClass.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">الصف</label>
                  <div className="text-lg font-semibold">{selectedClass.grade}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">اليوم</label>
                  <div className="text-lg font-semibold">{getDayName(selectedClass.dayOfWeek)}</div>
                </div>
                <div className="text-lg font-semibold">{selectedClass.startTime} - {selectedClass.endTime}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">المكان</label>
                  <span className="text-lg font-semibold">{selectedClass.servantName}</span>
                </div>
                {selectedClass.location && (
                  <div>
                    <label className="text-sm font-medium">المكان</label>
                    <span className="text-lg font-semibold">{selectedClass.location}</span>
                  </div>
                )}
              </div>
            </div>
              {selectedClass.description && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium">الوصف</label>
                    <span className="text-sm text-muted-foreground">
                      {selectedClass.description || 'لا يوجد وصف'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-6">
              <Button onClick={() => setSelectedClass(null)} variant="outline">
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      )}
    </div>
  );
}

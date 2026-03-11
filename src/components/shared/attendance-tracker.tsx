"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  checkInTime: string;
  checkOutTime: string | null;
  location: string | null;
  pointsAwarded: number;
}

interface AttendanceStats {
  totalAttendances: number;
  thisMonthAttendances: number;
  thisWeekAttendances: number;
  averagePointsPerAttendance: number;
  totalPointsEarned: number;
  streak: number;
}

export default function AttendanceTracker() {
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [historyRes, statsRes] = await Promise.all([
        fetch('/api/attendance/history'),
        fetch('/api/attendance/statistics'),
      ]);

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData.attendances || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          متابعة الحضور
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
            <TabsTrigger value="history">السجل</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardContent className="p-4">
                      <Users className="h-8 w-8 mb-2" />
                      <div className="text-3xl font-bold">{stats.totalAttendances}</div>
                      <div className="text-sm opacity-90">إجمالي الحضور</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                    <CardContent className="p-4">
                      <Calendar className="h-8 w-8 mb-2" />
                      <div className="text-3xl font-bold">{stats.thisMonthAttendances}</div>
                      <div className="text-sm opacity-90">هذا الشهر</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardContent className="p-4">
                      <TrendingUp className="h-8 w-8 mb-2" />
                      <div className="text-3xl font-bold">{stats.totalPointsEarned}</div>
                      <div className="text-sm opacity-90">نقاط مكتسبة</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                    <CardContent className="p-4">
                      <Clock className="h-8 w-8 mb-2" />
                      <div className="text-3xl font-bold">{stats.streak}</div>
                      <div className="text-sm opacity-90">أيام متتالية</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
                    <CardContent className="p-4">
                      <TrendingUp className="h-8 w-8 mb-2" />
                      <div className="text-3xl font-bold">{stats.averagePointsPerAttendance}</div>
                      <div className="text-sm opacity-90">متوسط النقاط</div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0">
                    <CardContent className="p-4">
                      <Users className="h-8 w-8 mb-2" />
                      <div className="text-3xl font-bold">{stats.thisWeekAttendances}</div>
                      <div className="text-sm opacity-90">هذا الأسبوع</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-[400px]">
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد سجلات حضور
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{record.userName}</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>تسجيل الدخول: {formatDate(record.checkInTime)}</span>
                            </div>
                            {record.checkOutTime && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>تسجيل الخروج: {formatDate(record.checkOutTime)}</span>
                              </div>
                            )}
                            {record.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{record.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-green-600">
                          +{record.pointsAwarded} نقطة
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

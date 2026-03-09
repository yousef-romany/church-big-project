"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar, 
  Church, 
  TrendingUp,
  UserCheck,
  FileText,
  AlertCircle,
  CheckCircle,
  BarChart3,
  DollarSign,
  Activity,
  Eye,
  Download
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';

// Mock data for demonstration - replace with actual API calls
const statsData = {
  totalUsers: 1248,
  activePriests: 12,
  totalFamilies: 342,
  upcomingEvents: 8,
  monthlyGrowth: 15.3
};

const recentActivities = [
  { id: 1, action: 'تم إضافة مستخدم جديد', user: 'أحمد محمد', time: 'منذ 10 دقائق', status: 'success' },
  { id: 2, action: 'تم تحديث معلومات الكنيسة', user: 'مدير النظام', time: 'منذ ساعة', status: 'success' },
  { id: 3, action: 'محاولة تسجيل دخول فاشلة', user: 'مستخدم غير معروف', time: 'منذ 3 ساعات', status: 'error' },
  { id: 4, action: 'تم إنشاء فعالية جديدة', user: 'الخادم يوسف', time: 'منذ 5 ساعات', status: 'success' },
  { id: 5, action: 'تم حذف حساب مستخدم', user: 'مدير النظام', time: 'منذ يوم', status: 'warning' }
];

const systemAlerts = [
  { id: 1, message: 'تجديد اشتراك النظام قريباً', level: 'warning', action: 'تجديد الآن' },
  { id: 2, message: 'نسخ احتياطية للبيانات مطلوبة', level: 'info', action: 'تنفيذ الآن' },
  { id: 3, message: 'تحديث أمني متاح', level: 'info', action: 'تحديث' }
];

// Mock data for charts
const attendanceData = [
  { month: 'يناير', services: 450, sundaySchool: 320, youth: 180, total: 950 },
  { month: 'فبراير', services: 480, sundaySchool: 340, youth: 200, total: 1020 },
  { month: 'مارس', services: 490, sundaySchool: 350, youth: 210, total: 1050 },
  { month: 'أبريل', services: 520, sundaySchool: 360, youth: 220, total: 1100 },
  { month: 'مايو', services: 510, sundaySchool: 355, youth: 215, total: 1080 },
  { month: 'يونيو', services: 500, sundaySchool: 345, youth: 205, total: 1050 }
];

const donationsData = [
  { month: 'يناير', amount: 125000 },
  { month: 'فبراير', amount: 135000 },
  { month: 'مارس', amount: 145000 },
  { month: 'أبريل', amount: 160000 },
  { month: 'مايو', amount: 155000 },
  { month: 'يونيو', amount: 170000 }
];

const userGrowthData = [
  { month: 'يناير', count: 1050 },
  { month: 'فبراير', count: 1105 },
  { month: 'مارس', count: 1165 },
  { month: 'أبريل', count: 1235 },
  { month: 'مايو', count: 1300 },
  { month: 'يونيو', count: 1370 }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(statsData);

  useEffect(() => {
    // Fetch actual stats from API
    const fetchStats = async () => {
      try {
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        // setStats(data);
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل تحميل الإحصائيات',
          variant: 'destructive',
        });
      }
    };

    fetchStats();
  }, []);

  const handleAction = (action: string) => {
    toast({
      title: 'الإجراء',
      description: `تم النقر على: ${action}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">مرحباً، {session?.user?.name}</h1>
        <p className="text-blue-100">هذه هي لوحة تحكم الإدارة. لديك حقول الوصول الكامل للنظام.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString('ar-EG')}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                +{stats.monthlyGrowth}% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الكهنة النشطون</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePriests}</div>
              <p className="text-xs text-muted-foreground">جميعهم في الخدمة</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العائلات</CardTitle>
              <Church className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFamilies}</div>
              <p className="text-xs text-muted-foreground">5 عائلات جديدة هذا الأسبوع</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الفعاليات القادمة</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">3 فعاليات هذا الأسبوع</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نمو الشهر</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">أعلى من المتوسط</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Data Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="ml-2 h-5 w-5" />
                إحصائيات الحضور الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">505</div>
                    <div className="text-sm text-muted-foreground">متوسط حضور الخدمات</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">345</div>
                    <div className="text-sm text-muted-foreground">متوسط حضور مدارس الأحد</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">205</div>
                    <div className="text-sm text-muted-foreground">متوسط حضور الشباب</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">الحضور الإجمالي الشهري</h4>
                  {attendanceData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-16 text-sm font-medium">{item.month}</div>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-6 mr-2">
                          <div 
                            className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2" 
                            style={{ width: `${(item.total / Math.max(...attendanceData.map(d => d.total))) * 100}%` }}
                          >
                            <span className="text-xs text-white font-medium">{item.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Donations Chart */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="ml-2 h-5 w-5" />
                التبرعات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donationsData.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.month}</span>
                      <span>{item.amount.toLocaleString('ar-EG')} جنيه</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(item.amount / Math.max(...donationsData.map(d => d.amount))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">إجمالي التبرعات</span>
                    <span className="font-bold text-green-600">
                      {donationsData.reduce((sum, item) => sum + item.amount, 0).toLocaleString('ar-EG')} جنيه
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2"
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="ml-2 h-5 w-5" />
                الأنشطة الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100' :
                        activity.status === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                      }`}>
                        {activity.status === 'success' ? 
                          <CheckCircle className="h-4 w-4 text-green-600" /> :
                          activity.status === 'error' ? 
                          <AlertCircle className="h-4 w-4 text-red-600" /> :
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">بواسطة {activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Alerts */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="ml-2 h-5 w-5" />
                تنبيهات النظام
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-3">
                    <p className="text-sm">{alert.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={
                        alert.level === 'warning' ? 'destructive' :
                        alert.level === 'error' ? 'destructive' : 'default'
                      }>
                        {alert.level === 'warning' ? 'تحذير' :
                         alert.level === 'error' ? 'خطأ' : 'معلومة'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction(alert.action)}
                      >
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

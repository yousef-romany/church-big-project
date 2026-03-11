"use client";

import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, Activity, AlertCircle, CheckCircle, FileText, Settings, RefreshCw, UserCheck, DollarSign, BarChart3, Download, Eye, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon: Icon, color, trend }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className={`text-3xl font-bold`} style={{ color }}>
              {typeof value === 'number' ? value.toLocaleString('ar-EG') : value}
            </div>
          </div>
          <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}20` }}>
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
        </div>
        {trend && (
          <div className={`flex items-center text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? (
              <>
                <TrendingUp className="h-4 w-4 ml-1" />
                <span>+{trend.value}%</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 ml-1 rotate-180" />
                <span>-{trend.value}%</span>
              </>
            )}
            <span className="text-muted-foreground mr-2">من الشهر الماضي</span>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1248,
    activePriests: 12,
    totalFamilies: 342,
    upcomingEvents: 8,
    monthlyGrowth: 15.3,
    totalNotifications: 45,
    pendingApprovals: 23,
    systemHealth: 'good',
    recentActivities: [
      { id: 1, action: 'تم إضافة مستخدم جديد', user: 'أحمد محمد', time: 'منذ 10 دقائق', status: 'success' },
      { id: 2, action: 'تم تحديث معلومات الكنيسة', user: 'مدير النظام', time: 'منذ ساعة', status: 'success' },
      { id: 3, action: 'محاولة تسجيل دخول فاشلة', user: 'مستخدم غير معروف', time: 'منذ 3 ساعات', status: 'error' },
      { id: 4, action: 'تم إنشاء فعالية جديدة', user: 'الخادم يوسف', time: 'منذ 5 ساعات', status: 'success' },
      { id: 5, action: 'تمتغيير إعدادات النظام', user: 'مدير النظام', time: 'منذ يوم', status: 'warning' },
      { id: 6, action: 'تمتسجيل 12 طلب مقابلة', user: 'نظام تلقائي', time: 'منذ يومين', status: 'success' },
    ],
  });

  const refreshStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">مرحباً بالأب الفاضل!</h1>
        <p className="text-blue-100">لديك حقول الوصول الكامل للنظام</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.totalUsers}
          icon={<Users />}
          color="#3b82f6"
          trend={{ value: stats.monthlyGrowth, isPositive: true }}
        />
        <StatCard
          title="الكهنة النشطون"
          value={stats.activePriests}
          icon={<UserCheck />}
          color="#22c55e"
        />
        <StatCard
          title="العائلات"
          value={stats.totalFamilies}
          icon={<Activity />}
          color="#10b981"
        />
        <StatCard
          title="الفعاليات القادمة"
          value={stats.upcomingEvents}
          icon={<Calendar />}
          color="#f59e0b"
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">إدارة المستخدمين</h3>
                <p className="text-sm text-muted-foreground">إدارة جميع حسابات المستخدمين</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-green-100">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">العائلات</h3>
                <p className="text-sm text-muted-foreground">قاعدة بيانات العائلات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">الفعاليات</h3>
                <p className="text-sm text-muted-foreground">إنشاء وإدارة الفعاليات</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white">
                  {stats.pendingApprovals}
                </Badge>
                <span>طلبات معلقة</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              مراجعة الطلبات
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span>تنبيهات النظام</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center gap-2 mb-2 ${stats.systemHealth === 'good' ? 'text-green-600' : 'text-red-600'}`}>
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {stats.systemHealth === 'good' ? 'النظام يعمل بشكل طبيعي' : 'مشكلة في النظام'}
              </span>
            </div>
            <Button onClick={refreshStats} variant="outline" size="sm" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              تحديث
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>الأنشطة الأخيرة</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              تصدير
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'error' ? 'bg-red-100' :
                    'bg-amber-100'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : activity.status === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <div className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
                <Badge variant={activity.status === 'success' ? 'default' : activity.status === 'error' ? 'destructive' : 'outline'}>
                  {activity.status === 'success' ? 'نجح' : activity.status === 'error' ? 'فشل' : 'تحذير'}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

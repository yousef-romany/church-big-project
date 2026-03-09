"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Filter,
  Calendar,
  Users,
  FileText,
  Eye,
  Settings,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  UserCheck,
  Clock
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - replace with actual API calls
const attendanceData = [
  { month: 'يناير', services: 450, sundaySchool: 320, youth: 180, total: 950 },
  { month: 'فبراير', services: 480, sundaySchool: 340, youth: 200, total: 1020 },
  { month: 'مارس', services: 490, sundaySchool: 350, youth: 210, total: 1050 },
  { month: 'أبريل', services: 520, sundaySchool: 360, youth: 220, total: 1100 },
  { month: 'مايو', services: 510, sundaySchool: 355, youth: 215, total: 1080 },
  { month: 'يونيو', services: 500, sundaySchool: 345, youth: 205, total: 1050 }
];

const userGrowthData = [
  { month: 'يناير', newUsers: 45, activeUsers: 890, growthRate: 2.1 },
  { month: 'فبراير', newUsers: 52, activeUsers: 942, growthRate: 2.4 },
  { month: 'مارس', newUsers: 48, activeUsers: 990, growthRate: 2.0 },
  { month: 'أبريل', newUsers: 63, activeUsers: 1053, growthRate: 2.8 },
  { month: 'مايو', newUsers: 58, activeUsers: 1111, growthRate: 2.5 },
  { month: 'يونيو', newUsers: 61, activeUsers: 1172, growthRate: 2.6 }
];

const donationsData = [
  { month: 'يناير', amount: 125000, donors: 320 },
  { month: 'فبراير', amount: 135000, donors: 335 },
  { month: 'مارس', amount: 145000, donors: 350 },
  { month: 'أبريل', amount: 160000, donors: 365 },
  { month: 'مايو', amount: 155000, donors: 360 },
  { month: 'يونيو', amount: 170000, donors: 375 }
];

const eventParticipationData = [
  { eventName: 'قداس عيد القيامة', participants: 450, capacity: 500, percentage: 90 },
  { eventName: 'محاضرة تاريخ الكنيسة', participants: 85, capacity: 120, percentage: 70 },
  { eventName: 'رحلة دير السريان', participants: 58, capacity: 60, percentage: 96 },
  { eventName: 'يوم خدمة مجتمعي', participants: 45, capacity: 50, percentage: 90 },
  { eventName: 'برنامج الصيف للأطفال', participants: 120, capacity: 150, percentage: 80 }
];

const userActivityData = [
  { userRole: 'الكهنة', activeUsers: 12, totalUsers: 12, percentage: 100 },
  { userRole: 'الخدام', activeUsers: 45, totalUsers: 50, percentage: 90 },
  { userRole: 'أولياء الأمور', activeUsers: 280, totalUsers: 350, percentage: 80 },
  { userRole: 'الأطفال', activeUsers: 180, totalUsers: 250, percentage: 72 },
  { userRole: 'الشباب', activeUsers: 95, totalUsers: 120, percentage: 79 }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut"
    }
  }
};

export default function ReportsAnalytics() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('6months');
  const [reportType, setReportType] = useState('overview');
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportReport = (type: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: 'تم التصدير',
        description: `تم تصدير تقرير ${type} بنجاح.`,
      });
    }, 1500);
  };

  const handleRefreshData = () => {
    toast({
      title: 'تحديث البيانات',
      description: 'جاري تحديث البيانات...',
    });
  };

  const renderSimpleBarChart = (data: any[], dataKey: string, label: string) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm font-medium">{item.month}</div>
            <div className="flex-1 flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-6 mr-2">
                <div 
                  className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2" 
                  style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">{item[dataKey]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderHorizontalBarChart = (data: any[], dataKey: string, labelKey: string) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item[labelKey]}</span>
              <span>{item[dataKey]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">التقارير والتحليلات</h1>
        <p className="text-blue-100">عرض وتحليل بيانات نظام إدارة الكنيسة وتصدير التقارير المفصلة.</p>
      </motion.div>

      {/* Controls */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row gap-4"
      >
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="اختر الفترة الزمنية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">الشهر الماضي</SelectItem>
            <SelectItem value="3months">آخر 3 أشهر</SelectItem>
            <SelectItem value="6months">آخر 6 أشهر</SelectItem>
            <SelectItem value="1year">السنة الماضية</SelectItem>
            <SelectItem value="all">كل الوقت</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="اختر نوع التقرير" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">نظرة عامة</SelectItem>
            <SelectItem value="attendance">الحضور</SelectItem>
            <SelectItem value="users">المستخدمون</SelectItem>
            <SelectItem value="donations">التبرعات</SelectItem>
            <SelectItem value="events">الفعاليات</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          onClick={handleRefreshData}
          disabled={isGenerating}
          className="flex items-center"
        >
          <RefreshCw className={`ml-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          تحديث البيانات
        </Button>
        
        <Button 
          onClick={() => handleExportReport(reportType)}
          disabled={isGenerating}
          className="flex items-center"
        >
          <Download className="ml-2 h-4 w-4" />
          {isGenerating ? 'جاري التصدير...' : 'تصدير التقرير'}
        </Button>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 ml-1 text-green-500" />
              <span className="text-green-500">+12%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الحضور الأسبوعي</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,050</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 ml-1 text-green-500" />
              <span className="text-green-500">+5%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التبرعات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">890,000</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 ml-1 text-green-500" />
              <span className="text-green-500">+18%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النشاط</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowDownRight className="h-3 w-3 ml-1 text-red-500" />
              <span className="text-red-500">-2%</span> من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs for different reports */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="attendance">الحضور</TabsTrigger>
            <TabsTrigger value="users">المستخدمون</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="ml-2 h-5 w-5" />
                    نمو المستخدمين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSimpleBarChart(userGrowthData, 'newUsers', 'مستخدمون جدد')}
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="ml-2 h-5 w-5" />
                    التبرعات الشهرية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderSimpleBarChart(donationsData, 'amount', 'مبلغ التبرعات')}
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="ml-2 h-5 w-5" />
                  مشاركة الفعاليات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventParticipationData.map((event, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{event.eventName}</span>
                        <span>{event.participants}/{event.capacity} ({event.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${event.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="ml-2 h-5 w-5" />
                  إحصائيات الحضور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">الحضور الشهري حسب النوع</h3>
                    {renderSimpleBarChart(attendanceData, 'total', 'إجمالي الحضور')}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">505</div>
                      <div className="text-sm text-muted-foreground">متوسط حضور الخدمات</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">345</div>
                      <div className="text-sm text-muted-foreground">متوسط حضور مدارس الأحد</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">205</div>
                      <div className="text-sm text-muted-foreground">متوسط حضور الشباب</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="ml-2 h-5 w-5" />
                    نشاط المستخدمين حسب الدور
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userActivityData.map((user, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{user.userRole}</span>
                          <span>{user.activeUsers}/{user.totalUsers} ({user.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${user.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="ml-2 h-5 w-5" />
                    معدلات تسجيل الدخول
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span>اليوم</span>
                      <Badge variant="default">285</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span>الأسبوع الماضي</span>
                      <Badge variant="secondary">1,250</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span>الشهر الماضي</span>
                      <Badge variant="outline">5,420</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span>متوسط الجلسة</span>
                      <Badge variant="outline">12 دقيقة</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
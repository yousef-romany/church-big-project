
"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookUser, 
  Footprints, 
  UsersRound, 
  SendHorizonal, 
  ArrowLeft,
  Calendar,
  TrendingUp,
  Award,
  BarChart3,
  Activity,
  Church,
  Clock
} from 'lucide-react';

const dashboardSections = [
  {
    title: 'سكرتارية الاعتراف',
    description: 'إدارة مواعيد الاعترافات القادمة والسابقة.',
    href: '/priest-panel/confessions',
    icon: BookUser,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500',
  },
  {
    title: 'خدمة الافتقاد اليومية',
    description: 'جدولة ومتابعة زيارات الأسر.',
    href: '/priest-panel/visitations',
    icon: Footprints,
    color: 'bg-green-500/10 text-green-600 dark:text-green-400',
    borderColor: 'border-green-500',
  },
  {
    title: 'إضافة أسرة جديدة',
    description: 'تسجيل بيانات العائلات الجديدة في الخدمة.',
    href: '/priest-panel/families/add',
    icon: UsersRound,
    color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    borderColor: 'border-yellow-500',
  },
  {
    title: 'إرسال خادم للافتقاد',
    description: 'تفويض المهام للخدام المساعدين.',
    href: '/priest-panel/send-servant',
    icon: SendHorizonal,
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PriestDashboardPage() {
  return (
    <motion.div
      className="container mx-auto py-8 px-0 md:px-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 text-center text-primary"
        variants={cardVariants}
      >
        مرحباً بك في لوحة تحكم الكاهن
      </motion.h1>

      <Tabs defaultValue="overview" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="analytics">الإحصائيات والتحليلات</TabsTrigger>
          <TabsTrigger value="activities">الأنشطة والفعاليات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <UsersRound className="ml-2 h-5 w-5 text-primary" />
                  الأسر المسجلة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">أسرة في الخدمة</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="ml-2 h-5 w-5 text-blue-500" />
                  مواعيد الاعتراف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">15</div>
                <p className="text-xs text-muted-foreground">موعد هذا الأسبوع</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Footprints className="ml-2 h-5 w-5 text-green-500" />
                  الزيارات المنجزة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">23</div>
                <p className="text-xs text-muted-foreground">زيارة هذا الشهر</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="ml-2 h-5 w-5 text-amber-500" />
                  معدل النمو
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">12%</div>
                <p className="text-xs text-muted-foreground">زيادة عن الشهر الماضي</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {dashboardSections.map((section, index) => (
              <motion.div key={index} variants={cardVariants} whileHover={{ y: -5 }}>
                <Link href={section.href} legacyBehavior passHref>
                  <Card className={`cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 ${section.borderColor}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                      <section.icon className={`h-8 w-8 ${section.color.split(' ')[1]}`} />
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{section.description}</CardDescription>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary hover:underline">
                        اذهب إلى القسم
                        <ArrowLeft className="ms-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="ml-2 h-5 w-5 text-primary" />
                  إحصائيات الاعترافات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>إجمالي المواعيد هذا الشهر</span>
                  <Badge variant="secondary">60</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>المواعيد المنجزة</span>
                  <Badge variant="default">48</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>معدل الإنجاز</span>
                  <Badge variant="outline">80%</Badge>
                </div>
                <Progress value={80} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="ml-2 h-5 w-5 text-primary" />
                  إحصائيات الافتقاد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>الزيارات المنجزة هذا الشهر</span>
                  <Badge variant="secondary">23</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>الزيارات العاجلة</span>
                  <Badge variant="destructive">5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>الخدمة الهاتفية</span>
                  <Badge variant="outline">12</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="ml-2 h-5 w-5 text-primary" />
                توزيع النقاط للأطفال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-amber-500">1,245</div>
                  <p className="text-sm text-muted-foreground">مجموع النقاط</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">87</div>
                  <p className="text-sm text-muted-foreground">عدد الأطفال</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">14.3</div>
                  <p className="text-sm text-muted-foreground">متوسط النقاط</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Church className="ml-2 h-5 w-5 text-primary" />
                أحدث الأنشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "اجتماع مدارس الأحد", date: "15 مارس 2024", time: "5:00 مساء", type: "اجتماع" },
                  { title: "رحلة موسم الصيف", date: "24 مارس 2024", time: "8:00 صباحا", type: "رحلة" },
                  { title: "قداس عيد القيامة", date: "1 أبريل 2024", time: "9:00 صباحا", type: "قداس" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {activity.type === "اجتماع" ? <UsersRound className="h-5 w-5 text-primary" /> :
                         activity.type === "رحلة" ? <Footprints className="h-5 w-5 text-primary" /> :
                         <Church className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {activity.date} - {activity.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

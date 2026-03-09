
"use client";
import SundaySchoolMain from '@/components/priest-panel/sunday-school/SundaySchoolMain';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Award, Calendar } from 'lucide-react';

export default function SundaySchoolPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">إدارة خدام مدارس الأحد</h1>
        <p className="text-muted-foreground">إدارة بيانات خدام مدارس الأحد، تسجيل الحضور والغياب، وعرض السجلات.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="ml-2 h-5 w-5 text-primary" />
              الخدام النشطون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">خادم في الخدمة</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="ml-2 h-5 w-5 text-green-500" />
              معدل الحضور
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">87%</div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Award className="ml-2 h-5 w-5 text-amber-500" />
              نقاط الأبناء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">1,245</div>
            <p className="text-xs text-muted-foreground">مجموع النقاط</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="ml-2 h-5 w-5 text-blue-500" />
              الفصول الدراسية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">12</div>
            <p className="text-xs text-muted-foreground">فصل نشط</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/20 rounded-lg p-4">
        <h3 className="font-medium mb-2">أهم الإحصائيات هذا الأسبوع:</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">18 خادم حضروا القداس</Badge>
          <Badge variant="secondary">145 طفل حضروا الدراسة</Badge>
          <Badge variant="secondary">3 خدام متغيبون بعذر</Badge>
          <Badge variant="outline">اجتماع خدمة يوم الأحد 5 مساء</Badge>
        </div>
      </div>
      
      <Separator />
      <SundaySchoolMain />
    </motion.div>
  );
}

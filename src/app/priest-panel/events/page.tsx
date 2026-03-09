
"use client";
import ManageEvents from '@/components/priest-panel/events/ManageEvents';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, TrendingUp, Award, MapPin } from 'lucide-react';

export default function ManageEventsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">إدارة الفعاليات والاجتماعات الخاصة</h1>
        <p className="text-muted-foreground">
          هنا يمكنك إنشاء وتعديل الفعاليات والاجتماعات الخاصة، وتحديد نقاط الحضور لها.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="ml-2 h-5 w-5 text-primary" />
              الفعاليات القادمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">فعالية هذا الشهر</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="ml-2 h-5 w-5 text-green-500" />
              المشاركين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">156</div>
            <p className="text-xs text-muted-foreground">مشارك في الفعاليات</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Award className="ml-2 h-5 w-5 text-amber-500" />
              النقاط الموزعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">2,450</div>
            <p className="text-xs text-muted-foreground">نقاط إجمالية</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MapPin className="ml-2 h-5 w-5 text-blue-500" />
              الأماكن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">5</div>
            <p className="text-xs text-muted-foreground">مكان فعاليات</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/20 rounded-lg p-4">
        <h3 className="font-medium mb-2">أهم الفعاليات القادمة:</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">الخميس 15 مارس: اجتماع مدارس الأحد</Badge>
          <Badge variant="secondary">السبت 24 مارس: رحلة موسم الصيف</Badge>
          <Badge variant="outline">الأحد 1 أبريل: قداس عيد القيامة</Badge>
        </div>
      </div>
      
      <Separator />
      <ManageEvents />
    </motion.div>
  );
}

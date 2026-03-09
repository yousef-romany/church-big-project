"use client";
import DailyVisitationSchedule from '@/components/priest-panel/daily-visitation-schedule';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, MapPin, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

export default function VisitationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary">خدمة الافتقاد اليومية</h1>
        <p className="text-muted-foreground">عرض وجدولة زيارات الأسر ومتابعة الخدام.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="ml-2 h-5 w-5 text-primary" />
              إجمالي الأسر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">أسرة مسجلة</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="ml-2 h-5 w-5 text-red-500" />
              زيارات عاجلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">5</div>
            <p className="text-xs text-muted-foreground">تحتاج اهتمام فوري</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MapPin className="ml-2 h-5 w-5 text-green-500" />
              الزيارات هذا الأسبوع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">12</div>
            <p className="text-xs text-muted-foreground">زيارة مجدولة</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="ml-2 h-5 w-5 text-blue-500" />
              الخدام النشطون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">8</div>
            <p className="text-xs text-muted-foreground">خادم في الخدمة</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">جدول الزيارات</TabsTrigger>
          <TabsTrigger value="servants">إدارة الخدام</TabsTrigger>
          <TabsTrigger value="reports">التقارير والإحصائيات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule" className="space-y-4">
          <DailyVisitationSchedule />
        </TabsContent>
        
        <TabsContent value="servants" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="ml-2 h-5 w-5 text-primary" />
                متابعة الخدام المعينين للافتقاد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "الخادم طوني صبحي", families: 8, completed: 6, pending: 2 },
                  { name: "الخادمة مريم لمعي", families: 6, completed: 5, pending: 1 },
                  { name: "الخادم بيشوي إميل", families: 10, completed: 8, pending: 2 },
                  { name: "الخادمة فيرينا كامل", families: 7, completed: 7, pending: 0 },
                ].map((servant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{servant.name}</h4>
                        <p className="text-sm text-muted-foreground">{servant.families} أسرة معينة</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {servant.completed} مكتملة
                      </Badge>
                      <Badge variant="outline" className="text-amber-600 border-amber-600">
                        {servant.pending} معلقة
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="ml-2 h-5 w-5 text-primary" />
                إحصائيات الافتقاد الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">أكثر المناطق زيارة</h4>
                    <div className="space-y-2">
                      {["المعادي (12 زيارة)", "المقطم (8 زيارات)", "الدقي (7 زيارات)"].map((area, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{area}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2 ml-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${80 - (index * 20)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">أنواع الزيارات</h4>
                    <div className="space-y-2">
                      {[
                        { type: "زيارات دورية", count: 25, color: "bg-blue-500" },
                        { type: "زيارات عاجلة", count: 8, color: "bg-red-500" },
                        { type: "زيارات جديدة", count: 5, color: "bg-green-500" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{item.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.count}</span>
                            <div className={`w-16 rounded-full h-2 ${item.color}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">ملاحظات من الزيارات</h4>
                  <div className="bg-muted/30 p-3 rounded-md max-h-32 overflow-y-auto">
                    <p className="text-sm">
                      - 5 أسر تحتاج دعم مادي<br/>
                      - 3 حالات صحية تحتاج متابعة<br/>
                      - 7 شباب يحتاجون انضمام للخدمات<br/>
                      - 2 أسر جديدة تحتاج ترحيب ودمج
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

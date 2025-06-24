
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageSundaySchoolServants from "./ManageSundaySchoolServants";
import RecordSundaySchoolAttendance from "./RecordSundaySchoolAttendance";
import ViewSundaySchoolAttendance from "./ViewSundaySchoolAttendance";
import ChildrenAttendanceInteraction from "./ChildrenAttendanceInteraction";
import { UserCog, ListChecks, Eye, QrCode, BarChartHorizontal } from 'lucide-react';
import ChildrenAttendanceReports from "./ChildrenAttendanceReports";
import ServantAttendanceReports from "./ServantAttendanceReports";

export default function SundaySchoolMain() {
  return (
    <Tabs defaultValue="manage-servants" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 h-auto">
        <TabsTrigger value="manage-servants" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <UserCog className="h-5 w-5" /> إدارة الخدام
        </TabsTrigger>
        <TabsTrigger value="record-servant-attendance" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <ListChecks className="h-5 w-5" /> حضور الخدام
        </TabsTrigger>
        <TabsTrigger value="view-servant-attendance" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <Eye className="h-5 w-5" /> سجلات الخدام
        </TabsTrigger>
        <TabsTrigger value="servant-reports" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
            <BarChartHorizontal className="h-5 w-5" /> تقارير الخدام
        </TabsTrigger>
        <TabsTrigger value="children-interaction" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" /> حضور الأبناء
        </TabsTrigger>
         <TabsTrigger value="children-reports" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <BarChartHorizontal className="h-5 w-5" /> تقارير الأبناء
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manage-servants">
        <ManageSundaySchoolServants />
      </TabsContent>
      <TabsContent value="record-servant-attendance">
        <RecordSundaySchoolAttendance />
      </TabsContent>
      <TabsContent value="view-servant-attendance">
        <ViewSundaySchoolAttendance />
      </TabsContent>
       <TabsContent value="servant-reports">
        <ServantAttendanceReports />
      </TabsContent>
      <TabsContent value="children-interaction">
        <ChildrenAttendanceInteraction />
      </TabsContent>
      <TabsContent value="children-reports">
        <ChildrenAttendanceReports />
      </TabsContent>
    </Tabs>
  );
}

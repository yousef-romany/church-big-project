
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageSundaySchoolServants from "./ManageSundaySchoolServants";
import RecordSundaySchoolAttendance from "./RecordSundaySchoolAttendance";
import ViewSundaySchoolAttendance from "./ViewSundaySchoolAttendance";
import ChildrenAttendanceInteraction from "./ChildrenAttendanceInteraction";
import { UserCog, ListChecks, Eye, QrCode } from 'lucide-react';

export default function SundaySchoolMain() {
  return (
    <Tabs defaultValue="manage-servants" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 gap-1 h-auto sm:h-10">
        <TabsTrigger value="manage-servants" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <UserCog className="h-5 w-5" /> إدارة الخدام
        </TabsTrigger>
        <TabsTrigger value="record-attendance" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <ListChecks className="h-5 w-5" /> تسجيل حضور الخدام
        </TabsTrigger>
        <TabsTrigger value="view-attendance" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <Eye className="h-5 w-5" /> سجلات الخدام
        </TabsTrigger>
        <TabsTrigger value="children-interaction" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" /> حضور وتفاعل الأبناء
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manage-servants">
        <ManageSundaySchoolServants />
      </TabsContent>
      <TabsContent value="record-attendance">
        <RecordSundaySchoolAttendance />
      </TabsContent>
      <TabsContent value="view-attendance">
        <ViewSundaySchoolAttendance />
      </TabsContent>
      <TabsContent value="children-interaction">
        <ChildrenAttendanceInteraction />
      </TabsContent>
    </Tabs>
  );
}

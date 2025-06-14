
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageSundaySchoolServants from "./ManageSundaySchoolServants";
import RecordSundaySchoolAttendance from "./RecordSundaySchoolAttendance";
import ViewSundaySchoolAttendance from "./ViewSundaySchoolAttendance";
import { UserCog, ListChecks, Eye } from 'lucide-react';

export default function SundaySchoolMain() {
  return (
    <Tabs defaultValue="manage-servants" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 h-auto sm:h-10">
        <TabsTrigger value="manage-servants" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <UserCog className="h-5 w-5" /> إدارة الخدام
        </TabsTrigger>
        <TabsTrigger value="record-attendance" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <ListChecks className="h-5 w-5" /> تسجيل الحضور
        </TabsTrigger>
        <TabsTrigger value="view-attendance" className="py-2 sm:py-1.5 flex items-center justify-center gap-2">
          <Eye className="h-5 w-5" /> عرض السجلات
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
    </Tabs>
  );
}

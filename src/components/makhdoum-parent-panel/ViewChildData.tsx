
"use client";

import { useState, useEffect } from 'react';
import { getSundaySchoolChildren } from '@/lib/sunday-school-store';
import type { SundaySchoolChild } from '@/types/sunday-school';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyPointsDisplay from '@/components/makhdoum-panel/MyPointsDisplay';
import MyScheduleView from '@/components/makhdoum-panel/MyScheduleView';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Calendar } from 'lucide-react';

interface ViewChildDataProps {
  childId: string;
}

export default function ViewChildData({ childId }: ViewChildDataProps) {
  const [child, setChild] = useState<SundaySchoolChild | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allChildren = getSundaySchoolChildren();
    const foundChild = allChildren.find(c => c.id === childId);
    setChild(foundChild || null);
    setIsLoading(false);
  }, [childId]);

  if (isLoading) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  if (!child) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-destructive">لم يتم العثور على الابن</h2>
        <p className="text-muted-foreground">قد يكون تم حذف الحساب أو أن الرابط غير صحيح.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border-4 border-primary">
            <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child portrait" />
            <AvatarFallback>{child.name.substring(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-3xl font-bold text-primary">متابعة: {child.name}</h1>
            <p className="text-muted-foreground">هنا يمكنك عرض بيانات ونشاط ابنك.</p>
        </div>
      </div>
      
      <Tabs defaultValue="points" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="points"><Star className="me-2 h-4 w-4" />النقاط</TabsTrigger>
          <TabsTrigger value="schedule"><Calendar className="me-2 h-4 w-4" />الجدول الزمني</TabsTrigger>
        </TabsList>
        <TabsContent value="points" className="mt-4">
          <MyPointsDisplay isParentView={true} />
        </TabsContent>
        <TabsContent value="schedule" className="mt-4">
          <MyScheduleView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

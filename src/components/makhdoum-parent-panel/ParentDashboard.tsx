
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLinkedChildrenData, getRequestsForParent } from '@/lib/parent-child-link-store';
import type { LinkedChild, LinkRequest } from '@/types/public';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Eye, Link2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusMap: Record<LinkRequest['status'], { label: string, icon: JSX.Element, color: string }> = {
    pending: { label: 'قيد المراجعة', icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-500/20 text-yellow-700' },
    accepted: { label: 'تم القبول', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-500/20 text-green-700' },
    rejected: { label: 'تم الرفض', icon: <XCircle className="h-4 w-4" />, color: 'bg-red-500/20 text-red-700' },
};

export default function ParentDashboard() {
  // In a real app, this ID would come from the logged-in user context
  const MOCK_PARENT_ID = 'parent1_mock_id';
  const [linkedChildren, setLinkedChildren] = useState<LinkedChild[]>([]);
  const [sentRequests, setSentRequests] = useState<LinkRequest[]>([]);
  
  useEffect(() => {
    // A simple polling mechanism to refresh data. In a real app, use SWR/React Query or WebSockets.
    const interval = setInterval(() => {
      setLinkedChildren(getLinkedChildrenData(MOCK_PARENT_ID));
      setSentRequests(getRequestsForParent(MOCK_PARENT_ID));
    }, 2000); // Refresh every 2 seconds to see updates after child accepts

    // Initial load
    setLinkedChildren(getLinkedChildrenData(MOCK_PARENT_ID));
    setSentRequests(getRequestsForParent(MOCK_PARENT_ID));

    return () => clearInterval(interval);
  }, [MOCK_PARENT_ID]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">متابعة الأبناء</h1>
        <p className="text-muted-foreground">هنا يمكنك عرض بيانات أبنائك المرتبطين وحالة طلبات الربط.</p>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>الأبناء المرتبطون</CardTitle>
          <CardDescription>انقر على "عرض البيانات" لمتابعة نقاط وجدول كل ابن.</CardDescription>
        </CardHeader>
        <CardContent>
          {linkedChildren.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {linkedChildren.map(child => (
                <Card key={child.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child portrait" />
                      <AvatarFallback>{child.name.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{child.name}</p>
                      <p className="text-sm text-yellow-600 flex items-center">
                        <Star className="h-4 w-4 me-1" /> {child.points} نقطة
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/makhdoum-parent-panel/view-child/${child.id}`}>
                      <Eye className="me-2 h-4 w-4" /> عرض البيانات
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-6">
              <p>لم تقم بربط حساب أي ابن حتى الآن.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/makhdoum-parent-panel/link-child">
                  <Link2 className="me-2 h-4 w-4" />
                  اذهب لصفحة الربط الآن
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>طلبات الربط المرسلة</CardTitle>
          <CardDescription>حالة طلبات الربط التي أرسلتها.</CardDescription>
        </CardHeader>
        <CardContent>
            {sentRequests.length > 0 ? (
                <ul className="space-y-2">
                    {sentRequests.map(req => (
                        <li key={req.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                            <p className="font-medium">طلب إلى: {req.childName}</p>
                            <Badge className={statusMap[req.status].color}>
                                {statusMap[req.status].icon}
                                <span className="ms-1.5">{statusMap[req.status].label}</span>
                            </Badge>
                        </li>
                    ))}
                </ul>
            ) : (
                 <p className="text-center text-muted-foreground py-4">لم تقم بإرسال أي طلبات ربط.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

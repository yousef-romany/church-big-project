
"use client";

import { useState, useEffect } from 'react';
import type { LinkRequest } from '@/types/public';
import { getRequestsForChild, updateRequestStatus } from '@/lib/parent-child-link-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';

export default function ChildDashboard() {
  // In a real app, this ID would come from the logged-in user context
  const MOCK_CHILD_ID = 'child_SS-CHILD-001'; 
  const [requests, setRequests] = useState<LinkRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setRequests(getRequestsForChild(MOCK_CHILD_ID));
  }, [MOCK_CHILD_ID]);

  const handleUpdateRequest = (requestId: string, status: 'accepted' | 'rejected') => {
    const success = updateRequestStatus(requestId, status);
    if (success) {
      toast({
        title: `تم ${status === 'accepted' ? 'قبول' : 'رفض'} الطلب بنجاح!`,
      });
      // Refresh the list of requests
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } else {
      toast({
        title: 'حدث خطأ ما',
        description: 'لم نتمكن من تحديث الطلب. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">مرحباً بك في لوحة التحكم!</h1>
        <p className="text-muted-foreground mt-2">هنا يمكنك إدارة حسابك والاطلاع على جديدك.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="me-2 h-5 w-5 text-primary" /> طلبات ربط الحساب</CardTitle>
          <CardDescription>
            هنا تظهر الطلبات من أولياء الأمور لربط حساباتهم بحسابك لمتابعة تقدمك.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {requests.length > 0 ? (
              <div className="space-y-3">
                {requests.map(req => (
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                    className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold">{req.parentName}</p>
                      <p className="text-sm text-muted-foreground">
                        يرغب في ربط حسابه بحسابك. (تم الإرسال {formatDistanceToNow(new Date(req.requestedAt), { addSuffix: true, locale: arSA })})
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleUpdateRequest(req.id, 'accepted')}>
                        <Check className="me-1 h-4 w-4" /> قبول
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleUpdateRequest(req.id, 'rejected')}>
                        <X className="me-1 h-4 w-4" /> رفض
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">لا توجد طلبات ربط حالية.</p>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
       {/* Future components can be added here, e.g., displaying weekly verse */}
    </div>
  );
}

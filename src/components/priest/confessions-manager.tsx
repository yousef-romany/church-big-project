"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Plus, Eye, Edit, Trash2, ChevronRight, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Confession {
  id: string;
  userId: string;
  userName: string;
  scheduledAt: string;
  duration: number;
  status: string;
  notes?: string;
}

export default function PriestConfessions() {
  const { toast } = useToast();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfession, setSelectedConfession] = useState<Confession | null>(null);

  useEffect(() => {
    fetchConfessions();
  }, []);

  const fetchConfessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/priest/confessions');
      const data = await response.json();
      setConfessions(data.confessions || []);
    } catch (error) {
      console.error('Error fetching confessions:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل المواعيد',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (confessionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/priest/confessions/${confessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث حالة الموعيد',
        });
        fetchConfessions();
      }
    } catch (error) {
      console.error('Error updating confession:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث الموعيد',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-600';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-600';
      case 'COMPLETED':
        return 'bg-green-100 text-green-600';
      case 'CANCELLED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>إدارة المواعيد</span>
          </CardTitle>
          <Button onClick={() => {}} size="sm">
            <Plus className="h-4 w-4" />
            موعد جديد
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input placeholder="بحث عن موعد..." />
            <Button>بحث</Button>
          </div>
        </CardContent>
      </Card>

      {/* Confessions List */}
      <Card>
        <CardHeader>
          <CardTitle>المواعيد ({confessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : confessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد مواعيد مجدولة
            </div>
          ) : (
            <div className="space-y-3">
              {confessions.map((confession, index) => (
                <motion.div
                  key={confession.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedConfession(confession)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(confession.status)}>
                          {confession.status === 'SCHEDULED' && 'مجدول' }
                          {confession.status === 'IN_PROGRESS' && 'جاري' }
                          {confession.status === 'COMPLETED' && 'مكتمل' }
                          {confession.status === 'CANCELLED' && 'ملغي'}
                        </Badge>
                        <span className="text-lg font-semibold">{new Date(confession.scheduledAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {confession.duration} دقيقة
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{confession.userName}</span>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(confession.scheduledAt).toLocaleTimeString('ar-EG')}
                      </span>
                    </div>
                  </div>
                  {confession.notes && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>{confession.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {}}
                    >
                      <Eye className="h-4 w-4" />
                      تفاصيل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {}}
                    >
                      <Edit className="h-4 w-4" />
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(confession.id, 'COMPLETED')}
                    >
                      <CheckCircle className="h-4 w-4" />
                      اكتمل
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confession Details Modal */}
      {selectedConfession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedConfession(null)}
            className="absolute inset-0"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">تفاصيل الاعتراف</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1">العك: {selectedConfession.userName}</label>
              </div>
              <div>
                <label className="text-sm font-medium mb-1">التاريخ: {new Date(selectedConfession.scheduledAt).toLocaleDateString('ar-EG')}</label>
              </div>
              <div>
                <label className="text-sm font-medium mb-1">الوقت: {new Date(selectedConfession.scheduledAt).toLocaleTimeString('ar-EG')}</label>
              </div>
              <div>
                <label className="text-sm font-medium mb-1">المدة: {selectedConfession.duration} دقيقة</label>
              </div>
              <div>
                <label className="text-sm font-medium mb-1">الحالة: {selectedConfession.status}</label>
              </div>
              {selectedConfession.notes && (
                <div>
                  <label className="text-sm font-medium mb-1">ملاحظات</label>
                  <p className="text-sm text-muted-foreground">{selectedConfession.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setSelectedConfession(null)} variant="outline">
                إغلاق
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

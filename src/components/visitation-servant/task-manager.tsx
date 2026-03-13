"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, CheckCircle, AlertTriangle, MoreVertical, ChevronRight, FileText, Phone, UserCheck, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface VisitationTask {
  id: string;
  priestId: string;
  priestName: string;
  servantId: string;
  servantName: string;
  familyId: string;
  familyName: string;
  familyAddress: string;
  familyPhone: string;
  priority: string;
  status: string;
  scheduledAt?: string;
  completedAt?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  familyMembers: FamilyMember[];
}

interface FamilyMember {
  id: string;
  name: string;
  email: string;
}

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export default function TaskManager() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<VisitationTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<VisitationTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<VisitationTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedTaskForMap, setSelectedTaskForMap] = useState<VisitationTask | null>(null);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const filterTasks = () => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(t => t.status === statusFilter));
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/visitation-servant/tasks');
      const data = await response.json();
      setTasks(data.visitationTasks || []);
      setFilteredTasks(data.visitationTasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل المهام',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus, notes?: string) => {
    try {
      const response = await fetch(`/api/visitation-servant/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      if (response.ok) {
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث حالة المهمة',
        });
        fetchTasks();
        if (selectedTask?.id === taskId) {
          setSelectedTask({ ...selectedTask, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحديث المهمة',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-600';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-600';
      case 'HIGH':
        return 'bg-orange-100 text-orange-600';
      case 'URGENT':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-600';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-600';
      case 'COMPLETED':
        return 'bg-green-100 text-green-600';
      case 'CANCELLED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'PENDING':
        return 'قيد الانتظار';
      case 'IN_PROGRESS':
        return 'جاري العمل';
      case 'COMPLETED':
        return 'مكتمل';
      case 'CANCELLED':
        return 'ملغي';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>المهام ({filteredTasks.length})</span>
            </CardTitle>
            <Button onClick={() => setShowMapModal(true)} variant="outline" size="sm">
              <MapPin className="h-4 w-4" />
              عرض الخريطة
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Tabs value={statusFilter} onValueChange={(v: any) => setStatusFilter(v as TaskStatus | 'all')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">كل المهام</TabsTrigger>
                <TabsTrigger value="PENDING">قيد الانتظار</TabsTrigger>
                <TabsTrigger value="IN_PROGRESS">جاري العمل</TabsTrigger>
                <TabsTrigger value="COMPLETED">مكتمل</TabsTrigger>
                <TabsTrigger value="CANCELLED">ملغي</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      {loading ? (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </CardContent>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              لا توجد مهام حالياً
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <span className="text-lg font-semibold">{task.familyName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <ChevronRight className="h-4 w-4" />
                          {task.servantName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{task.familyAddress || 'بدون عنوان'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{task.familyPhone || 'بدون هاتف'}</span>
                    </div>
                    {task.scheduledAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(task.scheduledAt).toLocaleDateString('ar-EG')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{task.priestName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span>{task.servantName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">أعضاء الأسرة: {task.familyMembers.length} شخص</span>
                    </div>
                    {task.notes && (
                      <div className="text-sm text-muted-foreground border-t pt-2">
                        <p>{task.notes}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowMapModal(true)}
                      >
                        <MapPin className="h-4 w-4" />
                        عرض الموقع
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {}}
                      >
                        <FileText className="h-4 w-4" />
                        ملاحظات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      )}

      {/* Map Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl h-[600px]">
          <DialogHeader>
            <DialogTitle>موقع العائلة</DialogTitle>
            <DialogDescription>
              عرض موقع العائلة على الخريطة
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="p-0">
            <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center">
              {selectedTaskForMap && selectedTaskForMap.latitude && selectedTaskForMap.longitude ? (
                <div className="w-full h-full relative">
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '400px',
                    }}
                  >
                    <iframe
                      src={`https://www.openfreemap.org/?mlat=${selectedTaskForMap.latitude}&mlon=${selectedTaskForMap.longitude}&zoom=15`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      title={`موقع ${selectedTaskForMap.familyName}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mb-4" />
                  <p>لا توجد إحداثيات لعرضها</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Dialog>

      {/* Task Details Modal */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={(open) => !open ? setSelectedTask(null) : null}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تفاصيل المهمة</DialogTitle>
              <DialogDescription>
                معلومات تفاصيلية عن المهمة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">العائلة</label>
                  <div className="text-lg font-semibold">{selectedTask.familyName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">الأولوية</label>
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">الحالة الحالية</label>
                  <Badge className={getStatusColor(selectedTask.status)}>
                    {getStatusLabel(selectedTask.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">تاريخ الموعد</label>
                  <span>
                    {selectedTask.scheduledAt 
                      ? new Date(selectedTask.scheduledAt).toLocaleDateString('ar-EG')
                      : 'لم يحدد بعد'}
                  </span>
                </div>
              </div>
              {selectedTask.completedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">تاريخ الإنجاز</label>
                    <span>{new Date(selectedTask.completedAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium">الكاهن</label>
                    <span>{selectedTask.priestName}</span>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">الخادم المكلّف</label>
                <span>{selectedTask.servantName}</span>
              </div>
              <div>
                <label className="text-sm font-medium">العنوان</label>
                <span>{selectedTask.familyAddress || 'غير مسجل'}</span>
              </div>
              <div>
                <label className="text-sm font-medium">الهاتف</label>
                <span>{selectedTask.familyPhone || 'غير مسجل'}</span>
              </div>
              {selectedTask.notes && (
                <div>
                  <label className="text-sm font-medium">ملاحظات</label>
                  <p className="text-sm text-muted-foreground">{selectedTask.notes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="text-sm font-medium">ملاحظات إضافية</label>
                  <Textarea
                    placeholder="أضف ملاحظاتك حول المهمة..."
                    rows={4}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedTask.id, 'IN_PROGRESS', selectedTask.notes || '')}
                >
                  بدء العمل
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedTask.id, 'COMPLETED', selectedTask.notes || '')}
                >
                  إكمال المهمة
                </Button>
              </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  إغلاق
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

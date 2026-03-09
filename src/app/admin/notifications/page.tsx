"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Bell, Send, Users, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Types
interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'URGENT' | 'INFO' | 'REMINDER' | 'EVENT' | 'APPOINTMENT' | 'ANNOUNCEMENT' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  readStatus: boolean;
  deliveryStatus: 'PENDING' | 'SENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'READ';
  recipientId: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  titleTemplate: string;
  bodyTemplate: string;
  type: string;
  priority: string;
  description?: string;
  isActive: boolean;
  variables: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const typeLabels = {
  URGENT: 'عاجل',
  INFO: 'معلومات',
  REMINDER: 'تذكير',
  EVENT: 'فعالية',
  APPOINTMENT: 'موعدة',
  ANNOUNCEMENT: 'إعلان',
  SYSTEM: 'نظام',
};

const priorityLabels = {
  LOW: 'منخفض',
  MEDIUM: 'متوسط',
  HIGH: 'عالي',
  CRITICAL: 'حرج',
};

const statusLabels = {
  PENDING: 'في الانتظار',
  SENDING: 'قيد الإرسال',
  SENT: 'تم الإرسال',
  DELIVERED: 'تم التسليم',
  FAILED: 'فشل',
  READ: 'مقروء',
};

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SENDING: 'bg-blue-100 text-blue-800',
  SENT: 'bg-green-100 text-green-800',
  DELIVERED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  READ: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

export default function NotificationsAdmin() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    recipientType: 'individual' as 'individual' | 'batch' | 'role',
    recipientId: '',
    recipientIds: [] as string[],
    recipientRole: 'USER' as 'USER' | 'ADMIN' | 'PRIEST' | 'SERVANT' | 'PARENT' | 'CHILD',
    title: '',
    body: '',
    type: 'INFO' as 'URGENT' | 'INFO' | 'REMINDER' | 'EVENT' | 'APPOINTMENT' | 'ANNOUNCEMENT' | 'SYSTEM',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    imageUrl: '',
    actionUrl: '',
    templateId: '',
    templateData: {} as Record<string, string>,
    scheduledFor: '',
  });

  const [templateForm, setTemplateForm] = useState({
    name: '',
    titleTemplate: '',
    bodyTemplate: '',
    type: 'INFO',
    priority: 'MEDIUM',
    description: '',
    isActive: true,
  });

  // Load data
  useEffect(() => {
    loadNotifications();
    loadTemplates();
    loadUsers();
  }, [pagination.page, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
      });

      const response = await fetch(`/api/notifications?${params}`);
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        }));
        setUnreadCount(data.unreadCount);
      } else {
        toast({
          title: 'خطأ',
          description: data.message || 'فشل في جلب الإشعارات',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب الإشعارات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/notifications/templates?activeOnly=true');
      const data = await response.json();

      if (response.ok) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  // Send notification
  const handleSendNotification = async () => {
    try {
      let payload = {};

      if (createForm.recipientType === 'individual') {
        payload = {
          recipientId: createForm.recipientId,
          title: createForm.title,
          body: createForm.body,
          type: createForm.type,
          priority: createForm.priority,
          imageUrl: createForm.imageUrl || undefined,
          actionUrl: createForm.actionUrl || undefined,
          templateId: createForm.templateId || undefined,
          templateData: createForm.templateData,
        };
      } else if (createForm.recipientType === 'batch') {
        payload = {
          recipientIds: createForm.recipientIds,
          title: createForm.title,
          body: createForm.body,
          type: createForm.type,
          priority: createForm.priority,
          imageUrl: createForm.imageUrl || undefined,
          actionUrl: createForm.actionUrl || undefined,
          templateId: createForm.templateId || undefined,
          templateData: createForm.templateData,
        };
      } else if (createForm.recipientType === 'role') {
        payload = {
          recipientRole: createForm.recipientRole,
          title: createForm.title,
          body: createForm.body,
          type: createForm.type,
          priority: createForm.priority,
          imageUrl: createForm.imageUrl || undefined,
          actionUrl: createForm.actionUrl || undefined,
          templateId: createForm.templateId || undefined,
          templateData: createForm.templateData,
        };
      }

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'نجاح',
          description: data.message,
        });
        setIsCreateOpen(false);
        setCreateForm({
          recipientType: 'individual',
          recipientId: '',
          recipientIds: [],
          recipientRole: 'USER',
          title: '',
          body: '',
          type: 'INFO',
          priority: 'MEDIUM',
          imageUrl: '',
          actionUrl: '',
          templateId: '',
          templateData: {},
          scheduledFor: '',
        });
        loadNotifications();
      } else {
        toast({
          title: 'خطأ',
          description: data.message || 'فشل في إرسال الإشعار',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الإشعار',
        variant: 'destructive',
      });
    }
  };

  // Create template
  const handleCreateTemplate = async () => {
    try {
      const response = await fetch('/api/notifications/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'نجاح',
          description: data.message,
        });
        setIsTemplateOpen(false);
        setTemplateForm({
          name: '',
          titleTemplate: '',
          bodyTemplate: '',
          type: 'INFO',
          priority: 'MEDIUM',
          description: '',
          isActive: true,
        });
        loadTemplates();
      } else {
        toast({
          title: 'خطأ',
          description: data.message || 'فشل في إنشاء القالب',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إنشاء القالب',
        variant: 'destructive',
      });
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      });

      if (response.ok) {
        loadNotifications();
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'نجاح',
          description: `${data.message} (${data.updatedCount} إشعار)`,
        });
        loadNotifications();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || notification.deliveryStatus === statusFilter;
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الإشعارات</h1>
            <p className="text-blue-100">إرسال وإدارة إشعارات النظام</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => setIsCreateOpen(true)}
            >
              <Send className="ml-2 h-4 w-4" />
              إرسال إشعار
            </Button>
            <Button
              variant="outline"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => setIsTemplateOpen(true)}
            >
              <Users className="ml-2 h-4 w-4" />
              القوالب
            </Button>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="ml-2 h-5 w-5" />
            قائمة الإشعارات
            {unreadCount > 0 && (
              <Badge variant="destructive" className="mr-4">
                {unreadCount} غير مقروء
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="البحث في الإشعارات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="PENDING">في الانتظار</SelectItem>
                <SelectItem value="SENT">تم الإرسال</SelectItem>
                <SelectItem value="DELIVERED">تم التسليم</SelectItem>
                <SelectItem value="FAILED">فشل</SelectItem>
                <SelectItem value="READ">مقروء</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="URGENT">عاجل</SelectItem>
                <SelectItem value="INFO">معلومات</SelectItem>
                <SelectItem value="REMINDER">تذكير</SelectItem>
                <SelectItem value="EVENT">فعالية</SelectItem>
                <SelectItem value="APPOINTMENT">موعدة</SelectItem>
                <SelectItem value="ANNOUNCEMENT">إعلان</SelectItem>
                <SelectItem value="SYSTEM">نظام</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                <SelectItem value="CRITICAL">حرج</SelectItem>
                <SelectItem value="HIGH">عالي</SelectItem>
                <SelectItem value="MEDIUM">متوسط</SelectItem>
                <SelectItem value="LOW">منخفض</SelectItem>
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCircle className="ml-2 h-4 w-4" />
                تحديد الكل كمقروء
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد إشعارات مطابقة للفلاتر
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <Badge className={statusColors[notification.deliveryStatus as keyof typeof statusColors]}>
                          {statusLabels[notification.deliveryStatus as keyof typeof statusLabels]}
                        </Badge>
                        <Badge className={priorityColors[notification.priority as keyof typeof priorityColors]}>
                          {priorityLabels[notification.priority as keyof typeof priorityLabels]}
                        </Badge>
                        <Badge variant="outline">
                          {typeLabels[notification.type as keyof typeof typeLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.body}</p>
                      {notification.actionUrl && (
                        <a
                          href={notification.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                        >
                          فتح الرابط
                        </a>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>إلى: {notification.sender?.name || 'نظام'}</div>
                      <div>في: {new Date(notification.createdAt).toLocaleString('ar-EG')}</div>
                      {notification.scheduledFor && (
                        <div>مجدول لـ: {new Date(notification.scheduledFor).toLocaleString('ar-EG')}</div>
                      )}
                    </div>
                  </div>
                  {!notification.readStatus && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CheckCircle className="ml-2 h-3 w-3" />
                      تحديد كمقروء
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Notification Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إرسال إشعار جديد</DialogTitle>
            <DialogDescription>
              قم بإنشاء وإرسال إشعار للمستخدمين
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>نوع الإرسال</Label>
                <Select
                  value={createForm.recipientType}
                  onValueChange={(value: any) => setCreateForm(prev => ({ ...prev, recipientType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">فرد</SelectItem>
                    <SelectItem value="batch">مجموعة</SelectItem>
                    <SelectItem value="role">حسب الدور</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {createForm.recipientType === 'role' && (
                <div className="space-y-2">
                  <Label>دور المستلم</Label>
                  <Select
                    value={createForm.recipientRole}
                    onValueChange={(value: any) => setCreateForm(prev => ({ ...prev, recipientRole: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">مستخدم</SelectItem>
                      <SelectItem value="ADMIN">مدير</SelectItem>
                      <SelectItem value="PRIEST">كاهن</SelectItem>
                      <SelectItem value="SERVANT">خادم</SelectItem>
                      <SelectItem value="PARENT">ولي أمر</SelectItem>
                      <SelectItem value="CHILD">طفل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>القالب</Label>
                <Select
                  value={createForm.templateId}
                  onValueChange={(value: any) => {
                    const template = templates.find(t => t.id === value);
                    if (template) {
                      setCreateForm(prev => ({
                        ...prev,
                        templateId: value,
                        title: template.titleTemplate,
                        body: template.bodyTemplate,
                        type: template.type,
                        priority: template.priority,
                      }));
                    } else {
                      setCreateForm(prev => ({ ...prev, templateId: value }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر قالب (اختياري)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">بدون قالب</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">العنوان</Label>
              <Input
                id="title"
                value={createForm.title}
                onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="عنوان الإشعار"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">المحتوى</Label>
              <Textarea
                id="body"
                value={createForm.body}
                onChange={(e) => setCreateForm(prev => ({ ...prev, body: e.target.value }))}
                placeholder="محتوى الإشعار"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>النوع</Label>
                <Select
                  value={createForm.type}
                  onValueChange={(value: any) => setCreateForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INFO">معلومات</SelectItem>
                    <SelectItem value="URGENT">عاجل</SelectItem>
                    <SelectItem value="REMINDER">تذكير</SelectItem>
                    <SelectItem value="EVENT">فعالية</SelectItem>
                    <SelectItem value="APPOINTMENT">موعدة</SelectItem>
                    <SelectItem value="ANNOUNCEMENT">إعلان</SelectItem>
                    <SelectItem value="SYSTEM">نظام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الأولوية</Label>
                <Select
                  value={createForm.priority}
                  onValueChange={(value: any) => setCreateForm(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">منخفض</SelectItem>
                    <SelectItem value="MEDIUM">متوسط</SelectItem>
                    <SelectItem value="HIGH">عالي</SelectItem>
                    <SelectItem value="CRITICAL">حرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">رابط الصورة (اختياري)</Label>
                <Input
                  id="imageUrl"
                  value={createForm.imageUrl}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionUrl">رابط الإجراء (اختياري)</Label>
                <Input
                  id="actionUrl"
                  value={createForm.actionUrl}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, actionUrl: e.target.value }))}
                  placeholder="https://example.com/action"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledFor">جدولة لـ (اختياري)</Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={createForm.scheduledFor}
                onChange={(e) => setCreateForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSendNotification}>
                <Send className="ml-2 h-4 w-4" />
                إرسال الإشعار
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>قوالب الإشعارات</DialogTitle>
            <DialogDescription>
              إدارة قوالب الإشعارات المستخدمة بشكل متكرر
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">اسم القالب</Label>
              <Input
                id="templateName"
                value={templateForm.name}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="اسم القالب"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titleTemplate">قالب العنوان</Label>
              <Input
                id="titleTemplate"
                value={templateForm.titleTemplate}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, titleTemplate: e.target.value }))}
                placeholder="{{userName}} - {{eventName}}"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyTemplate">قالب المحتوى</Label>
              <Textarea
                id="bodyTemplate"
                value={templateForm.bodyTemplate}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, bodyTemplate: e.target.value }))}
                placeholder="مرحبا {{userName}}، تذكير بالفعالية {{eventName}} في {{eventDate}}"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>النوع</Label>
                <Select
                  value={templateForm.type}
                  onValueChange={(value: any) => setTemplateForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INFO">معلومات</SelectItem>
                    <SelectItem value="URGENT">عاجل</SelectItem>
                    <SelectItem value="REMINDER">تذكير</SelectItem>
                    <SelectItem value="EVENT">فعالية</SelectItem>
                    <SelectItem value="APPOINTMENT">موعدة</SelectItem>
                    <SelectItem value="ANNOUNCEMENT">إعلان</SelectItem>
                    <SelectItem value="SYSTEM">نظام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الأولوية</Label>
                <Select
                  value={templateForm.priority}
                  onValueChange={(value: any) => setTemplateForm(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">منخفض</SelectItem>
                    <SelectItem value="MEDIUM">متوسط</SelectItem>
                    <SelectItem value="HIGH">عالي</SelectItem>
                    <SelectItem value="CRITICAL">حرج</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateDescription">وصف القالب</Label>
              <Textarea
                id="templateDescription"
                value={templateForm.description}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف استخدام هذا القالب"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={templateForm.isActive}
                  onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">نشط</Label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsTemplateOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateTemplate}>
                  إنشاء القالب
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
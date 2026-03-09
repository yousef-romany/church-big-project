"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MessageSquare, 
  Bell, 
  Users, 
  Send, 
  Mail, 
  Phone,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  recipient: string;
  group: string;
  subject: string;
  content: string;
  status: 'sent' | 'pending' | 'draft';
  timestamp: Date;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
  read: boolean;
}

export default function CommunicationToolsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      recipient: 'خدام مدارس الأحد',
      group: 'all',
      subject: 'اجتماع يوم الأحد',
      content: 'الرجاء الحضور لاجتماع مدارس الأحد يوم الأحد القادم الساعة 5 مساء.',
      status: 'sent',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
    },
    {
      id: '2',
      recipient: 'آباء وأمهات',
      group: 'parents',
      subject: 'رحلة الصيف',
      content: 'نعلن عن بدء التسجيل في رحلة الصيف القادمة. موعد التسجيل ينتهي يوم 15 يونيو.',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
    }
  ]);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'تم تأكيد الحضور',
      message: 'الخادم طوني صبحي أكد حضوره لاجتماع يوم الأحد',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: false
    },
    {
      id: '2',
      title: 'تذكير بالزيارة',
      message: 'موعد زيارة أسرة جرجس رؤوف غداً الساعة 4 مساء',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      read: true
    }
  ]);
  
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    group: 'all',
    subject: '',
    content: ''
  });
  
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning'
  });
  
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [isSMSEnabled, setIsSMSEnabled] = useState(false);
  const [isAppEnabled, setIsAppEnabled] = useState(true);
  
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    const message: Message = {
      id: Date.now().toString(),
      recipient: newMessage.recipient,
      group: newMessage.group,
      subject: newMessage.subject,
      content: newMessage.content,
      status: 'pending',
      timestamp: new Date()
    };
    
    setMessages([message, ...messages]);
    setNewMessage({ recipient: '', group: 'all', subject: '', content: '' });
    
    toast({
      title: "تم إرسال الرسالة",
      description: "سيتم إرسال الرسالة إلى المستلمين المحددين"
    });
  };

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى إدخال عنوان ومحتوى الإشعار",
        variant: "destructive"
      });
      return;
    }
    
    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications([notification, ...notifications]);
    setNewNotification({ title: '', message: '', type: 'info' });
    
    toast({
      title: "تم إرسال الإشعار",
      description: "تم إرسال الإشعار بنجاح"
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">أدوات الاتصال والإشعارات</h1>
        <p className="text-muted-foreground">
          إرسال الرسائل للمجموعات المختلفة، وإدارة الإشعارات.
        </p>
      </div>
      
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">الرسائل</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="ml-2 h-5 w-5 text-primary" />
                إرسال رسالة جديدة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">المجموعة المستهدفة</label>
                  <Select value={newMessage.group} onValueChange={(value) => setNewMessage({...newMessage, group: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المجموعة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="servants">خدام</SelectItem>
                      <SelectItem value="parents">آباء وأمهات</SelectItem>
                      <SelectItem value="children">أطفال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">محدد (اختياري)</label>
                  <Input
                    placeholder="اسم شخص محدد"
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">عنوان الرسالة</label>
                <Input
                  placeholder="عنوان الرسالة"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">محتوى الرسالة</label>
                <Textarea
                  placeholder="اكتب رسالتك هنا..."
                  rows={4}
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                />
              </div>
              
              <Button onClick={handleSendMessage} className="w-full">
                <Send className="ml-2 h-4 w-4" />
                إرسال الرسالة
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="ml-2 h-5 w-5 text-primary" />
                الرسائل المرسلة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">لا توجد رسائل مرسلة</p>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 border rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{message.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            إلى: {message.recipient || message.group}
                          </p>
                        </div>
                        <Badge variant={message.status === 'sent' ? 'default' : 'secondary'}>
                          {message.status === 'sent' ? 'تم الإرسال' : 'قيد الانتظار'}
                        </Badge>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.timestamp.toLocaleString('ar-SA')}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="ml-2 h-5 w-5 text-primary" />
                إرسال إشعار جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">عنوان الإشعار</label>
                <Input
                  placeholder="عنوان الإشعار"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">محتوى الإشعار</label>
                <Textarea
                  placeholder="محتوى الإشعار"
                  rows={3}
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">نوع الإشعار</label>
                <Select value={newNotification.type} onValueChange={(value: 'info' | 'success' | 'warning') => setNewNotification({...newNotification, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">معلومات</SelectItem>
                    <SelectItem value="success">نجاح</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleSendNotification} className="w-full">
                <Bell className="ml-2 h-4 w-4" />
                إرسال الإشعار
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="ml-2 h-5 w-5 text-primary" />
                الإشعارات الحالية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">لا توجد إشعارات حالياً</p>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 border rounded-lg cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{notification.title}</h4>
                          <Badge variant={notification.type === 'success' ? 'default' : notification.type === 'warning' ? 'destructive' : 'secondary'}>
                            {notification.type === 'success' ? 'نجاح' : notification.type === 'warning' ? 'تحذير' : 'معلومات'}
                          </Badge>
                        </div>
                        {notification.read ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.timestamp.toLocaleString('ar-SA')}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="ml-2 h-5 w-5 text-primary" />
                إعدادات الاتصال
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">قنوات الإشعارات</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>البريد الإلكتروني</span>
                    </div>
                    <Checkbox
                      checked={isEmailEnabled}
                      onCheckedChange={(checked) => setIsEmailEnabled(checked === true)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>الرسائل النصية (SMS)</span>
                    </div>
                    <Checkbox
                      checked={isSMSEnabled}
                      onCheckedChange={(checked) => setIsSMSEnabled(checked === true)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>إشعارات التطبيق</span>
                    </div>
                    <Checkbox
                      checked={isAppEnabled}
                      onCheckedChange={(checked) => setIsAppEnabled(checked === true)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">الإعدادات المتقدمة</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>إرسال تذكيرات تلقائية</span>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>نسخ carbon للرسائل</span>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>تشفير الرسائل</span>
                    <Checkbox />
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
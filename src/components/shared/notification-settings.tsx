"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, MessageSquare, Clock, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  receiveAnnouncements: boolean;
  receiveMessages: boolean;
  receiveReminders: boolean;
}

export default function NotificationSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    receiveAnnouncements: true,
    receiveMessages: true,
    receiveReminders: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data.settings || settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ إعدادات الإشعارات بنجاح',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حفظ الإعدادات',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          إعدادات الإشعارات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            طرق الإشعارات
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <p className="text-xs text-muted-foreground">استلام الإشعارات عبر البريد الإلكتروني</p>
                </div>
              </div>
              <Switch
                id="email"
                checked={settings.emailEnabled}
                onCheckedChange={(checked) => updateSetting('emailEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="push">الإشعارات الفورية</Label>
                  <p className="text-xs text-muted-foreground">استلام إشعارات فورية على الجهاز</p>
                </div>
              </div>
              <Switch
                id="push"
                checked={settings.pushEnabled}
                onCheckedChange={(checked) => updateSetting('pushEnabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="sms">الرسائل النصية</Label>
                  <p className="text-xs text-muted-foreground">استلام إشعارات عبر الرسائل النصية</p>
                </div>
              </div>
              <Switch
                id="sms"
                checked={settings.smsEnabled}
                onCheckedChange={(checked) => updateSetting('smsEnabled', checked)}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            أوقات الراحة
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quietStart">بداية الراحة</Label>
              <Input
                id="quietStart"
                type="time"
                value={settings.quietHoursStart}
                onChange={(e) => updateSetting('quietHoursStart', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quietEnd">نهاية الراحة</Label>
              <Input
                id="quietEnd"
                type="time"
                value={settings.quietHoursEnd}
                onChange={(e) => updateSetting('quietHoursEnd', e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            لن تتلقى إشعارات خلال هذه الفترة
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold mb-4">أنواع الإشعارات</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="announcements">الإعلانات</Label>
                <p className="text-xs text-muted-foreground">إعلانات الكنيسة والفعاليات</p>
              </div>
              <Switch
                id="announcements"
                checked={settings.receiveAnnouncements}
                onCheckedChange={(checked) => updateSetting('receiveAnnouncements', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="messages">الرسائل</Label>
                <p className="text-xs text-muted-foreground">الرسائل المباشرة من الآخرين</p>
              </div>
              <Switch
                id="messages"
                checked={settings.receiveMessages}
                onCheckedChange={(checked) => updateSetting('receiveMessages', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label htmlFor="reminders">التذكيرات</Label>
                <p className="text-xs text-muted-foreground">تذكيرات المواعيد والمهام</p>
              </div>
              <Switch
                id="reminders"
                checked={settings.receiveReminders}
                onCheckedChange={(checked) => updateSetting('receiveReminders', checked)}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={saveSettings} disabled={saving} className="w-full">
            <Save className="ml-2 h-4 w-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

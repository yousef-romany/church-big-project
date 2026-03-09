'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Shield, 
  ShieldCheck, 
  Trash2, 
  Clock,
  AlertTriangle
} from 'lucide-react';

interface Device {
  id: string;
  token: string;
  deviceInfo: {
    browser?: string;
    os?: string;
    deviceType?: string;
    userAgent?: string;
    ip?: string;
    trusted?: boolean;
  };
  isActive: boolean;
  lastSeenAt: string;
  createdAt: string;
}

export default function DevicesPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokeDialog, setRevokeDialog] = useState<{
    open: boolean;
    deviceId?: string;
    deviceName?: string;
  }>({ open: false });
  const [revokeAllDialog, setRevokeAllDialog] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchDevices();
    }
  }, [session]);

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/auth/devices');
      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices || []);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/auth/devices?deviceId=${deviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'نجاح',
          description: 'تم إلغاء الجهاز بنجاح',
        });
        fetchDevices(); // Refresh the list
      } else {
        throw new Error('فشل إلغاء الجهاز');
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل إلغاء الجهاز',
        variant: 'destructive',
      });
    }
    setRevokeDialog({ open: false });
  };

  const handleRevokeAllOtherDevices = async () => {
    try {
      // Find current device (the most recently active one)
      const currentDevice = devices.reduce((prev, current) => 
        new Date(prev.lastSeenAt) > new Date(current.lastSeenAt) ? prev : current
      );

      const response = await fetch(
        `/api/auth/devices?revokeAll=true&currentToken=${currentDevice.token}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'نجاح',
          description: data.message,
        });
        fetchDevices(); // Refresh the list
      } else {
        throw new Error('فشل إلغاء الأجهزة');
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل إلغاء الأجهزة الأخرى',
        variant: 'destructive',
      });
    }
    setRevokeAllDialog(false);
  };

  const handleTrustDevice = async (deviceId: string) => {
    try {
      const response = await fetch('/api/auth/devices', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          action: 'trust',
        }),
      });

      if (response.ok) {
        toast({
          title: 'نجاح',
          description: 'تمت إضافة الجهاز إلى القائمة الموثوقة',
        });
        fetchDevices(); // Refresh the list
      } else {
        throw new Error('فشل تحديث الجهاز');
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحديث الجهاز',
        variant: 'destructive',
      });
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType) {
      case 'Mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'Tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'الآن';
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else if (diffInHours < 48) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const isCurrentDevice = (device: Device) => {
    // Find the most recently active device
    const mostRecent = devices.reduce((prev, current) => 
      new Date(prev.lastSeenAt) > new Date(current.lastSeenAt) ? prev : current
    );
    return device.id === mostRecent.id;
  };

  if (!session) {
    return <div>يرجى تسجيل الدخول</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">الأجهزة المتصلة</h1>
        <p className="text-muted-foreground mt-2">
          إدارة الأجهزة المسموح لها بالوصول إلى حسابك
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>الأجهزة النشطة</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setRevokeAllDialog(true)}
              disabled={devices.length <= 1}
            >
              إلغاء جميع الأجهزة الأخرى
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : devices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد أجهزة متصلة
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {getDeviceIcon(device.deviceInfo.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {device.deviceInfo.browser} على {device.deviceInfo.os}
                        </span>
                        {isCurrentDevice(device) && (
                          <Badge variant="secondary">الجهاز الحالي</Badge>
                        )}
                        {device.deviceInfo.trusted && (
                          <Badge variant="default" className="gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            موثوق
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {device.deviceInfo.ip}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          آخر نشاط: {formatDate(device.lastSeenAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!device.deviceInfo.trusted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrustDevice(device.id)}
                        className="gap-1"
                      >
                        <Shield className="h-4 w-4" />
                        الوثوق
                      </Button>
                    )}
                    {!isCurrentDevice(device) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRevokeDialog({
                          open: true,
                          deviceId: device.id,
                          deviceName: `${device.deviceInfo.browser} على ${device.deviceInfo.os}`
                        })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revoke Device Dialog */}
      <Dialog open={revokeDialog.open} onOpenChange={(open) => setRevokeDialog({ ...revokeDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              تأكيد إلغاء الجهاز
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد إلغاء هذا الجهاز؟
              <br />
              <span className="font-medium">{revokeDialog.deviceName}</span>
              <br />
              سيتم تسجيل الخروج من هذا الجهاز ولن يتمكن من الوصول إلى حسابك.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialog({ open: false })}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => revokeDialog.deviceId && handleRevokeDevice(revokeDialog.deviceId)}
            >
              إلغاء الجهاز
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke All Dialog */}
      <Dialog open={revokeAllDialog} onOpenChange={setRevokeAllDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              تأكيد إلغاء جميع الأجهزة
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد إلغاء جميع الأجهزة باستثناء الجهاز الحالي؟
              <br />
              سيتم تسجيل الخروج من جميع الأجهزة الأخرى وستحتاج إلى تسجيل الدخول مرة أخرى.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeAllDialog(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRevokeAllOtherDevices}
            >
              إلغاء جميع الأجهزة الأخرى
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Smartphone, 
  Key, 
  Lock, 
  Unlock,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Smartphone as PhoneIcon,
  Mail,
  QrCode,
  Save,
  Trash2
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const securitySettings = {
  mfa: {
    enabled: false,
    methods: ['email', 'sms', 'authenticator'],
    defaultMethod: 'email'
  },
  sessions: {
    timeout: 60,
    maxConcurrentSessions: 3,
    allowMultipleDevices: true,
    requireReauth: false,
    sessionTracking: true
  },
  accessLogs: {
    enabled: true,
    retentionDays: 90,
    includeIp: true,
    includeUserAgent: true
  },
  securityAlerts: {
    failedLoginAttempts: true,
    passwordChanges: true,
    accountLockouts: true,
    privilegedActions: true,
    unusualActivity: true
  }
};

const activeSessions = [
  {
    id: '1',
    device: 'Chrome on Windows',
    ip: '192.168.1.100',
    location: 'القاهرة، مصر',
    loginTime: '2024-03-04 08:30:00',
    lastActivity: '2024-03-04 14:22:00',
    current: true
  },
  {
    id: '2',
    device: 'Safari on iPhone',
    ip: '192.168.1.105',
    location: 'القاهرة، مصر',
    loginTime: '2024-03-03 19:45:00',
    lastActivity: '2024-03-04 09:15:00',
    current: false
  },
  {
    id: '3',
    device: 'Chrome on Android',
    ip: '192.168.1.108',
    location: 'القاهرة، مصر',
    loginTime: '2024-03-02 10:20:00',
    lastActivity: '2024-03-04 07:30:00',
    current: false
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut"
    }
  }
};

export default function SecuritySettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(securitySettings);
  const [showMfaSecret, setShowMfaSecret] = useState(false);
  const [isSetupMfa, setIsSetupMfa] = useState(false);
  const [activeTab, setActiveTab] = useState('mfa');
  const [sessions, setSessions] = useState(activeSessions);

  const handleSaveSettings = () => {
    toast({
      title: 'تم الحفظ',
      description: 'تم حفظ إعدادات الأمان بنجاح.',
    });
  };

  const handleEnableMfa = () => {
    setIsSetupMfa(true);
  };

  const handleDisableMfa = () => {
    if (confirm('هل أنت متأكد من أنك تريد تعطيل المصادقة الثنائية؟')) {
      setSettings(prev => ({
        ...prev,
        mfa: { ...prev.mfa, enabled: false }
      }));
      toast({
        title: 'تم التعطيل',
        description: 'تم تعطيل المصادقة الثنائية.',
      });
    }
  };

  const handleCompleteMfaSetup = () => {
    setSettings(prev => ({
      ...prev,
      mfa: { ...prev.mfa, enabled: true }
    }));
    setIsSetupMfa(false);
    toast({
      title: 'تم التفعيل',
      description: 'تم تفعيل المصادقة الثنائية بنجاح.',
    });
  };

  const handleRevokeSession = (sessionId: string) => {
    if (confirm('هل أنت متأكد من أنك تريد إنهاء هذه الجلسة؟')) {
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      toast({
        title: 'تم إنهاء الجلسة',
        description: 'تم إنهاء الجلسة المحددة بنجاح.',
      });
    }
  };

  const handleRevokeAllSessions = () => {
    if (confirm('هل أنت متأكد من أنك تريد إنهاء جميع الجلسات؟ سيتم تسجيل خروجك من جميع الأجهزة.')) {
      setSessions([sessions.find(s => s.current) as typeof sessions[0]]);
      toast({
        title: 'تم إنهاء جميع الجلسات',
        description: 'تم إنهاء جميع الجلسات ما عدا الجلسة الحالية.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">إعدادات الأمان</h1>
        <p className="text-red-100">إدارة المصادقة الثنائية والجلسات والتحكم في الوصول.</p>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mfa">المصادقة الثنائية</TabsTrigger>
            <TabsTrigger value="sessions">الجلسات</TabsTrigger>
            <TabsTrigger value="logs">السجلات والتنبيهات</TabsTrigger>
          </TabsList>

          <TabsContent value="mfa" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="ml-2 h-5 w-5" />
                  المصادقة الثنائية (MFA)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!settings.mfa.enabled ? (
                  <div className="text-center py-6">
                    <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">المصادقة الثنائية غير مفعلة</h3>
                    <p className="text-muted-foreground mb-4">
                      قم بتفعيل المصادقة الثنائية لإضافة طبقة إضافية من الأمان لحسابك
                    </p>
                    <Button onClick={handleEnableMfa} className="flex items-center">
                      <Lock className="ml-2 h-4 w-4" />
                      تفعيل المصادقة الثنائية
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                        <div>
                          <h4 className="font-medium">المصادقة الثنائية مفعلة</h4>
                          <p className="text-sm text-muted-foreground">
                            طريقة المصادقة الافتراضية: {settings.mfa.defaultMethod === 'email' ? 'البريد الإلكتروني' : 
                            settings.mfa.defaultMethod === 'sms' ? 'الرسائل النصية' : 'تطبيق المصادقة'}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={handleDisableMfa} className="text-red-600 hover:text-red-800">
                        <Unlock className="ml-2 h-4 w-4" />
                        تعطيل
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Label>طرق المصادقة المتاحة</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 ml-2" />
                            <span>البريد الإلكتروني</span>
                          </div>
                          <Badge variant={settings.mfa.methods.includes('email') ? 'default' : 'secondary'}>
                            {settings.mfa.methods.includes('email') ? 'مفعل' : 'غير مفعل'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 ml-2" />
                            <span>الرسائل النصية</span>
                          </div>
                          <Badge variant={settings.mfa.methods.includes('sms') ? 'default' : 'secondary'}>
                            {settings.mfa.methods.includes('sms') ? 'مفعل' : 'غير مفعل'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <Key className="h-4 w-4 ml-2" />
                            <span>تطبيق المصادقة</span>
                          </div>
                          <Badge variant={settings.mfa.methods.includes('authenticator') ? 'default' : 'secondary'}>
                            {settings.mfa.methods.includes('authenticator') ? 'مفعل' : 'غير مفعل'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex items-center">
                        <Smartphone className="ml-2 h-4 w-4" />
                        إعداد تطبيق المصادقة
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <PhoneIcon className="ml-2 h-4 w-4" />
                        تغيير رقم الهاتف
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="ml-2 h-5 w-5" />
                    الجلسات النشطة
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRevokeAllSessions}>
                    إنهاء جميع الجلسات
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">مهلة الجلسة (دقائق)</Label>
                      <Input 
                        id="sessionTimeout" 
                        type="number" 
                        value={settings.sessions.timeout}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          sessions: { ...prev.sessions, timeout: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxConcurrentSessions">الحد الأقصى للجلسات المتزامنة</Label>
                      <Input 
                        id="maxConcurrentSessions" 
                        type="number" 
                        value={settings.sessions.maxConcurrentSessions}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          sessions: { ...prev.sessions, maxConcurrentSessions: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowMultipleDevices">السماح بأجهزة متعددة</Label>
                        <p className="text-sm text-muted-foreground">
                          السماح بتسجيل الدخول من عدة أجهزة في نفس الوقت
                        </p>
                      </div>
                      <Switch 
                        id="allowMultipleDevices"
                        checked={settings.sessions.allowMultipleDevices}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          sessions: { ...prev.sessions, allowMultipleDevices: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requireReauth">يتطلب إعادة المصادقة</Label>
                        <p className="text-sm text-muted-foreground">
                          يتطلب إعادة المصادقة للإجراءات الحساسة
                        </p>
                      </div>
                      <Switch 
                        id="requireReauth"
                        checked={settings.sessions.requireReauth}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          sessions: { ...prev.sessions, requireReauth: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sessionTracking">تتبع الجلسات</Label>
                        <p className="text-sm text-muted-foreground">
                          تتبع الجلسات النشطة والموقع الجغرافي
                        </p>
                      </div>
                      <Switch 
                        id="sessionTracking"
                        checked={settings.sessions.sessionTracking}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          sessions: { ...prev.sessions, sessionTracking: checked }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-3">الجلسات النشطة حالياً</h4>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>الجهاز</TableHead>
                            <TableHead>الموقع</TableHead>
                            <TableHead>آخر نشاط</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sessions.map((session) => (
                            <TableRow key={session.id}>
                              <TableCell>
                                <div className="flex items-center">
                                  <PhoneIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">{session.device}</div>
                                    <div className="text-sm text-muted-foreground">{session.ip}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{session.location}</TableCell>
                              <TableCell>{session.lastActivity}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {session.current && (
                                    <Badge variant="default">حالية</Badge>
                                  )}
                                  {!session.current && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRevokeSession(session.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="ml-2 h-5 w-5" />
                    سجلات الوصول
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="logsEnabled">تفعيل سجلات الوصول</Label>
                      <p className="text-sm text-muted-foreground">
                        تسجيل جميع محاولات الوصول إلى النظام
                      </p>
                    </div>
                    <Switch 
                      id="logsEnabled"
                      checked={settings.accessLogs.enabled}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        accessLogs: { ...prev.accessLogs, enabled: checked }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retentionDays">فترة الاحتفاظ بالسجلات (أيام)</Label>
                    <Input 
                      id="retentionDays" 
                      type="number" 
                      value={settings.accessLogs.retentionDays}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        accessLogs: { ...prev.accessLogs, retentionDays: parseInt(e.target.value) }
                      }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeIp">تضمين عناوين IP</Label>
                      <Switch 
                        id="includeIp"
                        checked={settings.accessLogs.includeIp}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          accessLogs: { ...prev.accessLogs, includeIp: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeUserAgent">تضمين معلومات المتصفح</Label>
                      <Switch 
                        id="includeUserAgent"
                        checked={settings.accessLogs.includeUserAgent}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          accessLogs: { ...prev.accessLogs, includeUserAgent: checked }
                        }))}
                      />
                    </div>
                  </div>

                  <Button variant="outline" className="flex items-center w-full">
                    <Download className="ml-2 h-4 w-4" />
                    تصدير سجلات الوصول
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="ml-2 h-5 w-5" />
                    تنبيهات الأمان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="failedLoginAttempts">محاولات تسجيل الدخول الفاشلة</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال تنبيه عند محاولات الدخول الفاشلة
                      </p>
                    </div>
                    <Switch 
                      id="failedLoginAttempts"
                      checked={settings.securityAlerts.failedLoginAttempts}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        securityAlerts: { ...prev.securityAlerts, failedLoginAttempts: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="passwordChanges">تغييرات كلمة المرور</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال تنبيه عند تغيير كلمات المرور
                      </p>
                    </div>
                    <Switch 
                      id="passwordChanges"
                      checked={settings.securityAlerts.passwordChanges}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        securityAlerts: { ...prev.securityAlerts, passwordChanges: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="accountLockouts">قفل الحسابات</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال تنبيه عند قفل الحسابات
                      </p>
                    </div>
                    <Switch 
                      id="accountLockouts"
                      checked={settings.securityAlerts.accountLockouts}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        securityAlerts: { ...prev.securityAlerts, accountLockouts: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="privilegedActions">الإجراءات المميزة</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال تنبيه عند تنفيذ إجراءات مميزة
                      </p>
                    </div>
                    <Switch 
                      id="privilegedActions"
                      checked={settings.securityAlerts.privilegedActions}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        securityAlerts: { ...prev.securityAlerts, privilegedActions: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="unusualActivity">النشاط غير المعتاد</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال تنبيه عند اكتشاف نشاط غير معتاد
                      </p>
                    </div>
                    <Switch 
                      id="unusualActivity"
                      checked={settings.securityAlerts.unusualActivity}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        securityAlerts: { ...prev.securityAlerts, unusualActivity: checked }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-end"
      >
        <Button 
          onClick={handleSaveSettings}
          className="flex items-center"
        >
          <Save className="ml-2 h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </motion.div>

      {/* MFA Setup Dialog */}
      <Dialog open={isSetupMfa} onOpenChange={setIsSetupMfa}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إعداد المصادقة الثنائية</DialogTitle>
            <DialogDescription>
              قم بتفعيل المصادقة الثنائية لإضافة طبقة إضافية من الأمان لحسابك
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>اختر طريقة المصادقة الافتراضية</Label>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center space-x-reverse space-x-2 border rounded-lg p-3">
                  <Mail className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">البريد الإلكتروني</div>
                    <div className="text-sm text-muted-foreground">admin@example.com</div>
                  </div>
                  <input type="radio" name="mfa-method" value="email" className="ml-2" />
                </div>
                <div className="flex items-center space-x-reverse space-x-2 border rounded-lg p-3">
                  <Smartphone className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">الرسائل النصية</div>
                    <div className="text-sm text-muted-foreground">+20 1012345678</div>
                  </div>
                  <input type="radio" name="mfa-method" value="sms" className="ml-2" />
                </div>
                <div className="flex items-center space-x-reverse space-x-2 border rounded-lg p-3">
                  <Key className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">تطبيق المصادقة</div>
                    <div className="text-sm text-muted-foreground">Google Authenticator</div>
                  </div>
                  <input type="radio" name="mfa-method" value="authenticator" className="ml-2" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsSetupMfa(false)}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button 
                onClick={handleCompleteMfaSetup}
              >
                تفعيل المصادقة الثنائية
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
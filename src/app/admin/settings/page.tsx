"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Shield, 
  Database, 
  Bell,
  Globe,
  Mail,
  Smartphone,
  Users,
  FileText,
  HardDrive,
  Zap,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Brain,
  Cloud,
  Key,
  Plug
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - replace with actual API calls
const systemSettings = {
  general: {
    siteName: 'نظام إدارة الكنيسة',
    siteUrl: 'https://church-management.example.com',
    defaultLanguage: 'ar',
    timezone: 'Africa/Cairo',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true
  },
  security: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    twoFactorAuth: false
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emailSettings: {
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'noreply@example.com',
      smtpPassword: '********',
      fromEmail: 'noreply@example.com',
      fromName: 'نظام إدارة الكنيسة'
    }
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetentionDays: 30,
    lastBackupDate: '2024-03-04 02:00:00',
    nextBackupDate: '2024-03-05 02:00:00'
  },
  ai: {
    aiEnabled: true,
    aiProvider: 'openai',
    apiKey: 'sk-*********************',
    model: 'gpt-4',
    maxTokens: 1000,
    temperature: 0.7,
    features: {
      contentGeneration: true,
      translation: true,
      summarization: false,
      smartSearch: true,
      recommendation: true
    }
  },
  integrations: {
    paymentGateway: {
      enabled: false,
      provider: 'stripe',
      publicKey: 'pk_test_*********************',
      secretKey: 'sk_test_*********************'
    },
    smsService: {
      enabled: false,
      provider: 'twilio',
      accountSid: 'AC*********************',
      authToken: '*********************',
      phoneNumber: '+1234567890'
    },
    cloudStorage: {
      enabled: false,
      provider: 'aws-s3',
      bucket: 'church-management-files',
      region: 'us-east-1',
      accessKey: 'AKIA*********************',
      secretKey: '*********************'
    }
  },
  system: {
    version: '1.0.0',
    buildDate: '2024-03-01',
    phpVersion: '8.2.12',
    databaseVersion: 'PostgreSQL 15.2',
    diskUsage: '45.2 GB',
    diskQuota: '100 GB'
  }
};

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

export default function AdministrativeControls() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(systemSettings);
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ إعدادات النظام بنجاح.',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حفظ إعدادات النظام.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackupNow = async () => {
    toast({
      title: 'النسخ الاحتياطي',
      description: 'جاري إنشاء نسخة احتياطية...',
    });
    
    // Simulate backup process
    setTimeout(() => {
      toast({
        title: 'اكتمل النسخ الاحتياطي',
        description: 'تم إنشاء نسخة احتياطية بنجاح.',
      });
    }, 3000);
  };

  const handleRestoreBackup = () => {
    toast({
      title: 'استعادة النسخة الاحتياطية',
      description: 'جاري استعادة النسخة الاحتياطية...',
    });
  };

  const handleExportLogs = () => {
    toast({
      title: 'تصدير السجلات',
      description: 'جاري تصدير سجلات النظام...',
    });
  };

  const handleClearCache = () => {
    toast({
      title: 'مسح ذاكرة التخزين المؤقت',
      description: 'جاري مسح ذاكرة التخزين المؤقت...',
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">التحكم الإداري</h1>
        <p className="text-blue-100">إعدادات النظام والتحكم في الوصول والأمان والنسخ الاحتياطي.</p>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">عام</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
            <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
            <TabsTrigger value="integrations">التكاملات</TabsTrigger>
            <TabsTrigger value="system">النظام</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="ml-2 h-5 w-5" />
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">اسم الموقع</Label>
                    <Input 
                      id="siteName" 
                      value={settings.general.siteName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, siteName: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">رابط الموقع</Label>
                    <Input 
                      id="siteUrl" 
                      value={settings.general.siteUrl}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, siteUrl: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">اللغة الافتراضية</Label>
                    <Select 
                      value={settings.general.defaultLanguage}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, defaultLanguage: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">المنطقة الزمنية</Label>
                    <Select 
                      value={settings.general.timezone}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, timezone: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Cairo">أفريقيا/القاهرة</SelectItem>
                        <SelectItem value="Asia/Riyadh">آسيا/الرياض</SelectItem>
                        <SelectItem value="Europe/London">أوروبا/لندن</SelectItem>
                        <SelectItem value="America/New_York">أمريكا/نيويورك</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode">وضع الصيانة</Label>
                      <p className="text-sm text-muted-foreground">
                        تعطيل الوصول إلى الموقع للصيانة
                      </p>
                    </div>
                    <Switch 
                      id="maintenanceMode"
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, maintenanceMode: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowRegistration">السماح بالتسجيل</Label>
                      <p className="text-sm text-muted-foreground">
                        السماح للمستخدمين الجدد بالتسجيل في النظام
                      </p>
                    </div>
                    <Switch 
                      id="allowRegistration"
                      checked={settings.general.allowRegistration}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, allowRegistration: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="requireEmailVerification">تطلب التحقق من البريد الإلكتروني</Label>
                      <p className="text-sm text-muted-foreground">
                        يتطلب من المستخدمين التحقق من بريدهم الإلكتروني
                      </p>
                    </div>
                    <Switch 
                      id="requireEmailVerification"
                      checked={settings.general.requireEmailVerification}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, requireEmailVerification: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="ml-2 h-5 w-5" />
                  إعدادات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>إعدادات الأمان المتقدمة</Label>
          <div className="flex items-center justify-between p-3 border rounded-lg mb-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 ml-2" />
              <div>
                <div className="font-medium">إعدادات الأمان المتقدمة</div>
                <div className="text-sm text-muted-foreground">المصادقة الثنائية والجلسات والسجلات</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              إدارة
            </Button>
          </div>

          <Label>متطلبات كلمة المرور</Label>
          <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passwordMinLength">الطول الأدنى</Label>
                      <div className="flex items-center space-x-reverse space-x-2">
                        <Input 
                          id="passwordMinLength" 
                          type="number" 
                          className="w-20"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, passwordMinLength: parseInt(e.target.value) }
                          }))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passwordRequireUppercase">يتطلب أحرف كبيرة</Label>
                      <Switch 
                        id="passwordRequireUppercase"
                        checked={settings.security.passwordRequireUppercase}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, passwordRequireUppercase: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passwordRequireNumbers">يتطلب أرقام</Label>
                      <Switch 
                        id="passwordRequireNumbers"
                        checked={settings.security.passwordRequireNumbers}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, passwordRequireNumbers: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passwordRequireSpecialChars">يتطلب أحرف خاصة</Label>
                      <Switch 
                        id="passwordRequireSpecialChars"
                        checked={settings.security.passwordRequireSpecialChars}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, passwordRequireSpecialChars: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>إعدادات الجلسة</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sessionTimeout">مهلة الجلسة (دقائق)</Label>
                      <Input 
                        id="sessionTimeout" 
                        type="number" 
                        className="w-20"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maxLoginAttempts">محاولات تسجيل الدخول القصوى</Label>
                      <Input 
                        id="maxLoginAttempts" 
                        type="number" 
                        className="w-20"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lockoutDuration">مدة القفل (دقائق)</Label>
                      <Input 
                        id="lockoutDuration" 
                        type="number" 
                        className="w-20"
                        value={settings.security.lockoutDuration}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, lockoutDuration: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="twoFactorAuth">المصادقة الثنائية</Label>
                      <Switch 
                        id="twoFactorAuth"
                        checked={settings.security.twoFactorAuth}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactorAuth: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="ml-2 h-5 w-5" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">الإشعارات البريدية</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال الإشعارات عبر البريد الإلكتروني
                      </p>
                    </div>
                    <Switch 
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailNotifications: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">الإشعارات عبر الرسائل النصية</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال الإشعارات عبر الرسائل النصية القصيرة
                      </p>
                    </div>
                    <Switch 
                      id="smsNotifications"
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, smsNotifications: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">الإشعارات الفورية</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال الإشعارات الفورية للمتصفح
                      </p>
                    </div>
                    <Switch 
                      id="pushNotifications"
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, pushNotifications: checked }
                      }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>إعدادات البريد الإلكتروني</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpServer">خادم SMTP</Label>
                      <Input 
                        id="smtpServer" 
                        value={settings.notifications.emailSettings.smtpServer}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { 
                            ...prev.notifications, 
                            emailSettings: { 
                              ...prev.notifications.emailSettings, 
                              smtpServer: e.target.value 
                            } 
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">منفذ SMTP</Label>
                      <Input 
                        id="smtpPort" 
                        value={settings.notifications.emailSettings.smtpPort}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { 
                            ...prev.notifications, 
                            emailSettings: { 
                              ...prev.notifications.emailSettings, 
                              smtpPort: parseInt(e.target.value) 
                            } 
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">اسم المستخدم</Label>
                      <Input 
                        id="smtpUsername" 
                        value={settings.notifications.emailSettings.smtpUsername}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { 
                            ...prev.notifications, 
                            emailSettings: { 
                              ...prev.notifications.emailSettings, 
                              smtpUsername: e.target.value 
                            } 
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">كلمة المرور</Label>
                      <div className="relative">
                        <Input 
                          id="smtpPassword" 
                          type={showPasswords ? "text" : "password"}
                          value={settings.notifications.emailSettings.smtpPassword}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notifications: { 
                              ...prev.notifications, 
                              emailSettings: { 
                                ...prev.notifications.emailSettings, 
                                smtpPassword: e.target.value 
                              } 
                            }
                          }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute left-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">البريد الإلكتروني للمرسل</Label>
                      <Input 
                        id="fromEmail" 
                        value={settings.notifications.emailSettings.fromEmail}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { 
                            ...prev.notifications, 
                            emailSettings: { 
                              ...prev.notifications.emailSettings, 
                              fromEmail: e.target.value 
                            } 
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromName">اسم المرسل</Label>
                      <Input 
                        id="fromName" 
                        value={settings.notifications.emailSettings.fromName}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { 
                            ...prev.notifications, 
                            emailSettings: { 
                              ...prev.notifications.emailSettings, 
                              fromName: e.target.value 
                            } 
                          }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="ml-2 h-5 w-5" />
                  النسخ الاحتياطي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoBackup">النسخ الاحتياطي التلقائي</Label>
                      <p className="text-sm text-muted-foreground">
                        إنشاء نسخ احتياطية تلقائية بشكل دوري
                      </p>
                    </div>
                    <Switch 
                      id="autoBackup"
                      checked={settings.backup.autoBackup}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        backup: { ...prev.backup, autoBackup: checked }
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">تكرار النسخ الاحتياطي</Label>
                      <Select 
                        value={settings.backup.backupFrequency}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          backup: { ...prev.backup, backupFrequency: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">يومياً</SelectItem>
                          <SelectItem value="weekly">أسبوعياً</SelectItem>
                          <SelectItem value="monthly">شهرياً</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupRetentionDays">فترة الاحتفاظ بالنسخ (أيام)</Label>
                      <Input 
                        id="backupRetentionDays" 
                        type="number" 
                        value={settings.backup.backupRetentionDays}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          backup: { ...prev.backup, backupRetentionDays: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>آخر نسخة احتياطية</Label>
                    <p className="text-sm">{settings.backup.lastBackupDate}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>النسخة الاحتياطية القادمة</Label>
                    <p className="text-sm">{settings.backup.nextBackupDate}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleBackupNow}
                    className="flex items-center"
                  >
                    <Download className="ml-2 h-4 w-4" />
                    نسخ احتياطي الآن
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRestoreBackup}
                    className="flex items-center"
                  >
                    <Upload className="ml-2 h-4 w-4" />
                    استعادة نسخة احتياطية
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="ml-2 h-5 w-5" />
                  إعدادات الذكاء الاصطناعي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="aiEnabled">تفعيل الذكاء الاصطناعي</Label>
                    <p className="text-sm text-muted-foreground">
                      تفعيل ميزات الذكاء الاصطناعي في النظام
                    </p>
                  </div>
                  <Switch 
                    id="aiEnabled"
                    checked={settings.ai.aiEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, aiEnabled: checked }
                    }))}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aiProvider">مزود الذكاء الاصطناعي</Label>
                      <Select 
                        value={settings.ai.aiProvider}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          ai: { ...prev.ai, aiProvider: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="google-ai">Google AI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="azure">Azure AI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">النموذج</Label>
                      <Select 
                        value={settings.ai.model}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          ai: { ...prev.ai, model: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="text-davinci-003">Text Davinci-003</SelectItem>
                          <SelectItem value="text-curie-001">Text Curie-001</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxTokens">الحد الأقصى للرموز</Label>
                      <Input 
                        id="maxTokens" 
                        type="number" 
                        value={settings.ai.maxTokens}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          ai: { ...prev.ai, maxTokens: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">درجة الحرارة</Label>
                      <Input 
                        id="temperature" 
                        type="number" 
                        step="0.1"
                        min="0"
                        max="1"
                        value={settings.ai.temperature}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          ai: { ...prev.ai, temperature: parseFloat(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">مفتاح API</Label>
                    <div className="relative">
                      <Input 
                        id="apiKey" 
                        type={showPasswords ? "text" : "password"}
                        value={settings.ai.apiKey}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          ai: { ...prev.ai, apiKey: e.target.value }
                        }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>الميزات المفعلة</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="contentGeneration">توليد المحتوى</Label>
                        <Switch 
                          id="contentGeneration"
                          checked={settings.ai.features.contentGeneration}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            ai: { 
                              ...prev.ai, 
                              features: { ...prev.ai.features, contentGeneration: checked }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="translation">الترجمة</Label>
                        <Switch 
                          id="translation"
                          checked={settings.ai.features.translation}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            ai: { 
                              ...prev.ai, 
                              features: { ...prev.ai.features, translation: checked }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="summarization">التلخيص</Label>
                        <Switch 
                          id="summarization"
                          checked={settings.ai.features.summarization}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            ai: { 
                              ...prev.ai, 
                              features: { ...prev.ai.features, summarization: checked }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smartSearch">البحث الذكي</Label>
                        <Switch 
                          id="smartSearch"
                          checked={settings.ai.features.smartSearch}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            ai: { 
                              ...prev.ai, 
                              features: { ...prev.ai.features, smartSearch: checked }
                            }
                          }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="recommendation">التوصيات</Label>
                        <Switch 
                          id="recommendation"
                          checked={settings.ai.features.recommendation}
                          onCheckedChange={(checked) => setSettings(prev => ({
                            ...prev,
                            ai: { 
                              ...prev.ai, 
                              features: { ...prev.ai.features, recommendation: checked }
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plug className="ml-2 h-5 w-5" />
                  التكاملات الخارجية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paymentGatewayEnabled">بوابة الدفع</Label>
                      <p className="text-sm text-muted-foreground">
                        تفعيل معالجة الدفعات الإلكترونية
                      </p>
                    </div>
                    <Switch 
                      id="paymentGatewayEnabled"
                      checked={settings.integrations.paymentGateway.enabled}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        integrations: { 
                          ...prev.integrations, 
                          paymentGateway: { ...prev.integrations.paymentGateway, enabled: checked }
                        }
                      }))}
                    />
                  </div>
                  
                  {settings.integrations.paymentGateway.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentProvider">مزود الدفع</Label>
                        <Select 
                          value={settings.integrations.paymentGateway.provider}
                          onValueChange={(value) => setSettings(prev => ({
                            ...prev,
                            integrations: { 
                              ...prev.integrations, 
                              paymentGateway: { ...prev.integrations.paymentGateway, provider: value }
                            }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="razorpay">Razorpay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="publicKey">المفتاح العام</Label>
                        <Input 
                          id="publicKey" 
                          value={settings.integrations.paymentGateway.publicKey}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            integrations: { 
                              ...prev.integrations, 
                              paymentGateway: { ...prev.integrations.paymentGateway, publicKey: e.target.value }
                            }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secretKey">المفتاح السري</Label>
                        <div className="relative">
                          <Input 
                            id="secretKey" 
                            type={showPasswords ? "text" : "password"}
                            value={settings.integrations.paymentGateway.secretKey}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              integrations: { 
                                ...prev.integrations, 
                                paymentGateway: { ...prev.integrations.paymentGateway, secretKey: e.target.value }
                              }
                            }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute left-0 top-0 h-full px-3 py-2"
                            onClick={() => setShowPasswords(!showPasswords)}
                          >
                            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsServiceEnabled">خدمة الرسائل النصية</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال الرسائل النصية القصيرة
                      </p>
                    </div>
                    <Switch 
                      id="smsServiceEnabled"
                      checked={settings.integrations.smsService.enabled}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        integrations: { 
                          ...prev.integrations, 
                          smsService: { ...prev.integrations.smsService, enabled: checked }
                        }
                      }))}
                    />
                  </div>
                  
                  {settings.integrations.smsService.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smsProvider">مزود الرسائل</Label>
                        <Select 
                          value={settings.integrations.smsService.provider}
                          onValueChange={(value) => setSettings(prev => ({
                            ...prev,
                            integrations: { 
                              ...prev.integrations, 
                              smsService: { ...prev.integrations.smsService, provider: value }
                            }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="twilio">Twilio</SelectItem>
                            <SelectItem value="nexmo">Nexmo</SelectItem>
                            <SelectItem value="messagebird">MessageBird</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountSid">معرف الحساب</Label>
                        <Input 
                          id="accountSid" 
                          value={settings.integrations.smsService.accountSid}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            integrations: { 
                              ...prev.integrations, 
                              smsService: { ...prev.integrations.smsService, accountSid: e.target.value }
                            }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="authToken">رمز المصادقة</Label>
                        <div className="relative">
                          <Input 
                            id="authToken" 
                            type={showPasswords ? "text" : "password"}
                            value={settings.integrations.smsService.authToken}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              integrations: { 
                                ...prev.integrations, 
                                smsService: { ...prev.integrations.smsService, authToken: e.target.value }
                              }
                            }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute left-0 top-0 h-full px-3 py-2"
                            onClick={() => setShowPasswords(!showPasswords)}
                          >
                            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                        <Input 
                          id="phoneNumber" 
                          value={settings.integrations.smsService.phoneNumber}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            integrations: { 
                              ...prev.integrations, 
                              smsService: { ...prev.integrations.smsService, phoneNumber: e.target.value }
                            }
                          }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cloudStorageEnabled">التخزين السحابي</Label>
                      <p className="text-sm text-muted-foreground">
                        تخزين الملفات في السحابة
                      </p>
                    </div>
                    <Switch 
                      id="cloudStorageEnabled"
                      checked={settings.integrations.cloudStorage.enabled}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        integrations: { 
                          ...prev.integrations, 
                          cloudStorage: { ...prev.integrations.cloudStorage, enabled: checked }
                        }
                      }))}
                    />
                  </div>
                  
                  {settings.integrations.cloudStorage.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cloudProvider">مزود التخزين</Label>
                        <Select 
                          value={settings.integrations.cloudStorage.provider}
                          onValueChange={(value) => setSettings(prev => ({
                            ...prev,
                            integrations: { 
                              ...prev.integrations, 
                              cloudStorage: { ...prev.integrations.cloudStorage, provider: value }
                            }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aws-s3">AWS S3</SelectItem>
                            <SelectItem value="google-cloud">Google Cloud Storage</SelectItem>
                            <SelectItem value="azure-blob">Azure Blob Storage</SelectItem>
                            <SelectItem value="digitalocean">DigitalOcean Spaces</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bucket">حاوية التخزين</Label>
                        <Input 
                          id="bucket" 
                          value={settings.integrations.cloudStorage.bucket}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            integrations: { 
                              ...prev.integrations, 
                              cloudStorage: { ...prev.integrations.cloudStorage, bucket: e.target.value }
                            }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="region">المنطقة</Label>
                        <Select 
                          value={settings.integrations.cloudStorage.region}
                          onValueChange={(value) => setSettings(prev => ({
                            ...prev,
                            integrations: { 
                              ...prev.integrations, 
                              cloudStorage: { ...prev.integrations.cloudStorage, region: value }
                            }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us-east-1">US East 1</SelectItem>
                            <SelectItem value="us-west-2">US West 2</SelectItem>
                            <SelectItem value="eu-west-1">EU West 1</SelectItem>
                            <SelectItem value="me-south-1">Middle East South 1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accessKey">مفتاح الوصول</Label>
                        <Input 
                          id="accessKey" 
                          value={settings.integrations.cloudStorage.accessKey}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            integrations: { 
                              ...prev.integrations, 
                              cloudStorage: { ...prev.integrations.cloudStorage, accessKey: e.target.value }
                            }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secretAccessKey">مفتاح الوصول السري</Label>
                        <div className="relative">
                          <Input 
                            id="secretAccessKey" 
                            type={showPasswords ? "text" : "password"}
                            value={settings.integrations.cloudStorage.secretKey}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              integrations: { 
                                ...prev.integrations, 
                                cloudStorage: { ...prev.integrations.cloudStorage, secretKey: e.target.value }
                              }
                            }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute left-0 top-0 h-full px-3 py-2"
                            onClick={() => setShowPasswords(!showPasswords)}
                          >
                            {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="ml-2 h-5 w-5" />
                  معلومات النظام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>إصدار النظام</Label>
                    <p className="text-sm">{settings.system.version}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>تاريخ البناء</Label>
                    <p className="text-sm">{settings.system.buildDate}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>إصدار PHP</Label>
                    <p className="text-sm">{settings.system.phpVersion}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>إصدار قاعدة البيانات</Label>
                    <p className="text-sm">{settings.system.databaseVersion}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>استخدام القرص</Label>
                    <p className="text-sm">{settings.system.diskUsage} من {settings.system.diskQuota}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleClearCache}
                    className="flex items-center"
                  >
                    <RefreshCw className="ml-2 h-4 w-4" />
                    مسح ذاكرة التخزين المؤقت
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleExportLogs}
                    className="flex items-center"
                  >
                    <FileText className="ml-2 h-4 w-4" />
                    تصدير السجلات
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          disabled={isSaving}
          className="flex items-center"
        >
          <Save className="ml-2 h-4 w-4" />
          {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </motion.div>
    </div>
  );
}
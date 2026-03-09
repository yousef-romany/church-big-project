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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Fingerprint, 
  Plus, 
  Trash2, 
  Shield, 
  ShieldCheck,
  Smartphone,
  Key,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { 
  startRegistration,
  startAuthentication
} from '@simplewebauthn/browser';

interface Passkey {
  id: string;
  credentialId: string;
  name: string;
  deviceType: string;
  transports?: string;
  createdAt: string;
  isBackup: boolean;
  isPreferred: boolean;
}

export default function PasskeysPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    passkeyId?: string;
    passkeyName?: string;
  }>({ open: false });
  const [passkeyName, setPasskeyName] = useState('');

  useEffect(() => {
    if (session?.user) {
      fetchPasskeys();
    }
  }, [session]);

  const fetchPasskeys = async () => {
    try {
      const response = await fetch('/api/auth/passkeys');
      if (response.ok) {
        const data = await response.json();
        setPasskeys(data.passkeys || []);
      }
    } catch (error) {
      console.error('Failed to fetch passkeys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPasskey = async () => {
    setRegistering(true);
    try {
      // Get registration options
      const optionsResponse = await fetch('/api/auth/webauthn/register');
      if (!optionsResponse.ok) {
        throw new Error('Failed to get registration options');
      }
      
      const { options } = await optionsResponse.json();
      
      // Start WebAuthn registration
      const credential = await startRegistration(options);
      
      // Complete registration
      const registerResponse = await fetch('/api/auth/webauthn/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential,
          name: passkeyName || `مفتاح ${new Date().toLocaleDateString('ar-SA')}`
        }),
      });

      if (registerResponse.ok) {
        toast({
          title: 'نجاح',
          description: 'تم إضافة مفتاح المصادقة البيومترية بنجاح',
        });
        setPasskeyName('');
        fetchPasskeys();
      } else {
        throw new Error('Failed to register passkey');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل إضافة مفتاح المصادقة',
        variant: 'destructive',
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleDeletePasskey = async (passkeyId: string) => {
    try {
      const response = await fetch(`/api/auth/passkeys/${passkeyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'نجاح',
          description: 'تم حذف مفتاح المصادقة بنجاح',
        });
        fetchPasskeys();
      } else {
        throw new Error('Failed to delete passkey');
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف مفتاح المصادقة',
        variant: 'destructive',
      });
    }
    setDeleteDialog({ open: false });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType) {
      case 'biometric':
        return <Fingerprint className="h-4 w-4" />;
      case 'singleDevice':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Key className="h-4 w-4" />;
    }
  };

  if (!session) {
    return <div>يرجى تسجيل الدخول</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Fingerprint className="h-8 w-8" />
          مفاتيح المصادقة البيومترية
        </h1>
        <p className="text-muted-foreground mt-2">
          إدارة مفاتيح المصادقة لتسجيل الدخول الآمن والسريع
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>مفاتيح المصادقة المسجلة</CardTitle>
            <Button onClick={() => setPasskeyName('')}>
              <Plus className="mr-2 h-4 w-4" />
              إضافة مفتاح جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2">جاري التحميل...</p>
            </div>
          ) : passkeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Fingerprint className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد مفاتيح مصادقة مسجلة</p>
              <p className="text-sm">أضف مفتاح مصادقة لتسجيل الدخول بشكل أسرع وأكثر أماناً</p>
            </div>
          ) : (
            <div className="space-y-4">
              {passkeys.map((passkey) => (
                <motion.div
                  key={passkey.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {getDeviceIcon(passkey.deviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{passkey.name}</span>
                        {passkey.isPreferred && (
                          <Badge variant="default" className="gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            مفضل
                          </Badge>
                        )}
                        {passkey.isBackup && (
                          <Badge variant="secondary">نسخة احتياطية</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>نوع: {passkey.deviceType === 'biometric' ? 'بصمة/وجه' : 'جهاز'}</div>
                        <div>أضيف في: {formatDate(passkey.createdAt)}</div>
                        {passkey.transports && (
                          <div>الطرق المتاحة: {passkey.transports}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialog({
                      open: true,
                      passkeyId: passkey.id,
                      passkeyName: passkey.name
                    })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Passkey Dialog */}
      <Dialog open={passkeyName !== ''} onOpenChange={(open) => !open && setPasskeyName('')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              إضافة مفتاح مصادقة جديد
            </DialogTitle>
            <DialogDescription>
              سيتم إنشاء مفتاح مصادقة بيومتري جديد لحسابك
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="passkeyName">اسم المفتاح (اختياري)</Label>
              <Input
                id="passkeyName"
                placeholder="مثال: هاتفي الشخصي"
                value={passkeyName}
                onChange={(e) => setPasskeyName(e.target.value)}
              />
            </div>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>ملاحظات هامة</AlertTitle>
              <AlertDescription>
                • تأكد من أن جهازك يدعم المصادقة البيومترية (بصمة، وجه، إلخ)<br />
                • سيتم طلب المصادقة البيومترية لإتمام العملية<br />
                • احتفظ بمفتاحك في مكان آمن
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasskeyName('')}>
              إلغاء
            </Button>
            <Button 
              onClick={handleRegisterPasskey}
              disabled={registering}
            >
              {registering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  إضافة المفتاح
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Passkey Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              تأكيد حذف مفتاح المصادقة
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد حذف هذا المفتاح؟
              <br />
              <span className="font-medium">{deleteDialog.passkeyName}</span>
              <br />
              لن تتمكن من استخدام هذا المفتاح لتسجيل الدخول مرة أخرى.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false })}>
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteDialog.passkeyId && handleDeletePasskey(deleteDialog.passkeyId)}
            >
              حذف المفتاح
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
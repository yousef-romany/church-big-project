"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Phone, Mail, Save, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ChurchInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  serviceTimes: string;
}

const defaultChurchInfo: ChurchInfo = {
  name: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  description: '',
  serviceTimes: '',
};

export default function ChurchInfoForm() {
  const { toast } = useToast();
  const [churchInfo, setChurchInfo] = useState<ChurchInfo>(defaultChurchInfo);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchChurchInfo();
  }, []);

  const fetchChurchInfo = async () => {
    try {
      const response = await fetch('/api/admin/church-info');
      if (response.ok) {
        const data = await response.json();
        setChurchInfo(data);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل معلومات الكنيسة',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (field: keyof ChurchInfo, value: string) => {
    setChurchInfo(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/church-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(churchInfo),
      });

      if (response.ok) {
        toast({
          title: 'تم الحفظ',
          description: 'تم تحديث معلومات الكنيسة بنجاح',
        });
        setHasChanges(false);
      } else {
        toast({
          title: 'خطأ',
          description: 'فشل تحديث معلومات الكنيسة',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    fetchChurchInfo();
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <span>معلومات الكنيسة</span>
            </div>
            {hasChanges && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <X className="h-4 w-4 ml-1" />
                  إلغاء
                </Button>
                <Button size="sm" onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 ml-1" />
                  )}
                  {loading ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">معلومات أساسية</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-right">اسم الكنيسة *</label>
                <Input
                  value={churchInfo.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="أدخل اسم الكنيسة"
                  className="text-right"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-right">العنوان *</label>
                  <Input
                    value={churchInfo.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="أدخل العنوان"
                    className="text-right"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-right">المدينة *</label>
                  <Input
                    value={churchInfo.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="أدخل المدينة"
                    className="text-right"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-right">رقم الهاتف</label>
                  <Input
                    type="tel"
                    value={churchInfo.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="أدخل رقم الهاتف"
                    className="text-right"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-right">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    value={churchInfo.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="أدخل البريد الإلكتروني"
                    className="text-right"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-right">وصف الكنيسة</label>
              <Textarea
                value={churchInfo.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="أدخل وصف الكنيسة..."
                rows={4}
                className="text-right resize-none"
              />
            </div>

            {/* Service Times */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2 text-right">أوقات الخدمات</label>
              <Textarea
                value={churchInfo.serviceTimes}
                onChange={(e) => handleChange('serviceTimes', e.target.value)}
                placeholder="أدخل أوقات الخدمات..."
                rows={3}
                className="text-right resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
                <X className="h-4 w-4 ml-1" />
                إلغاء التغييرات
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges || loading} className="flex-1">
                {loading ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 ml-2" />
                )}
                {loading ? 'جاري الحفظ...' : 'حفظ المعلومات'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

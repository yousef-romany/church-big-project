"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Save,
  Upload
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - replace with actual API calls
const churchData = {
  name: 'كنيسة القديس مرقس',
  arabicName: 'كنيسة القديس مرقس',
  englishName: 'St. Mark Church',
  address: 'شارع الكنيسة، القاهرة، مصر',
  phoneNumber: '+20 2 12345678',
  emailAddress: 'info@stmarkchurch.com',
  website: 'www.stmarkchurch.com',
  description: 'كنيسة القديس مرقس هي إحدى أقدم الكنائس في المنطقة، تأسست عام 1900.',
  arabicDescription: 'كنيسة القديس مرقس هي إحدى أقدم الكنائس في المنطقة، تأسست عام 1900.',
  massSchedule: [
    { day: 'السبت', time: '6:00 م', type: 'عشية' },
    { day: 'الأحد', time: '8:00 ص', type: 'قداس الصباح' },
    { day: 'الأحد', time: '10:30 ص', type: 'قداس العائلات' },
    { day: 'الأحد', time: '6:00 م', type: 'قداس المساء' },
    { day: 'الثلاثاء', time: '6:00 م', type: 'قداس الأسبوعي' },
    { day: 'الخميس', time: '6:00 م', type: 'قداس الأسبوعي' }
  ],
  confessionTimes: 'السبت 4:00 م - 6:00 م',
  offices: [
    { name: 'مكتب الكاهن', schedule: 'السبت - الخميس 9:00 ص - 2:00 م' },
    { name: 'مكتب الخادم', schedule: 'السبت - الخميس 9:00 ص - 5:00 م' },
    { name: 'مكتب السكرتارية', schedule: 'السبت - الخميس 9:00 ص - 3:00 م' }
  ]
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

export default function ChurchInformationManagement() {
  const { toast } = useToast();
  const [churchInfo, setChurchInfo] = useState(churchData);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setChurchInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'تم الحفظ',
        description: 'تم تحديث معلومات الكنيسة بنجاح.',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحديث معلومات الكنيسة.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = () => {
    // Handle image upload logic
    toast({
      title: 'تحميل الصورة',
      description: 'سيتم تحميل صورة الكنيسة.',
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
        <h1 className="text-3xl font-bold mb-2">معلومات الكنيسة</h1>
        <p className="text-blue-100">تحديث وإدارة معلومات الكنيسة ومعلومات الاتصال والجدول الزمني للخدمات.</p>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="schedule">الجداول الزمنية</TabsTrigger>
            <TabsTrigger value="contacts">معلومات الاتصال</TabsTrigger>
            <TabsTrigger value="media">الوسائط</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="ml-2 h-5 w-5" />
                  معلومات الكنيسة الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="arabicName">الاسم بالعربية</Label>
                    <Input
                      id="arabicName"
                      value={churchInfo.arabicName}
                      onChange={(e) => handleInputChange('arabicName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="englishName">الاسم بالإنجليزية</Label>
                    <Input
                      id="englishName"
                      value={churchInfo.englishName}
                      onChange={(e) => handleInputChange('englishName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={churchInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="arabicDescription">الوصف بالعربية</Label>
                  <Textarea
                    id="arabicDescription"
                    rows={4}
                    value={churchInfo.arabicDescription}
                    onChange={(e) => handleInputChange('arabicDescription', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="ml-2 h-5 w-5" />
                  جداول القداسات والخدمات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="massSchedule">جدول القداسات</Label>
                  <div className="border rounded-lg p-4">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-right pb-2">اليوم</th>
                          <th className="text-right pb-2">الوقت</th>
                          <th className="text-right pb-2">النوع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {churchInfo.massSchedule.map((schedule, index) => (
                          <tr key={index}>
                            <td className="py-2">{schedule.day}</td>
                            <td className="py-2">{schedule.time}</td>
                            <td className="py-2">{schedule.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confessionTimes">أوقات الاعتراف</Label>
                  <Input
                    id="confessionTimes"
                    value={churchInfo.confessionTimes}
                    onChange={(e) => handleInputChange('confessionTimes', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="ml-2 h-5 w-5" />
                  معلومات الاتصال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="flex items-center">
                      <Phone className="ml-2 h-4 w-4" />
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={churchInfo.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress" className="flex items-center">
                      <Mail className="ml-2 h-4 w-4" />
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="emailAddress"
                      value={churchInfo.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center">
                    <MapPin className="ml-2 h-4 w-4" />
                    الموقع الإلكتروني
                  </Label>
                  <Input
                    id="website"
                    value={churchInfo.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="ml-2 h-5 w-5" />
                  صور وشعار الكنيسة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>شعار الكنيسة</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">انقر لتحميل شعار الكنيسة</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleImageUpload}
                    >
                      تحميل الشعار
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>صور الكنيسة</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">انقر لتحميل صور الكنيسة</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleImageUpload}
                    >
                      تحميل الصور
                    </Button>
                  </div>
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
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="flex items-center"
        >
          <Save className="ml-2 h-4 w-4" />
          {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </motion.div>
    </div>
  );
}
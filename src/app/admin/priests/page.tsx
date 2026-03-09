"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  UserPlus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  CalendarDays,
  CalendarPlus,
  Users,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - replace with actual API calls
const priestsData = [
  {
    id: '1',
    name: 'القس مرقس يوسف',
    email: 'markos@example.com',
    phone: '+20 1012345678',
    address: 'شارع الكنيسة، القاهرة',
    specialization: 'خدمة العائلات',
    status: 'active',
    joinDate: '2018-09-15',
    rating: 4.8,
    services: ['القداس', 'الاعتراف', 'الزيارات'],
    availability: {
      sunday: { morning: true, evening: true },
      monday: { morning: false, evening: true },
      tuesday: { morning: true, evening: false },
      wednesday: { morning: false, evening: true },
      thursday: { morning: true, evening: true },
      friday: { morning: false, evening: false },
      saturday: { morning: true, evening: true }
    },
    schedule: [
      { id: '1', day: 'الأحد', service: 'قداس', time: '09:00', location: 'الكاتدرائية الرئيسية' },
      { id: '2', day: 'الثلاثاء', service: 'اعتراف', time: '16:00', location: 'قاعة الاعتراف' },
      { id: '3', day: 'الخميس', service: 'اجتماع عائلات', time: '19:00', location: 'قاعة الاجتماعات' }
    ],
    avatar: '/avatars/priest01.png'
  },
  {
    id: '2',
    name: 'القس بطرس أنطون',
    email: 'peter@example.com',
    phone: '+20 1023456789',
    address: 'شارع الكنيسة، الجيزة',
    specialization: 'خدمة الشباب',
    status: 'active',
    joinDate: '2020-01-20',
    rating: 4.6,
    services: ['القداس', 'الاعتراف', 'جماعات الشباب'],
    availability: {
      sunday: { morning: true, evening: true },
      monday: { morning: false, evening: false },
      tuesday: { morning: true, evening: true },
      wednesday: { morning: false, evening: false },
      thursday: { morning: true, evening: true },
      friday: { morning: false, evening: false },
      saturday: { morning: false, evening: true }
    },
    schedule: [
      { id: '4', day: 'الأحد', service: 'قداس', time: '11:00', location: 'كنيسة الجيزة' },
      { id: '5', day: 'الثلاثاء', service: 'جماعة شباب', time: '18:00', location: 'قاعدة الشباب' },
      { id: '6', day: 'الخميس', service: 'دراسة كتابية', time: '19:00', location: 'قاعة الدراسة' }
    ],
    avatar: '/avatars/priest02.png'
  },
  {
    id: '3',
    name: 'القس يعقوب إبراهيم',
    email: 'yacoub@example.com',
    phone: '+20 1034567890',
    address: 'شارع الكنيسة، الإسكندرية',
    specialization: 'خدمة الأطفال',
    status: 'inactive',
    joinDate: '2019-05-10',
    rating: 4.9,
    services: ['القداس', 'الاعتراف', 'مدارس الأحد'],
    availability: {
      sunday: { morning: true, evening: false },
      monday: { morning: false, evening: false },
      tuesday: { morning: false, evening: false },
      wednesday: { morning: false, evening: false },
      thursday: { morning: false, evening: false },
      friday: { morning: false, evening: false },
      saturday: { morning: false, evening: false }
    },
    schedule: [
      { id: '7', day: 'الأحد', service: 'قداس', time: '08:00', location: 'كنيسة الإسكندرية' },
      { id: '8', day: 'السبت', service: 'مدارس الأحد', time: '10:00', location: 'فصول مدارس الأحد' }
    ],
    avatar: '/avatars/priest03.png'
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

export default function PriestManagement() {
  const { toast } = useToast();
  const [priests, setPriests] = useState(priestsData);
  const [filteredPriests, setFilteredPriests] = useState(priestsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);
  const [selectedPriest, setSelectedPriest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('priests');

  useEffect(() => {
    let filtered = priests;
    
    if (searchTerm) {
      filtered = filtered.filter(priest => 
        priest.name.includes(searchTerm) || 
        priest.email.includes(searchTerm) ||
        priest.specialization.includes(searchTerm)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(priest => priest.status === statusFilter);
    }
    
    setFilteredPriests(filtered);
  }, [priests, searchTerm, statusFilter]);

  const handleCreatePriest = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewPriest = (priest: any) => {
    setSelectedPriest(priest);
    setIsViewDialogOpen(true);
  };

  const handleViewSchedule = (priest: any) => {
    setSelectedPriest(priest);
    setIsScheduleDialogOpen(true);
  };

  const handleViewAvailability = (priest: any) => {
    setSelectedPriest(priest);
    setIsAvailabilityDialogOpen(true);
  };

  const handleToggleStatus = (priestId: string) => {
    setPriests(prev => 
      prev.map(priest => 
        priest.id === priestId 
          ? { ...priest, status: priest.status === 'active' ? 'inactive' : 'active' }
          : priest
      )
    );
    
    const priest = priests.find(p => p.id === priestId);
    toast({
      title: 'تم التحديث',
      description: `تم ${priest?.status === 'active' ? 'تعطيل' : 'تفعيل'} حساب الكاهن.`,
    });
  };

  const handleDeletePriest = (priestId: string) => {
    if (confirm('هل أنت متأكد من أنك تريد حذف هذا الكاهن؟')) {
      setPriests(prev => prev.filter(priest => priest.id !== priestId));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الكاهن بنجاح.',
      });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">إدارة الكهنة</h1>
        <p className="text-blue-100">إدارة بيانات الكهنة والخدمات الخاصة بهم والجدول الزمني.</p>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="priests">الكهنة</TabsTrigger>
            <TabsTrigger value="schedule">جدول الخدمات</TabsTrigger>
          </TabsList>

          <TabsContent value="priests" className="space-y-4">
            <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center">
              <UserCheck className="ml-2 h-5 w-5" />
              قائمة الكهنة
            </CardTitle>
            <Button 
              onClick={handleCreatePriest}
              className="flex items-center"
            >
              <UserPlus className="ml-2 h-4 w-4" />
              إضافة كاهن
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم أو البريد الإلكتروني أو التخصص..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="فلترة حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الكاهن</TableHead>
                    <TableHead className="text-right">التخصص</TableHead>
                    <TableHead className="text-right">التقييم</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">تاريخ الانضمام</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPriests.map((priest) => (
                    <TableRow key={priest.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 ml-2">
                            <AvatarImage src={priest.avatar} alt={priest.name} />
                            <AvatarFallback>
                              {priest.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{priest.name}</div>
                            <div className="text-sm text-muted-foreground">{priest.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{priest.specialization}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex ml-1">
                            {renderStars(priest.rating)}
                          </div>
                          <span className="mr-2 text-sm">{priest.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={priest.status === 'active' ? 'default' : 'secondary'}>
                          {priest.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>{priest.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-reverse space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewPriest(priest)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewSchedule(priest)}
                          >
                            <CalendarDays className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(priest.id)}
                          >
                            {priest.status === 'active' ? 
                              <XCircle className="h-4 w-4 text-red-600" /> : 
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePriest(priest.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="ml-2 h-5 w-5" />
                  جدول الخدمات الشهري
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priests.filter(p => p.status === 'active').map((priest) => (
                    <div key={priest.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{priest.name}</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewSchedule(priest)}>
                            <Calendar className="ml-1 h-4 w-4" />
                            عرض الجدول
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewAvailability(priest)}>
                            <Clock className="ml-1 h-4 w-4" />
                            التوفر
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="text-sm text-muted-foreground">التخصص</div>
                        <div className="text-sm text-muted-foreground">الخدمات</div>
                        <div className="text-sm text-muted-foreground">الحالة</div>
                        <div>{priest.specialization}</div>
                        <div>{priest.services.join(', ')}</div>
                        <div>
                          <Badge variant={priest.status === 'active' ? 'default' : 'secondary'}>
                            {priest.status === 'active' ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Priest Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الكاهن</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن الكاهن المحدد
            </DialogDescription>
          </DialogHeader>
          {selectedPriest && (
            <div className="space-y-4">
              <div className="flex items-center space-x-reverse space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPriest.avatar} alt={selectedPriest.name} />
                  <AvatarFallback>
                    {selectedPriest.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{selectedPriest.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPriest.email}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex ml-1">
                      {renderStars(selectedPriest.rating)}
                    </div>
                    <span className="mr-2 text-sm">{selectedPriest.rating}</span>
                  </div>
                </div>
                <Badge variant={selectedPriest.status === 'active' ? 'default' : 'secondary'}>
                  {selectedPriest.status === 'active' ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
                  <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
                  <TabsTrigger value="services">الخدمات</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">التخصص</Label>
                      <p>{selectedPriest.specialization}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">تاريخ الانضمام</Label>
                      <p>{selectedPriest.joinDate}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPriest.phone}</span>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPriest.email}</span>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPriest.address}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="services" className="space-y-4">
                  <div className="space-y-2">
                    {selectedPriest.services.map((service: string, index: number) => (
                      <div key={index} className="flex items-center space-x-reverse space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Priest Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة كاهن جديد</DialogTitle>
            <DialogDescription>
              إضافة كاهن جديد إلى النظام
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input id="name" placeholder="أدخل اسم الكاهن" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="أدخل البريد الإلكتروني" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" placeholder="أدخل رقم الهاتف" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">التخصص</Label>
              <Input id="specialization" placeholder="أدخل تخصص الكاهن" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input id="address" placeholder="أدخل العنوان" />
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: 'تم الإنشاء',
                    description: 'تم إضافة الكاهن بنجاح.',
                  });
                  setIsCreateDialogOpen(false);
                }}
              >
                إضافة كاهن
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>جدول الكاهن</DialogTitle>
            <DialogDescription>
              عرض وإدارة جدول الخدمات والالتزامات
            </DialogDescription>
          </DialogHeader>
          {selectedPriest && (
            <div className="space-y-4">
              <div className="flex items-center space-x-reverse space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPriest.avatar} alt={selectedPriest.name} />
                  <AvatarFallback>
                    {selectedPriest.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{selectedPriest.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPriest.specialization}</p>
                </div>
                <Button variant="outline" size="sm">
                  <CalendarPlus className="ml-1 h-4 w-4" />
                  إضافة خدمة
                </Button>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">الخدمات الحالية</h4>
                {selectedPriest.schedule?.map((service: any) => (
                  <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-reverse space-x-4">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{service.day} - {service.service}</div>
                        <div className="text-sm text-muted-foreground">
                          {service.time} في {service.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsScheduleDialogOpen(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Availability Dialog */}
      <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>توفر الكاهن</DialogTitle>
            <DialogDescription>
              عرض وإدارة أوقات توفر الكاهن خلال الأسبوع
            </DialogDescription>
          </DialogHeader>
          {selectedPriest && (
            <div className="space-y-4">
              <div className="flex items-center space-x-reverse space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPriest.avatar} alt={selectedPriest.name} />
                  <AvatarFallback>
                    {selectedPriest.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{selectedPriest.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPriest.specialization}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">أوقات التوفر الأسبوعية</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries({
                    sunday: 'الأحد',
                    monday: 'الإثنين',
                    tuesday: 'الثلاثاء',
                    wednesday: 'الأربعاء',
                    thursday: 'الخميس',
                    friday: 'الجمعة',
                    saturday: 'السبت'
                  }).map(([dayKey, dayName]) => (
                    <div key={dayKey} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="font-medium">{dayName}</div>
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <span className="ml-2 text-sm">صباحاً</span>
                          <div className={`w-5 h-5 rounded-full ${selectedPriest.availability[dayKey as keyof typeof selectedPriest.availability]?.morning ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="flex items-center">
                          <span className="ml-2 text-sm">مساءً</span>
                          <div className={`w-5 h-5 rounded-full ${selectedPriest.availability[dayKey as keyof typeof selectedPriest.availability]?.evening ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAvailabilityDialogOpen(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
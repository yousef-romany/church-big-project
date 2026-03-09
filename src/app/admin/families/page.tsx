"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users2, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Tag,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - replace with actual API calls
const familiesData = [
  {
    id: '1',
    name: 'عائلة أحمد محمد',
    fatherName: 'أحمد محمد',
    motherName: 'فاطمة إبراهيم',
    phoneNumber: '+20 1012345678',
    address: 'شارع الكنيسة، القاهرة',
    status: 'active',
    registrationDate: '2020-05-15',
    membersCount: 5,
    childrenCount: 3,
    notes: 'عائلة نشطة في خدمات الكنيسة',
    email: 'ahmed@example.com',
    category: 'regular',
    involvement: 'high',
    lastActivity: '2024-03-01',
    sacraments: ['baptism', 'marriage'],
    details: {
      occupation: 'مهندس',
      income: 'medium',
      education: 'university',
      specialNeeds: false,
      financialAid: false
    },
    lastVisit: '2024-02-28'
  },
  {
    id: '2',
    name: 'عائلة مرقس يوسف',
    fatherName: 'مرقس يوسف',
    motherName: 'مريم سامي',
    phoneNumber: '+20 1023456789',
    address: 'شارع الكنيسة، الجيزة',
    status: 'active',
    registrationDate: '2019-08-20',
    membersCount: 4,
    childrenCount: 2,
    notes: 'مشاركة منتظمة في الأنشطة',
    email: 'markos@example.com',
    category: 'regular',
    involvement: 'medium',
    lastActivity: '2024-03-01',
    sacraments: ['baptism'],
    details: {
      occupation: 'معلم',
      income: 'low',
      education: 'college',
      specialNeeds: false,
      financialAid: true
    },
    lastVisit: '2024-03-01'
  },
  {
    id: '3',
    name: 'عائلة بطرس أنطون',
    fatherName: 'بطرس أنطون',
    motherName: 'سارة رامي',
    phoneNumber: '+20 1034567890',
    address: 'شارع الكنيسة، الإسكندرية',
    status: 'inactive',
    registrationDate: '2021-01-10',
    membersCount: 3,
    childrenCount: 1,
    category: 'inactive',
    involvement: 'low',
    lastActivity: '2023-12-15',
    sacraments: ['baptism'],
    details: {
      occupation: 'موظف',
      income: 'medium',
      education: 'university',
      specialNeeds: true,
      financialAid: false
    },
    notes: 'لم يزوروا الكنيسة منذ فترة',
    email: 'peter@example.com',
    lastVisit: '2023-10-15'
  },
  {
    id: '4',
    name: 'عائلة يعقوب إبراهيم',
    fatherName: 'يعقوب إبراهيم',
    motherName: 'هناء خالد',
    phoneNumber: '+20 1045678901',
    address: 'شارع الكنيسة، المنصورة',
    status: 'active',
    registrationDate: '2022-03-25',
    membersCount: 6,
    childrenCount: 4,
    notes: 'عائلة كبيرة ومشاركة في جميع الأنشطة',
    email: 'yacoub@example.com',
    lastVisit: '2024-03-02'
  }
];

const statusLabels = {
  active: 'نشطة',
  inactive: 'غير نشطة',
  new: 'جديدة'
};

const statusColors = {
  active: 'default',
  inactive: 'secondary'
};

const categoryLabels = {
  regular: 'عادية',
  new: 'جديدة',
  inactive: 'غير نشطة',
  special: 'ذوي احتياجات خاصة'
};

const categoryColors = {
  regular: 'default',
  new: 'secondary',
  inactive: 'outline',
  special: 'destructive'
};

const involvementLabels = {
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة'
};

const involvementColors = {
  high: 'default',
  medium: 'secondary',
  low: 'outline'
};

const sacramentLabels = {
  baptism: 'المعمودية',
  marriage: 'الزواج',
  confirmation: 'التثبيت'
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

export default function FamilyDatabaseOversight() {
  const { toast } = useToast();
  const [families, setFamilies] = useState(familiesData);
  const [filteredFamilies, setFilteredFamilies] = useState(familiesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [involvementFilter, setInvolvementFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('families');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  useEffect(() => {
    let filtered = families;
    
    if (searchTerm) {
      filtered = filtered.filter(family => 
        family.name.includes(searchTerm) || 
        family.email.includes(searchTerm) ||
        family.fatherName.includes(searchTerm) ||
        family.motherName.includes(searchTerm)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(family => family.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(family => family.category === categoryFilter);
    }
    
    if (involvementFilter !== 'all') {
      filtered = filtered.filter(family => family.involvement === involvementFilter);
    }
    
    setFilteredFamilies(filtered);
  }, [families, searchTerm, statusFilter, categoryFilter, involvementFilter]);

  const handleCreateFamily = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewFamily = (family: any) => {
    setSelectedFamily(family);
    setIsViewDialogOpen(true);
  };

  const handleToggleStatus = (familyId: string) => {
    setFamilies(prev => 
      prev.map(family => 
        family.id === familyId 
          ? { ...family, status: family.status === 'active' ? 'inactive' : 'active' }
          : family
      )
    );
    
    const family = families.find(f => f.id === familyId);
    toast({
      title: 'تم التحديث',
      description: `تم ${family?.status === 'active' ? 'تعطيل' : 'تفعيل'} العائلة.`,
    });
  };

  const handleDeleteFamily = (familyId: string) => {
    if (confirm('هل أنت متأكد من أنك تريد حذف هذه العائلة؟')) {
      setFamilies(prev => prev.filter(family => family.id !== familyId));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف العائلة بنجاح.',
      });
    }
  };

  const handleExportFamilies = () => {
    // Simulate export functionality
    toast({
      title: 'تصدير العائلات',
      description: 'جاري تصدير قائمة العائلات...',
    });
  };

  const handleImportFamilies = () => {
    setIsImportDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">قاعدة بيانات العائلات</h1>
        <p className="text-blue-100">إدارة قاعدة بيانات العائلات ومتابعة تسجيلهم ونشاطهم.</p>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="families">قاعدة البيانات</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>

          <TabsContent value="families" className="space-y-4">
            <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center">
              <Users2 className="ml-2 h-5 w-5" />
              قائمة العائلات
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={handleImportFamilies}
                className="flex items-center"
              >
                <Upload className="ml-2 h-4 w-4" />
                استيراد
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportFamilies}
                className="flex items-center"
              >
                <Download className="ml-2 h-4 w-4" />
                تصدير
              </Button>
              <Button 
                onClick={handleCreateFamily}
                className="flex items-center"
              >
                <Plus className="ml-2 h-4 w-4" />
                إضافة عائلة
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم أو البريد الإلكتروني..."
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="فلترة حسب الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={involvementFilter} onValueChange={setInvolvementFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="فلترة حسب المشاركة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  {Object.entries(involvementLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="فلترة حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشطة</SelectItem>
                  <SelectItem value="inactive">غير نشطة</SelectItem>
                  <SelectItem value="new">جديدة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">العائلة</TableHead>
                    <TableHead className="text-right">الاتصال</TableHead>
                    <TableHead className="text-right">الأعضاء</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFamilies.map((family) => (
                    <TableRow key={family.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{family.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {family.fatherName} و {family.motherName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 ml-1" />
                            {family.phoneNumber}
                          </div>
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 ml-1" />
                            {family.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <Users className="h-4 w-4 ml-1" />
                            {family.membersCount}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {family.childrenCount} أطفال
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[family.status as keyof typeof statusColors] as any}>
                          {statusLabels[family.status as keyof typeof statusLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>{family.registrationDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-reverse space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewFamily(family)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(family.id)}
                          >
                            {family.status === 'active' ? 
                              <XCircle className="h-4 w-4 text-red-600" /> : 
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteFamily(family.id)}
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

          <TabsContent value="analytics" className="space-y-6">
            {/* Family Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي العائلات</CardTitle>
                  <Users2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{families.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {families.filter(f => f.status === 'active').length} عائلة نشطة
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الأفراد</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {families.reduce((sum, f) => sum + f.membersCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {families.reduce((sum, f) => sum + f.childrenCount, 0)} طفل
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">المشاركة العالية</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {families.filter(f => f.involvement === 'high').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    عائلات ذات مشاركة عالية
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">تحتاج مساعدة</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {families.filter(f => f.details?.financialAid).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    عائلات تحتاج مساعدة مالية
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="ml-2 h-5 w-5" />
                  توزيع العائلات حسب الفئة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryLabels).map(([key, label]) => {
                    const count = families.filter(f => f.category === key).length;
                    const percentage = Math.round((count / families.length) * 100);
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{label}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Involvement Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="ml-2 h-5 w-5" />
                  مستويات المشاركة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(involvementLabels).map(([key, label]) => {
                    const count = families.filter(f => f.involvement === key).length;
                    return (
                      <div key={key} className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground">{label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Math.round((count / families.length) * 100)}% من العائلات
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Special Needs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="ml-2 h-5 w-5" />
                  الحالات الخاصة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>العائلات ذات أفراد ذوي احتياجات خاصة</span>
                    <Badge variant="outline">
                      {families.filter(f => f.details?.specialNeeds).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>العائلات تحتاج مساعدة مالية</span>
                    <Badge variant="outline">
                      {families.filter(f => f.details?.financialAid).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span>العائلات الحاصلة على المعونات</span>
                    <Badge variant="outline">
                      {families.filter(f => f.details?.financialAid).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Family Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل العائلة</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن العائلة المحددة
            </DialogDescription>
          </DialogHeader>
          {selectedFamily && (
            <div className="space-y-4">
              <div className="flex items-center space-x-reverse space-x-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users2 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{selectedFamily.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedFamily.fatherName} و {selectedFamily.motherName}
                  </p>
                </div>
                <Badge variant={statusColors[selectedFamily.status as keyof typeof statusColors] as any}>
                  {statusLabels[selectedFamily.status as keyof typeof statusLabels]}
                </Badge>
              </div>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
                  <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
                  <TabsTrigger value="details">تفاصيل إضافية</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">عدد الأعضاء</Label>
                      <p>{selectedFamily.membersCount}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">عدد الأطفال</Label>
                      <p>{selectedFamily.childrenCount}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">تاريخ التسجيل</Label>
                      <p>{selectedFamily.registrationDate}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">آخر زيارة</Label>
                      <p>{selectedFamily.lastVisit}</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFamily.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFamily.email}</span>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFamily.address}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">ملاحظات</Label>
                    <p className="text-sm">{selectedFamily.notes}</p>
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

      {/* Create Family Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة عائلة جديدة</DialogTitle>
            <DialogDescription>
              إضافة عائلة جديدة إلى قاعدة البيانات
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="familyName">اسم العائلة</Label>
              <Input id="familyName" placeholder="أدخل اسم العائلة" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherName">اسم الأب</Label>
                <Input id="fatherName" placeholder="أدخل اسم الأب" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">اسم الأم</Label>
                <Input id="motherName" placeholder="أدخل اسم الأم" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">رقم الهاتف</Label>
              <Input id="phoneNumber" placeholder="أدخل رقم الهاتف" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="أدخل البريد الإلكتروني" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input id="address" placeholder="أدخل العنوان" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" placeholder="أدخل أي ملاحظات" />
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
                    description: 'تم إضافة العائلة بنجاح.',
                  });
                  setIsCreateDialogOpen(false);
                }}
              >
                إضافة عائلة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Families Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>استيراد العائلات</DialogTitle>
            <DialogDescription>
              استيراد العائلات من ملف CSV أو Excel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">انقر لتحميل ملف العائلات</p>
              <p className="text-xs text-gray-500 mt-1">CSV, Excel (支持的格式: .csv, .xlsx)</p>
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsImportDialogOpen(false)}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: 'تم الاستيراد',
                    description: 'تم استيراد العائلات بنجاح.',
                  });
                  setIsImportDialogOpen(false);
                }}
              >
                استيراد
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  Clock,
  Send,
  Archive,
  CheckCircle,
  XCircle,
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - replace with actual API calls
const announcementsData = [
  {
    id: '1',
    title: 'إعلان القداس العيد',
    content: 'تم تحديد مواعيد قداس عيد الميلاد المجيد. يرجى الحضور في الوقت المحدد.',
    authorId: 'admin1',
    authorName: 'مدير النظام',
    status: 'published',
    priority: 'high',
    publishDate: '2024-03-01',
    expiryDate: '2024-03-10',
    targetAudience: 'all',
    views: 245,
    createdAt: '2024-02-28'
  },
  {
    id: '2',
    content: 'تذكير باجتماع مجلس الكنيسة الأسبوع المقبل.',
    authorId: 'admin1',
    authorName: 'مدير النظام',
    status: 'published',
    priority: 'medium',
    publishDate: '2024-02-20',
    expiryDate: '2024-02-28',
    targetAudience: 'admin',
    views: 15,
    createdAt: '2024-02-15'
  },
  {
    id: '3',
    title: 'فعالية يوم الأحد',
    content: 'سيقام يوم الأحد القادم فعالية خاصة للأطفال. يرجى تسجيل أبنائكم للمشاركة.',
    authorId: 'admin1',
    authorName: 'مدير النظام',
    status: 'scheduled',
    priority: 'medium',
    publishDate: '2024-03-05',
    expiryDate: '2024-03-12',
    targetAudience: 'parents',
    views: 0,
    createdAt: '2024-03-01'
  },
  {
    id: '4',
    title: 'صيانة النظام',
    content: 'سيتم إجراء صيانة للنظام يوم السبت من 9 ص إلى 12 ظ. قد تتأثر بعض الخدمات.',
    authorId: 'admin1',
    authorName: 'مدير النظام',
    status: 'draft',
    priority: 'low',
    publishDate: '',
    expiryDate: '',
    targetAudience: 'all',
    views: 0,
    createdAt: '2024-03-02'
  }
];

const statusLabels = {
  draft: 'مسودة',
  scheduled: 'مجدول',
  published: 'منشور',
  archived: 'مؤرشف'
};

const statusColors = {
  draft: 'secondary',
  scheduled: 'outline',
  published: 'default',
  archived: 'destructive'
};

const priorityLabels = {
  low: 'منخفض',
  medium: 'متوسط',
  high: 'عالي'
};

const priorityColors = {
  low: 'secondary',
  medium: 'outline',
  high: 'destructive'
};

const audienceLabels = {
  all: 'جميع المستخدمين',
  admin: 'المديرون',
  priests: 'الكهنة',
  servants: 'الخدام',
  parents: 'أولياء الأمور',
  children: 'الأطفال'
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

export default function SystemAnnouncements() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState(announcementsData);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState(announcementsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  useEffect(() => {
    let filtered = announcements;
    
    if (searchTerm) {
      filtered = filtered.filter(announcement => 
        announcement.title?.includes(searchTerm) || 
        announcement.content.includes(searchTerm)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.priority === priorityFilter);
    }
    
    if (audienceFilter !== 'all') {
      filtered = filtered.filter(announcement => announcement.targetAudience === audienceFilter);
    }
    
    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, statusFilter, priorityFilter, audienceFilter]);

  const handleCreateAnnouncement = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsViewDialogOpen(true);
  };

  const handlePublishAnnouncement = (announcementId: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === announcementId 
          ? { ...announcement, status: 'published' }
          : announcement
      )
    );
    
    toast({
      title: 'تم النشر',
      description: 'تم نشر الإعلان بنجاح.',
    });
  };

  const handleArchiveAnnouncement = (announcementId: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === announcementId 
          ? { ...announcement, status: 'archived' }
          : announcement
      )
    );
    
    toast({
      title: 'تم الأرشفة',
      description: 'تم أرشفة الإعلان بنجاح.',
    });
  };

  const handleDeleteAnnouncement = (announcementId: string) => {
    if (confirm('هل أنت متأكد من أنك تريد حذف هذا الإعلان؟')) {
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== announcementId));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الإعلان بنجاح.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">إعلانات النظام</h1>
        <p className="text-blue-100">إدارة إعلانات النظام وجدولة النشر والتحكم في الوصول.</p>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center">
              <Megaphone className="ml-2 h-5 w-5" />
              قائمة الإعلانات
            </CardTitle>
            <Button 
              onClick={handleCreateAnnouncement}
              className="flex items-center"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة إعلان
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث في العنوان أو المحتوى..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأولويات</SelectItem>
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={audienceFilter} onValueChange={setAudienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الجمهور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الجماهير</SelectItem>
                  {Object.entries(audienceLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الإعلان</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الأولوية</TableHead>
                    <TableHead className="text-right">الجمهور</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">المشاهدات</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnnouncements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell>
                        <div>
                          {announcement.title && (
                            <div className="font-medium">{announcement.title}</div>
                          )}
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {announcement.content}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[announcement.status as keyof typeof statusColors] as any}>
                          {statusLabels[announcement.status as keyof typeof statusLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={priorityColors[announcement.priority as keyof typeof priorityColors] as any}>
                          {priorityLabels[announcement.priority as keyof typeof priorityLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {audienceLabels[announcement.targetAudience as keyof typeof audienceLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          {announcement.publishDate ? (
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 ml-1" />
                              {announcement.publishDate}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">غير محدد</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 ml-1" />
                          {announcement.views}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-reverse space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewAnnouncement(announcement)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {announcement.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePublishAnnouncement(announcement.id)}
                            >
                              <Send className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {announcement.status === 'published' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleArchiveAnnouncement(announcement.id)}
                            >
                              <Archive className="h-4 w-4 text-orange-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
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
      </motion.div>

      {/* Announcement Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الإعلان</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن الإعلان المحدد
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {selectedAnnouncement.title || 'إعلان بدون عنوان'}
                </h3>
                <div className="flex gap-2">
                  <Badge variant={statusColors[selectedAnnouncement.status as keyof typeof statusColors] as any}>
                    {statusLabels[selectedAnnouncement.status as keyof typeof statusLabels]}
                  </Badge>
                  <Badge variant={priorityColors[selectedAnnouncement.priority as keyof typeof priorityColors] as any}>
                    {priorityLabels[selectedAnnouncement.priority as keyof typeof priorityLabels]}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">المحتوى</Label>
                  <p className="text-sm">{selectedAnnouncement.content}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">الجمهور المستهدف</Label>
                    <p>{audienceLabels[selectedAnnouncement.targetAudience as keyof typeof audienceLabels]}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">المشاهدات</Label>
                    <p>{selectedAnnouncement.views}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">تاريخ النشر</Label>
                    <p>{selectedAnnouncement.publishDate || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">تاريخ الانتهاء</Label>
                    <p>{selectedAnnouncement.expiryDate || 'غير محدد'}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">المؤلف</Label>
                    <p>{selectedAnnouncement.authorName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">تاريخ الإنشاء</Label>
                    <p>{selectedAnnouncement.createdAt}</p>
                  </div>
                </div>
              </div>
              
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

      {/* Create Announcement Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إنشاء إعلان جديد</DialogTitle>
            <DialogDescription>
              إنشاء إعلان جديد للنظام
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">العنوان</Label>
              <Input id="title" placeholder="أدخل عنوان الإعلان" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">المحتوى</Label>
              <Textarea id="content" placeholder="أدخل محتوى الإعلان" rows={4} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">الأولوية</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">الجمهور المستهدف</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الجمهور" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(audienceLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishDate">تاريخ النشر</Label>
                <Input id="publishDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                <Input id="expiryDate" type="date" />
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-2">
              <Switch id="publishNow" />
              <Label htmlFor="publishNow">نشر الآن</Label>
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
                    description: 'تم إنشاء الإعلان بنجاح.',
                  });
                  setIsCreateDialogOpen(false);
                }}
              >
                إنشاء إعلان
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
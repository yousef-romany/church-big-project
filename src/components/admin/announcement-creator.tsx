"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  Send, 
  Clock,
  ChevronDown,
  RefreshCw,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import FormDatePicker from '@/components/shared/form-date-picker';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'URGENT' | 'EVENT';
  targetAudience: 'ALL' | 'PRIESTS' | 'SERVANTS' | 'PARENTS' | 'CHILDREN';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  publishDate: string | null;
  expiryDate?: string;
  publishedBy: string;
  createdAt: string;
  views?: number;
}

export default function AnnouncementCreator() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'INFO' as 'INFO' | 'WARNING' | 'URGENT' | 'EVENT',
    targetAudience: 'ALL' as 'ALL' | 'PRIESTS' | 'SERVANTS' | 'PARENTS' | 'CHILDREN',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    publishDate: '',
    expiryDate: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [announcements, searchTerm, typeFilter, activeTab]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الإعلانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAnnouncements = () => {
    let filtered = announcements;

    if (searchTerm.trim()) {
      filtered = filtered.filter(ann =>
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(ann => ann.type === typeFilter);
    }

    if (activeTab === 'active') {
      filtered = filtered.filter(ann => ann.publishDate && new Date(ann.publishDate) <= new Date());
    } else if (activeTab === 'draft') {
      filtered = filtered.filter(ann => !ann.publishDate);
    }

    setFilteredAnnouncements(filtered);
  };

  const handleCreateAnnouncement = async () => {
    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'تم الإضافة',
          description: 'تم إضافة الإعلان بنجاح',
        });
        setIsCreateDialogOpen(false);
        setFormData({
          title: '',
          content: '',
          type: 'INFO',
          targetAudience: 'ALL',
          priority: 'MEDIUM',
          publishDate: '',
          expiryDate: '',
        });
        fetchAnnouncements();
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل إضافة الإعلان',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!selectedAnnouncement) return;

    try {
      const response = await fetch(`/api/admin/announcements/${selectedAnnouncement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث الإعلان بنجاح',
        });
        setIsEditDialogOpen(false);
        setSelectedAnnouncement(null);
        setFormData({
          title: '',
          content: '',
          type: 'INFO',
          targetAudience: 'ALL',
          priority: 'MEDIUM',
          publishDate: '',
          expiryDate: '',
        });
        fetchAnnouncements();
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحديث الإعلان',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      const response = await fetch(`/api/admin/announcements/${announcementId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف الإعلان بنجاح',
        });
        setIsDeleteDialogOpen(false);
        setAnnouncementToDelete(null);
        fetchAnnouncements();
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف الإعلان',
        variant: 'destructive',
      });
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'INFO':
        return 'bg-blue-100 text-blue-600';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-600';
      case 'URGENT':
        return 'bg-red-100 text-red-600';
      case 'EVENT':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'INFO':
        return 'معلومة';
      case 'WARNING':
        return 'تحذير';
      case 'URGENT':
        return 'عاجل';
      case 'EVENT':
        return 'فعالية';
      default:
        return type;
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-600';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-600';
      case 'HIGH':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              <span>إدارة الإعلانات</span>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-1" />
              إنشاء إعلان جديد
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن إعلان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[150px]">
                  {typeFilter === 'all' ? 'كل الأنواع' : getTypeLabel(typeFilter)}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter('all')}>
                  كل الأنواع
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('INFO')}>
                  معلومات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('WARNING')}>
                  تحذيرات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('URGENT')}>
                  عاجلة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('EVENT')}>
                  فعاليات
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={fetchAnnouncements}>
              <RefreshCw className="h-4 w-4 ml-1" />
              تحديث
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            جميع الإعلانات ({announcements.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            النشطة ({announcements.filter(a => a.publishDate && new Date(a.publishDate) <= new Date()).length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            مسودة ({announcements.filter(a => !a.publishDate).length})
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Megaphone className="h-12 w-12 mb-4" />
                <p>لا توجد إعلانات</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                <AnimatePresence mode="popLayout">
                  {filteredAnnouncements.map((announcement) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getTypeBadgeColor(announcement.type)}>
                                {getTypeLabel(announcement.type)}
                              </Badge>
                              <h3 className="text-lg font-semibold">{announcement.title}</h3>
                            </div>
                            </div>
                            <Badge className={getPriorityBadgeColor(announcement.priority)}>
                              {announcement.priority === 'HIGH' ? 'عاجل' : announcement.priority === 'MEDIUM' ? 'متوسطة' : 'عادية'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => {
                                setSelectedAnnouncement(announcement);
                                setIsEditDialogOpen(true);
                                setFormData({
                                  title: announcement.title,
                                  content: announcement.content,
                                  type: announcement.type,
                                  targetAudience: announcement.targetAudience,
                                  priority: announcement.priority,
                                  publishDate: announcement.publishDate || '',
                                  expiryDate: announcement.expiryDate || '',
                                });
                              }}>
                                <Edit className="h-4 w-4 ml-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setAnnouncementToDelete(announcement);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedAnnouncement(announcement);
                                setIsEditDialogOpen(true);
                                setFormData({
                                  ...formData,
                                  publishDate: new Date().toISOString().split('T')[0],
                                });
                              }}>
                                <Send className="h-4 w-4 ml-2" />
                                نشر الآن
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-4 pt-3 border-t text-sm">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{announcement.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {announcement.publishDate 
                                ? new Date(announcement.publishDate).toLocaleDateString('ar-EG')
                                : 'مسودة'
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">
                              {announcement.targetAudience === 'ALL' ? 'الكل' :
                               announcement.targetAudience === 'PRIESTS' ? 'الكهنة' :
                               announcement.targetAudience === 'SERVANTS' ? 'الخدام' :
                               announcement.targetAudience === 'PARENTS' ? 'الأباء' :
                               announcement.targetAudience === 'CHILDREN' ? 'الأطفال' : announcement.targetAudience
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        setIsEditDialogOpen(open);
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'تعديل الإعلان' : 'إنشاء إعلان جديد'}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? 'قم بتعديل معلومات الإعلان' : 'أدخل معلومات الإعلان الجديد'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-right">العنوان *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="عنوان الإعلان"
                className="text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-right">المحتوى *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="محتوى الإعلان..."
                rows={4}
                className="text-right resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">النوع</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 border rounded-md text-right"
                >
                  <option value="INFO">معلومة</option>
                  <option value="WARNING">تحذير</option>
                  <option value="URGENT">عاجل</option>
                  <option value="EVENT">فعالية</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الأولوية</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full p-2 border rounded-md text-right"
                >
                  <option value="LOW">عادية</option>
                  <option value="MEDIUM">متوسطة</option>
                  <option value="HIGH">عاجلة</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-right">الفئة المستهدفة</label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                className="w-full p-2 border rounded-md text-right"
              >
                <option value="ALL">الكل</option>
                <option value="PRIESTS">الكهنة</option>
                <option value="SERVANTS">الخدام</option>
                <option value="PARENTS">الأباء</option>
                <option value="CHILDREN">الأطفال</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormDatePicker
                label="تاريخ النشر"
                value={formData.publishDate ? new Date(formData.publishDate) : undefined}
                onChange={(date) => setFormData({ ...formData, publishDate: date ? date.toISOString().split('T')[0] : '' })}
                placeholder="أدخل تاريخ النشر"
              />
              <FormDatePicker
                label="تاريخ الانتهاء"
                value={formData.expiryDate ? new Date(formData.expiryDate) : undefined}
                onChange={(date) => setFormData({ ...formData, expiryDate: date ? date.toISOString().split('T')[0] : '' })}
                placeholder="اختياري"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                setFormData({
                  title: '',
                  content: '',
                  type: 'INFO',
                  targetAudience: 'ALL',
                  priority: 'MEDIUM',
                  publishDate: '',
                  expiryDate: '',
                });
              }}>
                إلغاء
              </Button>
              <Button onClick={isEditDialogOpen ? handleUpdateAnnouncement : handleCreateAnnouncement} disabled={!formData.title || !formData.content}>
                {isEditDialogOpen ? 'تحديث' : 'نشر'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الإعلان "{announcementToDelete?.title}"؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive"
              onClick={() => announcementToDelete && handleDeleteAnnouncement(announcementToDelete.id)}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

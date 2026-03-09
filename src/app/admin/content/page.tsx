"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Book,
  Video,
  Music,
  Image,
  FileAudio,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Tag,
  FolderOpen,
  Lock,
  Unlock
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
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - replace with actual API calls
const contentData = [
  {
    id: '1',
    title: 'دورة تعليمية عن تاريخ الكنيسة القبطية',
    description: 'سلسلة محاضرات شاملة عن تاريخ الكنيسة القبطية الأرثوذكسية',
    type: 'educational',
    category: 'sunday-school',
    contentType: 'video',
    author: 'د. مينا غبريال',
    status: 'published',
    publishedDate: '2024-02-15',
    views: 1250,
    downloads: 320,
    tags: ['تاريخ', 'كنيسة', 'تعليم'],
    accessLevel: 'public'
  },
  {
    id: '2',
    title: 'ترانيم الصوم الكبير',
    description: 'مجموعة ترانيم وألحان خاصة بفترة الصوم الكبير',
    type: 'worship',
    category: 'hymns',
    contentType: 'audio',
    author: 'القس بطرس أنطون',
    status: 'published',
    publishedDate: '2024-03-01',
    views: 890,
    downloads: 450,
    tags: ['ترانيم', 'صوم', 'ألحان'],
    accessLevel: 'public'
  },
  {
    id: '3',
    title: 'دليل خادم مدارس الأحد',
    description: 'دليل شامل للخدام في مدارس الأحد',
    type: 'educational',
    category: 'servant-guide',
    contentType: 'document',
    author: 'لجنة مدارس الأحد',
    status: 'draft',
    publishedDate: null,
    views: 0,
    downloads: 0,
    tags: ['خدام', 'مدارس الأحد', 'دليل'],
    accessLevel: 'servants'
  },
  {
    id: '4',
    title: 'لقاء مع الأب شنودة الثالث',
    description: 'لقاء تاريخي مع قداسة البابا شنودة الثالث',
    type: 'spiritual',
    category: 'sermons',
    contentType: 'video',
    author: 'قناة كنيسة الإسكندرية',
    status: 'published',
    publishedDate: '2024-01-20',
    views: 3200,
    downloads: 180,
    tags: ['بابا', 'لقاء', 'تاريخ'],
    accessLevel: 'public'
  },
  {
    id: '5',
    title: 'صلوات الساعة السادسة',
    description: 'صلوات الساعة السادسة من الأجبية كاملة مع الشرح',
    type: 'worship',
    category: 'prayers',
    contentType: 'audio',
    author: 'الراهب أنطونيوس السرياني',
    status: 'published',
    publishedDate: '2024-02-10',
    views: 650,
    downloads: 280,
    tags: ['صلوات', 'أجبية', 'ساعة سادسة'],
    accessLevel: 'public'
  },
  {
    id: '6',
    title: 'خلفيات للعظات',
    description: 'مجموعة صور وخلفيات لاستخدامها في العظات والتعليم',
    type: 'media',
    category: 'images',
    contentType: 'image',
    author: 'فريق التصميم',
    status: 'published',
    publishedDate: '2024-03-05',
    views: 420,
    downloads: 350,
    tags: ['خلفيات', 'صور', 'تصميم'],
    accessLevel: 'servants'
  }
];

const contentTypeIcons = {
  video: Video,
  audio: FileAudio,
  document: FileText,
  image: Image
};

const contentTypeLabels = {
  video: 'فيديو',
  audio: 'صوتي',
  document: 'مستند',
  image: 'صورة'
};

const contentTypeColors = {
  video: 'default',
  audio: 'secondary',
  document: 'outline',
  image: 'default'
};

const typeLabels = {
  educational: 'تعليمي',
  worship: 'عبادة',
  spiritual: 'روحي',
  media: 'وسائط'
};

const categoryLabels = {
  'sunday-school': 'مدارس الأحد',
  'hymns': 'ترانيم',
  'servant-guide': 'دليل الخدام',
  'sermons': 'عظات',
  'prayers': 'صلوات',
  'images': 'صور'
};

const statusLabels = {
  published: 'منشور',
  draft: 'مسودة',
  archived: 'مؤرشف',
  restricted: 'مقيد'
};

const statusColors = {
  published: 'default',
  draft: 'secondary',
  archived: 'outline',
  restricted: 'destructive'
};

const accessLabels = {
  public: 'عام',
  servants: 'للخدام فقط',
  priests: 'للكهنة فقط',
  admin: 'للمديرين فقط'
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

export default function ContentManagement() {
  const { toast } = useToast();
  const [content, setContent] = useState(contentData);
  const [filteredContent, setFilteredContent] = useState(contentData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    let filtered = content;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.includes(searchTerm) || 
        item.description.includes(searchTerm) ||
        item.author.includes(searchTerm) ||
        item.tags.some((tag: string) => tag.includes(searchTerm))
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setFilteredContent(filtered);
  }, [content, searchTerm, typeFilter, statusFilter]);

  const handleCreateContent = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewContent = (contentItem: any) => {
    setSelectedContent(contentItem);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = (contentId: string, newStatus: string) => {
    setContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, status: newStatus }
          : item
      )
    );
    
    toast({
      title: 'تم التحديث',
      description: `تم تحديث حالة المحتوى إلى ${statusLabels[newStatus as keyof typeof statusLabels]}.`,
    });
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm('هل أنت متأكد من أنك تريد حذف هذا المحتوى؟')) {
      setContent(prev => prev.filter(item => item.id !== contentId));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المحتوى بنجاح.',
      });
    }
  };

  const handleApproveContent = (contentId: string) => {
    setContent(prev => 
      prev.map(item => 
        item.id === contentId 
          ? { ...item, status: 'published' }
          : item
      )
    );
    
    toast({
      title: 'تمت الموافقة',
      description: 'تمت الموافقة على نشر المحتوى.',
    });
  };

  const renderContentTypeIcon = (contentType: string) => {
    const IconComponent = contentTypeIcons[contentType as keyof typeof contentTypeIcons];
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">إدارة المحتوى</h1>
        <p className="text-blue-100">مراجعة والموافقة على المحتوى التعليمي والروحي وإدارة الموارد الرقمية.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المحتوى</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{content.length}</div>
            <p className="text-xs text-muted-foreground">
              {content.filter(item => item.status === 'published').length} منشور
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في انتظار الموافقة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {content.filter(item => item.status === 'draft').length}
            </div>
            <p className="text-xs text-muted-foreground">محتوى يحتاج مراجعة</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {content.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التنزيلات</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {content.reduce((sum, item) => sum + item.downloads, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">المحتوى</TabsTrigger>
            <TabsTrigger value="approval">الموافقات</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center">
                  <FileText className="ml-2 h-5 w-5" />
                  قائمة المحتوى
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center">
                    <Upload className="ml-2 h-4 w-4" />
                    استيراد
                  </Button>
                  <Button 
                    onClick={handleCreateContent}
                    className="flex items-center"
                  >
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة محتوى
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="بحث بالعنوان أو الوصف أو المؤلف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-8"
                      />
                    </div>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="فلترة حسب النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      {Object.entries(typeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="فلترة حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">المحتوى</TableHead>
                        <TableHead className="text-right">النوع</TableHead>
                        <TableHead className="text-right">المؤلف</TableHead>
                        <TableHead className="text-right">الإحصائيات</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContent.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="ml-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                                {renderContentTypeIcon(item.contentType)}
                              </div>
                              <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-muted-foreground">{item.description.substring(0, 50)}...</div>
                                <div className="flex gap-1 mt-1">
                                  {item.tags.slice(0, 2).map((tag: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                                  ))}
                                  {item.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">+{item.tags.length - 2}</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={contentTypeColors[item.contentType as keyof typeof contentTypeColors] as any}>
                                {contentTypeLabels[item.contentType as keyof typeof contentTypeLabels]}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {typeLabels[item.type as keyof typeof typeLabels]}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.author}</div>
                              <div className="text-xs text-muted-foreground">{item.publishedDate || 'غير منشور'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 ml-1" />
                                {item.views.toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <Download className="h-3 w-3 ml-1" />
                                {item.downloads.toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={statusColors[item.status as keyof typeof statusColors] as any}>
                                {statusLabels[item.status as keyof typeof statusLabels]}
                              </Badge>
                              <div className="flex items-center text-xs text-muted-foreground">
                                {item.accessLevel === 'public' ? (
                                  <Unlock className="h-3 w-3 ml-1" />
                                ) : (
                                  <Lock className="h-3 w-3 ml-1" />
                                )}
                                {accessLabels[item.accessLevel as keyof typeof accessLabels]}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-reverse space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewContent(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {item.status === 'draft' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleApproveContent(item.id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteContent(item.id)}
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

          <TabsContent value="approval" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="ml-2 h-5 w-5" />
                  المحتوى في انتظار الموافقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.filter(item => item.status === 'draft').map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-reverse space-x-4">
                          <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                            {renderContentTypeIcon(item.contentType)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{item.author}</Badge>
                              <Badge variant={contentTypeColors[item.contentType as keyof typeof contentTypeColors] as any}>
                                {contentTypeLabels[item.contentType as keyof typeof contentTypeLabels]}
                              </Badge>
                              <Badge variant="outline">
                                {typeLabels[item.type as keyof typeof typeLabels]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewContent(item)}
                          >
                            <Eye className="ml-1 h-4 w-4" />
                            عرض
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(item.id, 'restricted')}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XCircle className="ml-1 h-4 w-4" />
                            رفض
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveContent(item.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="ml-1 h-4 w-4" />
                            موافقة
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {content.filter(item => item.status === 'draft').length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">لا يوجد محتوى في انتظار الموافقة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Content Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل المحتوى</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن المحتوى المحدد
            </DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{selectedContent.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedContent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">النوع</Label>
                  <Badge variant={contentTypeColors[selectedContent.contentType as keyof typeof contentTypeColors] as any}>
                    {contentTypeLabels[selectedContent.contentType as keyof typeof contentTypeLabels]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">الفئة</Label>
                  <Badge variant="outline">
                    {typeLabels[selectedContent.type as keyof typeof typeLabels]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">المؤلف</Label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 ml-1 text-muted-foreground" />
                    <span>{selectedContent.author}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">الحالة</Label>
                  <Badge variant={statusColors[selectedContent.status as keyof typeof statusColors] as any}>
                    {statusLabels[selectedContent.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">مستوى الوصول</Label>
                  <Badge variant="outline">
                    {accessLabels[selectedContent.accessLevel as keyof typeof accessLabels]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">تاريخ النشر</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 ml-1 text-muted-foreground" />
                    <span>{selectedContent.publishedDate || 'غير منشور'}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">المشاهدات</Label>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 ml-1 text-muted-foreground" />
                    <span>{selectedContent.views.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">التنزيلات</Label>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 ml-1 text-muted-foreground" />
                    <span>{selectedContent.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">الوسوم</Label>
                <div className="flex flex-wrap gap-1">
                  {selectedContent.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      <Tag className="h-3 w-3 ml-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  إغلاق
                </Button>
                {selectedContent.status === 'draft' && (
                  <Button 
                    onClick={() => {
                      handleApproveContent(selectedContent.id);
                      setIsViewDialogOpen(false);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    <CheckCircle className="ml-1 h-4 w-4" />
                    موافقة
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Content Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة محتوى جديد</DialogTitle>
            <DialogDescription>
              إضافة محتوى جديد إلى النظام
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content-title">العنوان</Label>
              <Input id="content-title" placeholder="أدخل عنوان المحتوى" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-description">الوصف</Label>
              <Input id="content-description" placeholder="أدخل وصف المحتوى" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-type">نوع المحتوى</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المحتوى" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(contentTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-category">الفئة</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-author">المؤلف</Label>
              <Input id="content-author" placeholder="أدخل اسم المؤلف" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-access">مستوى الوصول</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى الوصول" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(accessLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-file">الملف</Label>
              <Input id="content-file" type="file" />
            </div>
            <div className="flex justify-end pt-4 gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: 'تم الإنشاء',
                    description: 'تم إنشاء المحتوى بنجاح.',
                  });
                  setIsCreateDialogOpen(false);
                }}
              >
                إنشاء محتوى
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
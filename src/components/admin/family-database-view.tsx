"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users2, 
  Search, 
  MapPin, 
  Phone, 
  ChevronDown,
  Download,
  BarChart3,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Family {
  id: string;
  familyName: string;
  headOfFamily: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  membersCount: number;
  childrenCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  visitations?: number;
  lastVisit?: string;
}

export default function FamilyDatabaseView() {
  const { toast } = useToast();
  const [families, setFamilies] = useState<Family[]>([]);
  const [filteredFamilies, setFilteredFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState<Family | null>(null);

  const cities = ['القاهرة', 'الجيزة', 'الإسكندرية', 'الإسماعيلية', 'الشرقية', 'الدقهلية', 'الغربية', 'الفيوم', 'البهيرة', 'المنوفية', 'القليوبية'];

  useEffect(() => {
    fetchFamilies();
  }, []);

  useEffect(() => {
    filterFamilies();
  }, [families, searchTerm, statusFilter, cityFilter]);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/families');
      if (response.ok) {
        const data = await response.json();
        setFamilies(data.families || []);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل قاعدة بيانات العائلات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFamilies = () => {
    let filtered = families;

    if (searchTerm.trim()) {
      filtered = filtered.filter(family =>
        family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.headOfFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(family => family.status === statusFilter);
    }

    if (cityFilter !== 'all') {
      filtered = filtered.filter(family => family.city === cityFilter);
    }

    setFilteredFamilies(filtered);
  };

  const handleDeleteFamily = async (familyId: string) => {
    try {
      const response = await fetch(`/api/admin/families/${familyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف العائلة بنجاح',
        });
        setIsDeleteDialogOpen(false);
        setFamilyToDelete(null);
        fetchFamilies();
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف العائلة',
        variant: 'destructive',
      });
    }
  };

  const handleExportFamilies = () => {
    const csvContent = [
      'اسم العائلة,رب العائلة,رقم الهاتف,البريد الإلكتروني,المدينة,عدد الأعضاء,عدد الأطفال,الحالة,تاريخ الإضافة',
      ...families.map(f => [
        f.familyName,
        f.headOfFamily,
        f.phone || '',
        f.email || '',
        f.city || '',
        f.membersCount,
        f.childrenCount,
        f.status,
        new Date(f.createdAt).toLocaleDateString('ar-EG')
      ])
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'families.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className="h-5 w-5" />
              <span>قاعدة بيانات العائلات</span>
            </div>
            <Button onClick={handleExportFamilies} variant="outline" size="sm">
              <Download className="h-4 w-4 ml-1" />
              تصدير
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن عائلة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[150px]">
                  {statusFilter === 'all' ? 'كل الحالات' : statusFilter === 'ACTIVE' ? 'نشطة' : 'غير نشطة'}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  كل الحالات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('ACTIVE')}>
                  نشطة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('INACTIVE')}>
                  غير نشطة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[150px]">
                  {cityFilter === 'all' ? 'كل المدن' : cityFilter}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCityFilter('all')}>
                  كل المدن
                </DropdownMenuItem>
                {cities.map(city => (
                  <DropdownMenuItem key={city} onClick={() => setCityFilter(city)}>
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{families.length}</div>
                <div className="text-sm text-blue-800">إجمالي العائلات</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {families.filter(f => f.status === 'ACTIVE').length}
                </div>
                <div className="text-sm text-green-800">عائلات نشطة</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {families.reduce((sum, f) => sum + f.membersCount, 0)}
                </div>
                <div className="text-sm text-purple-800">إجمالي الأعضاء</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {families.reduce((sum, f) => sum + f.childrenCount, 0)}
                </div>
                <div className="text-sm text-orange-800">إجمالي الأطفال</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Families Grid */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredFamilies.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Users2 className="h-12 w-12 mb-4" />
              <p>لا توجد عائلات</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              <AnimatePresence mode="popLayout">
                {filteredFamilies.map((family) => (
                  <motion.div
                    key={family.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedFamily(family)}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={family.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                {family.status === 'ACTIVE' ? 'نشطة' : 'غير نشطة'}
                              </Badge>
                              <CardTitle className="text-lg font-semibold">
                                {family.familyName}
                              </CardTitle>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Users2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">رب العائلة:</span>
                          <span>{family.headOfFamily}</span>
                        </div>
                        {family.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{family.phone}</span>
                          </div>
                        )}
                        {family.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{family.email}</span>
                          </div>
                        )}
                        {family.address && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{family.address}</span>
                          </div>
                        )}
                        {family.city && (
                          <div className="text-sm text-muted-foreground">
                            {family.city}
                          </div>
                        )}
                        <div className="flex gap-4 pt-3 border-t">
                          <div className="text-center flex-1">
                            <div className="text-2xl font-bold text-blue-600">{family.membersCount}</div>
                            <div className="text-xs text-muted-foreground">عضو</div>
                          </div>
                          <div className="text-center flex-1">
                            <div className="text-2xl font-bold text-green-600">{family.childrenCount}</div>
                            <div className="text-xs text-muted-foreground">طفل</div>
                          </div>
                          {family.visitations && (
                            <div className="text-center flex-1">
                              <div className="text-2xl font-bold text-purple-600">{family.visitations}</div>
                              <div className="text-xs text-muted-foreground">زيارة</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Details Modal */}
      <Dialog open={!!selectedFamily} onOpenChange={(open) => !open ? setSelectedFamily(null) : null}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل العائلة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">اسم العائلة</label>
                <div className="text-lg font-semibold">{selectedFamily?.familyName}</div>
              </div>
              <div>
                <label className="text-sm font-medium">رب العائلة</label>
                <div className="text-lg font-semibold">{selectedFamily?.headOfFamily}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">رقم الهاتف</label>
                <div>{selectedFamily?.phone || 'غير مسجل'}</div>
              </div>
              <div>
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <div className="truncate">{selectedFamily?.email || 'غير مسجل'}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">العنوان</label>
                <div className="truncate max-w-[250px]">{selectedFamily?.address || 'غير مسجل'}</div>
              </div>
              <div>
                <label className="text-sm font-medium">المدينة</label>
                <div>{selectedFamily?.city || 'غير مسجل'}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedFamily?.membersCount}</div>
                <div className="text-sm text-muted-foreground">عضو</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedFamily?.childrenCount}</div>
                <div className="text-sm text-muted-foreground">طفل</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedFamily?.visitations || 0}</div>
                <div className="text-sm text-muted-foreground">زيارة</div>
              </div>
            </div>
            {selectedFamily?.lastVisit && (
              <div className="pt-4 border-t">
                <label className="text-sm font-medium">آخر زيارة</label>
                <div>{new Date(selectedFamily.lastVisit).toLocaleDateString('ar-EG')}</div>
              </div>
            )}
            <div className="flex justify-end pt-6">
              <Button variant="destructive" onClick={() => {
                setSelectedFamily(null);
                setFamilyToDelete(selectedFamily);
                setIsDeleteDialogOpen(true);
              }}>
                حذف العائلة
              </Button>
              <Button variant="outline" onClick={() => setSelectedFamily(null)}>
                إغلاق
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
              هل أنت متأكد من حذف عائلة {familyToDelete?.familyName}؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive"
              onClick={() => familyToDelete && handleDeleteFamily(familyToDelete.id)}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

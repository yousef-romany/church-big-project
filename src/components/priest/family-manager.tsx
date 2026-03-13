"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, MapPin, Edit, Trash2, Plus, Search, ChevronRight, Calendar, UserCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  status: string;
  createdAt: string;
}

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export default function FamilyManager() {
  const { toast } = useToast();
  const [families, setFamilies] = useState<Family[]>([]);
  const [filteredFamilies, setFilteredFamilies] = useState<Family[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFamily, setNewFamily] = useState({
    familyName: '',
    headOfFamily: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });

  useEffect(() => {
    filterFamilies();
  }, [families, searchTerm]);

  useEffect(() => {
    fetchFamilies();
  }, []);

  const filterFamilies = () => {
    if (searchTerm.trim() === '') {
      setFilteredFamilies(families);
    } else {
      const filtered = families.filter(f =>
        f.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.headOfFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFamilies(filtered);
    }
  };

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/priest/families');
      const data = await response.json();
      setFamilies(data.families || []);
    } catch (error) {
      console.error('Error fetching families:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل العائلات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamily = async () => {
    try {
      const response = await fetch('/api/admin/families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFamily),
      });

      if (response.ok) {
        toast({
          title: 'تم الإنشاء',
          description: 'تم إضافة العائلة بنجاح',
        });
        setIsCreateDialogOpen(false);
        setNewFamily({
          familyName: '',
          headOfFamily: '',
          phone: '',
          email: '',
          address: '',
          city: '',
        });
        fetchFamilies();
      }
    } catch (error) {
      console.error('Error creating family:', error);
      toast({
        title: 'خطأ',
        description: 'فشل إضافة العائلة',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'inactive':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>العائلات ({filteredFamilies.length})</span>
          </CardTitle>
          <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4" />
            إضافة عائلة
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن عائلة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Families Grid */}
      {loading ? (
        <Card>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </CardContent>
        </Card>
      ) : filteredFamilies.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              لا توجد عائلات
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFamilies.map((family, index) => (
            <motion.div
              key={family.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedFamily(family)}
            >
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{family.familyName}</h3>
                      <Badge className={getStatusColor(family.status)}>
                        {family.status === 'active' ? 'نشطة' : 'غير نشطة'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">رب العائلة: {family.headOfFamily}</span>
                    </div>
                    {family.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{family.phone}</span>
                      </div>
                    )}
                    {family.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <span>{family.email}</span>
                      </div>
                    )}
                    {family.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{family.address}</span>
                      </div>
                    )}
                    {family.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span>{family.city}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{family.membersCount} عضو</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{family.childrenCount} طفل</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      )}

      {/* Create Family Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة عائلة جديدة</DialogTitle>
            <DialogDescription>
              أضف معلومات العائلة الجديدة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">اسم العائلة *</label>
              <Input
                value={newFamily.familyName}
                onChange={(e) => setNewFamily({ ...newFamily, familyName: e.target.value })}
                placeholder="أدخل اسم العائلة"
              />
            </div>
            <div>
              <label className="text-sm font-medium">رب العائلة *</label>
              <Input
                value={newFamily.headOfFamily}
                onChange={(e) => setNewFamily({ ...newFamily, headOfFamily: e.target.value })}
                placeholder="اسم رب العائلة"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">رقم الهاتف</label>
                <Input
                  type="tel"
                  value={newFamily.phone}
                  onChange={(e) => setNewFamily({ ...newFamily, phone: e.target.value })}
                  placeholder="رقم الهاتف"
                />
              </div>
              <div>
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={newFamily.email}
                  onChange={(e) => setNewFamily({ ...newFamily, email: e.target.value })}
                  placeholder="البريد الإلكتروني"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">العنوان</label>
              <Input
                value={newFamily.address}
                onChange={(e) => setNewFamily({ ...newFamily, address: e.target.value })}
                placeholder="العنوان الكامل"
              />
            </div>
            <div>
              <label className="text-sm font-medium">المدينة</label>
              <Input
                value={newFamily.city}
                onChange={(e) => setNewFamily({ ...newFamily, city: e.target.value })}
                placeholder="المدينة"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleCreateFamily}>
                إضافة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Family Details Dialog */}
      {selectedFamily && (
        <Dialog open={!!selectedFamily} onOpenChange={(open) => !open ? setSelectedFamily(null) : null}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>تفاصيل العائلة</DialogTitle>
              <DialogDescription>
                معلومات تفاصيلية عن العائلة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">اسم العائلة</label>
                  <div className="text-lg font-semibold">{selectedFamily.familyName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">رب العائلة</label>
                  <div>{selectedFamily.headOfFamily}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">الحالة</label>
                  <Badge className={getStatusColor(selectedFamily.status)}>
                    {selectedFamily.status === 'active' ? 'نشطة' : 'غير نشطة'}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">رقم الهاتف</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedFamily.phone || 'غير مسجل'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedFamily.email || 'غير مسجل'}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">العنوان</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedFamily.address || 'غير مسجل'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">المدينة</label>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedFamily.city || 'غير مسجل'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <Badge variant="outline">
                  {selectedFamily.membersCount} عضو
                </Badge>
                <Badge variant="outline">
                  {selectedFamily.childrenCount} طفل
                </Badge>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline">
                  <Edit className="h-4 w-4" />
                  تعديل
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

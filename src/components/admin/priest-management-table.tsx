"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical,
  Phone,
  Mail,
  Church,
  Calendar,
  Shield,
  ChevronDown,
  RefreshCw,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Priest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: string;
  createdAt: string;
  parish?: string;
  familyAssignments?: number;
}

export default function PriestManagementTable() {
  const { toast } = useToast();
  const [priests, setPriests] = useState<Priest[]>([]);
  const [filteredPriests, setFilteredPriests] = useState<Priest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPriest, setSelectedPriest] = useState<Priest | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [priestToDelete, setPriestToDelete] = useState<Priest | null>(null);

  useEffect(() => {
    fetchPriests();
  }, []);

  useEffect(() => {
    filterPriests();
  }, [priests, searchTerm, statusFilter]);

  const fetchPriests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/priests');
      if (response.ok) {
        const data = await response.json();
        setPriests(data.priests || []);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الكهنة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPriests = () => {
    let filtered = priests;

    if (searchTerm.trim()) {
      filtered = filtered.filter(priest =>
        priest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        priest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        priest.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(priest => priest.status === statusFilter);
    }

    setFilteredPriests(filtered);
  };

  const handleDeletePriest = async (priestId: string) => {
    try {
      const response = await fetch(`/api/admin/priests/${priestId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'تم الحذف',
          description: 'تم حذف الكاهن بنجاح',
        });
        setIsDeleteDialogOpen(false);
        setPriestToDelete(null);
        fetchPriests();
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف الكاهن',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (priestId: string) => {
    try {
      const priest = priests.find(p => p.id === priestId);
      if (!priest) return;

      const newStatus = priest.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await fetch(`/api/admin/priests/${priestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: 'تم التحديث',
          description: `تم تغيير حالة الكاهن إلى ${newStatus === 'ACTIVE' ? 'نشط' : 'غير نشط'}`,
        });
        fetchPriests();
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحديث حالة الكاهن',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-600';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-600';
      case 'ON_LEAVE':
        return 'bg-yellow-100 text-yellow-600';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'INACTIVE':
        return 'غير نشط';
      case 'ON_LEAVE':
        return 'إجازة';
      case 'SUSPENDED':
        return 'معلق';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              <span>إدارة الكهنة</span>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-1" />
              إضافة كاهن
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن كاهن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[150px]">
                  {statusFilter === 'all' ? 'كل الحالات' : getStatusLabel(statusFilter)}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  كل الحالات
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('ACTIVE')}>
                  نشط
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('INACTIVE')}>
                  غير نشط
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('ON_LEAVE')}>
                  إجازة
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('SUSPENDED')}>
                  معلق
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={fetchPriests}>
              <RefreshCw className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Priests Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredPriests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <UserCheck className="h-12 w-12 mb-4" />
              <p>لا يوجد كهنة</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-4 font-medium text-sm">الاسم</th>
                    <th className="text-right p-4 font-medium text-sm">معلومات الاتصال</th>
                    <th className="text-right p-4 font-medium text-sm">الأبرشية</th>
                    <th className="text-right p-4 font-medium text-sm">العنوان</th>
                    <th className="text-right p-4 font-medium text-sm">الحالة</th>
                    <th className="text-right p-4 font-medium text-sm">العائلات</th>
                    <th className="text-right p-4 font-medium text-sm">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredPriests.map((priest, index) => (
                      <motion.tr
                        key={priest.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4 text-right">{priest.name}</td>
                        <td className="p-4 text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            <span className="text-sm">{priest.phone || 'غير مسجل'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span className="text-sm">{priest.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {priest.parish || 'غير محدد'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm truncate max-w-[150px]">{priest.address || 'غير مسجل'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Badge className={getStatusBadgeColor(priest.status)}>
                            {getStatusLabel(priest.status)}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          {priest.familyAssignments || 0}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setSelectedPriest(priest)}>
                                <Edit className="h-4 w-4 ml-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(priest.id)}>
                                <Shield className="h-4 w-4 ml-2" />
                                {priest.status === 'ACTIVE' ? 'تعطيل' : 'تفعيل'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setPriestToDelete(priest);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف الكاهن {priestToDelete?.name}؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button 
              variant="destructive"
              onClick={() => priestToDelete && handleDeletePriest(priestToDelete.id)}
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

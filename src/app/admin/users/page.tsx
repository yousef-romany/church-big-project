"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Download
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
const usersData = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    role: 'PRIEST',
    status: 'active',
    createdAt: '2023-01-15',
    lastLogin: '2024-03-04',
    avatar: '/avatars/01.png'
  },
  {
    id: '2',
    name: 'مريم يوسف',
    email: 'mariam@example.com',
    role: 'PARENT',
    status: 'active',
    createdAt: '2023-02-20',
    lastLogin: '2024-03-03',
    avatar: '/avatars/02.png'
  },
  {
    id: '3',
    name: 'يوحنا عادل',
    email: 'yohanna@example.com',
    role: 'CHILD',
    status: 'active',
    createdAt: '2023-03-10',
    lastLogin: '2024-02-28',
    avatar: '/avatars/03.png'
  },
  {
    id: '4',
    name: 'سارة محمود',
    email: 'sara@example.com',
    role: 'SERVANT',
    status: 'inactive',
    createdAt: '2023-04-05',
    lastLogin: '2024-01-15',
    avatar: '/avatars/04.png'
  },
  {
    id: '5',
    name: 'ميشيل جورج',
    email: 'michel@example.com',
    role: 'USER',
    status: 'active',
    createdAt: '2023-05-12',
    lastLogin: '2024-03-02',
    avatar: '/avatars/05.png'
  }
];

const roleLabels = {
  ADMIN: 'مدير النظام',
  PRIEST: 'كاهن',
  SERVANT: 'خادم',
  PARENT: 'ولي أمر',
  CHILD: 'طفل',
  USER: 'مستخدم'
};

const roleColors = {
  ADMIN: 'destructive',
  PRIEST: 'default',
  SERVANT: 'secondary',
  PARENT: 'outline',
  CHILD: 'outline',
  USER: 'outline'
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

export default function UserAccountManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState(usersData);
  const [filteredUsers, setFilteredUsers] = useState(usersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.includes(searchTerm) || 
        user.email.includes(searchTerm)
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleCreateUser = () => {
    setIsCreateDialogOpen(true);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
    
    const user = users.find(u => u.id === userId);
    toast({
      title: 'تم التحديث',
      description: `تم ${user?.status === 'active' ? 'تعطيل' : 'تفعيل'} حساب المستخدم.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('هل أنت متأكد من أنك تريد حذف هذا المستخدم؟')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المستخدم بنجاح.',
      });
    }
  };

  const handleExportUsers = () => {
    // Simulate export functionality
    toast({
      title: 'تصدير المستخدمين',
      description: 'جاري تصدير قائمة المستخدمين...',
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
        <h1 className="text-3xl font-bold mb-2">إدارة المستخدمين</h1>
        <p className="text-blue-100">إدارة حسابات المستخدمين والأدوار والصلاحيات في النظام.</p>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="flex items-center">
              <Users className="ml-2 h-5 w-5" />
              قائمة المستخدمين
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportUsers}
                className="flex items-center"
              >
                <Download className="ml-2 h-4 w-4" />
                تصدير
              </Button>
              <Button 
                onClick={handleCreateUser}
                className="flex items-center"
              >
                <UserPlus className="ml-2 h-4 w-4" />
                إضافة مستخدم
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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="فلترة حسب الدور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  {Object.entries(roleLabels).map(([key, label]) => (
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
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المستخدم</TableHead>
                    <TableHead className="text-right">الدور</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-right">آخر تسجيل دخول</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 ml-2">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleColors[user.role as keyof typeof roleColors] as any}>
                          {roleLabels[user.role as keyof typeof roleLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-reverse space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status === 'active' ? 
                              <Lock className="h-4 w-4" /> : 
                              <Unlock className="h-4 w-4" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
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

      {/* User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تفاصيل المستخدم</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن المستخدم المحدد
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-reverse space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>
                              {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">الدور</Label>
                  <Badge variant={roleColors[selectedUser.role as keyof typeof roleColors] as any}>
                    {roleLabels[selectedUser.role as keyof typeof roleLabels]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">الحالة</Label>
                  <Badge variant={selectedUser.status === 'active' ? 'default' : 'secondary'}>
                    {selectedUser.status === 'active' ? 'نشط' : 'غير نشط'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">تاريخ الإنشاء</Label>
                  <p>{selectedUser.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">آخر تسجيل دخول</Label>
                  <p>{selectedUser.lastLogin}</p>
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

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            <DialogDescription>
              إنشاء حساب مستخدم جديد في النظام
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input id="name" placeholder="أدخل اسم المستخدم" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="أدخل البريد الإلكتروني" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" type="password" placeholder="أدخل كلمة المرور" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">الدور</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر دور المستخدم" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    description: 'تم إنشاء المستخدم بنجاح.',
                  });
                  setIsCreateDialogOpen(false);
                }}
              >
                إنشاء مستخدم
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
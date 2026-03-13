"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Link as LinkIcon, Eye, Plus, Calendar, Award, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ChildData {
  id: string;
  name: string;
  email: string;
  points: number;
  grade: string;
  birthDay: string;
  createdAt: string;
}

interface AttendanceData {
  id: string;
  date: string;
  activity: string;
  status: string;
  pointsEarned: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  earnedAt: string;
}

export default function ParentDashboard() {
  const { toast } = useToast();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkEmail, setLinkEmail] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/parent/profile');
      const data = await response.json();
      setChildren(data.linkedChildren || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل البيانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChild = async () => {
    if (!linkEmail.trim()) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال البريد الإلكتروني',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/parent/link-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childEmail: linkEmail }),
      });

      if (response.ok) {
        toast({
          title: 'تم الربط',
          description: 'تم ربط حساب الطفل بنجاح',
        });
        setIsLinkDialogOpen(false);
        setLinkEmail('');
        fetchChildren();
      }
    } catch (error) {
      console.error('Error linking child:', error);
      toast({
        title: 'خطأ',
        description: 'فشل ربط الطفل',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">مرحباً بكم!</h1>
        <p className="text-blue-100">
          دليلكم لمتابعة أطفالهم ومراقبة أنشطتهم
        </p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{children.length}</div>
              <div className="text-blue-100">أبن مربطين</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Activity className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">0</div>
              <div className="text-muted-foreground">إجمالي النقاط</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">12</div>
              <div className="text-muted-foreground">نقاط الشهر</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold">24</div>
              <div className="text-muted-foreground">نشاط الشهر</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsLinkDialogOpen(true)}>
            <CardContent className="p-6">
              <Plus className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-center mb-1">ربط حساب طفل</div>
              <p className="text-sm text-center text-muted-foreground">
                ربط حساب الطفل بحساب
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <LinkIcon className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-center mb-1">عرض بيانات الطفل</div>
              <p className="text-sm text-center text-muted-foreground">
                عرض تفاصيل الطفل
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Children List */}
      <Card>
        <CardHeader>
          <CardTitle>الأبناء ({children.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : children.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد أطفال مربطين
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedChild(child)}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold">{child.name}</h3>
                            {child.grade && (
                              <Badge variant="secondary" className="ml-2">
                                {child.grade}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Award className="h-4 w-4 text-yellow-600" />
                            <span>{child.points} نقطة</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {}}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{child.createdAt ? new Date(child.createdAt).toLocaleDateString('ar-EG') : 'غير معروف'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <LinkIcon className="h-4 w-4" />
                        <span>{child.email}</span>
                      </div>
                      {child.birthDay && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(child.birthDay).toLocaleDateString('ar-EG')}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link Child Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ربط حساب طفل</DialogTitle>
            <DialogDescription>
              أدخل البريد الإلكتروني للطفل
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="childEmail" className="text-sm font-medium">
                البريد الإلكتروني للطفل
              </label>
              <Input
                id="childEmail"
                type="email"
                value={linkEmail}
                onChange={(e) => setLinkEmail(e.target.value)}
                placeholder="child@example.com"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsLinkDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleLinkChild} disabled={!linkEmail.trim()}>
                ربط حساب
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Child Details Modal */}
      {selectedChild && (
        <Dialog open={!!selectedChild} onOpenChange={(open) => !open ? setSelectedChild(null) : null}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  <span>تفاصيل الطفل</span>
                  <Badge variant="outline">نقاط: {selectedChild.points}</Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">الاسم الطفل</label>
                    <span className="text-lg font-semibold">{selectedChild.name}</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium">البريد الإلكتروني</label>
                    <span>{selectedChild.email}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">تاريخ الميلاد</label>
                    <span className="text-lg font-semibold">
                      {selectedChild.createdAt 
                        ? new Date(selectedChild.createdAt).toLocaleDateString('ar-EG') 
                        : 'غير معروف'
                      }
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium">تاريخ الميلاد</label>
                    <span className="text-lg font-semibold">
                      {selectedChild.birthDay
                        ? new Date(selectedChild.birthDay).toLocaleDateString('ar-EG') 
                        : 'غير مسجل'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">حضور ونقاط</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {}}
                    >
                      <Calendar className="h-4 w-4" />
                      عرض الجدول
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {}}
                    >
                      <Activity className="h-4 w-4" />
                      عرض السجل
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">الإنجازات ونقاط</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-lg">
                      {selectedChild.points} نقطة
                    </Badge>
                    <Button onClick={() => {}}>
                      عرض السجل
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">الإعدادات</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      عرض جدول الحضور
                    </Button>
                    <Button variant="outline">
                      <Activity className="h-4 w-4" />
                      عرض الأنشاط
                    </Button>
                  </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button onClick={() => setSelectedChild(null)} variant="outline">
                  إغلاق
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

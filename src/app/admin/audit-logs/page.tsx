'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  History,
  Search,
  Filter,
  Calendar,
  UserCheck,
  UserX,
  Activity,
  Shield,
  AlertTriangle,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  timestamp: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
}

interface LogStats {
  totalLogs: number;
  successCount: number;
  failureCount: number;
  successRate: string;
  uniqueUsers: number;
  recentLogins: number;
}

export default function AuditLogsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current: 1,
    limit: 50
  });
  
  const [filters, setFilters] = useState({
    action: '',
    userId: '',
    startDate: '',
    endDate: '',
    success: '' as 'true' | 'false' | ''
  });

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchLogs();
    }
  }, [session, filters, pagination.current]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast({
        title: 'خطأ',
        description: 'فشل جلب سجلات التدقيق',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await fetch(`/api/admin/audit-logs/export?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تصدير السجلات',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-SA');
  };

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) {
      return action.includes('SUCCESS') ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />;
    }
    if (action.includes('2FA')) {
      return <Shield className="h-4 w-4" />;
    }
    if (action.includes('FAILED') || action.includes('ERROR')) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Activity className="h-4 w-4" />;
  };

  const getActionColor = (action: string, success: boolean) => {
    if (!success) return 'destructive';
    if (action.includes('LOGIN')) return 'default';
    if (action.includes('2FA')) return 'secondary';
    return 'outline';
  };

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold">غير مصرح</h2>
          <p className="text-muted-foreground">هذه الصفحة متاحة للمسؤولين فقط</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <History className="h-8 w-8" />
          سجلات التدقيق
        </h1>
        <p className="text-muted-foreground mt-2">
          عرض وتحليل جميع أحداث المصادقة والنظام
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">إجمالي السجلات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs.toLocaleString('ar-SA')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">عمليات ناجحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.successCount.toLocaleString('ar-SA')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">عمليات فاشلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failureCount.toLocaleString('ar-SA')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">تسجيلات دخول (24 ساعة)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentLogins.toLocaleString('ar-SA')}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            عوامل التصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="action">الإجراء</Label>
              <Input
                id="action"
                placeholder="ابحث عن إجراء..."
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="userId">معرف المستخدم</Label>
              <Input
                id="userId"
                placeholder="أدخل معرف المستخدم..."
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="startDate">من تاريخ</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">إلى تاريخ</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="success">الحالة</Label>
              <Select value={filters.success} onValueChange={(value: any) => setFilters({ ...filters, success: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="true">ناجح</SelectItem>
                  <SelectItem value="false">فاشل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end gap-2">
              <Button onClick={() => setFilters({ action: '', userId: '', startDate: '', endDate: '', success: '' })} variant="outline">
                إعادة تعيين
              </Button>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                تصدير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجلات التدقيق</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد سجلات تطابق عوامل التصفية
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getActionIcon(log.action)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.action}</span>
                          <Badge variant={getActionColor(log.action, log.success) as any}>
                            {log.success ? 'نجح' : 'فشل'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {log.user && (
                            <>
                              {log.user.name || log.user.email}
                              {log.user.role && ` (${log.user.role})`}
                              {' • '}
                            </>
                          )}
                          {log.ipAddress && `IP: ${log.ipAddress}`}
                          {' • '}
                          {formatDate(log.timestamp)}
                        </div>
                        {log.errorMessage && (
                          <div className="text-sm text-red-600 mt-1">
                            {log.errorMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPagination({ ...pagination, current: Math.max(1, pagination.current - 1) })}
                    disabled={pagination.current === 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    صفحة {pagination.current} من {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPagination({ ...pagination, current: Math.min(pagination.pages, pagination.current + 1) })}
                    disabled={pagination.current === pagination.pages}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

interface ReportConfig {
  reportType: string;
  startDate: string;
  endDate: string;
  format: 'PDF' | 'EXCEL' | 'CSV';
}

export default function ReportGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ReportConfig>({
    reportType: 'attendance',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    format: 'PDF',
  });

  const reportTypes = [
    { value: 'attendance', label: 'تقرير الحضور', icon: Users },
    { value: 'points', label: 'تقرير النقاط', icon: TrendingUp },
    { value: 'activities', label: 'تقرير الأنشطة', icon: Calendar },
    { value: 'comprehensive', label: 'تقرير شامل', icon: FileText },
  ];

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Failed to generate report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.reportType}-report.${config.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'تم إنشاء التقرير',
        description: 'تم تحميل التقرير بنجاح',
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'خطأ',
        description: 'فشل إنشاء التقرير',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          مولد التقارير
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="reportType">نوع التقرير</Label>
            <Select
              value={config.reportType}
              onValueChange={(value) => setConfig({ ...config, reportType: value })}
            >
              <SelectTrigger id="reportType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">تاريخ البداية</Label>
              <Input
                id="startDate"
                type="date"
                value={config.startDate}
                onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">تاريخ النهاية</Label>
              <Input
                id="endDate"
                type="date"
                value={config.endDate}
                onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="format">صيغة التقرير</Label>
            <Select
              value={config.format}
              onValueChange={(value: 'PDF' | 'EXCEL' | 'CSV') =>
                setConfig({ ...config, format: value })
              }
            >
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="EXCEL">Excel</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={generateReport}
            disabled={loading}
            className="w-full"
          >
            <Download className="ml-2 h-4 w-4" />
            {loading ? 'جاري الإنشاء...' : 'إنشاء وتحميل التقرير'}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

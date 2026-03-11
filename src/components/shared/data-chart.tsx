"use client";

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DataPoint {
  label: string;
  value: number;
}

interface DataChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
  showTrend?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}

export default function DataChart({ data, title, color = '#3b82f6', showTrend = false, trend }: DataChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const averageValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {showTrend && trend && (
            <div className={`flex items-center gap-1 ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp className="h-4 w-4" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4" />}
              {trend === 'neutral' && <Minus className="h-4 w-4" />}
              <span className="text-sm font-medium">
                {trend === 'up' ? 'زيادة' : trend === 'down' ? 'نقصان' : 'ثبات'}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {data.map((point, index) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-24 text-sm font-medium text-muted-foreground text-right">
                {point.label}
              </div>
              <div className="flex-1">
                <div className="h-6 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(point.value / maxValue) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm font-semibold text-left">
                {point.value.toLocaleString('ar-EG')}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{maxValue.toLocaleString('ar-EG')}</div>
            <div className="text-xs text-muted-foreground">الحد الأقصى</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-muted-foreground">
              {averageValue.toLocaleString('ar-EG', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-muted-foreground">المتوسط</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-muted-foreground">{minValue.toLocaleString('ar-EG')}</div>
            <div className="text-xs text-muted-foreground">الحد الأدنى</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

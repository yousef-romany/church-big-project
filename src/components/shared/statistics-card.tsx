"use client";

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatisticsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export default function StatisticsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = '#3b82f6',
}: StatisticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </div>
              <div className="text-3xl font-bold">
                {typeof value === 'number' ? value.toLocaleString('ar-EG') : value}
              </div>
              {trend && (
                <div
                  className={`text-sm mt-2 flex items-center gap-1 ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <span>{trend.isPositive ? '+' : '-'}</span>
                  <span>{Math.abs(trend.value)}%</span>
                  <span className="text-muted-foreground">من الشهر الماضي</span>
                </div>
              )}
            </div>
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="h-8 w-8" style={{ color }} />
            </div>
          </div>
        </CardContent>
        <div
          className="h-1"
          style={{ backgroundColor: color }}
        />
      </Card>
    </motion.div>
  );
}

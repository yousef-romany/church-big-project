"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  showPercentage?: boolean;
}

export default function ProgressIndicator({
  label,
  value,
  max,
  color = '#3b82f6',
  showPercentage = true,
}: ProgressIndicatorProps) {
  const percentage = (value / max) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{label}</span>
            {showPercentage && (
              <span className="text-sm font-semibold" style={{ color }}>
                {percentage.toFixed(1)}%
              </span>
            )}
          </div>
          <Progress value={percentage} className="h-2" style={{ '--progress-color': color } as any} />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{value.toLocaleString('ar-EG')}</span>
            <span>من {max.toLocaleString('ar-EG')}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

"use client";

import { motion } from 'framer-motion';
import { usePoints } from './points-provider';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PointsDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

export default function PointsDisplay({ size = 'md', showLabel = true }: PointsDisplayProps) {
  const { points, loading } = usePoints();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <Card className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white shadow-lg border-0">
        <CardContent className="p-4 flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Star className={`fill-white ${size === 'sm' ? 'h-5 w-5' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12'}`} />
          </motion.div>
          <div>
            <div className={`${sizeClasses[size]} font-bold`}>
              {loading ? '...' : points.toLocaleString('ar-EG')}
            </div>
            {showLabel && (
              <div className="text-xs md:text-sm opacity-90">نقطة</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

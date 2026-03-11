"use client";

import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BadgeItem {
  id: string;
  title: string;
  icon: 'trophy' | 'medal' | 'award' | 'star';
  color: string;
}

interface BadgeDisplayProps {
  badges: BadgeItem[];
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
};

const iconSize = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function BadgeDisplay({ badges, size = 'md' }: BadgeDisplayProps) {
  const getIcon = (icon: BadgeItem['icon']) => {
    const size = iconSize[size];
    switch (icon) {
      case 'trophy':
        return <Trophy className={size} />;
      case 'medal':
        return <Medal className={size} />;
      case 'award':
        return <Award className={size} />;
      case 'star':
        return <Star className={size} />;
      default:
        return <Trophy className={size} />;
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
          className="relative"
        >
          <div
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg`}
            style={{ backgroundColor: badge.color }}
          >
            <div className="text-white">{getIcon(badge.icon)}</div>
          </div>
          <Badge
            variant="secondary"
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs"
          >
            {badge.title}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
}

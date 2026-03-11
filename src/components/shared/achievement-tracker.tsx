"use client";

import { usePoints } from './points-provider';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AchievementDetail {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  earnedAt?: string;
}

export default function AchievementTracker() {
  const { achievements, fetchAchievements, loading } = usePoints();
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDetail | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const getIconComponent = (iconName: string) => {
    const iconClass = "h-8 w-8";
    switch (iconName) {
      case 'trophy':
        return <Trophy className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'award':
        return <Award className={iconClass} />;
      default:
        return <Trophy className={iconClass} />;
    }
  };

  const earnedAchievements = achievements.filter(a => a.earnedAt);
  const lockedAchievements = achievements.filter(a => !a.earnedAt);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          الإنجازات
          <Badge variant="secondary" className="mr-2">
            {earnedAchievements.length}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            جاري التحميل...
          </div>
        ) : (
          <div className="space-y-6">
            {earnedAchievements.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-600 mb-3">الإنجازات المحققة</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {earnedAchievements.map((achievement, index) => (
                    <Dialog key={achievement.id}>
                      <DialogTrigger asChild>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="cursor-pointer"
                          onClick={() => setSelectedAchievement(achievement)}
                        >
                          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-lg transition-shadow p-4 text-center">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                              className="text-green-600 mb-2"
                            >
                              {getIconComponent(achievement.icon)}
                            </motion.div>
                            <div className="font-semibold text-sm text-green-800">{achievement.title}</div>
                            <Badge className="mt-1 bg-green-600 text-xs">
                              +{achievement.points} نقطة
                            </Badge>
                          </Card>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-green-600">
                            {getIconComponent(achievement.icon)}
                            {achievement.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">+{achievement.points} نقطة</span>
                          </div>
                          {achievement.earnedAt && (
                            <div className="text-xs text-muted-foreground">
                              تم الإنجاز: {new Date(achievement.earnedAt).toLocaleDateString('ar-EG')}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            )}

            {lockedAchievements.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">الإنجازات القادمة</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {lockedAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      <Card className="bg-muted border-muted-foreground/20 p-4 text-center">
                        <div className="text-muted-foreground/50 mb-2 relative">
                          {getIconComponent(achievement.icon)}
                          <Lock className="absolute -top-1 -right-1 h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="font-semibold text-sm text-muted-foreground">{achievement.title}</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {achievement.points} نقطة
                        </Badge>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

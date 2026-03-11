"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trophy, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
}

export default function AchievementNotification() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkNewAchievements = async () => {
      try {
        const response = await fetch('/api/achievements/check-new');
        if (!response.ok) return;
        const data = await response.json();
        if (data.newAchievements && data.newAchievements.length > 0) {
          setAchievements(data.newAchievements);
          setShowNextAchievement();
        }
      } catch (error) {
        console.error('Error checking achievements:', error);
      }
    };

    checkNewAchievements();
    const interval = setInterval(checkNewAchievements, 30000);
    return () => clearInterval(interval);
  }, []);

  const showNextAchievement = () => {
    if (achievements.length > 0) {
      const next = achievements[0];
      setCurrentAchievement(next);
      setAchievements(prev => prev.slice(1));
      setShow(true);
      
      setTimeout(() => {
        setShow(false);
        if (achievements.length > 1) {
          setTimeout(showNextAchievement, 1000);
        }
      }, 5000);
    }
  };

  const handleClose = () => {
    setShow(false);
    if (achievements.length > 0) {
      setTimeout(showNextAchievement, 500);
    }
  };

  return (
    <AnimatePresence>
      {show && currentAchievement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <Card className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-2xl border-0">
            <CardContent className="p-6 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 left-2 text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="flex-shrink-0"
                >
                  <Trophy className="h-16 w-16 fill-white" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm font-semibold">إنجاز جديد!</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">
                    {currentAchievement.title}
                  </h3>
                  <p className="text-sm opacity-90 mb-3">
                    {currentAchievement.description}
                  </p>
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg p-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">
                      +{currentAchievement.points} نقطة
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

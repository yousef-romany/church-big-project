"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  publishAt: string;
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(false);
      const response = await fetch('/api/announcements/active');
      if (!response.ok) return;
      const data = await response.json();
      const activeAnnouncements = (data.announcements || []).filter(
        (a: Announcement) => !dismissed.has(a.id)
      );
      setAnnouncements(activeAnnouncements);
      if (activeAnnouncements.length > 0) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissCurrent = () => {
    if (announcements[currentIndex]) {
      const dismissedId = announcements[currentIndex].id;
      setDismissed(prev => new Set([...prev, dismissedId]));
      setAnnouncements(prev => prev.filter(a => a.id !== dismissedId));
      if (announcements.length > 1) {
        setCurrentIndex(0);
      }
    }
  };

  const nextAnnouncement = () => {
    setCurrentIndex(prev => (prev + 1) % announcements.length);
  };

  const prevAnnouncement = () => {
    setCurrentIndex(prev => (prev - 1 + announcements.length) % announcements.length);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'from-red-500 to-orange-500';
      case 'MEDIUM':
        return 'from-blue-500 to-indigo-500';
      case 'LOW':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="mb-6"
      >
        <Card className={`bg-gradient-to-r ${getPriorityColor(currentAnnouncement.priority)} text-white shadow-lg border-0`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex-shrink-0"
              >
                <Megaphone className="h-6 w-6" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{currentAnnouncement.title}</h3>
                  <Badge className="bg-white/20 text-white text-xs">
                    {currentAnnouncement.priority}
                  </Badge>
                </div>
                <p className="text-sm opacity-90 truncate">{currentAnnouncement.content}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {announcements.length > 1 && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={prevAnnouncement}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                    </Button>
                    <span className="text-xs">
                      {currentIndex + 1} / {announcements.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={nextAnnouncement}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={dismissCurrent}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

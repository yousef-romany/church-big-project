"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info, Award, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'ANNOUNCEMENT' | 'MESSAGE' | 'REMINDER' | 'ACHIEVEMENT' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export default function NotificationToast() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    checkNewNotifications();
    const interval = setInterval(checkNewNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const checkNewNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/new');
      if (!response.ok) return;
      const data = await response.json();
      if (data.notifications && data.notifications.length > 0) {
        const newNotifications = data.notifications.filter(
          (n: ToastNotification) => !dismissed.has(n.id)
        );
        setToasts(prev => [...prev, ...newNotifications]);
        
        newNotifications.forEach((n: ToastNotification) => {
          setTimeout(() => dismissToast(n.id), 8000);
        });
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    setDismissed(prev => new Set([...prev, id]));
  };

  const dismissAll = () => {
    toasts.forEach(t => setDismissed(prev => new Set([...prev, t.id])));
    setToasts([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return <Bell className="h-5 w-5" />;
      case 'MESSAGE':
        return <MessageSquare className="h-5 w-5" />;
      case 'REMINDER':
        return <AlertCircle className="h-5 w-5" />;
      case 'ACHIEVEMENT':
        return <Award className="h-5 w-5" />;
      case 'SYSTEM':
        return <Info className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'from-red-500 to-red-600';
      case 'HIGH':
        return 'from-orange-500 to-orange-600';
      case 'MEDIUM':
        return 'from-blue-500 to-blue-600';
      case 'LOW':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={dismissAll}
              className="w-full"
            >
              تجاهل الكل ({toasts.length})
            </Button>
          </motion.div>
        )}
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 400, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.3 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              delay: index * 0.1,
            }}
          >
            <Card className={`bg-gradient-to-r ${getPriorityStyles(toast.priority)} text-white shadow-2xl border-0`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        {getIcon(toast.type)}
                      </motion.div>
                      <h4 className="font-semibold text-sm">{toast.title}</h4>
                    </div>
                    <p className="text-sm opacity-90">{toast.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-white/20 flex-shrink-0"
                    onClick={() => dismissToast(toast.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

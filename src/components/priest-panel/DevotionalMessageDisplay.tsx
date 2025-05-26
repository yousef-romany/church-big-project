
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRandomDevotionalMessage, devotionalMessages } from '@/lib/devotional-messages';
import { RefreshCw, Sparkles } from 'lucide-react';

export default function DevotionalMessageDisplay() {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchNewMessage = useCallback(() => {
    setIsLoading(true);
    // Simulate a small delay for visual feedback if needed, or remove for instant change
    setTimeout(() => {
      setCurrentMessage(getRandomDevotionalMessage());
      setIsLoading(false);
    }, 300); // Short delay for animation
  }, []);

  useEffect(() => {
    setCurrentMessage(getRandomDevotionalMessage()); // Initial message

    const intervalId = setInterval(() => {
      fetchNewMessage();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchNewMessage]);

  if (devotionalMessages.length === 0) {
    return null; // Don't render if no messages are available
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-auto" // Pushes to the bottom if in a flex-col container
    >
      <Card className="bg-primary/10 border-primary/30 shadow-md">
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-primary flex items-center">
              <Sparkles className="h-4 w-4 me-1.5" />
              رسالة اليوم
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchNewMessage}
              disabled={isLoading}
              className="h-7 w-7 text-primary/70 hover:text-primary hover:bg-primary/10"
              aria-label="تحديث الرسالة"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-xs text-primary/90 px-3 pb-3 min-h-[40px] flex items-center justify-center text-center">
          {isLoading ? (
            <span className="italic">جاري تحميل رسالة جديدة...</span>
          ) : (
            <motion.p
              key={currentMessage} // Ensures animation on message change
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentMessage}
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

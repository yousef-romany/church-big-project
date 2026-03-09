"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDevotionalMessage } from '@/ai/flows/devotional-message-flow'; // Import the new AI flow
import { RefreshCw, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const devotionalTopics = ['الإيمان', 'الرجاء', 'المحبة', 'الغفران', 'الشكر', 'الصبر', 'السلام'];

export default function DevotionalMessageDisplay() {
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchNewMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const randomTopic = devotionalTopics[Math.floor(Math.random() * devotionalTopics.length)];
      const message = await getDevotionalMessage(randomTopic);
      setCurrentMessage(message);
    } catch (error) {
      console.error("Failed to fetch devotional message:", error);
      setCurrentMessage("لا يمكن تحميل الرسالة الآن. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewMessage(); // Fetch on initial load
  }, [fetchNewMessage]);

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
            <div className="w-full space-y-1">
                <Skeleton className="h-2 w-3/4 mx-auto bg-primary/20"/>
                <Skeleton className="h-2 w-1/2 mx-auto bg-primary/20"/>
            </div>
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

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Trash2, Reply, Forward, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  subject: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  read: boolean;
  createdAt: string;
}

export default function MessageCenter() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch('/api/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      });
      if (response.ok) {
        setMessages(prev =>
          prev.map(m => (m.id === messageId ? { ...m, read: true } : m))
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
        toast({
          title: 'تم الحذف',
          description: 'تم حذف الرسالة بنجاح',
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-blue-500';
      case 'LOW':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredMessages = messages.filter(m => {
    if (searchQuery && !m.subject.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !m.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter === 'unread' && m.read) return false;
    if (filter === 'priority' && m.priority !== 'HIGH' && m.priority !== 'URGENT') {
      return false;
    }
    return true;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <Card className="shadow-lg h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            مركز الرسائل
            {unreadCount > 0 && (
              <Badge variant="destructive" className="mr-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button size="sm">
            <Plus className="ml-2 h-4 w-4" />
            رسالة جديدة
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-[calc(100%-80px)]">
          <div className="w-80 border-r">
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث..."
                  className="pr-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="unread">غير مقروء</TabsTrigger>
                  <TabsTrigger value="priority">مهم</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ScrollArea className="h-[calc(100%-150px)]">
              {loading ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  جاري التحميل...
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد رسائل
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'bg-primary/10 border-primary'
                          : !message.read
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-muted/50'
                      } ${!message.read ? 'border' : ''}`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.read) markAsRead(message.id);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm truncate">
                              {message.senderName}
                            </h4>
                            <Badge className={getPriorityColor(message.priority)} variant="secondary">
                              {message.priority}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium truncate">{message.subject}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                        {!message.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col">
            <AnimatePresence>
              {selectedMessage ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Forward className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMessage(selectedMessage.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>من: {selectedMessage.senderName}</span>
                      <span>•</span>
                      <span>{formatDate(selectedMessage.createdAt)}</span>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-base leading-relaxed">{selectedMessage.content}</p>
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input placeholder="اكتب رد..." className="flex-1" />
                      <Button>
                        <Send className="ml-2 h-4 w-4" />
                        إرسال
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>اختر رسالة لعرضها</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

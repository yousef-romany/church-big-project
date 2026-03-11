"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, RefreshCw } from 'lucide-react';

interface QRCodeDisplayProps {
  userId?: string;
}

export default function QRCodeDisplay({ userId }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQRCode();
  }, [userId]);

  const fetchQRCode = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/attendance/qr-code');
      if (!response.ok) throw new Error('Failed to fetch QR code');
      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qr-code.png';
    link.click();
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'رمز الاستجابة السريعة',
          text: 'رمز الاستجابة السريعة الخاص بي',
          url: qrCode,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>رمز الاستجابة السريعة</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchQRCode}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex justify-center"
            >
              <div className="bg-white p-4 rounded-lg shadow-lg">
                {qrCode ? (
                  <img 
                    src={qrCode} 
                    alt="QR Code" 
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                    <p className="text-muted-foreground">غير متوفر</p>
                  </div>
                )}
              </div>
            </motion.div>
            <div className="flex gap-2 justify-center">
              <Button onClick={downloadQRCode} variant="outline" size="sm">
                <Download className="ml-2 h-4 w-4" />
                تحميل
              </Button>
              <Button onClick={shareQRCode} variant="outline" size="sm">
                <Share2 className="ml-2 h-4 w-4" />
                مشاركة
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

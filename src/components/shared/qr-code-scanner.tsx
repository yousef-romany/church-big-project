"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ScanResult {
  success: boolean;
  message: string;
  userId?: string;
  userName?: string;
  attendancePoints?: number;
}

export default function QRCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      toast({
        title: 'خطأ',
        description: 'فشل الوصول إلى الكاميرا',
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const captureQRCode = async () => {
    if (!scanning || !videoRef.current) return;

    setLoading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        
        const response = await fetch('/api/attendance/check-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData: canvas.toDataURL() }),
        });

        const data = await response.json();
        setResult(data);

        if (data.success) {
          toast({
            title: 'نجح التسجيل',
            description: data.message,
          });
        } else {
          toast({
            title: 'فشل التسجيل',
            description: data.message,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error capturing QR code:', error);
      toast({
        title: 'خطأ',
        description: 'فشل قراءة رمز الاستجابة السريعة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setResult(null);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          مسح رمز الاستجابة السريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
            {scanning && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="text-center text-muted-foreground">
                  <CameraOff className="h-16 w-16 mx-auto mb-2" />
                  <p>الكاميرا متوقفة</p>
                </div>
              </div>
            )}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 flex items-center justify-center"
                >
                  <div className="text-center text-white p-6 space-y-4">
                    {result.success ? (
                      <>
                        <CheckCircle className="h-20 w-20 mx-auto text-green-500" />
                        <h3 className="text-2xl font-bold">تم التسجيل بنجاح!</h3>
                        {result.userName && (
                          <p className="text-lg">{result.userName}</p>
                        )}
                        {result.attendancePoints && (
                          <Badge className="bg-green-500 text-white">
                            +{result.attendancePoints} نقطة
                          </Badge>
                        )}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-20 w-20 mx-auto text-red-500" />
                        <h3 className="text-2xl font-bold">فشل التسجيل</h3>
                        <p>{result.message}</p>
                      </>
                    )}
                    <Button onClick={resetScan} className="mt-4">
                      مسح آخر
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {scanning && (
              <div className="absolute inset-0 border-4 border-transparent">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-primary rounded-lg" />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!scanning ? (
              <Button onClick={startCamera} className="flex-1">
                <Camera className="ml-2 h-4 w-4" />
                تشغيل الكاميرا
              </Button>
            ) : (
              <>
                <Button 
                  onClick={captureQRCode} 
                  className="flex-1"
                  disabled={loading || !!result}
                >
                  {loading ? 'جاري المسح...' : 'مسح الآن'}
                </Button>
                <Button 
                  onClick={stopCamera} 
                  variant="outline"
                >
                  <CameraOff className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {!result && scanning && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <p>ضع رمز الاستجابة السريعة داخل الإطار</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

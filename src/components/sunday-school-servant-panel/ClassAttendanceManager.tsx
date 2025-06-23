
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Camera, Check, Star, User, Calendar, XCircle, Award, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from 'date-fns';
import { arSA } from 'date-fns/locale';

import type { SundaySchoolChild } from '@/types/sunday-school';
import { findChildByQrCode, recordChildAttendance, awardPointsToChild, getChildAttendanceForDate } from '@/lib/sunday-school-store';

const quickPoints = [5, 10, 15, 20];

export default function ClassAttendanceManager() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scannedChild, setScannedChild] = useState<SundaySchoolChild | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number | string>('');
  const [alreadyRecordedToday, setAlreadyRecordedToday] = useState(false);
  
  // This would come from the logged-in servant's context in a real app
  const MOCK_SERVANT_ID = 'servant1_ss_mock_id';

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        console.warn("Camera access is not supported by this browser.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  useEffect(() => {
    if (scannedChild) {
      const todayString = format(new Date(), 'yyyy-MM-dd');
      const todaysRecord = getChildAttendanceForDate(scannedChild.id, todayString);
      setAlreadyRecordedToday(!!todaysRecord);
    } else {
      setAlreadyRecordedToday(false);
    }
  }, [scannedChild]);

  const handleQrSubmit = () => {
    if (!qrCodeInput) return;
    const child = findChildByQrCode(qrCodeInput);
    if (child) {
      setScannedChild(child);
      toast({
        title: "تم العثور على الابن",
        description: `تم العثور على ${child.name}.`,
      });
    } else {
      setScannedChild(null);
      toast({
        title: "لم يتم العثور على الابن",
        description: "الرجاء التأكد من الكود المدخل والمحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleRecordAttendance = () => {
    if (!scannedChild) return;
    const result = recordChildAttendance(scannedChild.id, MOCK_SERVANT_ID);
    if (result.success && result.child) {
      setScannedChild(result.child);
      setAlreadyRecordedToday(true);
      toast({
        title: "تم تسجيل الحضور",
        description: `تم تسجيل حضور ${result.child.name} ومنحه 10 نقاط للمواظبة.`,
      });
    } else {
        toast({
            title: "خطأ",
            description: result.message,
            variant: "destructive",
        });
    }
  };
  
  const handleAwardPoints = (points: number) => {
    if (!scannedChild || isNaN(points) || points <= 0) return;
    const updatedChild = awardPointsToChild(scannedChild.id, points);
     if (updatedChild) {
      setScannedChild(updatedChild);
      toast({
        title: "تم منح النقاط بنجاح",
        description: `تم منح ${points} نقاط إلى ${updatedChild.name}.`,
      });
      setPointsToAdd('');
    }
  }
  
  const reset = () => {
      setScannedChild(null);
      setQrCodeInput('');
      setPointsToAdd('');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><QrCode className="me-2 h-6 w-6 text-primary" /> تسجيل حضور ومكافآت الأبناء</CardTitle>
          <CardDescription>استخدم الكاميرا لمسح QR Code أو أدخل الكود يدويًا.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
            <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                autoPlay 
                muted 
                playsInline
                data-ai-hint="QR code scanner"
            />
            {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white p-4">
                    <Camera className="h-12 w-12 mb-4" />
                    <p className="text-center font-semibold">الكاميرا غير متاحة</p>
                    <p className="text-center text-sm">الرجاء السماح بالوصول إلى الكاميرا لاستخدام الماسح الضوئي.</p>
                </div>
            )}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-3/4 h-3/4 border-4 border-dashed border-white/50 rounded-lg"/>
            </div>
          </div>

          <div className="flex gap-2">
            <Input 
              placeholder="أو أدخل كود الـ QR يدويًا" 
              value={qrCodeInput}
              onChange={(e) => setQrCodeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQrSubmit()}
            />
            <Button onClick={handleQrSubmit}>بحث</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col">
        <AnimatePresence>
        {scannedChild ? (
            <motion.div
                key={scannedChild.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <Card className="shadow-xl flex-grow flex flex-col">
                    <CardHeader className="flex flex-row items-center gap-4">
                         <Avatar className="h-20 w-20 border-4 border-primary">
                            <AvatarImage src={scannedChild.avatarUrl} alt={scannedChild.name} data-ai-hint="child portrait" />
                            <AvatarFallback>{scannedChild.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{scannedChild.name}</CardTitle>
                            <CardDescription className="flex items-center text-sm mt-1">
                                <Star className="h-4 w-4 me-1 text-yellow-500" /> {scannedChild.points} نقطة
                            </CardDescription>
                             <CardDescription className="flex items-center text-sm mt-1">
                                <Calendar className="h-4 w-4 me-1 text-muted-foreground" /> آخر حضور: {format(parseISO(scannedChild.lastAttendance), 'd MMMM yyyy', { locale: arSA })}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="ms-auto" onClick={reset}>
                            <XCircle className="h-5 w-5"/>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow">
                         {alreadyRecordedToday ? (
                             <div className="w-full flex items-center justify-center p-3 rounded-md bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                <CheckCircle className="me-2 h-5 w-5" /> تم تسجيل الحضور لهذا اليوم.
                            </div>
                        ) : (
                             <Button 
                                onClick={handleRecordAttendance} 
                                className="w-full bg-green-600 hover:bg-green-700" 
                                size="lg"
                            >
                                <Check className="me-2 h-5 w-5" /> تسجيل حضور اليوم (+10 نقاط)
                            </Button>
                        )}
                        <div className="space-y-2">
                             <h4 className="font-semibold text-center text-primary">منح نقاط إضافية (للمشاركة)</h4>
                             <div className="flex gap-2">
                                <Input 
                                    type="number" 
                                    placeholder="عدد النقاط" 
                                    value={pointsToAdd}
                                    onChange={(e) => setPointsToAdd(e.target.value)}
                                />
                                <Button onClick={() => handleAwardPoints(Number(pointsToAdd))} disabled={!pointsToAdd || Number(pointsToAdd) <= 0}>منح</Button>
                             </div>
                             <div className="flex justify-around gap-1">
                                {quickPoints.map(p => (
                                    <Button key={p} variant="outline" size="sm" onClick={() => handleAwardPoints(p)}>+{p}</Button>
                                ))}
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        ) : (
            <Card className="flex-grow flex items-center justify-center bg-muted/30 border-dashed">
                <div className="text-center text-muted-foreground p-8">
                    <User className="mx-auto h-12 w-12 mb-4" />
                    <p className="font-semibold">في انتظار مسح QR Code</p>
                    <p className="text-sm">سيتم عرض بيانات الابن هنا بعد البحث عنه.</p>
                </div>
            </Card>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}

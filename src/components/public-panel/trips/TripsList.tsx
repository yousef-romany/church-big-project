
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

import type { Trip } from '@/types/trips';
import { getTrips, getBookingStats } from '@/lib/trips-store';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Calendar, Users, BadgeDollarSign, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';


export default function TripsList() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    // Fetch only future trips and sort them
    const futureTrips = getTrips()
      .filter(trip => new Date(trip.startDate) >= new Date())
      .sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    setTrips(futureTrips);
  }, []);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => {
              const stats = getBookingStats(trip.id);
              const progress = (stats.total / trip.capacity) * 100;

              return (
                 <motion.div 
                    key={trip.id}
                    layout 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }} 
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Plane className="h-6 w-6 text-primary"/>{trip.title}</CardTitle>
                            <CardDescription>{trip.destination}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3 text-sm">
                             <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/> 
                                {format(new Date(trip.startDate), "d MMMM", { locale: arSA })} إلى {format(new Date(trip.endDate), "d MMMM yyyy", { locale: arSA })}
                            </p>
                            <p className="flex items-center gap-2"><BadgeDollarSign className="h-4 w-4 text-muted-foreground"/> {trip.price} جنيه للفرد</p>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground"/> الأماكن المحجوزة</span>
                                    <span>{stats.total} / {trip.capacity}</span>
                                </div>
                                <Progress value={progress} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/public-panel/trips/${trip.id}`}>
                                    عرض التفاصيل والحجز <ArrowLeft className="ms-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                 </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
            <p className="text-muted-foreground">لا توجد رحلات متاحة في الوقت الحالي. يرجى المتابعة لاحقًا.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

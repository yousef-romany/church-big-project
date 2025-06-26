
"use client";

import { useState, useEffect } from 'react';
import type { Trip, Booking } from '@/types/trips';
import { getBookingsForTrip, confirmPayment, getBookingStats } from '@/lib/trips-store';
import { useToast } from '@/hooks/use-toast';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, KeyRound, Check, Ticket, User, Users } from 'lucide-react';

interface TripBookingsViewProps {
  trip: Trip;
  onBookingUpdate: () => void;
}

export default function TripBookingsView({ trip, onBookingUpdate }: TripBookingsViewProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0 });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const fetchBookings = () => {
    setBookings(getBookingsForTrip(trip.id));
    setStats(getBookingStats(trip.id));
  };
  
  useEffect(() => {
    fetchBookings();
  }, [trip]);

  const handleConfirmPayment = () => {
    if (!confirmationCode.trim()) {
        toast({ title: "خطأ", description: "الرجاء إدخال كود التأكيد.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    const result = confirmPayment(confirmationCode.trim());
    if (result.success) {
        toast({ title: "تم تأكيد الدفع!", description: `تم تحديث حالة حجز ${result.booking?.userName}.`});
        setConfirmationCode('');
        fetchBookings(); // Refresh the list
        onBookingUpdate(); // Notify parent component to refresh trip list stats
    } else {
        toast({ title: "فشل التأكيد", description: result.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 max-h-[85vh] overflow-y-auto p-1">
      <DialogHeader>
        <DialogTitle className="text-2xl">حجوزات رحلة: {trip.title}</DialogTitle>
        <DialogDescription>متابعة الحجوزات وتأكيد المدفوعات.</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الحجوزات</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.total} / {trip.capacity}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">تم الدفع</CardTitle>
                <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.paid}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">لم يتم الدفع</CardTitle>
                <Ticket className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.unpaid}</div>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle className="text-lg">تأكيد الدفع</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
            <Input 
                placeholder="أدخل كود تأكيد الحجز..." 
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                className="flex-grow"
            />
            <Button onClick={handleConfirmPayment} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="me-2 h-4 w-4 animate-spin"/> : <KeyRound className="me-2 h-4 w-4"/>}
                تأكيد الدفع
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">قائمة المسجلين</CardTitle></CardHeader>
        <CardContent>
            {bookings.length > 0 ? (
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الاسم</TableHead>
                            <TableHead>كود الحجز</TableHead>
                            <TableHead>الحالة</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map(booking => (
                            <TableRow key={booking.id}>
                                <TableCell className="font-medium">{booking.userName}</TableCell>
                                <TableCell className="font-mono text-xs">{booking.bookingCode}</TableCell>
                                <TableCell>
                                    <Badge variant={booking.status === 'paid' ? 'default' : 'destructive'}>
                                        {booking.status === 'paid' ? 'تم الدفع' : 'لم يتم الدفع'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-center text-muted-foreground py-4">لا توجد حجوزات لهذه الرحلة بعد.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

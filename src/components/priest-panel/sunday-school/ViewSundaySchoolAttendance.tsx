
"use client";
import type { SundaySchoolServant, SundaySchoolAttendance, ServingDay, AttendanceStatus } from '@/types/sunday-school';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Eye, MessageSquare, Filter, User, CalendarDays as DateIcon, Check, X, Edit2 as ExcusedIcon } from 'lucide-react';
import { DatePickerWithPresets } from '@/components/ui/DatePickerWithPresets';
import { getSundaySchoolServants, getSundaySchoolAttendance } from '@/lib/sunday-school-store';
import { format, parseISO, isValid } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

const statusDisplay: Record<AttendanceStatus, { label: string; icon: JSX.Element; className: string }> = {
  present: { label: 'حاضر', icon: <Check className="h-4 w-4" />, className: 'text-green-600 dark:text-green-400' },
  absent: { label: 'غائب', icon: <X className="h-4 w-4" />, className: 'text-red-600 dark:text-red-400' },
  excused: { label: 'معذور', icon: <ExcusedIcon className="h-4 w-4" />, className: 'text-yellow-600 dark:text-yellow-400' },
};

export default function ViewSundaySchoolAttendance() {
  const [allServants, setAllServants] = useState<SundaySchoolServant[]>([]);
  const [allAttendance, setAllAttendance] = useState<SundaySchoolAttendance[]>([]);
  
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterServantId, setFilterServantId] = useState<string>('الكل');
  const [filterStatus, setFilterStatus] = useState<AttendanceStatus | 'الكل'>('الكل');

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messagingServant, setMessagingServant] = useState<SundaySchoolServant | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setAllServants(getSundaySchoolServants().filter(s => s.isActive));
    setAllAttendance(getSundaySchoolAttendance());
  }, []);

  const filteredAttendance = useMemo(() => {
    return allAttendance
      .map(att => {
        const servant = allServants.find(s => s.id === att.servantId);
        return servant ? { ...att, servantName: servant.name } : null;
      })
      .filter(Boolean) // Remove nulls if servant not found (e.g., deleted servant)
      .filter(att => {
        if (!att) return false;
        const matchesDate = !filterDate || att.date === format(filterDate, 'yyyy-MM-dd');
        const matchesServant = filterServantId === 'الكل' || att.servantId === filterServantId;
        const matchesStatus = filterStatus === 'الكل' || att.status === filterStatus;
        return matchesDate && matchesServant && matchesStatus;
      })
      .sort((a, b) => { // Sort by date (desc) then by servant name (asc)
        if (!a || !b) return 0;
        const dateComparison = parseISO(b.date).getTime() - parseISO(a.date).getTime();
        if (dateComparison !== 0) return dateComparison;
        return a.servantName.localeCompare(b.servantName, 'ar');
      });
  }, [allAttendance, allServants, filterDate, filterServantId, filterStatus]);

  const openMessageModal = (servantId: string) => {
    const servant = allServants.find(s => s.id === servantId);
    if (servant) {
      setMessagingServant(servant);
      setMessageContent(`مرحباً ${servant.name}، لاحظنا غيابك عن خدمة مدارس الأحد اليوم. هل كل شيء بخير؟ نتمنى لك كل التوفيق.`);
      setIsMessageModalOpen(true);
    }
  };

  const handleSendMessage = () => {
    if (!messagingServant || !messageContent) return;
    // Simulate sending message
    console.log(`Sending message to ${messagingServant.name} (${messagingServant.contactNumber || 'N/A'}): "${messageContent}"`);
    toast({
      title: "تم إرسال الرسالة (محاكاة)",
      description: `تم "إرسال" رسالة إلى ${messagingServant.name}.`,
    });
    setIsMessageModalOpen(false);
    setMessageContent("");
    setMessagingServant(null);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><Eye className="me-2 h-6 w-6 text-primary"/>عرض سجلات حضور مدارس الأحد</CardTitle>
        <CardDescription>فلترة وعرض سجلات الحضور والغياب للخدام.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="p-4 bg-muted/30">
          <CardTitle className="text-lg mb-3 flex items-center"><Filter className="me-2 h-5 w-5"/>خيارات الفلترة</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filter-date-ss">التاريخ</Label>
              <DatePickerWithPresets date={filterDate} setDate={setFilterDate} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="filter-servant-ss">الخادم</Label>
              <Select value={filterServantId} onValueChange={setFilterServantId}>
                <SelectTrigger id="filter-servant-ss" className="mt-1"><SelectValue placeholder="اختر الخادم" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">جميع الخدام</SelectItem>
                  {allServants.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-status-ss">الحالة</Label>
              <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val as AttendanceStatus | 'الكل')}>
                <SelectTrigger id="filter-status-ss" className="mt-1"><SelectValue placeholder="اختر الحالة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="الكل">الكل</SelectItem>
                  {Object.entries(statusDisplay).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {filteredAttendance.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">لا توجد سجلات حضور تطابق الفلاتر المحددة.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الخادم</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>يوم الخدمة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>ملاحظات الكاهن</TableHead>
                  <TableHead className="text-left">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell className="font-medium">{att.servantName}</TableCell>
                    <TableCell>{format(parseISO(att.date), 'EEEE, d MMM yyyy', { locale: arSA })}</TableCell>
                    <TableCell>{att.serviceDay === 'Thursday' ? 'الخميس' : 'الجمعة'}</TableCell>
                    <TableCell>
                      <span className={`flex items-center ${statusDisplay[att.status].className}`}>
                        {statusDisplay[att.status].icon}
                        <span className="ms-1">{statusDisplay[att.status].label}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate" title={att.notes}>{att.notes || '-'}</TableCell>
                    <TableCell className="text-left">
                      {att.status === 'absent' && (
                        <Button variant="ghost" size="icon" onClick={() => openMessageModal(att.servantId)} className="text-orange-500 hover:text-orange-700" title="إرسال رسالة">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إرسال رسالة إلى {messagingServant?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
            <Button onClick={handleSendMessage}>إرسال الرسالة (محاكاة)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

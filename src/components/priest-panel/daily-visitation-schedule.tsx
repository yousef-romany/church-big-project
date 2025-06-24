
"use client";
import type { PriestPanelFamily, VisitationFamilyStatus } from '@/types/priest-panel';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckSquare, MessageSquare, Users, MapPin, Phone, Edit, Info, Clock, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';

const mockFamilies: PriestPanelFamily[] = [
  { id: 'fam1', fatherName: 'جرجس رؤوف', motherName: 'مارينا أسعد', members: [{id: 'c1', name: 'بيتر', age: 10, gender: 'ذكر', educationLevel: 'رابع ابتدائي'}, {id: 'c2', name: 'سارة', age: 7, gender: 'أنثى', educationLevel: 'أولى ابتدائي'}], address: '15 شارع النصر، المعادي', phoneNumber: '01234567890', region: 'المعادي', visitationStatus: 'عاجل', lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), notes: 'الأب مريض ويحتاج دعم. تحتاج الأسرة إلى زيارة عاجلة لمتابعة الحالة الصحية وتوفير الاحتياجات الأساسية.', latitude: 29.9739, longitude: 31.2582 },
  { id: 'fam2', fatherName: 'مينا فكري', motherName: 'تريزا لمعي', members: [{id: 'c3', name: 'فادي', age: 16, gender: 'ذكر', educationLevel: 'أولى ثانوي'}], address: '30 شارع 9، المقطم', phoneNumber: '01098765431', region: 'المقطم', visitationStatus: 'عادي', lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), notes: 'الابن فادي يحتاج إلى تشجيع في دراسته ومتابعة سلوكه.', latitude: 30.0075, longitude: 31.3111 },
  { id: 'fam3', fatherName: 'صموئيل وهيب', motherName: 'إيرين فهيم', members: [], address: '7 شارع الكنيسة، شبرا', phoneNumber: '01123456782', region: 'شبرا', visitationStatus: 'تواصل فقط', notes: 'يحتاجون إلى مكالمة هاتفية فقط هذا الأسبوع للاطمئنان العام ومعرفة أخبارهم.', latitude: 30.0821, longitude: 31.2483 },
  { id: 'fam4', fatherName: 'بولس حليم', motherName: 'أماني ذكي', members: [{id: 'c4', name: 'ميرنا', age: 22, gender: 'أنثى', educationLevel: 'خريجة جامعية'}, {id: 'c5', name: 'كيرلس', age: 18, gender: 'ذكر', educationLevel: 'ثانوية عامة'}], address: '120 شارع التحرير، الدقي', phoneNumber: '01587654300', region: 'الدقي', visitationStatus: 'تمت الزيارة', lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), notes: 'تمت الزيارة، الأمور مستقرة. ميرنا تبحث عن عمل وكيرلس يستعد لامتحاناته.', latitude: 30.0384, longitude: 31.2069 },
  { id: 'fam5', fatherName: 'المرحوم مراد فوزي', motherName: 'الأم أنجيل', members: [{id: 'c6', name: 'يوستينا', age: 12, gender: 'أنثى', educationLevel: 'سادسة ابتدائي'}], address: 'عمارة 5، مساكن الزهور، مدينة نصر', phoneNumber: '01011223344', region: 'مدينة نصر', visitationStatus: 'عاجل', lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), notes: 'الأم أرملة وتحتاج إلى مساعدة في مصروفات الدراسة ليوساتينا. الوضع المادي صعب للغاية.', latitude: 30.0688, longitude: 31.3364 },
  { id: 'fam6', fatherName: 'فايز كرم', motherName: 'سلوى إبراهيم', members: [{id:'c7', name:'ديفيد', age:5, gender:'ذكر', educationLevel:'KG2'}], address: '23 شارع الحرية، عين شمس', phoneNumber: '01276543210', region: 'عين شمس', visitationStatus: 'عادي', notes: 'أسرة جديدة في المنطقة، تحتاج إلى ترحيب وتعريف بخدمات الكنيسة ودمجهم في الأنشطة.', latitude: 30.1173, longitude: 31.3204 },
  { id: 'fam7', fatherName: 'بطرس نادي', motherName: 'جلوريا ماهر', members: [{id:'c8', name:'فبرونيا', age:3, gender:'أنثى', educationLevel:'حضانة'}, {id:'c9', name:'يوأنس', age:1, gender:'ذكر', educationLevel:'رضيع'}], address: 'فيلا 17، التجمع الخامس', phoneNumber: '01002003004', region: 'التجمع الخامس', visitationStatus: 'عادي', lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), notes: 'الأسرة تطلب صلاة من أجل المولود الجديد يوأنس.', latitude: 30.0249, longitude: 31.4925 },
  { id: 'fam8', fatherName: 'روماني شوقي', motherName: 'فيفيان منير', members: [], address: 'شقة 10، برج الأطباء، المهندسين', phoneNumber: '01112223334', region: 'المهندسين', visitationStatus: 'تواصل فقط', notes: 'كبار في السن، يفضل الاطمئنان عليهم هاتفيًا بشكل دوري.', latitude: 30.0531, longitude: 31.2064 }
];


const statusMap: Record<VisitationFamilyStatus, { label: string; icon: JSX.Element; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  'عاجل': { label: 'عاجل', icon: <AlertTriangle className="h-4 w-4 me-1" />, badgeVariant: 'destructive' },
  'عادي': { label: 'عادي', icon: <Info className="h-4 w-4 me-1" />, badgeVariant: 'default' },
  'تواصل فقط': { label: 'تواصل فقط', icon: <MessageSquare className="h-4 w-4 me-1" />, badgeVariant: 'secondary' },
  'تمت الزيارة': { label: 'تمت الزيارة', icon: <CheckSquare className="h-4 w-4 me-1" />, badgeVariant: 'outline' },
  'لم تتم الزيارة': { label: 'لم تتم الزيارة', icon: <Clock className="h-4 w-4 me-1" />, badgeVariant: 'secondary' },
};

const visitationStatuses = ["الكل", ...Object.keys(statusMap).map(key => statusMap[key as VisitationFamilyStatus].label)];
const regions = ["الكل", ...new Set(mockFamilies.map(f => f.region).filter(Boolean)) as string[]];


const cardVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -20 },
};

export default function DailyVisitationSchedule() {
  const [families, setFamilies] = useState<PriestPanelFamily[]>(mockFamilies);
  const [selectedRegion, setSelectedRegion] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [editingNotesFamilyId, setEditingNotesFamilyId] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState('');
  const { toast } = useToast();

  const filteredFamilies = useMemo(() => {
    return families.filter(family => {
      const matchesRegion = selectedRegion === 'الكل' || family.region === selectedRegion;
      const familyStatusLabel = family.visitationStatus ? statusMap[family.visitationStatus].label : '';
      const matchesStatus = selectedStatus === 'الكل' || familyStatusLabel === selectedStatus;
      return matchesRegion && matchesStatus;
    }).sort((a,b) => {
        const order: Record<VisitationFamilyStatus, number> = {'عاجل':1, 'عادي':2, 'تواصل فقط':3, 'لم تتم الزيارة': 4, 'تمت الزيارة':5};
        return (a.visitationStatus ? order[a.visitationStatus] : 5) - (b.visitationStatus ? order[b.visitationStatus] : 5);
    });
  }, [families, selectedRegion, selectedStatus]);

  const handleMarkAsVisited = (familyId: string) => {
    setFamilies(prev => prev.map(f => f.id === familyId ? { ...f, visitationStatus: 'تمت الزيارة', lastVisited: new Date(), notes: currentNotes || f.notes } : f));
    toast({ title: "تم تسجيل الزيارة بنجاح!" });
    setEditingNotesFamilyId(null);
    setCurrentNotes('');
  };

  const startEditingNotes = (family: PriestPanelFamily) => {
    setEditingNotesFamilyId(family.id);
    setCurrentNotes(family.notes || '');
  };

  return (
    <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>فلترة الأسر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger><SelectValue placeholder="اختر المنطقة" /></SelectTrigger>
              <SelectContent>
                {regions.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger><SelectValue placeholder="اختر حالة الافتقاد" /></SelectTrigger>
              <SelectContent>
                {visitationStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredFamilies.length === 0 && (
         <motion.p variants={cardVariants} className="text-center text-muted-foreground py-8">لا توجد أسر تطابق الفلترة الحالية.</motion.p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredFamilies.map((family, index) => (
            <motion.div
              key={family.id}
              custom={index}
              variants={cardVariants}
              layout
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{family.fatherName} و {family.motherName}</CardTitle>
                    {family.visitationStatus && (
                      <Badge variant={statusMap[family.visitationStatus].badgeVariant} className="flex items-center">
                        {statusMap[family.visitationStatus].icon}
                        {statusMap[family.visitationStatus].label}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm space-y-1 mt-1">
                    <span className="flex items-center"><MapPin className="h-4 w-4 me-2 text-primary" /> {family.address} ({family.region})</span>
                    <span className="flex items-center"><Phone className="h-4 w-4 me-2 text-primary" /> {family.phoneNumber}</span>
                     <span className="flex items-center"><Users className="h-4 w-4 me-2 text-primary" /> عدد أفراد الأسرة: {family.members.length + 2}</span>
                     {family.lastVisited && <span className="flex items-center"><Clock className="h-4 w-4 me-2 text-muted-foreground" /> آخر زيارة: {formatDistanceToNow(family.lastVisited, { addSuffix: true, locale: arSA })}</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {editingNotesFamilyId === family.id ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="أضف ملاحظاتك هنا..."
                        value={currentNotes}
                        onChange={(e) => setCurrentNotes(e.target.value)}
                        rows={3}
                        className="transition-all duration-300 ease-in-out focus:ring-primary focus:border-primary"
                      />
                    </div>
                  ) : family.notes ? (
                     <div className="text-sm p-2 bg-muted/50 rounded-md">
                        <p className="font-semibold text-xs text-muted-foreground mb-1">ملاحظات:</p>
                        <p className="text-muted-foreground whitespace-pre-line">{family.notes}</p>
                    </div>
                  ) : (
                     <p className="text-sm text-muted-foreground italic">لا توجد ملاحظات.</p>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex w-full justify-between items-center gap-2">
                    {editingNotesFamilyId === family.id ? (
                       <>
                        <Button size="sm" onClick={() => handleMarkAsVisited(family.id)}>
                            <CheckSquare className="me-2 h-4 w-4" /> حفظ وتأكيد الزيارة
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingNotesFamilyId(null)}>
                            إلغاء
                        </Button>
                       </>
                    ) : (
                        <Button size="sm" onClick={() => startEditingNotes(family)} disabled={family.visitationStatus === 'تمت الزيارة'}>
                            {family.visitationStatus === 'تمت الزيارة' ? <><CheckSquare className="me-2 h-4 w-4" /> تمت الزيارة</> : <><Edit className="me-2 h-4 w-4" /> تسجيل الزيارة/ملاحظات</>}
                        </Button>
                    )}
                     {family.latitude && family.longitude && (
                      <Button asChild variant="secondary" size="sm">
                          <Link href={`https://www.google.com/maps/search/?api=1&query=${family.latitude},${family.longitude}`} target="_blank" rel="noopener noreferrer">
                              <Map className="me-2 h-4 w-4" />
                              اذهب للموقع
                          </Link>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

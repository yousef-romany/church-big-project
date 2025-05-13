"use client";
import type { Family, FamilyStatus } from '@/types';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Phone, MapPin, ChevronDown, ChevronUp, User, Smile, Meh, Frown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockFamilies: Family[] = [
  { id: '1', fatherName: 'الأب جورج', motherName: 'الأم مريم', childrenCount: 2, status: 'normal', region: 'الزيتون', phoneNumber: '01234567890', details: 'أسرة تحتاج إلى متابعة دورية للطفل الأصغر.' },
  { id: '2', fatherName: 'المرحوم الأب مينا', motherName: 'الأم تريزا', childrenCount: 3, status: 'widowed', region: 'شبرا', phoneNumber: '01098765432', details: 'الأم أرملة وتحتاج إلى دعم مادي ومعنوي.' },
  { id: '3', fatherName: 'الأب بولس', motherName: 'الأم فيرونيكا', childrenCount: 1, status: 'poor', region: 'عين شمس', phoneNumber: '01122334455', details: 'الأسرة تمر بضائقة مالية حادة.' },
  { id: '4', fatherName: 'الأب أندرو', motherName: 'الأم كاترينا', childrenCount: 0, status: 'divorced', region: 'مصر الجديدة', phoneNumber: '01556677889', details: 'الأم مطلقة حديثًا وتحتاج إلى مساندة نفسية.' },
];

const statusMap: Record<FamilyStatus, { label: string; icon: JSX.Element; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  normal: { label: 'طبيعية', icon: <Smile className="h-4 w-4 me-1" />, badgeVariant: 'default' },
  widowed: { label: 'أرملة', icon: <Meh className="h-4 w-4 me-1" />, badgeVariant: 'secondary' },
  poor: { label: 'فقيرة', icon: <Frown className="h-4 w-4 me-1" />, badgeVariant: 'destructive' },
  divorced: { label: 'مطلقة', icon: <Meh className="h-4 w-4 me-1" />, badgeVariant: 'outline' },
  other: { label: 'أخرى', icon: <Smile className="h-4 w-4 me-1" />, badgeVariant: 'default' },
};

const regions = ["الكل", ...new Set(mockFamilies.map(f => f.region))];
const familyStatuses = ["الكل", ...Object.keys(statusMap).map(key => statusMap[key as FamilyStatus].label)];


const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const detailsVariants = {
  collapsed: { height: 0, opacity: 0, marginTop: 0 },
  expanded: { height: "auto", opacity: 1, marginTop: "1rem" },
};


export default function FamilyManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const filteredFamilies = useMemo(() => {
    return mockFamilies.filter(family => {
      const matchesSearch = family.fatherName.includes(searchTerm) || family.motherName.includes(searchTerm) || family.phoneNumber.includes(searchTerm);
      const matchesRegion = selectedRegion === 'الكل' || family.region === selectedRegion;
      const familyStatusLabel = statusMap[family.status].label;
      const matchesStatus = selectedStatus === 'الكل' || familyStatusLabel === selectedStatus;
      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [searchTerm, selectedRegion, selectedStatus]);

  const toggleCardExpansion = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold mb-6">إدارة العائلات</h2>
      <div className="mb-6 p-4 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="بحث باسم الأسرة، رقم الموبايل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-1"
          />
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر المنطقة" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر حالة الأسرة" />
            </SelectTrigger>
            <SelectContent>
              {familyStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredFamilies.map((family, index) => (
            <motion.div
              key={family.id}
              custom={index}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout // enables smooth reordering when filtering
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="cursor-pointer p-4" onClick={() => toggleCardExpansion(family.id)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">{family.fatherName} و {family.motherName}</CardTitle>
                      <CardDescription className="flex items-center text-sm mt-1">
                        <MapPin className="h-4 w-4 me-1 text-muted-foreground" /> {family.region}
                      </CardDescription>
                    </div>
                    {expandedCardId === family.id ? <ChevronUp className="h-5 w-5 text-primary" /> : <ChevronDown className="h-5 w-5 text-primary" />}
                  </div>
                   <Badge variant={statusMap[family.status].badgeVariant} className="mt-2 self-start">
                      {statusMap[family.status].icon} {statusMap[family.status].label}
                    </Badge>
                </CardHeader>
                <AnimatePresence>
                  {expandedCardId === family.id && (
                    <motion.div
                      variants={detailsVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <CardContent className="p-4 pt-0 border-t">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 me-2 text-primary" />
                            عدد الأولاد: <span className="font-medium ms-1">{family.childrenCount}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 me-2 text-primary" />
                            رقم الموبايل: <span className="font-medium ms-1" dir="ltr">{family.phoneNumber}</span>
                          </div>
                          {family.details && (
                            <div className="pt-2">
                              <h4 className="font-semibold text-xs text-muted-foreground mb-1">ملاحظات:</h4>
                              <p className="text-muted-foreground">{family.details}</p>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="mt-4 w-full">
                          تعديل البيانات
                        </Button>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filteredFamilies.length === 0 && (
        <motion.p 
          initial={{opacity: 0}} animate={{opacity:1}}
          className="text-center text-muted-foreground mt-8">
          لا توجد عائلات تطابق معايير البحث.
        </motion.p>
      )}
    </motion.section>
  );
}
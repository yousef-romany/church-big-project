
"use client";
import type { PriestPanelFamily } from '@/types/priest-panel';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizonal, Users, MapPin, Search } from 'lucide-react';

// Mock data - in a real app, this would come from a data store or API
const mockFamilies: PriestPanelFamily[] = [
  { id: 'fam1', fatherName: 'جرجس رؤوف', motherName: 'مارينا أسعد', members: [], address: '15 شارع النصر، المعادي', phoneNumber: '01234567890', region: 'المعادي' },
  { id: 'fam2', fatherName: 'مينا فكري', motherName: 'تريزا لمعي', members: [], address: '30 شارع 9، المقطم', phoneNumber: '01098765431', region: 'المقطم' },
  { id: 'fam3', fatherName: 'صموئيل وهيب', motherName: 'إيرين فهيم', members: [], address: '7 شارع الكنيسة، شبرا', phoneNumber: '01123456782', region: 'شبرا' },
  { id: 'fam4', fatherName: 'بطرس غالي', motherName: 'سارة كرم', members: [], address: '22 شارع النيل، الزمالك', phoneNumber: '01001234567', region: 'الزمالك'},
  { id: 'fam5', fatherName: 'اندراوس فايز', motherName: 'ميريت اسحق', members: [], address: '9 شارع الحرية، مصر الجديدة', phoneNumber: '01223344556', region: 'مصر الجديدة'},
];

const mockServants = [
  { id: 'serv1', name: 'الخادم طوني' },
  { id: 'serv2', name: 'الخادمة مريم' },
  { id: 'serv3', name: 'الخادم بيشوي' },
];

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function SendServantForm() {
  const [families] = useState<PriestPanelFamily[]>(mockFamilies);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [selectedServantId, setSelectedServantId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredFamilies = useMemo(() => {
    if (!searchTerm) return families;
    return families.filter(family => 
      family.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.region?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [families, searchTerm]);

  const handleSendServant = () => {
    if (!selectedFamilyId || !selectedServantId) {
      toast({
        title: "خطأ في الإرسال",
        description: "الرجاء اختيار الأسرة والخادم أولاً.",
        variant: "destructive",
      });
      return;
    }
    const family = families.find(f => f.id === selectedFamilyId);
    const servant = mockServants.find(s => s.id === selectedServantId);

    // Simulate sending request
    console.log(`Sending servant ${servant?.name} to family ${family?.fatherName} at ${family?.address}`);
    toast({
      title: "تم إرسال الخادم بنجاح!",
      description: `تم إبلاغ ${servant?.name} بزيارة أسرة ${family?.fatherName}.`,
    });
    setSelectedFamilyId(null); // Reset selection
    setSelectedServantId(null);
    setSearchTerm('');
  };
  
  const selectedFamilyDetails = selectedFamilyId ? families.find(f => f.id === selectedFamilyId) : null;

  return (
    <motion.div 
      initial="initial" 
      animate="animate" 
      variants={{ animate: { transition: { staggerChildren: 0.1 }}}}
      className="space-y-6"
    >
      <motion.div variants={cardVariants}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>1. اختر الأسرة</CardTitle>
            <CardDescription>ابحث واختر الأسرة التي تود إرسال خادم لزيارتها.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="ابحث بالاسم أو المنطقة..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedFamilyId(null); // Reset family selection on search change
                }}
                className="ps-10 transition-all duration-300 focus:shadow-md"
              />
            </div>
            {searchTerm && filteredFamilies.length > 0 && (
              <div className="max-h-60 overflow-y-auto rounded-md border p-2 space-y-2">
                {filteredFamilies.map(family => (
                  <motion.div 
                    key={family.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant={selectedFamilyId === family.id ? "default" : "outline"}
                      className="w-full justify-start text-right h-auto py-2"
                      onClick={() => setSelectedFamilyId(family.id)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{family.fatherName} و {family.motherName}</span>
                        <span className="text-xs text-muted-foreground">{family.address} ({family.region})</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
            {searchTerm && filteredFamilies.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">لا توجد نتائج للبحث.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
      {selectedFamilyDetails && (
        <motion.div variants={cardVariants} initial="initial" animate="animate" exit="exit">
          <Card className="shadow-lg bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle className="text-primary">تفاصيل الأسرة المختارة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                <p><strong className="font-semibold">رب الأسرة:</strong> {selectedFamilyDetails.fatherName}</p>
                <p><strong className="font-semibold">الأم:</strong> {selectedFamilyDetails.motherName}</p>
                <p><strong className="font-semibold">العنوان:</strong> {selectedFamilyDetails.address}</p>
                <p><strong className="font-semibold">المنطقة:</strong> {selectedFamilyDetails.region}</p>
                <p><strong className="font-semibold">رقم الموبايل:</strong> <span dir="ltr">{selectedFamilyDetails.phoneNumber}</span></p>
            </CardContent>
          </Card>
        </motion.div>
      )}
      </AnimatePresence>
      
      <motion.div variants={cardVariants}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>2. اختر الخادم</CardTitle>
            <CardDescription>اختر الخادم الذي سيقوم بالزيارة.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedServantId} value={selectedServantId || ''} disabled={!selectedFamilyId}>
              <SelectTrigger className="w-full md:w-1/2 transition-all duration-300 focus:shadow-md">
                <SelectValue placeholder={!selectedFamilyId ? "اختر الأسرة أولاً" : "اختر الخادم"} />
              </SelectTrigger>
              <SelectContent>
                {mockServants.map(servant => (
                  <SelectItem key={servant.id} value={servant.id}>{servant.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} className="flex justify-end pt-4">
        <Button 
          size="lg" 
          onClick={handleSendServant} 
          disabled={!selectedFamilyId || !selectedServantId}
          className="min-w-[180px] transition-transform hover:scale-105"
          whileTap={{ scale: 0.95 }}
        >
          <SendHorizonal className="me-2 h-5 w-5" /> إرسال الخادم
        </Button>
      </motion.div>
      <p className="text-xs text-muted-foreground text-center mt-4">
        ملاحظة: عند إرسال الخادم، سيتم تزويده فقط باسم رب الأسرة وموقعها، مع الحفاظ على خصوصية باقي التفاصيل.
      </p>
    </motion.div>
  );
}

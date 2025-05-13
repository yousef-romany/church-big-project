"use client";
import type { Priest, PriestStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, Users, CalendarMinus } from 'lucide-react';
import { motion } from 'framer-motion';

const mockPriests: Priest[] = [
  { id: '1', name: 'الأب يوحنا', status: 'active', assignedFamilies: 25, missingVisits: 2, avatarUrl: 'https://picsum.photos/seed/priest1/80/80' },
  { id: '2', name: 'الأب بطرس', status: 'stressed', assignedFamilies: 40, missingVisits: 8, avatarUrl: 'https://picsum.photos/seed/priest2/80/80' },
  { id: '3', name: 'الأب متى', status: 'sanctioned', assignedFamilies: 15, missingVisits: 5, avatarUrl: 'https://picsum.photos/seed/priest3/80/80' },
  { id: '4', name: 'الأب مرقس', status: 'active', assignedFamilies: 30, missingVisits: 1, avatarUrl: 'https://picsum.photos/seed/priest4/80/80' },
];

const statusMap: Record<PriestStatus, { label: string; icon: JSX.Element; color: string; badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'نشط', icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, color: 'text-green-500', badgeVariant: 'default' },
  stressed: { label: 'مجهد', icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, color: 'text-yellow-500', badgeVariant: 'secondary' },
  sanctioned: { label: 'عليه ملاحظات', icon: <XCircle className="h-5 w-5 text-red-500" />, color: 'text-red-500', badgeVariant: 'destructive' },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PriestOverview() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="mb-8"
    >
      <h2 className="text-2xl font-semibold mb-6">عرض الكهنة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockPriests.map((priest, index) => (
          <motion.div
            key={priest.id}
            custom={index}
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center gap-4 p-4 bg-card-foreground/5 dark:bg-card-foreground/10">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage src={priest.avatarUrl} alt={priest.name} data-ai-hint="priest portrait" />
                  <AvatarFallback>{priest.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-semibold">{priest.name}</CardTitle>
                  <Badge variant={statusMap[priest.status].badgeVariant} className={`mt-1 ${statusMap[priest.status].color} border-${statusMap[priest.status].color.replace('text-','')} bg-${statusMap[priest.status].color.replace('text-','')}/10`}>
                    {statusMap[priest.status].icon}
                    <span className="ms-1">{statusMap[priest.status].label}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 me-2 text-primary" />
                    الأسر المكلف بها:
                  </span>
                  <span className="font-medium">{priest.assignedFamilies}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <CalendarMinus className="h-4 w-4 me-2 text-destructive" />
                     الزيارات الناقصة:
                  </span>
                  <span className="font-medium text-destructive">{priest.missingVisits}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
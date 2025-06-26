"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, UserSquare, CalendarCheck, HeartPulse, Phone, BookOpen, Briefcase, Shield, Mail, User as UserIcon, Building, Save } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';


type IconName = 'UserSquare' | 'CalendarCheck' | 'HeartPulse' | 'Phone' | 'BookOpen' | 'Briefcase' | 'Shield' | 'Mail' | 'UserIcon' | 'Building';

const iconComponents: { [key in IconName]: React.ElementType<LucideProps> } = {
  UserSquare, CalendarCheck, HeartPulse, Phone, BookOpen, Briefcase, Shield, Mail, UserIcon, Building
};

interface ProfileDetail {
  label: string;
  value: string;
  icon: IconName;
  dir?: 'ltr' | 'rtl';
}

interface UserProfileProps {
  profileData: {
    name: string;
    avatarUrl: string;
    role: string;
    details: ProfileDetail[];
  };
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function UserProfile({ profileData: initialProfileData }: UserProfileProps) {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedDetails = profileData.details.map(detail => ({
      ...detail,
      value: formData.get(detail.label) as string,
    }));
    const updatedName = formData.get('name') as string;

    const newProfileData = {
        ...profileData,
        name: updatedName,
        details: updatedDetails,
    };

    setProfileData(newProfileData);

    toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح (محاكاة).",
    });
    setIsModalOpen(false);
  };

  const { name, avatarUrl, role, details } = profileData;
  const fallback = name.substring(0, 2).toUpperCase();

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="w-full max-w-4xl mx-auto shadow-xl overflow-hidden">
          <CardHeader className="bg-primary/5 p-6 border-b">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                <Avatar className="h-28 w-28 border-4 border-primary shadow-lg">
                  <AvatarImage src={avatarUrl} alt={name} data-ai-hint="user portrait" />
                  <AvatarFallback className="text-4xl">{fallback}</AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="text-center md:text-right">
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">{name}</CardTitle>
                <CardDescription className="text-lg mt-1">
                  <Badge variant="secondary" className="text-base">{role}</Badge>
                </CardDescription>
              </div>
              <DialogTrigger asChild>
                  <Button variant="outline" className="ms-auto hidden md:flex">
                    <Edit className="me-2 h-4 w-4" /> تعديل الملف الشخصي
                  </Button>
              </DialogTrigger>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              animate="visible"
            >
              {details.map((detail, index) => {
                const IconComponent = iconComponents[detail.icon];
                return (
                  <motion.div key={index} variants={itemVariants} className="flex items-start gap-4 py-2 border-b border-dashed">
                    <IconComponent className="h-6 w-6 text-primary/70 mt-1 shrink-0" />
                    <div className="flex-grow">
                      <p className="text-sm text-muted-foreground">{detail.label}</p>
                      <p className="font-semibold text-lg" dir={detail.dir || 'rtl'}>{detail.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </CardContent>
          <CardFooter className="p-6 bg-muted/30 md:hidden">
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Edit className="me-2 h-4 w-4" /> تعديل الملف الشخصي
                </Button>
              </DialogTrigger>
          </CardFooter>
        </Card>
      </motion.div>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تعديل الملف الشخصي</DialogTitle>
          <DialogDescription>
            قم بإجراء التغييرات على ملفك الشخصي هنا. انقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveChanges}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right whitespace-nowrap">الاسم</Label>
                    <Input id="name" name="name" defaultValue={name} className="col-span-3" />
                 </div>
                 {details.map(detail => (
                     <div key={detail.label} className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor={detail.label} className="text-right whitespace-nowrap">{detail.label}</Label>
                         <Input id={detail.label} name={detail.label} defaultValue={detail.value} className="col-span-3" dir={detail.dir} />
                     </div>
                 ))}
            </div>
            <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">إلغاء</Button>
                </DialogClose>
                <Button type="submit">
                    <Save className="me-2 h-4 w-4" /> حفظ التغييرات
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
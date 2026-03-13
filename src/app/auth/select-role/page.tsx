'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building, 
  UserSquare, 
  UserCheck, 
  Users, 
  Footprints, 
  CalendarCheck, 
  Baby,
  CheckCircle,
  Info
} from 'lucide-react';

interface RoleOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  redirectPath: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'PRIEST',
    name: 'كاهن',
    description: 'Access priest panel to manage confessions, visitations, and church services',
    icon: UserSquare,
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400 dark:bg-purple-950 dark:border-purple-800',
    redirectPath: '/priest-panel/dashboard',
  },
  {
    id: 'SERVANT',
    name: 'خادم زيارات',
    description: 'Manage visitation tasks and follow up with church families',
    icon: Users,
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400 dark:bg-blue-950 dark:border-blue-800',
    redirectPath: '/visitation-servant-panel/dashboard',
  },
  {
    id: 'SUNDAY_SCHOOL_SERVANT',
    name: 'خادم مدارس الأحد',
    description: 'Manage Sunday school classes, students, and educational content',
    icon: CalendarCheck,
    color: 'bg-green-50 border-green-200 hover:border-green-400 dark:bg-green-950 dark:border-green-800',
    redirectPath: '/sunday-school-servant-panel/dashboard',
  },
  {
    id: 'PARENT',
    name: 'ولي أمر',
    description: 'Monitor your children, view attendance, and receive notifications',
    icon: Footprints,
    color: 'bg-orange-50 border-orange-200 hover:border-orange-400 dark:bg-orange-950 dark:border-orange-800',
    redirectPath: '/makhdoum-parent-panel/dashboard',
  },
  {
    id: 'CHILD',
    name: 'طفل',
    description: 'View your points, achievements, and Sunday school activities',
    icon: Baby,
    color: 'bg-pink-50 border-pink-200 hover:border-pink-400 dark:bg-pink-950 dark:border-pink-800',
    redirectPath: '/makhdoum-child-panel/dashboard',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SelectRolePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleSelection = async (roleId: string) => {
    setSelectedRole(roleId);
    setIsUpdating(true);

    try {
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: roleId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update role');
      }

      toast({
        title: 'تم تحديث الدور بنجاح!',
        description: 'سيتم توجيهك إلى لوحة التحكم الخاصة بك...',
      });

      await update({ role: roleId });

      const selectedOption = roleOptions.find((opt) => opt.id === roleId);
      if (selectedOption) {
        setTimeout(() => {
          router.push(selectedOption.redirectPath);
        }, 500);
      }
    } catch (err: any) {
      toast({
        title: 'فشل تحديث الدور',
        description: err.message || 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
      setIsUpdating(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl"
      >
        <Card className="mb-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2">
          <CardHeader className="text-center p-8">
            <CardTitle className="text-3xl md:text-4xl font-bold mb-2">اختر دورك</CardTitle>
            <CardDescription className="text-base md:text-lg">
              مرحبًا {session?.user?.name}! يرجى اختيار الدور المناسب لك للاستمرار
            </CardDescription>
          </CardHeader>
        </Card>

        <Alert className="mb-8 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            يمكنك تغيير دورك لاحقًا من إعدادات الملف الشخصي
          </AlertDescription>
        </Alert>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {roleOptions.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isLoading = isUpdating && isSelected;

            return (
              <motion.div key={role.id} variants={itemVariants}>
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${role.color} ${
                    isSelected ? 'ring-4 ring-primary scale-105' : ''
                  }`}
                  onClick={() => !isUpdating && handleRoleSelection(role.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-12 w-12 text-primary" />
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </motion.div>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold">{role.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {role.description}
                    </CardDescription>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 flex items-center justify-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full"
                        />
                        <span className="mr-2 text-sm font-medium">جاري التحديث...</span>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/auth/login')}
            className="text-muted-foreground hover:text-foreground"
          >
            العودة إلى تسجيل الدخول
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

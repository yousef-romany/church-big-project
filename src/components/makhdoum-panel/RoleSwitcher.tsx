
'use client';

import { useMakhdoumRole, type MakhdoumRole } from '@/contexts/MakhdoumRoleContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Users, Baby, Shield } from 'lucide-react';

const roleOptions: { value: MakhdoumRole; label: string; icon: React.ElementType }[] = [
  { value: 'child', label: 'عرض كـ "ابن"', icon: Baby },
  { value: 'parent', label: 'عرض كـ "ولي أمر"', icon: Shield },
  { value: 'regular', label: 'عرض كـ "مخدوم عادي"', icon: Users },
];

export default function RoleSwitcher() {
  const { role, setRole } = useMakhdoumRole();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="role-switcher" className="text-sm font-medium hidden sm:block">
        عرض البوابة كـ:
      </Label>
      <Select value={role} onValueChange={(value: MakhdoumRole) => setRole(value)}>
        <SelectTrigger id="role-switcher" className="w-auto sm:w-[220px] bg-background/50">
          <SelectValue placeholder="تغيير العرض..." />
        </SelectTrigger>
        <SelectContent>
          {roleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


'use client';

import { createContext, useState, useContext, type ReactNode, useMemo } from 'react';

export type MakhdoumRole = 'regular' | 'child' | 'parent';

interface MakhdoumRoleContextType {
  role: MakhdoumRole;
  setRole: (role: MakhdoumRole) => void;
}

const MakhdoumRoleContext = createContext<MakhdoumRoleContextType | undefined>(undefined);

export function MakhdoumRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<MakhdoumRole>('child'); // Default to 'child' view for demonstration

  const value = useMemo(() => ({ role, setRole }), [role]);

  return (
    <MakhdoumRoleContext.Provider value={value}>
      {children}
    </MakhdoumRoleContext.Provider>
  );
}

export function useMakhdoumRole() {
  const context = useContext(MakhdoumRoleContext);
  if (context === undefined) {
    throw new Error('useMakhdoumRole must be used within a MakhdoumRoleProvider');
  }
  return context;
}

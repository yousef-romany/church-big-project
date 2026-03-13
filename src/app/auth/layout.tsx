
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-mesh opacity-80 dark:opacity-60 transition-opacity duration-1000"></div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full p-4 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

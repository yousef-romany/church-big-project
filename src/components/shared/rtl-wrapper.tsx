"use client";

interface RTLWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function RTLWrapper({ children, className }: RTLWrapperProps) {
  return (
    <div dir="rtl" className={className}>
      {children}
    </div>
  );
}

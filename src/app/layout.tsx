import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { Toaster } from "@/components/ui/toaster"; // Toaster for notifications

const tajawal = Tajawal({
  weight: ['400', '500', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'لوحة تحكم مدير الكنيسة', // Church Manager Dashboard
  description: 'لوحة تحكم لإدارة شؤون الكنيسة والكهنة والعائلات والإعلانات', // Dashboard for managing church affairs, priests, families, and announcements
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
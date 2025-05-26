// No "use client" here
import type { Metadata, Viewport } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import AppSetup from '@/components/shared/AppSetup'; // Import the new client component

const tajawal = Tajawal({
  weight: ['400', '500', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'لوحة تحكم مدير الكنيسة',
  description: 'لوحة تحكم لإدارة شؤون الكنيسة والكهنة والعائلات والإعلانات',
  applicationName: 'لوحة تحكم مدير الكنيسة',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'لوحة تحكم مدير الكنيسة',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: 'https://placehold.co/16x16.png', sizes: '16x16', type: 'image/png' },
      { url: 'https://placehold.co/32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: 'https://placehold.co/180x180.png' },
      { url: 'https://placehold.co/152x152.png', sizes: '152x152', type: 'image/png' },
      { url: 'https://placehold.co/167x167.png', sizes: '167x167', type: 'image/png' },
      { url: 'https://placehold.co/180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [
      { url: 'https://placehold.co/192x192.png', sizes: '192x192' }
    ],
  },
  other: {
    'msapplication-TileColor': '#1E3A8A',
    'msapplication-config': '/icons/browserconfig.xml', // This file needs to exist or its reference removed if not used
    'mobile-web-app-capable': 'yes',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1E3A8A' }, // Matches manifest theme_color
    { media: '(prefers-color-scheme: dark)', color: '#6B8AEF' }  // Example dark mode theme color
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Metadata API handles most PWA meta tags. Viewport is separate. */}
      </head>
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <AppSetup>
          {children}
        </AppSetup>
      </body>
    </html>
  );
}

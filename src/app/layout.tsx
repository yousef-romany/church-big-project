
import type { Metadata, Viewport } from 'next';
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
  title: 'لوحة تحكم مدير الكنيسة', 
  description: 'لوحة تحكم لإدارة شؤون الكنيسة والكهنة والعائلات والإعلانات',
  applicationName: 'لوحة تحكم مدير الكنيسة',
  manifest: '/manifest.json', // Correctly points to public/manifest.json
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'لوحة تحكم مدير الكنيسة',
    // startupImage: [ // Ensure these images exist if uncommented
    //   { url: '/splash/iphone5_splash.png', media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)' },
    // ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: 'https://placehold.co/16x16.png?text=Icon', sizes: '16x16', type: 'image/png' },
      { url: 'https://placehold.co/32x32.png?text=Icon', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: 'https://placehold.co/180x180.png?text=AppleIcon' }, 
      { url: 'https://placehold.co/152x152.png?text=Icon', sizes: '152x152', type: 'image/png' },
      { url: 'https://placehold.co/167x167.png?text=Icon', sizes: '167x167', type: 'image/png' },
      { url: 'https://placehold.co/180x180.png?text=Icon', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [ // Used for Android home screen icons
      { url: 'https://placehold.co/192x192.png?text=Shortcut', sizes: '192x192' }
    ],
  },
  other: {
    'msapplication-TileColor': '#1E3A8A', // Windows tile color
    'msapplication-config': '/icons/browserconfig.xml', // Link to browserconfig in public/icons/
    'mobile-web-app-capable': 'yes', 
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [ // Matches manifest and provides specific theme colors
    { media: '(prefers-color-scheme: light)', color: '#1E3A8A' },
    { media: '(prefers-color-scheme: dark)', color: '#6B8AEF' } 
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

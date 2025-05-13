
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
  title: 'لوحة تحكم مدير الكنيسة', 
  description: 'لوحة تحكم لإدارة شؤون الكنيسة والكهنة والعائلات والإعلانات',
  applicationName: 'لوحة تحكم مدير الكنيسة',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover', // Added viewport for PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'لوحة تحكم مدير الكنيسة',
    // startupImage: [
    //   { url: '/splash/iphone5_splash.png', media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)' },
    // ],
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1E3A8A' }, // Primary Blue for light mode
    { media: '(prefers-color-scheme: dark)', color: '#6B8AEF' }  // Adjusted primary blue for dark mode (example: hsl(226, 70%, 60%))
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      // It's good to have a default apple-touch-icon.png at the root or referenced.
      // Providing specific sizes is also good practice.
      { url: '/icons/apple-touch-icon.png' }, // General fallback, e.g., 180x180
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-167x167.png', sizes: '167x167', type: 'image/png' },
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [ // Used for Android home screen icons
      { url: '/icons/icon-192x192.png', sizes: '192x192' }
    ],
  },
  other: {
    'msapplication-TileColor': '#1E3A8A', // Windows tile color
    'msapplication-config': '/icons/browserconfig.xml', // Link to browserconfig
    'mobile-web-app-capable': 'yes', // Ensures web app capabilities on Android Chrome
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Meta tags for PWA compatibility and appearance are now largely handled by the Metadata API, including viewport. */}
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

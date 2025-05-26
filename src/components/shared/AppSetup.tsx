
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { requestNotificationPermission, setupOnMessageListener, isFCMSupported } from '@/lib/firebase/messagingService';
import { useToast } from '@/hooks/use-toast';
import { firebaseConfig } from '@/lib/firebase/firebaseConfig'; // Used for placeholder check

export default function AppSetup({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  useEffect(() => {
    // FCM setup for all users
    if (typeof window !== 'undefined' && isFCMSupported()) {
      requestNotificationPermission().then(token => {
        if (token) {
          console.info('%c🔔 FCM Token obtained in AppSetup: %s', 'color: blue; font-weight: bold;', token);
          // TODO: Send this token to your server and associate it with the current user (if logged in)
        } else {
          // This often means permission was denied or not granted.
          // console.warn("Failed to get FCM token or permission denied in AppSetup.");
        }
      }).catch(error => {
        console.error("Error requesting notification permission in AppSetup:", error);
      });

      const handleIncomingMessage = (payload: any) => {
        console.log('Foreground message received in AppSetup:', payload);
        if (payload.notification) {
          toast({
            title: payload.notification.title || "إشعار جديد",
            description: payload.notification.body || "لديك رسالة جديدة.",
            duration: 10000,
          });
        }
      };
      
      const unsubscribe = setupOnMessageListener(handleIncomingMessage);

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } else if (typeof window !== 'undefined') { 
        // This console log can be noisy if FCM isn't expected everywhere or for every browser.
        // console.log("Firebase Cloud Messaging is not supported in this browser or not configured properly for AppSetup.");
        // The placeholder check is mostly for the developer during setup.
        if (firebaseConfig.apiKey === "AIzaSyCLI1l9VP5Rh3-QFt6Y8pPh8BTK-VbF7S4_PLACEHOLDER" || firebaseConfig.messagingSenderId === "YOUR_MESSAGING_SENDER_ID_PLACEHOLDER") {
            console.warn("Firebase configuration in firebaseConfig.ts seems to be using placeholder values. Please update them for FCM to work correctly.");
        }
    }
  }, [toast]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
}

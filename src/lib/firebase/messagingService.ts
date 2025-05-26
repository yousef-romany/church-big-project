
'use client';

import { firebaseConfig } from './firebaseConfig';
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';
// تأكد أن لديك useToast hook أو طريقة مشابهة لعرض التنبيهات
// import { toast as showToast } from '@/hooks/use-toast'; 

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

let messagingInstance: Messaging | null = null;

// تأكد أن الكود يعمل فقط في بيئة المتصفح وأن serviceWorker مدعوم
if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
        messagingInstance = getMessaging(app);
    } catch (error) {
        console.error("Failed to initialize Firebase Messaging:", error);
        // قد يحدث هذا إذا لم يتم تسجيل service worker أو في بيئة غير مدعومة
    }
}

export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!messagingInstance) {
    console.warn('Firebase Messaging is not available or not initialized.');
    return null;
  }

  // تحقق أولاً من أن إعدادات Firebase ليست القيم المؤقتة
  if (firebaseConfig.messagingSenderId === "YOUR_MESSAGING_SENDER_ID_PLACEHOLDER") { 
    console.warn("Firebase config is not set. Please update firebaseConfig.ts with your project settings.");
    // Consider a less intrusive way to inform the admin if needed
    return null;
  }
  
  console.log('Requesting notification permission...');
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // خـطـوة هـامـة: اسـتـبـدل 'YOUR_PUBLIC_VAPID_KEY_FROM_FIREBASE_CONSOLE'
      // بـمـفـتـاح VAPID الـعـام مـن Firebase Console (Project settings > Cloud Messaging > Web Push certificates)
      const vapidKey = "BGyv1z2sR4J1EVcH_Ttk-PLRhI6RMoSqkbwFGwnjoUnOAqLGj90gUuIBnhJTxUuuEMVOtTQChPWAvG4ltYvdcDQ"; // User provided
      
      // This check for placeholder VAPID key can be removed if it's confirmed to be always filled by the user or system
      // if (vapidKey === "YOUR_PUBLIC_VAPID_KEY_PLACEHOLDER") { 
      //   console.warn("VAPID key is not set in messagingService.ts. Please add your VAPID key.");
      //   return null;
      // }

      const currentToken = await getToken(messagingInstance, { vapidKey: vapidKey });
      if (currentToken) {
        console.info('%c🔔 FCM Token Obtained: %s', 'color: green; font-weight: bold;', currentToken);
        // TODO: أرسل هذا التوكن إلى خادمك وقم بتخزينه مقابل المستخدم لإرسال الإشعارات
        localStorage.setItem('fcmToken', currentToken); // لغرض العرض التوضيحي فقط
        return currentToken;
      } else {
        console.warn('No registration token available. Request permission to generate one.');
        return null;
      }
    } else {
      console.warn('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while requesting permission or getting token. ', error);
    if ((error as Error).message.includes("messaging/unsupported-browser")) {
        console.warn("FCM is not supported in this browser environment (e.g. HTTP, or missing features).");
    }
    return null;
  }
};

// هذه الدالة تقوم بإعداد مستمع الرسائل وتعيد دالة لإلغاء الاشتراك
export const setupOnMessageListener = (callback: (payload: any) => void): (() => void) | null => {
  if (!messagingInstance) {
    console.warn('Firebase Messaging is not available for onMessageListener.');
    return null;
  }
  // يتم استدعاء callback مع بيانات الرسالة (payload)
  return onMessage(messagingInstance, callback);
};

// دالة مساعدة للتحقق مما إذا كان FCM مدعومًا في المتصفح وأن الإعدادات الأساسية موجودة
export const isFCMSupported = (): boolean => {
    const isBrowserSupported = typeof window !== 'undefined' && 
                               'Notification' in window && 
                               typeof navigator !== 'undefined' && 
                               'serviceWorker' in navigator && 
                               'PushManager' in window;
    
    // Use a more robust check against placeholder values if needed
    const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyCLI1l9VP5Rh3-QFt6Y8pPh8BTK-VbF7S4_PLACEHOLDER" && 
                                 firebaseConfig.messagingSenderId !== "YOUR_MESSAGING_SENDER_ID_PLACEHOLDER"; 

    return isBrowserSupported && isFirebaseConfigured && messagingInstance !== null;
};

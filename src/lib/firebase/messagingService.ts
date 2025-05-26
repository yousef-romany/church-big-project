
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
  if (firebaseConfig.messagingSenderId === "YOUR_MESSAGING_SENDER_ID") {
    console.warn("Firebase config is not set. Please update firebaseConfig.ts with your project settings.");
    alert("إعدادات Firebase غير مكتملة. يرجى مراجعة المسؤول."); // تنبيه للمستخدم
    return null;
  }
  
  console.log('Requesting notification permission...');
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // خـطـوة هـامـة: اسـتـبـدل 'YOUR_PUBLIC_VAPID_KEY_FROM_FIREBASE_CONSOLE'
      // بـمـفـتـاح VAPID الـعـام مـن Firebase Console (Project settings > Cloud Messaging > Web Push certificates)
      const vapidKey = "YOUR_PUBLIC_VAPID_KEY_FROM_FIREBASE_CONSOLE";
      if (vapidKey === "YOUR_PUBLIC_VAPID_KEY_FROM_FIREBASE_CONSOLE") {
        console.warn("VAPID key is not set in messagingService.ts. Please add your VAPID key.");
        alert("مفتاح VAPID غير مُعد. يرجى مراجعة المسؤول."); // تنبيه للمستخدم
        return null;
      }

      const currentToken = await getToken(messagingInstance, { vapidKey: vapidKey });
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // TODO: أرسل هذا التوكن إلى خادمك وقم بتخزينه مقابل المستخدم لإرسال الإشعارات
        localStorage.setItem('fcmToken', currentToken); // لغرض العرض التوضيحي فقط
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
        return null;
      }
    } else {
      console.log('Unable to get permission to notify.');
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
    
    const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY" &&
                                 firebaseConfig.messagingSenderId !== "YOUR_MESSAGING_SENDER_ID";

    return isBrowserSupported && isFirebaseConfigured && messagingInstance !== null;
};

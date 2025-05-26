
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js'); // Updated to a recent version
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js'); // Updated to a recent version

// IMPORTANT: Replace with your actual Firebase project configuration
// خـطـوة هـامـة: يـجـb اسـتـبـدال الـقـيـم الـتـالـيـة بـإعـدادات مـشـروع Firebase الـخـاص بـك
const firebaseConfigSw = {
  apiKey: "YOUR_API_KEY", // استبدل هذه القيمة
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // استبدل هذه القيمة
  projectId: "YOUR_PROJECT_ID", // استبدل هذه القيمة
  storageBucket: "YOUR_PROJECT_ID.appspot.com", // استبدل هذه القيمة
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // استبدل هذه القيمة
  appId: "YOUR_APP_ID", // استبدل هذه القيمة
  measurementId: "YOUR_MEASUREMENT_ID" // اختياري، استبدل إذا كنت تستخدمه
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfigSw);
}

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'رسالة جديدة';
  const notificationOptions = {
    body: payload.notification?.body || 'لديك إشعار جديد.',
    icon: payload.notification?.icon || '/icons/icon-192x192.png', // Default icon
    // يمكنك إضافة المزيد من الخيارات مثل:
    // badge: '/path/to/badge.png',
    // image: '/path/to/image.png',
    // data: payload.data // لتمرير بيانات إضافية عند النقر على الإشعار
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

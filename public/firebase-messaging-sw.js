
// public/firebase-messaging-sw.js

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfigSw = {
  apiKey: "AIzaSyCLI1l9VP5Rh3-QFt6Y8pPh8BTK-VbF7S4",
  authDomain: "botbot-f929f.firebaseapp.com",
  projectId: "botbot-f929f",
  storageBucket: "botbot-f929f.firebasestorage.app", // Updated as per user's provided config
  messagingSenderId: "350363887575",
  appId: "1:350363887575:web:e8b2d8309ef40b97e64d92",
  measurementId: "G-4QE2Z70X2K"
};

firebase.initializeApp(firebaseConfigSw);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'رسالة جديدة';
  const notificationOptions = {
    body: payload.notification?.body || 'لديك رسالة جديدة من منصة الكنيسة.',
    icon: payload.notification?.icon || '/icons/icon-192x192.png', // Default icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

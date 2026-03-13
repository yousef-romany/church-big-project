
// public/firebase-messaging-sw.js

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfigSw = {
  apiKey: "AIzaSyDrLiDnkPALsZSWkw9zJXETBp-t0CKg6Do",
  authDomain: "church-63cdd.firebaseapp.com",
  projectId: "church-63cdd",
  storageBucket: "church-63cdd.firebasestorage.app",
  messagingSenderId: "904824008138",
  appId: "1:904824008138:web:3826dfbe0461523c5e7333",
  measurementId: "G-LDCE69WR80"
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

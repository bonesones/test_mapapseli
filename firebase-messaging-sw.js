importScripts(
  "https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyArgoetIZ9dPxHtVI0TOJVCEcgnw3mvmC0",
  appId: "1:663146901245:web:5d5e3c39cfb1c5925ed894",
  messagingSenderId: "663146901245",
  projectId: "mapapseli",
  authDomain: "mapapseli.firebaseapp.com",
  storageBucket: "mapapseli.firebasestorage.app",
  measurementId: "G-X2312HWC75",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((message) => {
  console.log("onBackgroundMessage", message);
});

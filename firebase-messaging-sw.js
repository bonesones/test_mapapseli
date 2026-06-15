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
  apiKey: "AIzaSyAbXUIqvHJVBYv2ggHhyVIDOMQ196ptNjA",
  authDomain: "mapapseli-99e4a.firebaseapp.com",
  projectId: "mapapseli-99e4a",
  storageBucket: "mapapseli-99e4a.firebasestorage.app",
  messagingSenderId: "183073830587",
  appId: "1:183073830587:web:faea59a89558c5e2295b9e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((message) => {
  console.log("onBackgroundMessage", message);
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgFQ6vuP_og4HozACDOZ9wAt5XJ3YoaK8",
  authDomain: "totaro-4a6c5.firebaseapp.com",
  projectId: "totaro-4a6c5",
  storageBucket: "totaro-4a6c5.firebasestorage.app",
  messagingSenderId: "313641113283",
  appId: "1:313641113283:web:1dbf7c650cb4b98cad7476",
  measurementId: "G-7V429MPZ1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };

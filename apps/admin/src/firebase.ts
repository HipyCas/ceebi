// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAc5FsVsbDnVL_NviAPWGLd17X3pIqhRxY',
  authDomain: 'ceebi-admin.firebaseapp.com',
  projectId: 'ceebi-admin',
  storageBucket: 'ceebi-admin.appspot.com',
  messagingSenderId: '192356291351',
  appId: '1:192356291351:web:f290e15c74358c5d395d52',
  measurementId: 'G-9XTW9BX0PX',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

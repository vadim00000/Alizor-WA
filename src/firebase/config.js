// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlmxA6hzlz5Wl-3mMFIlQcB_B_WfFhQuU",
  authDomain: "alizor-6a1da.firebaseapp.com",
  projectId: "alizor-6a1da",
  storageBucket: "alizor-6a1da.firebasestorage.app",
  messagingSenderId: "83675139554",
  appId: "1:83675139554:web:67c28f5ec5e7470e30fdbb",
  measurementId: "G-70EYV6XX1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
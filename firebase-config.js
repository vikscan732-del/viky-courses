import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBvHqTLICABX2uAHyEQkb7E1RnwTzKy8k",
  authDomain: "viky-courses.firebaseapp.com",
  projectId: "viky-courses",
  storageBucket: "viky-courses.firebasestorage.app",
  messagingSenderId: "301659825576",
  appId: "1:301659825576:web:6511bd2765dd617ce6699d",
  measurementId: "G-W5Z5QDMRTM"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
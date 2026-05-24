import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPTD9S8o5fUaXBOpEqo7ot08qBeJ9wr2Q",
  authDomain: "e-45-489107.firebaseapp.com",
  projectId: "e-45-489107",
  storageBucket: "e-45-489107.firebasestorage.app",
  messagingSenderId: "579679620696",
  appId: "1:579679620696:web:c52d9b1cc45515f743442d",
  measurementId: "G-W8ZV4CK35Z"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, "synau");
export default app;

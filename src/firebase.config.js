import { initializeApp } from "firebase/app"
import {getFirestore} from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: "AIzaSyBstisrTMv9cEBLrRpdYLEAWaP_0ASMswg",
  authDomain: "house-marketplace-app-e0197.firebaseapp.com",
  projectId: "house-marketplace-app-e0197",
  storageBucket: "house-marketplace-app-e0197.appspot.com",
  messagingSenderId: "565535435524",
  appId: "1:565535435524:web:1ac531329dc3b9046ebe51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
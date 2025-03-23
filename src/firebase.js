import { initializeApp } from "firebase/app";
import { 
    getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, signOut, updateProfile 
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase } from "firebase/database"
// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFJEUNO7b2xFgcvTHlJF076LRH8HBSulk",
    authDomain: "property-delaler.firebaseapp.com",
    projectId: "property-delaler",
    storageBucket: "property-delaler.appspot.com",
    messagingSenderId: "497117303974",
    appId: "1:497117303974:web:b583e8a4ae5a79c2c5d067",
    measurementId: "G-WGZXKVYY2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
export const realtimeDB = getDatabase(app) 

export { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, db, storage, doc, setDoc, ref, uploadBytes, getDownloadURL };


// apiKey: "AIzaSyCdVrirjXekDaQ2U-PigIrYY27D9BHyfD4",
//   authDomain: "propertydeal-f3ff7.firebaseapp.com",
//   projectId: "propertydeal-f3ff7",
//   storageBucket: "propertydeal-f3ff7.firebasestorage.app",
//   messagingSenderId: "963043309850",
//   appId: "1:963043309850:web:79016d8e78a695b44cd4a3",
//   measurementId: "G-25F6LNYSFY"

// apiKey: "AIzaSyDH5PO54k1egNgqLyjYhGVSavzbKJU9zhU",
//   authDomain: "chat2-41d8a.firebaseapp.com",
//   projectId: "chat2-41d8a",
//   storageBucket: "chat2-41d8a.appspot.com",
//   messagingSenderId: "1015075866923",
//   appId: "1:1015075866923:web:76e3423fb648740ef4dd6e"
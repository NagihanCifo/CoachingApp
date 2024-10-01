import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCRlcWWgVPU9fDLV8WNUXisFt6Ohf2g73Q",
    authDomain: "coaching-app-2024.firebaseapp.com",
    projectId: "coaching-app-2024",
    storageBucket: "coaching-app-2024.appspot.com",
    messagingSenderId: "819582143961",
    appId: "1:819582143961:web:12d6120341e66d62865dc8",
    measurementId: "G-Z9HQX781C9"
  };

export const Firebase_App = initializeApp(firebaseConfig);
export const Firestore_Db = getFirestore(Firebase_App);
export const Firebase_Auth = getAuth(Firebase_App);
export default firebaseConfig;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjqTRBDZPtTxO-paaBoN9nv6N2oXzyWzc",
  authDomain: "instantexplore.firebaseapp.com",
  projectId: "instantexplore",
  storageBucket: "instantexplore.appspot.com",
  messagingSenderId: "446235041850",
  appId: "1:446235041850:web:36a1527f0d4c9abd255503"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
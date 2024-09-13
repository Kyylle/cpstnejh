import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9LfycgcjHpqBqIyGZgX6qYJW9YMZUeN4",
    authDomain: "auth-jobhub.firebaseapp.com",
    projectId: "auth-jobhub",
    storageBucket: "auth-jobhub.appspot.com",
    messagingSenderId: "197776536867",
    appId: "1:197776536867:web:880431d7d753ae196f8896",
    measurementId: "G-ZJ46WJ007Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };

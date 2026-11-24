// PITCHCRAFT AI - FIREBASE CONFIGURATION

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzmLZqztvMQAtnHgZvTY9ItM6Ss_Z0RbQ",
    authDomain: "pitchcraft-ai-c05b7.firebaseapp.com",
    projectId: "pitchcraft-ai-c05b7",
    storageBucket: "pitchcraft-ai-c05b7.firebasestorage.app",
    messagingSenderId: "908775075237",
    appId: "1:908775075237:web:82ab32cf8dc7fd6e87cc4c",
    measurementId: "G-MKCGD61P6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Export Firebase Authentication
export { app, auth };

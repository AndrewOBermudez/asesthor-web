// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDUUtH8zFzPULrsOtWkQsfbqz11JGvm6I",
  authDomain: "asesthor-87d16-4b9f7.firebaseapp.com",
  databaseURL: "https://asesthor-87d16-4b9f7-default-rtdb.firebaseio.com",
  projectId: "asesthor-87d16-4b9f7",
  storageBucket: "asesthor-87d16-4b9f7.firebasestorage.app",
  messagingSenderId: "653916066303",
  appId: "1:653916066303:web:4b3dff31eb65f4c08257ca",
  measurementId: "G-7YEEP8YRD1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para iniciar sesión
const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Función para cerrar sesión
const logout = () => {
  return signOut(auth);
};

// Exportar auth, login y logout
export { auth, db, login, logout };
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import app from "../firebaseConfig"; // Importamos la configuración de Firebase

// Inicializar Firebase Authentication y Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Función para iniciar sesión
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error en login:", error);
        throw error;
    }
};

// Función para cerrar sesión
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
};

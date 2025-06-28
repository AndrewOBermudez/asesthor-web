import React, { createContext, useContext, useState, useEffect } from "react";
import {doc, getDoc} from "firebase/firestore";
import {db, auth, login as firebaseLogin, logout as firebaseLogout } from "../firebaseConfig"; // Importamos las funciones de firebase.js
import { onAuthStateChanged } from "firebase/auth";

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
            if(currentUser){
                const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
                let zone = "";
                if (userDoc.exists()) {
                    zone = userDoc.data().zone || "";
                }
                setUser({ ...currentUser,zone})
            }else{
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Funciones de login y logout
    const login = (email, password) => firebaseLogin(email, password);
    const logout = () => firebaseLogout();

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto en cualquier parte de la app
export const useAuth = () => {
    return useContext(AuthContext);
};

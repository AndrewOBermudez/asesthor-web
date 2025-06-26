// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
    const { user, login, logout } = useAuth();

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Ruta para la URL raíz que redirige a /login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Ruta de inicio de sesión */}
                    <Route path="/login" element={<Login />} />

                    {/* Ruta protegida para el Dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Ruta para manejar cualquier otra ruta desconocida */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

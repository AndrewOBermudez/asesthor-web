// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import 'leaflet/dist/leaflet.css'; // Importar el CSS de Leaflet
import reportWebVitals from "./reportWebVitals";

// Importar los estilos de Leaflet
import 'leaflet/dist/leaflet.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Si quieres medir el rendimiento, pasa una función a reportWebVitals
reportWebVitals();

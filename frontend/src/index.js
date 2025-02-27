// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Importa los estilos globales
import App from './App';

// Crear el root para renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación dentro de <React.StrictMode>
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
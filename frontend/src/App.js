import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Componentes
import PanelControl from './components/PanelControl';
import Inventario from './components/Inventario';
import Ventas from './components/Ventas';
import Informes from './components/Informes';
import Login from './components/Login'; // Importa el componente de inicio de sesión
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente ProtectedRoute

// Estilos globales
import './styles.css';

function App() {
    return (
        <Router>
            {/* Encabezado */}
            <header className="header">
                <img src="/logo.png" alt="Logo" className="logo" /> {/* Logo en la parte superior izquierda */}
                <h1>Sistema de Gestión de Café</h1>
            </header>

            {/* Contenido principal */}
            <div className="container">
                <aside className="sidebar">
                    <Link to="/">Panel de Control</Link>
                    <Link to="/inventario">Inventario</Link>
                    <Link to="/ventas">Ventas</Link>
                    <Link to="/informes">Informes</Link>
                </aside>
                <main className="main-content">
                    <Routes>
                        {/* Ruta pública: Inicio de sesión */}
                        <Route path="/login" element={<Login />} />

                        {/* Rutas protegidas */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <PanelControl />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/inventario"
                            element={
                                <ProtectedRoute>
                                    <Inventario />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/ventas"
                            element={
                                <ProtectedRoute>
                                    <Ventas />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/informes"
                            element={
                                <ProtectedRoute>
                                    <Informes />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>

            {/* Pie de página */}
            <footer className="footer">
             <div className="footer-content">
            {/* Información de los desarrolladores */}
            <div className="footer-info">
            <span className="footer-text">
                Desarrollado por Victor Gutiérrez y Samuel Toro | © 2025
            </span>
            <a href="mailto:contacto@ejemplo.com" className="footer-email">
                contacto@ejemplo.com
            </a>
            </div>

                {/* Botón para ir al inicio */}
            <button className="footer-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Ir al Inicio
            </button>
            </div>

            {/* Logo en la parte inferior derecha */}
            <img src="/logo.png" alt="Logo" className="footer-logo" />
            </footer>
                </Router>
    );
}

export default App;
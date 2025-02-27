// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PanelControl from './components/PanelControl';
import Inventario from './components/Inventario';
import Ventas from './components/Ventas';
import Informes from './components/Informes';
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
                        <Route path="/" element={<PanelControl />} />
                        <Route path="/inventario" element={<Inventario />} />
                        <Route path="/ventas" element={<Ventas />} />
                        <Route path="/informes" element={<Informes />} />
                    </Routes>
                </main>
            </div>

            {/* Pie de página */}
            <footer className="footer">
                <img src="/logo.png" alt="Logo" className="logo" /> {/* Logo en la parte inferior derecha */}
            </footer>
        </Router>
    );
}

export default App;
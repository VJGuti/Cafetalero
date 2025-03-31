import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import PanelControl from './components/PanelControl';
import Inventario from './components/Inventario';
import Ventas from './components/Ventas';
import Informes from './components/Informes';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

import './styles.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <div className="flex flex-1">
          <aside className="w-64 bg-[#795548] text-white px-4 py-6">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="px-4 py-2 rounded hover:bg-gray-700 transition-colors">Panel de Control</Link>
              <Link to="/inventario" className="px-4 py-2 rounded hover:bg-gray-700 transition-colors">Inventario</Link>
              <Link to="/ventas" className="px-4 py-2 rounded hover:bg-gray-700 transition-colors">Ventas</Link>
              <Link to="/informes" className="px-4 py-2 rounded hover:bg-gray-700 transition-colors">Informes</Link>
            </nav>
          </aside>
          
          <main className="flex-1 p-6 bg-gray-50">
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
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
     <div className="flex flex-1">
          <aside className="w-64 bg-[#795548] text-white px-4 py-6">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="px-4 py-2 rounded hover:bg-gray-700 transition-colors">Panel de Control</Link>
              <Link to="/inventario" className="px-4 py-2 rounded hover:bg-gray-700 transition-colors">Inventario</Link>
              <Link to="/ventas" className="px-4 py-2 rounded hover:bg-gray-700 transition-colors">Ventas</Link>
              <Link to="/informes" className="px-4 py-2 rounded hover:bg-gray-700 transition-colors">Informes</Link>
            </nav>
          </aside>
      </div>
  )
}

export default Sidebar;

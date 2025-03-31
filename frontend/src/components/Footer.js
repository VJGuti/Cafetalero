import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">
            Desarrollado por Victor Gutiérrez y Samuel Toro | © 2025
          </span>
          <a 
            href="mailto:contacto@ejemplo.com" 
            className="text-sm text-green-600 hover:text-green-800"
          >
            contacto@ejemplo.com
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Ir al Inicio
          </button>
          <img src="logo.png" alt="Logo" className="h-8 w-auto" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;

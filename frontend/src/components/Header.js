import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <img src="logo.png" alt="Logo" className="h-10 w-auto mr-4" />
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Gestión de Café</h1>
      </div>
    </header>
  );
}

export default Header;

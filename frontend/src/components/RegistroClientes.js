// src/components/RegistroClientes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function RegistroClientes() {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/clientes')
            .then(response => setClientes(response.data))
            .catch(error => console.error('Error al cargar clientes:', error));
    }, []);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(clientes);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
        XLSX.writeFile(workbook, 'clientes.xlsx');
    };

    return (
        <div>
            <h2>Registro de Clientes</h2>
            <button onClick={exportToExcel}>Exportar a Excel</button>
            {/* ... (tabla de clientes) */}
        </div>
    );
}

export default RegistroClientes;
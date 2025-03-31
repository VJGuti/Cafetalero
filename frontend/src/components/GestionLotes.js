// src/components/GestionLotes.js
import React, { useEffect, useState } from 'react';
import apiClient from '../axiosConfig';
import * as XLSX from 'xlsx';

function GestionLotes() {
    const [lotes, setLotes] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/inventario/semillas')
            .then(response => setLotes(response.data))
            .catch(error => console.error('Error al cargar lotes:', error));
    }, []);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(lotes);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Lotes');
        XLSX.writeFile(workbook, 'lotes.xlsx');
    };

    return (
        <div>
            <h2>Gestión de Lotes</h2>
            <button onClick={exportToExcel}>Exportar a Excel</button>
            {/* ... (tabla de lotes) */}
        </div>
    );
}

export default GestionLotes;

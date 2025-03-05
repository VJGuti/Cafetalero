import React, { useEffect, useState } from 'react';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Movimientos() {
    const [movimientos, setMovimientos] = useState([]);
    const [filtros, setFiltros] = useState({
        tipoMovimiento: '',
        fechaInicio: '',
        fechaFin: '',
        semillaId: ''
    });

    // Carga inicial de movimientos
    useEffect(() => {
        axios.get('http://localhost:3000/api/inventario/movimientos')
            .then(response => setMovimientos(response.data))
            .catch(error => console.error('Error al cargar movimientos:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFiltros({ ...filtros, [name]: value });
    };

    const aplicarFiltros = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/inventario/movimientos/filtrar', {
                params: filtros
            });
            setMovimientos(response.data);
        } catch (error) {
            console.error('Error al aplicar filtros:', error);
        }
    };

    const exportToPDF = () => {
        const documentDefinition = {
            content: [
                { text: 'Movimientos de Inventario', style: 'header' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            ['ID', 'Semilla ID', 'Tipo', 'Cantidad', 'Fecha'],
                            ...movimientos.map(mov => [
                                mov.id,
                                mov.semilla_id,
                                mov.tipo_movimiento,
                                mov.cantidad,
                                mov.fecha_movimiento
                            ])
                        ]
                    }
                }
            ],
            styles: {
                header: { 
                    fontSize: 18, 
                    bold: true, 
                    margin: [0, 0, 0, 10],
                    alignment: 'center'
                }
            }
        };

        pdfMake.createPdf(documentDefinition).download('movimientos_inventario.pdf');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Movimientos de Inventario</h2>

            {/* Panel de control */}
            <div style={{ 
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                {/* Filtros */}
                <select 
                    name="tipoMovimiento" 
                    value={filtros.tipoMovimiento} 
                    onChange={handleInputChange}
                    style={{ padding: '0.5rem' }}
                >
                    <option value="">Tipo de Movimiento</option>
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                </select>
                
                <input
                    type="date"
                    name="fechaInicio"
                    value={filtros.fechaInicio}
                    onChange={handleInputChange}
                    style={{ padding: '0.5rem' }}
                />
                
                <input
                    type="date"
                    name="fechaFin"
                    value={filtros.fechaFin}
                    onChange={handleInputChange}
                    style={{ padding: '0.5rem' }}
                />
                
                <input
                    type="number"
                    name="semillaId"
                    placeholder="ID de semilla"
                    value={filtros.semillaId}
                    onChange={handleInputChange}
                    style={{ padding: '0.5rem' }}
                />
                
                <button 
                    onClick={aplicarFiltros}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Aplicar Filtros
                </button>

                {/* Botón de exportación */}
                <button 
                    onClick={exportToPDF}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#008CBA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Exportar a PDF
                </button>
            </div>

            {/* Tabla de movimientos */}
            <table style={{ 
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '1rem'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Semilla ID</th>
                        <th style={tableHeaderStyle}>Tipo de Movimiento</th>
                        <th style={tableHeaderStyle}>Cantidad</th>
                        <th style={tableHeaderStyle}>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {movimientos.map(movimiento => (
                        <tr key={movimiento.id} style={tableRowStyle}>
                            <td style={tableCellStyle}>{movimiento.id}</td>
                            <td style={tableCellStyle}>{movimiento.semilla_id}</td>
                            <td style={tableCellStyle}>{movimiento.tipo_movimiento}</td>
                            <td style={tableCellStyle}>{movimiento.cantidad}</td>
                            <td style={tableCellStyle}>
                                {new Date(movimiento.fecha_movimiento).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Estilos para la tabla
const tableHeaderStyle = {
    padding: '1rem',
    borderBottom: '2px solid #ddd',
    textAlign: 'left',
    fontWeight: 'bold'
};

const tableCellStyle = {
    padding: '0.75rem',
    borderBottom: '1px solid #ddd',
    textAlign: 'left'
};

const tableRowStyle = {
    transition: 'background-color 0.2s',
    '&:hover': {
        backgroundColor: '#f9f9f9'
    }
};

export default Movimientos;
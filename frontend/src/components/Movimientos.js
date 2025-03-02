// src/components/Movimientos.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Movimientos() {
    const [movimientos, setMovimientos] = useState([]);
    const [filtros, setFiltros] = useState({
        tipoMovimiento: '',
        fechaInicio: '',
        fechaFin: '',
        semillaId: ''
    });

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

    return (
        <div>
            <h2>Movimientos de Inventario</h2>

            {/* Formulario de Filtros */}
            <div style={{ marginBottom: '1rem' }}>
                <select name="tipoMovimiento" value={filtros.tipoMovimiento} onChange={handleInputChange}>
                    <option value="">Seleccionar tipo</option>
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                </select>
                <input
                    type="date"
                    name="fechaInicio"
                    value={filtros.fechaInicio}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="fechaFin"
                    value={filtros.fechaFin}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="semillaId"
                    placeholder="ID de semilla"
                    value={filtros.semillaId}
                    onChange={handleInputChange}
                />
                <button onClick={aplicarFiltros}>Aplicar Filtros</button>
            </div>

            {/* Tabla de Movimientos */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Semilla ID</th>
                        <th>Tipo de Movimiento</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {movimientos.map(movimiento => (
                        <tr key={movimiento.id}>
                            <td>{movimiento.id}</td>
                            <td>{movimiento.semilla_id}</td>
                            <td>{movimiento.tipo_movimiento}</td>
                            <td>{movimiento.cantidad}</td>
                            <td>{movimiento.fecha_movimiento}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Movimientos;
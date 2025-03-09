// src/components/MonitoreoStock.js
import React, { useState } from 'react';
import apiClient from '../axiosConfig';

function MonitoreoStock() {
    const [movimiento, setMovimiento] = useState({
        semilla_id: '',
        tipo_movimiento: 'entrada',
        cantidad: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovimiento({ ...movimiento, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/inventario/movimientos', movimiento);
            alert('Movimiento registrado correctamente');
            setMovimiento({ semilla_id: '', tipo_movimiento: 'entrada', cantidad: '' });
        } catch (error) {
            console.error('Error al registrar movimiento:', error);
        }
    };

    return (
        <div>
            <h2>Monitoreo de Stock</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="semilla_id"
                    placeholder="ID de la Semilla"
                    value={movimiento.semilla_id}
                    onChange={handleChange}
                />
                <select
                    name="tipo_movimiento"
                    value={movimiento.tipo_movimiento}
                    onChange={handleChange}
                >
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                </select>
                <input
                    type="number"
                    name="cantidad"
                    placeholder="Cantidad"
                    value={movimiento.cantidad}
                    onChange={handleChange}
                />
                <button type="submit">Agregar Movimiento</button>
            </form>
        </div>
    );
}

export default MonitoreoStock;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Factura from './Factura';

function RegistroVentas() {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
        // Cargar todas las ventas
        axios.get('http://localhost:5000/api/ventas')
            .then(response => setVentas(response.data))
            .catch(error => console.error('Error al cargar ventas:', error));
    }, []);

    return (
        <div>
            <h2>Registro de Ventas</h2>

            {/* Lista de ventas */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Semilla</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map(venta => (
                        <tr key={venta.id}>
                            <td>{venta.id}</td>
                            <td>{venta.cliente}</td>
                            <td>{venta.semilla}</td>
                            <td>{venta.cantidad}</td>
                            <td>{venta.fecha_venta}</td>
                            <td>
                                <Factura ventaId={venta.id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RegistroVentas;
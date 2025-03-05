import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Factura from './Factura';

function RegistroVentas() {
    // Estado para almacenar las ventas cargadas desde la API
    const [ventas, setVentas] = useState([]);

    // Estado para manejar los datos del formulario de nueva venta
    const [venta, setVenta] = useState({
        cliente_id: '',
        semilla_id: '',
        cantidad: '',
        fecha_venta: '',
        precio_unitario: 0,
        total: 0
    });

    // Cargar todas las ventas al montar el componente
    useEffect(() => {
        axios.get('http://localhost:3000/api/ventas')
            .then(response => setVentas(response.data))
            .catch(error => console.error('Error al cargar ventas:', error));
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Calcular el total si se modifica la cantidad o el precio unitario
        if (name === 'cantidad' || name === 'precio_unitario') {
            const cantidad = name === 'cantidad' ? parseInt(value, 10) : parseInt(venta.cantidad, 10);
            const precioUnitario = name === 'precio_unitario' ? parseFloat(value) : parseFloat(venta.precio_unitario);
            const total = cantidad * precioUnitario;

            setVenta({ ...venta, [name]: value, total });
        } else {
            setVenta({ ...venta, [name]: value });
        }
    };

    // Manejar el envío del formulario para registrar una nueva venta
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/ventas', venta);
            alert('Venta registrada correctamente');

            // Limpiar el formulario después de registrar la venta
            setVenta({
                cliente_id: '',
                semilla_id: '',
                cantidad: '',
                fecha_venta: '',
                precio_unitario: 0,
                total: 0
            });

            // Recargar la lista de ventas para reflejar la nueva venta
            const response = await axios.get('http://localhost:3000/api/ventas');
            setVentas(response.data);
        } catch (error) {
            console.error('Error al registrar venta:', error);
        }
    };

    return (
        <div>
            {/* Formulario para registrar una nueva venta */}
            <h2>Registrar Venta</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="cliente_id"
                    placeholder="ID del Cliente"
                    value={venta.cliente_id}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="semilla_id"
                    placeholder="ID de la Semilla"
                    value={venta.semilla_id}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="cantidad"
                    placeholder="Cantidad"
                    value={venta.cantidad}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="precio_unitario"
                    placeholder="Precio Unitario"
                    value={venta.precio_unitario}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="fecha_venta"
                    value={venta.fecha_venta}
                    onChange={handleChange}
                    required
                />
                <p>Total: ${venta.total.toFixed(2)}</p>
                <button type="submit">Finalizar Venta</button>
            </form>

            {/* Lista de ventas registradas */}
            <h2>Registro de Ventas</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Semilla</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Total</th>
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
                            <td>${venta.precio_unitario.toFixed(2)}</td>
                            <td>${venta.total.toFixed(2)}</td>
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
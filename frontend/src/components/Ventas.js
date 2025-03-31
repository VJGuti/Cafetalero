import React, { useEffect, useState } from 'react';
import apiClient from '../axiosConfig';
import { ShoppingCart, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

function Ventas() {
    const [activeTab, setActiveTab] = useState('ventas');
    const [ventas, setVentas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterTipoSemilla, setFilterTipoSemilla] = useState('todos'); 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const ventasResponse = await apiClient.get('/api/informes/ventas');
                console.log(ventasResponse)
                setVentas(ventasResponse.data);

                const clientesResponse = await apiClient.get('/api/clientes/todos'); 
                setClientes(clientesResponse.data);

                const ventasPorSemillas = await apiClient.get('/api/informes/ventas/por-semilla')

                setError(null); 
            } catch (err) {
                console.error('Error al cargar datos:', err.message);
                setError('No se pudieron cargar los datos. Intente nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtrar ventas por tipo de semilla
const filteredVentas = ventas.filter((venta) => {
    if (filterTipoSemilla === 'todos') return true;
    return venta.semilla_tipo && venta.semilla_tipo.toLowerCase() === filterTipoSemilla.toLowerCase();
});

  if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-700">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Encabezado */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Ventas</h1>
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'ventas' ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('ventas')}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingCart size={18} />
                            <span>Ventas</span>
                        </div>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${
                            activeTab === 'clientes' ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('clientes')}
                    >
                        <div className="flex items-center gap-2">
                            <Users size={18} />
                            <span>Clientes</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="bg-green-500 rounded-full p-3 mr-4 text-white">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ventas del Mes</p>
                        <p className="text-2xl font-bold">${ventas.reduce((total, venta) => total + venta.total, 0).toFixed(2)}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Nuevos Clientes</p>
                        <p className="text-2xl font-bold">{clientes.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="bg-amber-500 rounded-full p-3 mr-4 text-white">
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ventas Pendientes</p>
                        <p className="text-2xl font-bold">
                            {ventas.filter((venta) => venta.estado === 'Pendiente').length}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                    <div className="bg-purple-500 rounded-full p-3 mr-4 text-white">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Crecimiento</p>
                        <p className="text-2xl font-bold">+15%</p>
                    </div>
                </div>
            </div>

            {/* Contenido de la pestaña */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {activeTab === 'ventas' ? (
                    <>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Ventas Recientes</h2>
                            <div className="flex gap-4">
                                {/* Filtro por tipo de semilla */}
                                <select
                                    value={filterTipoSemilla}
                                    onChange={(e) => setFilterTipoSemilla(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="todos">Todos los tipos de café</option>
                                    <option value="arabica">Arábica</option>
                                    <option value="robusta">Robusta</option>
                                    <option value="excelsa">Excelsa</option>
                                </select>
                                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                    <ShoppingCart size={18} />
                                    <span>Nueva Venta</span>
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th>Tipo de Semilla</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredVentas.length > 0 ? (
                                        filteredVentas.map((venta) => (
                                            <tr key={venta.id} className="hover:bg-gray-50">
                                                <td>{venta.id}</td>
                                                <td>{venta.cliente_nombre}</td>
                                                <td>
                                                    <div className="flex items-center">
                                                        <Calendar size={16} className="mr-2 text-gray-400" />
                                                        {new Date(venta.fecha_venta).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td>${venta.cantidad.toFixed(2)}</td>
                                                <td>{venta.semilla_tipo}</td>
                                                <td>
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            venta.estado === 'Completada'
                                                                ? 'bg-green-100 text-green-800'
                                                                : venta.estado === 'Pendiente'
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {venta.estado}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Ver</button>
                                                    <button className="text-red-600 hover:text-red-900">Eliminar</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                No hay ventas disponibles para este filtro.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Clientes Registrados</h2>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                <Users size={18} />
                                <span>Nuevo Cliente</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Contacto</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Última Compra</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {clientes.map((cliente) => (
                                        <tr key={cliente.id} className="hover:bg-gray-50">
                                            <td>{cliente.nombre}</td>
                                            <td>{cliente.contacto}</td>
                                            <td>{cliente.email}</td>
                                            <td>{cliente.telefono}</td>
                                            <td>{new Date(cliente.ultimaCompra).toLocaleDateString()}</td>
                                            <td>
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                                <button className="text-red-600 hover:text-red-900">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Ventas;

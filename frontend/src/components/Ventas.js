import React, { useState } from 'react';
import { ShoppingCart, Users, Calendar, DollarSign, TrendingUp,  } from 'lucide-react';

function Ventas() {
    const [activeTab, setActiveTab] = useState('ventas');
    
    // Datos de ejemplo para ventas
    const ventasRecientes = [
        { id: 1, cliente: 'Agrícola San José', fecha: '2023-05-15', total: 1250.00, productos: 'Semillas de tomate, lechuga y zanahoria', estado: 'Completada' },
        { id: 2, cliente: 'Vivero El Edén', fecha: '2023-05-12', total: 850.75, productos: 'Semillas de girasol y lavanda', estado: 'Completada' },
        { id: 3, cliente: 'Cooperativa Agrícola', fecha: '2023-05-10', total: 2340.50, productos: 'Semillas de maíz y trigo', estado: 'Pendiente' },
        { id: 4, cliente: 'Jardines Botánicos', fecha: '2023-05-08', total: 560.25, productos: 'Semillas de flores variadas', estado: 'Completada' },
        { id: 5, cliente: 'Huertos Urbanos', fecha: '2023-05-05', total: 980.00, productos: 'Kit de semillas para huerto', estado: 'Cancelada' },
    ];
    
    // Datos de ejemplo para clientes
    const clientesRecientes = [
        { id: 1, nombre: 'Agrícola San José', contacto: 'Juan Pérez', email: 'juan@agricolasj.com', telefono: '555-123-4567', ultimaCompra: '2023-05-15' },
        { id: 2, nombre: 'Vivero El Edén', contacto: 'María Gómez', email: 'maria@viveroeden.com', telefono: '555-234-5678', ultimaCompra: '2023-05-12' },
        { id: 3, nombre: 'Cooperativa Agrícola', contacto: 'Roberto Sánchez', email: 'roberto@coopagricola.org', telefono: '555-345-6789', ultimaCompra: '2023-05-10' },
        { id: 4, nombre: 'Jardines Botánicos', contacto: 'Ana Martínez', email: 'ana@jardinesbotanicos.com', telefono: '555-456-7890', ultimaCompra: '2023-05-08' },
        { id: 5, nombre: 'Huertos Urbanos', contacto: 'Carlos Rodríguez', email: 'carlos@huertosurbanos.com', telefono: '555-567-8901', ultimaCompra: '2023-05-05' },
    ];
    
    // Estadísticas de ventas
    const estadisticas = [
        { titulo: 'Ventas del Mes', valor: '$12,450', icono: <DollarSign size={24} />, color: 'bg-green-500' },
        { titulo: 'Nuevos Clientes', valor: '8', icono: <Users size={24} />, color: 'bg-blue-500' },
        { titulo: 'Ventas Pendientes', valor: '3', icono: <ShoppingCart size={24} />, color: 'bg-amber-500' },
        { titulo: 'Crecimiento', valor: '+15%', icono: <TrendingUp size={24} />, color: 'bg-purple-500' },
    ];
    
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Ventas</h1>
                
                <div className="flex space-x-2">
                    <button 
                        className={`px-4 py-2 rounded-md ${activeTab === 'ventas' ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('ventas')}
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingCart size={18} />
                            <span>Ventas</span>
                        </div>
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-md ${activeTab === 'clientes' ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
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
                {estadisticas.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6 flex items-center">
                        <div className={`${stat.color} rounded-full p-3 mr-4 text-white`}>
                            {stat.icono}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{stat.titulo}</p>
                            <p className="text-2xl font-bold">{stat.valor}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Contenido de la pestaña */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {activeTab === 'ventas' ? (
                    <>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Ventas Recientes</h2>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                <ShoppingCart size={18} />
                                <span>Nueva Venta</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ventasRecientes.map(venta => (
                                        <tr key={venta.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">#{venta.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{venta.cliente}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                <div className="flex items-center">
                                                    <Calendar size={16} className="mr-2 text-gray-400" />
                                                    {new Date(venta.fecha).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${venta.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-gray-700">{venta.productos}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    venta.estado === 'Completada' ? 'bg-green-100 text-green-800' : 
                                                    venta.estado === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {venta.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Ver</button>
                                                <button className="text-red-600 hover:text-red-900">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Compra</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {clientesRecientes.map(cliente => (
                                        <tr key={cliente.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cliente.nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cliente.contacto}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cliente.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cliente.telefono}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                {new Date(cliente.ultimaCompra).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
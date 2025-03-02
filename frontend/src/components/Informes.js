import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, Filter } from 'lucide-react';

function Informes() {
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');
    
    // Datos de ejemplo para informes
    const informesDisponibles = [
        { id: 1, nombre: 'Informe de Inventario', descripcion: 'Estado actual del inventario de semillas', icono: <FileText size={20} />, color: 'bg-blue-100 text-blue-800' },
        { id: 2, nombre: 'Informe de Ventas', descripcion: 'Resumen de ventas por período', icono: <BarChart3 size={20} />, color: 'bg-green-100 text-green-800' },
        { id: 3, nombre: 'Informe de Caducidad', descripcion: 'Semillas próximas a caducar', icono: <Calendar size={20} />, color: 'bg-amber-100 text-amber-800' },
        { id: 4, nombre: 'Informe de Clientes', descripcion: 'Análisis de clientes y compras', icono: <PieChart size={20} />, color: 'bg-purple-100 text-purple-800' },
        { id: 5, nombre: 'Informe de Tendencias', descripcion: 'Tendencias de ventas por tipo de semilla', icono: <TrendingUp size={20} />, color: 'bg-indigo-100 text-indigo-800' },
    ];
    
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Informes y Estadísticas</h1>
                
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden">
                        <button 
                            className={`px-4 py-2 ${periodoSeleccionado === 'semana' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}
                            onClick={() => setPeriodoSeleccionado('semana')}
                        >
                            Semana
                        </button>
                        <button 
                            className={`px-4 py-2 ${periodoSeleccionado === 'mes' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}
                            onClick={() => setPeriodoSeleccionado('mes')}
                        >
                            Mes
                        </button>
                        <button 
                            className={`px-4 py-2 ${periodoSeleccionado === 'año' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}
                            onClick={() => setPeriodoSeleccionado('año')}
                        >
                            Año
                        </button>
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <Filter size={18} />
                        <span>Filtros</span>
                    </button>
                </div>
            </div>
            
            {/* Gráficos de resumen */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Ventas por Tipo de Semilla</h2>
                        <PieChart size={20} className="text-gray-500" />
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <p className="text-gray-500">Gráfico de distribución de ventas por tipo de semilla</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Tendencia de Ventas</h2>
                        <TrendingUp size={20} className="text-gray-500" />
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <p className="text-gray-500">Gráfico de tendencia de ventas en el tiempo</p>
                    </div>
                </div>
            </div>
            
            {/* Lista de informes disponibles */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Informes Disponibles</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                    {informesDisponibles.map(informe => (
                        <div key={informe.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-3 rounded-lg ${informe.color}`}>
                                        {informe.icono}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{informe.nombre}</h3>
                                        <p className="text-gray-600 mt-1">{informe.descripcion}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                                        <FileText size={16} />
                                        <span>Ver</span>
                                    </button>
                                    <button className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                                        <Download size={16} />
                                        <span>Descargar</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex items-center text-sm text-gray-500">
                                <Calendar size={16} className="mr-1" />
                                <span>Última actualización: {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Informes;
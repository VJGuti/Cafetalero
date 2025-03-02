import React from 'react';
import { BarChart3, AlertTriangle, Package, TrendingUp, Users } from 'lucide-react';

function PanelControl() {
    // Datos de ejemplo para el panel
    const alertas = [
        { id: 1, tipo: 'Stock bajo', mensaje: 'Semillas de tomate por debajo del mínimo', nivel: 'alto' },
        { id: 2, tipo: 'Caducidad', mensaje: 'Semillas de lechuga próximas a caducar', nivel: 'medio' },
        { id: 3, tipo: 'Pedido pendiente', mensaje: 'Confirmar llegada de semillas de zanahoria', nivel: 'bajo' },
    ];

    const estadisticas = [
        { titulo: 'Total de Semillas', valor: '1,245', icono: <Package size={24} />, color: 'bg-blue-500' },
        { titulo: 'Ventas del Mes', valor: '$8,390', icono: <TrendingUp size={24} />, color: 'bg-green-500' },
        { titulo: 'Clientes Activos', valor: '64', icono: <Users size={24} />, color: 'bg-purple-500' },
        { titulo: 'Alertas Activas', valor: '3', icono: <AlertTriangle size={24} />, color: 'bg-amber-500' },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
                <div className="text-sm text-gray-500">
                    Última actualización: {new Date().toLocaleDateString()}
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

            {/* Gráfico y alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Resumen de Inventario</h2>
                        <BarChart3 size={20} className="text-gray-500" />
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                        <p className="text-gray-500">Gráfico de distribución de inventario por tipo de semilla</p>
                    </div>
                </div>

                {/* Alertas */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Alertas Activas</h2>
                        <AlertTriangle size={20} className="text-amber-500" />
                    </div>
                    <div className="space-y-4">
                        {alertas.map(alerta => (
                            <div 
                                key={alerta.id} 
                                className={`p-3 rounded-lg border-l-4 ${
                                    alerta.nivel === 'alto' ? 'border-red-500 bg-red-50' : 
                                    alerta.nivel === 'medio' ? 'border-amber-500 bg-amber-50' : 
                                    'border-blue-500 bg-blue-50'
                                }`}
                            >
                                <div className="font-medium">{alerta.tipo}</div>
                                <div className="text-sm text-gray-600">{alerta.mensaje}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PanelControl;
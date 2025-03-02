import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, AlertTriangle, Package, TrendingUp, Users } from 'lucide-react';

function PanelControl() {
    const [alertas, setAlertas] = useState([]);
    const [estadisticas, setEstadisticas] = useState([]);

    useEffect(() => {
        // Obtener alertas
        axios.get('http://localhost:3000/api/informes/alertas')
            .then(response => setAlertas(response.data))
            .catch(error => console.error('Error al cargar alertas:', error));

        // Obtener estadísticas (simulado)
        axios.get('http://localhost:5000/api/informes/estadisticas')
            .then(response => setEstadisticas(response.data))
            .catch(error => console.error('Error al cargar estadísticas:', error));
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>

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

            {/* Alertas */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800">Alertas Activas</h2>
                {alertas.length > 0 ? (
                    <ul className="space-y-4 mt-4">
                        {alertas.map(alerta => (
                            <li 
                                key={alerta.id} 
                                className={`p-3 rounded-lg border-l-4 ${
                                    alerta.nivel === 'alto' ? 'border-red-500 bg-red-50' : 
                                    alerta.nivel === 'medio' ? 'border-amber-500 bg-amber-50' : 
                                    'border-blue-500 bg-blue-50'
                                }`}
                            >
                                <div className="font-medium">{alerta.tipo}</div>
                                <div className="text-sm text-gray-600">{alerta.mensaje}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No hay alertas activas.</p>
                )}
            </div>
        </div>
    );
}

export default PanelControl;
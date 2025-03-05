import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart3, AlertTriangle, Package, TrendingUp, Users } from 'lucide-react';
import { Bar } from 'chart.js/auto';

function PanelControl() {
    const [alertas, setAlertas] = useState([]);
    const [estadisticas, setEstadisticas] = useState([]);
    const [ventasData, setVentasData] = useState([]);

    useEffect(() => {
        // Fetch alerts
        axios.get('http://localhost:3000/api/informes/alertas')
            .then(response => setAlertas(response.data))
            .catch(error => console.error('Error al cargar alertas:', error));

        // Fetch statistics (simulated)
        axios.get('http://localhost:3000/api/informes/estadisticas')
            .then(response => setEstadisticas(response.data))
            .catch(error => console.error('Error al cargar estadísticas:', error));

        // Fetch sales data
        axios.get('http://localhost:5000/api/informes/ventas/por-semilla')
            .then(response => setVentasData(response.data))
            .catch(error => console.error('Error al cargar datos de ventas:', error));
    }, []);

    useEffect(() => {
        if (ventasData.length > 0) {
            const ctx = document.getElementById('ventasChart')?.getContext('2d');
            if (ctx) {
                new Bar(ctx, {
                    data: {
                        labels: ventasData.map(item => item.semilla),
                        datasets: [{
                            label: 'Total Vendido',
                            data: ventasData.map(item => item.total_vendido),
                            backgroundColor: '#19551C',
                            borderColor: '#19551C',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Ventas por Tipo de Semilla'
                            }
                        }
                    }
                });
            }
        }
    }, [ventasData]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>

            {/* Statistical Cards */}
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

            {/* Alerts Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
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

            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Ventas por Tipo de Semilla</h2>
                <canvas id="ventasChart" width="400" height="200"></canvas>
            </div>
        </div>
    );
}

export default PanelControl;
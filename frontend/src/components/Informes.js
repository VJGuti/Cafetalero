import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Link, useParams, Routes, Route } from 'react-router-dom';
import apiClient from '../axiosConfig.js'; // Asumiendo que apiClient está importado correctamente

// Función exportToExcel compartida
const exportToExcel = (data, fileName) => {
    if (!data || data.length === 0) {
        console.error('No hay datos para exportar.');
        alert('No hay datos disponibles para descargar.');
        return;
    }

    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
        console.error('Error al exportar a Excel:', error.message);
        alert('Ocurrió un error al descargar el archivo.');
    }
};

function Informes() {
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');
    const [ventas, setVentas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos de la API al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Obtener datos de ventas
                const ventasResponse = await apiClient.get('/api/informes/ventas');
                console.log(ventasResponse);
                setVentas(ventasResponse.data.data);
                
                // Obtener datos de clientes
                const clientesResponse = await apiClient.get('/api/clientes/todos');
                setClientes(clientesResponse.data.data);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Preparar informes basados en los datos obtenidos de la API
    const informesDisponibles = [
        {
            id: 1,
            nombre: 'Informe de Ventas',
            descripcion: 'Resumen de ventas por período',
            icono: <BarChart3 size={20} />,
            color: 'bg-green-100 text-green-800',
            datos: ventas,
        },
        {
            id: 2,
            nombre: 'Informe de Clientes',
            descripcion: 'Listado de clientes registrados',
            icono: <FileText size={20} />,
            color: 'bg-blue-100 text-blue-800',
            datos: clientes,
        },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Cabecera con selector de período y filtros */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Informes y Estadísticas</h1>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden">
                        {[{ value: 'semana' }, { value: 'mes' }, { value: 'año' }].map((periodo) => (
                            <button
                                key={periodo.value}
                                className={`px-4 py-2 ${periodoSeleccionado === periodo.value ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}
                                onClick={() => setPeriodoSeleccionado(periodo.value)}
                            >
                                {periodo.value.charAt(0).toUpperCase() + periodo.value.slice(1)}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <Filter size={18} />
                        <span>Filtros</span>
                    </button>
                </div>
            </div>

            {/* Gráficos de resumen */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Gráfico de ventas por tipo de semilla */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Ventas por Tipo de Semilla</h2>
                        <PieChart size={20} className="text-gray-500" />
                    </div>
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                        {loading ? (
                            <span>Cargando datos...</span>
                        ) : (
                            <div className="p-4 w-full">
                                {/* Aquí iría un gráfico real de ventas por tipo de semilla */}
                                <p className="text-center text-gray-500">Datos de ventas listos para visualización</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Gráfico de tendencias */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Tendencia de Ventas</h2>
                        <TrendingUp size={20} className="text-gray-500" />
                    </div>
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                        {loading ? (
                            <span>Cargando datos...</span>
                        ) : (
                            <div className="p-4 w-full">
                                {/* Aquí iría un gráfico real de tendencias */}
                                <p className="text-center text-gray-500">Tendencia de ventas lista para visualización</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lista de informes disponibles */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Informes Disponibles</h2>
                </div>
                
                {loading ? (
                    <div className="p-6 text-center">
                        <span>Cargando informes...</span>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {informesDisponibles.map((informe) => (
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
                                        <Link to={`/informes/detalle/${informe.id}`}>
                                            <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                                                <FileText size={16} />
                                                <span>Ver</span>
                                            </button>
                                        </Link>
                                        <button
                                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                            onClick={() => exportToExcel(informe.datos, informe.nombre)}
                                        >
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
                )}
            </div>
        </div>
    );
}

// Componente para ver el detalle de un informe
function DetalleInforme() {
    const { id } = useParams();
    const [informe, setInforme] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInformeDetalle = async () => {
            try {
                setLoading(true);
                let datos = [];
                
                if (id === '1') {
                    // Detalle de ventas
                    const response = await apiClient.get('/api/informes/ventas');
                    datos = response.data;
                    setInforme({
                        id: 1,
                        nombre: 'Informe de Ventas',
                        datos: datos
                    });
                } else if (id === '2') {
                    // Detalle de clientes
                    const response = await apiClient.get('/api/clientes/todos');
                    datos = response.data;
                    setInforme({
                        id: 2,
                        nombre: 'Informe de Clientes',
                        datos: datos
                    });
                }
            } catch (error) {
                console.error('Error al cargar detalle del informe:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInformeDetalle();
    }, [id]);

    if (loading) {
        return <div className="p-6 text-center">Cargando detalles del informe...</div>;
    }

    if (!informe) {
        return <div className="p-6 text-center">Informe no encontrado</div>;
    }

    const renderTabla = () => {
        if (informe.id === 1) {
            // Tabla de ventas
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semilla</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {informe.datos.map((venta) => (
                            <tr key={venta.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.cliente_nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.semilla_tipo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.cantidad}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(venta.fecha_venta).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        } else if (informe.id === 2) {
            return (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {informe.datos.map((cliente) => (
                            <tr key={cliente.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefono}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
        
        return <p>No hay datos disponibles para este informe.</p>;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{informe.nombre}</h1>
                <Link to="/informes">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                        Volver a Informes
                    </button>
                </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Detalle del Informe</h2>
                    <button
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => exportToExcel(informe.datos, informe.nombre)}
                    >
                        <Download size={16} />
                        <span>Exportar a Excel</span>
                    </button>
                </div>
                <div className="p-0">
                    {renderTabla()}
                </div>
            </div>
        </div>
    );
}



export { Informes, DetalleInforme, exportToExcel };

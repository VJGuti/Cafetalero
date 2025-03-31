import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiClient from '../axiosConfig';
import { Search, Filter, Plus, RefreshCw, AlertTriangle, Edit, Trash2 } from 'lucide-react';

function Inventario() {
    const [semillas, setSemillas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('todos');
    const [stockFilter, setStockFilter] = useState('todos');

    useEffect(() => {
        fetchSemillas();
    }, []); 

    const fetchSemillas = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/api/inventario/semillas');

            if (response.data.semillas) {
                setSemillas(response.data.semillas);
            } else {
                setSemillas(response.data);
            }
            setError(null);
        } catch (error) {
            console.error('Error al cargar semillas:', error);
    
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('No se pudieron cargar los datos. Intente nuevamente más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta semilla?')) {
            try {
                await axios.delete(`http://localhost:5000/api/inventario/${id}`);
                setSemillas(semillas.filter((semilla) => semilla.id !== id));
                alert('Semilla eliminada correctamente.');
            } catch (error) {
                console.error('Error al eliminar semilla:', error);
                alert('Ocurrió un error al eliminar la semilla.');
            }
        }
    };

    // Función para editar una semilla
    const handleEdit = (id) => {
        alert(`Editar semilla con ID ${id}. Implementa la lógica aquí.`);
    };

    const filteredSemillas = semillas.filter((semilla) => {
        const matchesSearch =
            semilla.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            semilla.tipo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'todos' || semilla.tipo.toLowerCase() === filterType.toLowerCase();
        const matchesStock =
            stockFilter === 'todos' ||
            (stockFilter === 'bajo' && semilla.stock <= 50) ||
            (stockFilter === 'medio' && semilla.stock > 50 && semilla.stock <= 100) ||
            (stockFilter === 'alto' && semilla.stock > 100);
        return matchesSearch && matchesType && matchesStock;
    });

    const getStockClass = (stock) => {
        if (stock <= 50) return 'text-red-600 font-medium';
        if (stock <= 100) return 'text-amber-600 font-medium';
        return 'text-green-600 font-medium';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Encabezado */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Inventario de Semillas de Café</h1>
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Buscador */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar semillas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    {/* Filtro por tipo */}
                    <div className="relative">
                        <button
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            onClick={() => document.getElementById('filter-menu').classList.toggle('hidden')}
                        >
                            <Filter size={18} />
                            <span>Filtrar</span>
                        </button>
                        <div
                            id="filter-menu"
                            className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                        >
                            <div className="py-1">
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                        filterType === 'todos' ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => setFilterType('todos')}
                                >
                                    Todos los tipos
                                </button>
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                        filterType === 'arabica' ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => setFilterType('arabica')}
                                >
                                    Arábica
                                </button>
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                        filterType === 'robusta' ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => setFilterType('robusta')}
                                >
                                    Robusta
                                </button>
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                        filterType === 'excelsa' ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => setFilterType('excelsa')}
                                >
                                    Excelsa
                                </button>
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${
                                        filterType === 'liberica' ? 'bg-gray-100' : ''
                                    }`}
                                    onClick={() => setFilterType('liberica')}
                                >
                                    Liberica
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Filtro por stock */}
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="todos">Todos los niveles de stock</option>
                        <option value="bajo">Bajo (≤ 50)</option>
                        <option value="medio">Medio (51 - 100)</option>
                        <option value="alto">Alto (˃ 100)</option>
                    </select>
                    {/* Botón para agregar semillas */}
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        <Plus size={18} />
                        <span>Agregar</span>
                    </button>
                </div>
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start gap-3">
                    <AlertTriangle className="text-red-500 mt-0.5" size={20} />
                    <div>
                        <p className="font-medium text-red-800">Error</p>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Tabla de inventario */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <RefreshCw size={24} className="animate-spin text-green-600 mr-2" />
                        <span>Cargando inventario...</span>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha de Caducidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredSemillas.length > 0 ? (
                                        filteredSemillas.map((semilla) => (
                                            <tr key={semilla.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{semilla.nombre}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {semilla.tipo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={getStockClass(semilla.stock)}>{semilla.stock} unidades</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {semilla.fecha_caducidad
                                                        ? new Date(semilla.fecha_caducidad).toLocaleDateString()
                                                        : 'Sin fecha'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <button
                                                            className="flex items-center text-indigo-600 hover:text-indigo-900 mr-3"
                                                            onClick={() => handleEdit(semilla.id)}
                                                        >
                                                            <Edit size={16} className="mr-1" />
                                                            <span>Editar</span>
                                                        </button>
                                                        <button
                                                            className="flex items-center text-red-600 hover:text-red-900"
                                                            onClick={() => handleDelete(semilla.id)}
                                                        >
                                                            <Trash2 size={16} className="mr-1" />
                                                            <span>Eliminar</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                No se encontraron semillas que coincidan con los filtros
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                Mostrando <span className="font-medium">{filteredSemillas.length}</span> de{' '}
                                <span className="font-medium">{semillas.length}</span> semillas
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Inventario;

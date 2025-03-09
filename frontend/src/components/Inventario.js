import React, { useEffect, useState } from 'react';
import apiClient from '../axiosConfig';
import { Search, Filter, Plus, RefreshCw, AlertTriangle } from 'lucide-react';

function Inventario() {
    const [semillas, setSemillas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('todos'); // Estado para el filtro de tipo
    const [stockFilter, setStockFilter] = useState('todos'); // Estado para el filtro de stock

    useEffect(() => {
        fetchSemillas();
    }, []);

    const fetchSemillas = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/inventario/semillas');
            setSemillas(response.data);
            setError(null);
        } catch (error) {
            console.error('Error al cargar semillas:', error);
            setError('No se pudieron cargar los datos. Intente nuevamente más tarde.');
            // Datos de ejemplo para visualización en caso de error
            setSemillas([
                { id: 1, nombre: 'Tomate Cherry', tipo: 'Hortalizas', stock: 120, fecha_caducidad: '2025-06-15' },
                { id: 2, nombre: 'Lechuga Romana', tipo: 'Hortalizas', stock: 85, fecha_caducidad: '2025-04-20' },
                { id: 3, nombre: 'Zanahoria', tipo: 'Hortalizas', stock: 200, fecha_caducidad: '2025-08-10' },
                { id: 4, nombre: 'Girasol', tipo: 'Flores', stock: 50, fecha_caducidad: '2025-05-30' },
                { id: 5, nombre: 'Albahaca', tipo: 'Aromáticas', stock: 75, fecha_caducidad: '2024-12-25' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredSemillas = semillas.filter(semilla => {
        const matchesSearch = semilla.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Inventario de Semillas</h1>
                
                <div className="flex flex-col sm:flex-row gap-3">
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
                                    className={`block w-full text-left px-4 py-2 text-sm ${filterType === 'todos' ? 'bg-gray-100' : ''}`}
                                    onClick={() => setFilterType('todos')}
                                >
                                    Todos los tipos
                                </button>
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${filterType === 'hortalizas' ? 'bg-gray-100' : ''}`}
                                    onClick={() => setFilterType('hortalizas')}
                                >
                                    Hortalizas
                                </button>
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${filterType === 'flores' ? 'bg-gray-100' : ''}`}
                                    onClick={() => setFilterType('flores')}
                                >
                                    Flores
                                </button>
                                <button
                                    className={`block w-full text-left px-4 py-2 text-sm ${filterType === 'aromaticas' ? 'bg-gray-100' : ''}`}
                                    onClick={() => setFilterType('aromaticas')}
                                >
                                    Aromáticas
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
                        <option value="alto">Alto (&gt 100)</option>
                    </select>

                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        <Plus size={18} />
                        <span>Agregar</span>
                    </button>
                </div>
            </div>
            
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start gap-3">
                    <AlertTriangle className="text-red-500 mt-0.5" size={20} />
                    <div>
                        <p className="font-medium text-red-800">Error</p>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <RefreshCw size={24} className="animate-spin text-green-600 mr-2" />
                        <span>Cargando inventario...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Caducidad</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSemillas.length > 0 ? (
                                    filteredSemillas.map(semilla => (
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
                                                {new Date(semilla.fecha_caducidad).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                                <button className="text-red-600 hover:text-red-900">Eliminar</button>
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
                )}
                
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        Mostrando <span className="font-medium">{filteredSemillas.length}</span> de <span className="font-medium">{semillas.length}</span> semillas
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                            Anterior
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inventario;
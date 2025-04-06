import { useEffect, useState } from "react"
import apiClient from "../axiosConfig"
import {
  ShoppingCart,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import RegistroVentaForm from "./RegistroVentas.js"

function Ventas() {
  const [activeTab, setActiveTab] = useState("ventas")
  const [ventas, setVentas] = useState([])
  const [clientes, setClientes] = useState([])
  const [semillas, setSemillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterTipoSemilla, setFilterTipoSemilla] = useState("todos")

  // States for modals
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editingVenta, setEditingVenta] = useState(null)
  const [deletingVenta, setDeletingVenta] = useState(null)
  const [editingCliente, setEditingCliente] = useState(null)
  const [deletingCliente, setDeletingCliente] = useState(null)

  // Form data states
  const [ventaFormData, setVentaFormData] = useState({
    cliente_id: "",
    semilla_id: "",
    cantidad: 0,
    fecha_venta: "",
  })

  const [clienteFormData, setClienteFormData] = useState({
    nombre: "",
    contacto: "",
    email: "",
    telefono: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const ventasResponse = await apiClient.get("/api/informes/ventas")
        setVentas(ventasResponse.data)

        const clientesResponse = await apiClient.get("/api/clientes/todos")
        setClientes(clientesResponse.data)

        const semillasResponse = await apiClient.get("/api/inventario/semillas")
        if (semillasResponse.data.semillas) {
          setSemillas(semillasResponse.data.semillas)
        } else {
          setSemillas(semillasResponse.data)
        }

        setError(null)
      } catch (err) {
        console.error("Error al cargar datos:", err.message)
        setError("No se pudieron cargar los datos. Intente nuevamente más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredVentas = ventas.filter((venta) => {
    if (filterTipoSemilla === "todos") return true
    return venta.semilla_tipo && venta.semilla_tipo.toLowerCase() === filterTipoSemilla.toLowerCase()
  })

  // Handlers for sales
  const handleEditVenta = (venta) => {
    setEditingVenta(venta)
    setVentaFormData({
      cliente_id: venta.cliente_id || "",
      semilla_id: venta.semilla_id || "",
      cantidad: venta.cantidad || 0,
      fecha_venta: venta.fecha_venta ? venta.fecha_venta.split("T")[0] : "",
    })
  }

  const handleUpdateVenta = async () => {
    try {
      const response = await apiClient.put(`/api/ventas/${editingVenta.id}`, ventaFormData)

      if (response.data && (response.data.success || response.status === 200 || response.status === 201)) {
        // Refresh data after update
        const ventasResponse = await apiClient.get("/api/informes/ventas")
        setVentas(ventasResponse.data)

        setEditingVenta(null)
        setError(null)
      } else {
        setError(response.data.message || "No se pudo actualizar la venta")
      }
    } catch (error) {
      console.error("Error al actualizar venta:", error)
      setError("Ocurrió un error al actualizar la venta.")
    }
  }

  const handleDeleteVenta = async () => {
    try {
      await apiClient.delete(`/api/ventas/${deletingVenta.id}`)
      setVentas(ventas.filter((venta) => venta.id !== deletingVenta.id))
      setDeletingVenta(null)

      // Refresh data after delete
      const ventasResponse = await apiClient.get("/api/informes/ventas")
      setVentas(ventasResponse.data)
    } catch (error) {
      console.error("Error al eliminar venta:", error)
      setError("Ocurrió un error al eliminar la venta.")
    }
  }

  // Handlers for clients
  const handleEditCliente = (cliente) => {
    setEditingCliente(cliente)
    setClienteFormData({
      nombre: cliente.nombre || "",
      contacto: cliente.contacto || "",
      email: cliente.email || "",
      telefono: cliente.telefono || "",
    })
  }

  const handleUpdateCliente = async () => {
    try {
      const response = await apiClient.put(`/api/clientes/${editingCliente.id}`, clienteFormData)

      if (response.data.success) {
        // Refresh data after update
        const clientesResponse = await apiClient.get("/api/clientes/todos")
        setClientes(clientesResponse.data)

        setEditingCliente(null)
        setError(null)
      } else {
        setError(response.data.message || "No se pudo actualizar el cliente")
      }
    } catch (error) {
      console.error("Error al actualizar cliente:", error)
      setError("Ocurrió un error al actualizar el cliente.")
    }
  }

  const handleDeleteCliente = async () => {
    try {
      await apiClient.delete(`/api/clientes/${deletingCliente.id}`)
      setClientes(clientes.filter((cliente) => cliente.id !== deletingCliente.id))
      setDeletingCliente(null)

      // Refresh data after delete
      const clientesResponse = await apiClient.get("/api/clientes/todos")
      setClientes(clientesResponse.data)
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
      setError("Ocurrió un error al eliminar el cliente.")
    }
  }

 const handleSaveCliente = async () => {
    try {
      let response
      if (editingCliente.id) {
        // Update existing client
        response = await apiClient.put(`/api/clientes/${editingCliente.id}`, clienteFormData)
      } else {
        // Create new client
        response = await apiClient.post("/api/clientes/crear", clienteFormData)
      }

      if (response.data && (response.data.success || response.status === 200 || response.status === 201)) {

        const clientesResponse = await apiClient.get("/api/clientes/todos")
        setClientes(clientesResponse.data)

        // Close the modal
        setEditingCliente(null)
        setError(null)
      } else {
        setError(response.data?.message || "No se pudo guardar el cliente")
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error)
      setError("Ocurrió un error al guardar el cliente.")
    }
  }

  const handleVentaSuccess = async () => {
    // Refresh data after adding a new sale
    try {
      const ventasResponse = await apiClient.get("/api/informes/ventas")
      setVentas(ventasResponse.data)
      setError(null)
    } catch (err) {
      console.error("Error al cargar ventas:", err.message)
      setError("No se pudieron cargar los datos de ventas.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RefreshCw size={24} className="animate-spin text-green-600 mr-2" />
        <p className="text-gray-700">Cargando datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start gap-3">
          <AlertTriangle className="text-red-500 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-red-800">Error</p>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Ventas</h1>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "ventas"
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("ventas")}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              <span>Ventas</span>
            </div>
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "clientes"
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("clientes")}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>Clientes</span>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-green-500 rounded-full p-3 mr-4 text-white">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ventas del Mes</p>
            <p className="text-2xl font-bold">
              ${ventas.reduce((cantidad, venta) => cantidad + venta.cantidad, 0).toFixed(2)}
            </p>
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
            <p className="text-2xl font-bold">{ventas.filter((venta) => venta.estado === "Pendiente").length}</p>
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activeTab === "ventas" ? (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Ventas Recientes</h2>
              <div className="flex gap-4">
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
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={() => setMostrarFormulario(true)}
                >
                  <ShoppingCart size={18} />
                  <span>Nueva Venta</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Semilla
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVentas.length > 0 ? (
                    filteredVentas.map((venta) => (
                      <tr key={venta.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{venta.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{venta.cliente_nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-gray-400" />
                            {new Date(venta.fecha_venta).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">${venta.cantidad.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{venta.semilla_tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              className="flex items-center text-indigo-600 hover:text-indigo-900 mr-3"
                              onClick={() => handleEditVenta(venta)}
                            >
                              <Edit size={16} className="mr-1" />
                              <span>Editar</span>
                            </button>
                            <button
                              className="flex items-center text-red-600 hover:text-red-900"
                              onClick={() => setDeletingVenta(venta)}
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
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => {
                  setClienteFormData({
                    nombre: "",
                    contacto: "",
                    email: "",
                    telefono: "",
                  })
                  setEditingCliente({})
                }}
              >
                <Users size={18} />
                <span>Nuevo Cliente</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{cliente.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{cliente.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{cliente.telefono}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            className="flex items-center text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => handleEditCliente(cliente)}
                          >
                            <Edit size={16} className="mr-1" />
                            <span>Editar</span>
                          </button>
                          <button
                            className="flex items-center text-red-600 hover:text-red-900"
                            onClick={() => setDeletingCliente(cliente)}
                          >
                            <Trash2 size={16} className="mr-1" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal para editar venta */}
      {editingVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Editar Venta</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <select
                  value={ventaFormData.cliente_id}
                  onChange={(e) => setVentaFormData({ ...ventaFormData, cliente_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Semilla</label>
                <select
                  value={ventaFormData.semilla_id}
                  onChange={(e) => setVentaFormData({ ...ventaFormData, semilla_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccione una semilla</option>
                  {semillas.map((semilla) => (
                    <option key={semilla.id} value={semilla.id}>
                      {semilla.nombre} - {semilla.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cantidad</label>
                <input
                  type="number"
                  value={ventaFormData.cantidad}
                  onChange={(e) => setVentaFormData({ ...ventaFormData, cantidad: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha de Venta</label>
                <input
                  type="date"
                  value={ventaFormData.fecha_venta}
                  onChange={(e) => setVentaFormData({ ...ventaFormData, fecha_venta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setEditingVenta(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateVenta}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para eliminar venta */}
      {deletingVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>

            <div className="mb-4">
              <p className="text-gray-700">
                ¿Está seguro que desea eliminar la venta #{deletingVenta.id} de{" "}
                <span className="font-medium">{deletingVenta.cliente_nombre}</span>?
              </p>
              <p className="text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setDeletingVenta(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteVenta}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar cliente */}
      {editingCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{editingCliente.id ? "Editar Cliente" : "Nuevo Cliente"}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={clienteFormData.nombre}
                  onChange={(e) => setClienteFormData({ ...clienteFormData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={clienteFormData.email}
                  onChange={(e) => setClienteFormData({ ...clienteFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={clienteFormData.telefono}
                  onChange={(e) => setClienteFormData({ ...clienteFormData, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setEditingCliente(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCliente}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para registrar nueva venta */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Registrar Nueva Venta</h2>
            <RegistroVentaForm
              clientes={clientes}
              semillas={semillas}
              onCancel={() => setMostrarFormulario(false)}
              onSuccess={() => {
                setMostrarFormulario(false)
                handleVentaSuccess()
              }}
            />
          </div>
        </div>
      )}

      {/* Modal para eliminar cliente */}
      {deletingCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>

            <div className="mb-4">
              <p className="text-gray-700">
                ¿Está seguro que desea eliminar el cliente <span className="font-medium">{deletingCliente.nombre}</span>
                ?
              </p>
              <p className="text-gray-500 mt-2">
                Esta acción no se puede deshacer y podría afectar a las ventas asociadas.
              </p>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setDeletingCliente(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCliente}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ventas



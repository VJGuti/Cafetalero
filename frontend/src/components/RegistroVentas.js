import { useState } from "react"
import apiClient from "../axiosConfig"
import { AlertTriangle } from "lucide-react"

function RegistroVentaForm({ clientes, semillas, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    cliente_id: "",
    semilla_id: "",
    cantidad: 0,
    fecha_venta: new Date().toISOString().split("T")[0],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "cantidad" ? Number(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.cliente_id || !formData.semilla_id || formData.cantidad <= 0 || !formData.fecha_venta) {
        throw new Error("Por favor complete todos los campos requeridos.")
      }

      const response = await apiClient.post("/api/ventas/registrar", formData)

      if (response.data && (response.data.success || response.status === 200 || response.status === 201)) {
        onSuccess()
      } else {
        setError(response.data.message || "No se pudo registrar la venta")
      }
    } catch (error) {
      console.error("Error al registrar venta:", error)
      setError(error.message || "Ocurrió un error al registrar la venta.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start gap-2">
          <AlertTriangle className="text-red-500 mt-0.5" size={18} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Cliente *</label>
        <select
          name="cliente_id"
          value={formData.cliente_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
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
        <label className="block text-sm font-medium mb-1">Tipo de Semilla *</label>
        <select
          name="semilla_id"
          value={formData.semilla_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Seleccione una semilla</option>
          {semillas.map((semilla) => (
            <option key={semilla.id} value={semilla.id}>
              {semilla.nombre} - {semilla.tipo} (${semilla.precio_kg}/kg)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cantidad (kg) *</label>
        <input
          type="number"
          name="cantidad"
          value={formData.cantidad}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha de Venta *</label>
        <input
          type="date"
          name="fecha_venta"
          value={formData.fecha_venta}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="flex justify-end mt-6 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Registrar Venta"}
        </button>
      </div>
    </form>
  )
}

export default RegistroVentaForm

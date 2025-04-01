import React, { useState } from 'react';
import apiClient from '../axiosConfig.js'

const AgregarSemillaCafeForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    stock: '',
    fecha_caducidad: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'stock' ? Number(value) : value });

    console.log(setFormData)
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.tipo) newErrors.tipo = 'Seleccione un tipo de semilla';
    if (!formData.stock || formData.stock <= 0) newErrors.stock = 'El stock debe ser mayor a 0';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const dataToSend = { ...formData };
      if (!dataToSend.fecha_caducidad) {
        dataToSend.fecha_caducidad = null;
      }

      const response = await apiClient.post('/api/inventario/semillas', dataToSend);
      
      // Axios maneja respuestas exitosas con status 2xx automáticamente
      if (onSuccess) onSuccess();
      if (onClose) onClose();
      
    } catch (error) {
      console.error('Error:', error);
      
      if (error.response && error.response.data) {
        setErrors({ form: error.response.data.message || 'Ocurrió un error al agregar la semilla' });
      } else {
        setErrors({ form: 'Ocurrió un error al intentar agregar la semilla de café' });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Agregar Semilla de Café</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              data-cy="input-nombre"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          {/* Campo Tipo */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.tipo ? 'border-red-500' : 'border-gray-300'}`}
              data-cy="select-tipo"
            >
              <option value="Arábica">Arábica</option>
              <option value="Robusta">Robusta</option>
              <option value="Excelsa">Excelsa</option>
              <option value="Liberica">Liberica</option>
            </select>
            {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
          </div>

          {/* Campo Stock */}
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-md ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
              data-cy="input-stock"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>

          {/* Campo Fecha de Caducidad */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Caducidad (opcional)</label>
            <input
              type="date"
              name="fecha_caducidad"
              value={formData.fecha_caducidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              data-cy="input-fecha-caducidad"
            />
          </div>

          {errors.form && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errors.form}</span>
            </div>
          )}

          <div className="flex justify-end mt-6 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              data-cy="btn-cancelar"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              data-cy="btn-agregar"
            >
              Agregar Semilla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarSemillaCafeForm;

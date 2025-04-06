const { obtenerVentasPorSemilla, registrarVenta, editarVenta, eliminarVenta } = require('../models/ventasModel');

exports.registrarVenta = async (req, res) => {
    const { cliente_id, semilla_id, cantidad, fecha_venta } = req.body;

    try {
        const result = await registrarVenta(cliente_id, semilla_id, cantidad, fecha_venta)
       return res.status(200).json({ message: 'Venta registrada exitosamente', ventaId: result.insertId });
    } catch (error) {
        console.error('Error al registrar la venta:', error.message);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
};

exports.getVentasPorSemilla = async (req, res) => {
    console.log('Ejecutando getVentasPorSemilla...');
    try {
        const { semilla_id } = req.params;
        if (!semilla_id || isNaN(semilla_id)) {
            return res.status(400).json({ error: 'ID de semilla inválido' });
        }

        console.log(`Obteniendo ventas para semilla_id: ${semilla_id}`);
        const ventas = await obtenerVentasPorSemilla(semilla_id);

        if (!ventas) {
            return res.status(404).json({ error: 'No se encontraron ventas para esta semilla' });
        }

        res.status(200).json(ventas);
    } catch (error) {
        console.error('Error en el controlador getVentasPorSemilla:', error.message);

        // Manejar errores específicos
        if (error.message.includes('ID de semilla inválido')) {
            return res.status(400).json({ error: 'ID de semilla inválido' });
        }

        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.editarVenta = async (req, res) => {
  try {
   const { id } = req.params
   const { cliente_id ,semilla_id, cantidad, fecha_venta } = req.body;

    if (!cliente_id || !semilla_id || !cantidad || !fecha_venta) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const actualizarCliente = await editarVenta(id, cliente_id, semilla_id, cantidad, fecha_venta)

    if(actualizarCliente.success = true) {
      return res.status(200).json({message: 'Se ha actualizado la venta'})
    } 
  }catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
 }

exports.eliminarVenta = async (req, res) => {
  const { id } = req.params
  const idDelete = await eliminarVenta(id)
  if (idDelete.success === true) {
    return res.status(200).json({message: `${idDelete.message}` })
  } else {
    return res.status(404).json({message: `${idDelete.message}`})
  }  
}










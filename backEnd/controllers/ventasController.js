const { obtenerVentasPorSemilla } = require('../models/ventasModel');

// Controlador para registrar una venta
exports.registrarVenta = async (req, res) => {
    const { cliente_id, semilla_id, cantidad_vendida, fecha_venta } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO ventas (cliente_id, semilla_id, cantidad_vendida, fecha_venta) VALUES (?, ?, ?, ?)',
            [cliente_id, semilla_id, cantidad_vendida, fecha_venta]
        );
        res.json({ message: 'Venta registrada exitosamente', ventaId: result.insertId });
    } catch (error) {
        console.error('Error al registrar la venta:', error.message);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
};




















// Controlador para obtener ventas por semilla
exports.getVentasPorSemilla = async (req, res) => {
    console.log('Ejecutando getVentasPorSemilla...');
    try {
        const { semilla_id } = req.params;

        // Validar que semilla_id sea un número
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

const express = require('express');
const router = express.Router();
const pool = require('../db');
const ventasController = require('../controllers/ventasController');
const facturasController = require('../controllers/facturasController');

// Registrar una venta
router.post('/ventas', ventasController.registrarVenta);
// Generar factura
router.get('/ventas/:id/factura', facturasController.generarFactura);

router.get('/api/ventas/:semillaId', async (req, res) => {
    const { semillaId } = req.params;

    // Validar que semillaId sea un número
    if (isNaN(semillaId)) {
        return res.status(400).json({ success: false, message: 'ID de semilla inválido.' });
    }

    try {
        console.log('semillaId recibido:', semillaId);

        // Consulta SQL para obtener las ventas por tipo de semilla
        const [rows] = await pool.query(`
            SELECT 
                v.id AS venta_id,
                c.nombre AS cliente_nombre,
                s.tipo AS semilla_tipo,
                v.cantidad,
                v.fecha_venta
            FROM ventas v
            JOIN clientes c ON v.cliente_id = c.id
            JOIN semillas s ON v.semilla_id = s.id
            WHERE s.id = ?
        `, [semillaId]);

        console.log('Resultados de la consulta:', rows);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron ventas para esta semilla.' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener ventas por semilla:', error.message);

        // Manejar errores específicos
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            return res.status(400).json({ success: false, error: 'Campo semilla_id no existe en la tabla ventas.' });
        }

        res.status(500).json({ success: false, error: 'Error al obtener ventas por semilla.' });
    }
});

module.exports = router;
const express = require('express');
const { getVentasPorSemilla, registrarVenta, editarVenta, eliminarVenta } = require('../controllers/ventasController');
const { authenticateToken } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Ruta para registrar una venta
router.put('/:id', authenticateToken, editarVenta)
router.delete('/:id', authenticateToken, eliminarVenta)
router.post('/registrar', authenticateToken, registrarVenta);

// Ruta para obtener ventas por semilla
router.get('/ventas/semilla/:semilla_id', authenticateToken ,getVentasPorSemilla);

module.exports = router;

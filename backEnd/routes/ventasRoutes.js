const express = require('express');
const { getVentasPorSemilla, registrarVenta } = require('../controllers/ventasController');
const { authenticateToken } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Ruta para registrar una venta
router.post('/ventas', authenticateToken  ,registrarVenta);

// Ruta para obtener ventas por semilla
router.get('/ventas/semilla/:semilla_id', authenticateToken ,getVentasPorSemilla);

module.exports = router;

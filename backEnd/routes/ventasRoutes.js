const express = require('express');
const { getVentasPorSemilla, registrarVenta } = require('../controllers/ventasController');

const router = express.Router();

// Ruta para registrar una venta
router.post('/ventas', registrarVenta);

// Ruta para obtener ventas por semilla
router.get('/ventas/semilla/:semilla_id', getVentasPorSemilla);

module.exports = router;
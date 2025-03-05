const express = require('express');
const router = express.Router();
const informesController = require('../controllers/informesController');

// Generar informe de inventario
router.get('/inventario', informesController.generarInformeInventario);

// Generar informe de movimientos de inventario
router.get('/movimientos', informesController.generarInformeMovimientos);

router.get('/ventas/por-semilla', informesController.obtenerVentasPorSemilla);
// Generar informe de ventas
router.get('/ventas', informesController.generarInformeVentas);

module.exports = router;
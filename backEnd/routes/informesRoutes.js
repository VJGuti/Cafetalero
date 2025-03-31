const express = require('express');
const router = express.Router();
const pool = require('../db');
const informesController = require('../controllers/informesController');
const { authenticateToken } = require('../middleware/authMiddleware.js');

router.get('/inventario', authenticateToken, informesController.generarInformeInventario);

router.get('/movimientos', authenticateToken, informesController.generarInformeMovimientos);

router.get('/ventas/por-semilla', authenticateToken, informesController.obtenerVentasPorSemilla);

router.get('/ventas', authenticateToken, informesController.generarInformeVentas);

router.get('/alertas', authenticateToken, informesController.obtenerAlertas);

module.exports = router;

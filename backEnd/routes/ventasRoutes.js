const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const facturasController = require('../controllers/facturasController');

// Registrar una venta
router.post('/ventas', ventasController.registrarVenta);

// Generar factura
router.get('/ventas/:id/factura', facturasController.generarFactura);

module.exports = router;
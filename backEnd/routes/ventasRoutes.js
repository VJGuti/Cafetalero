const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

// Registrar una venta
router.post('/ventas', ventasController.registrarVenta);

module.exports = router;
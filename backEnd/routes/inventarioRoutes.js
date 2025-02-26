const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// Obtener todas las semillas
router.get('/semillas', inventarioController.obtenerSemillas);

// Agregar una nueva semilla
router.post('/semillas', inventarioController.agregarSemilla);

module.exports = router;
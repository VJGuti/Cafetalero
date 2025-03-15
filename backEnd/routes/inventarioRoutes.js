const express = require('express');
const router = express.Router();
const pool = require('../db');
const inventarioController = require('../controllers/inventarioController');
const semillasModel = require('../models/semillasModel'); // Importa el modelo
const movimientosModel = require('../models/movimientosModel'); // Importa el modelo

// Obtener todas las semillas
router.get('/semillas', inventarioController.obtenerSemillas);

// Agregar una nueva semilla
router.post('/semillas', inventarioController.agregarSemilla);

// Filtrar semillas
router.get('/semillas/filtrar', async (req, res) => {
    const { tipo, stockMin, stockMax, fechaCaducidad } = req.query;

    try {
        const semillas = await semillasModel.filtrarSemillas(tipo, stockMin, stockMax, fechaCaducidad);
        res.json(semillas);
    } catch (error) {
        throw new Error('Error al filtrar semillas');
    }
});

// Filtrar movimientos
router.get('/movimientos/filtrar', async (req, res) => {
    const { tipoMovimiento, fechaInicio, fechaFin, semillaId } = req.query;

    try {
        const movimientos = await movimientosModel.filtrarMovimientos(tipoMovimiento, fechaInicio, fechaFin, semillaId);
        res.json(movimientos);
    } catch (error) {
        throw new Error('Error al filtrar movimientos');
    }
});
router.get('/inventario', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventario');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener el inventario:', error.message);
        res.status(500).json({ error: 'No se pudieron cargar los datos del inventario.' });
    }
});

module.exports = router;
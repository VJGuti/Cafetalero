const express = require('express');
const router = express.Router();
const pool = require('../db');
const inventarioController = require('../controllers/inventarioController');
const semillasModel = require('../models/semillasModel'); 
const movimientosModel = require('../models/movimientosModel'); 
const { authenticateToken } = require('../middleware/authMiddleware.js');

router.put('/semillas/:id', authenticateToken, inventarioController.editarSemilla);
router.get('/semillas', authenticateToken, inventarioController.obtenerSemillas);

router.post('/semillas', authenticateToken ,inventarioController.agregarSemilla);

router.get('/semillas/filtrar', async (req, res) => {
    const { tipo, stockMin, stockMax, fechaCaducidad } = req.query;

    try {
        const semillas = await semillasModel.filtrarSemillas(tipo, stockMin, stockMax, fechaCaducidad);
        res.json(semillas);
    } catch (error) {
        throw new Error('Error al filtrar semillas');
    }
});

router.get('/movimientos/filtrar', async (req, res) => {
    const { tipoMovimiento, fechaInicio, fechaFin, semillaId } = req.query;

    try {
        const movimientos = await movimientosModel.filtrarMovimientos(tipoMovimiento, fechaInicio, fechaFin, semillaId);
        res.json(movimientos);
    } catch (error) {
        throw new Error('Error al filtrar movimientos');
    }
});

module.exports = router;

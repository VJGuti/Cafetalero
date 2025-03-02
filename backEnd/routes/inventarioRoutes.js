const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// Obtener todas las semillas
router.get('/semillas', inventarioController.obtenerSemillas);

// Agregar una nueva semilla
router.post('/semillas', inventarioController.agregarSemilla);

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
// backend/controllers/inventarioController.js
const semillasModel = require('../models/semillasModel');

// Obtener todas las semillas
exports.obtenerSemillas = async (req, res) => {
    try {
        const semillas = await semillasModel.obtenerSemillas();
        res.json(semillas);
    } catch (error) {
        throw new Error('Error al obtener las semillas');
    }
};

// Agregar una nueva semilla
exports.agregarSemilla = async (req, res) => {
    const { nombre, tipo, stock, fecha_caducidad } = req.body;

    // Validaciones
    if (!nombre || !tipo || stock === undefined || !fecha_caducidad) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (stock < 0) {
        return res.status(400).json({ error: 'El stock no puede ser negativo' });
    }

    try {
        const id = await semillasModel.agregarSemilla(nombre, tipo, stock, fecha_caducidad);
        res.status(201).json({ id, nombre, tipo, stock, fecha_caducidad });
    } catch (error) {
        throw new Error('Error al agregar la semilla');
    }
};
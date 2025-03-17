const semillasModel = require('../models/semillasModel');
const materiasPrimas = require('../models/materiasPrimasModel')
const Joi = require('joi');
const pool = require('../db');

// Esquema de validación para agregar una semilla
const semillaSchema = Joi.object({
    nombre: Joi.string().required(),
    tipo: Joi.string().valid('Arábica', 'Robusta', 'Liberica', 'Excelsa').required(),
    stock: Joi.number().min(0).required(),
    fecha_caducidad: Joi.date().iso().required()
});

// Obtener todas las semillas (con paginación)
exports.obtenerSemillas = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Valor predeterminado: 10
    const offset = parseInt(req.query.offset) || 0; // Valor predeterminado: 0

    try {
        const semillas = await semillasModel.obtenerSemillasPaginadas(limit, offset);
        res.json(semillas);
    } catch (error) {
        console.error(error); // Registrar el error para depuración
        res.status(500).json({ error: 'Error al obtener las semillas' });
    }
};

// Agregar una nueva semilla
exports.agregarSemilla = async (req, res) => {
    // Validar los datos de entrada usando Joi
    const { error } = semillaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Extraer los datos del cuerpo de la solicitud
    const { nombre, tipo, stock, fecha_caducidad } = req.body;

    try {
        // Llamar al modelo para agregar la semilla
        const id = await semillasModel.agregarSemilla(nombre, tipo, stock, fecha_caducidad);
        res.status(201).json({ id, nombre, tipo, stock, fecha_caducidad });
    } catch (error) {
        console.error(error); // Registrar el error para depuración
        res.status(500).json({ error: 'Error al agregar la semilla' });
    }
};
exports.obtenerInventario = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventario');
        return rows;
    } catch (error) {
        console.error('Error al obtener el inventario:', error.message);
        throw new Error('Error al obtener los datos del inventario.');
    }
};

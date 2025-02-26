const db = require('../db');

// Obtener todas las semillas
exports.obtenerSemillas = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM semillas');
        return rows;
    } catch (error) {
        console.error(error); // Registrar el error para depuración
        throw new Error('Error al obtener las semillas');
    }
};

// Obtener semillas paginadas
exports.obtenerSemillasPaginadas = async (limit = 10, offset = 0) => {
    try {
        const [rows] = await db.query('SELECT * FROM semillas LIMIT ? OFFSET ?', [limit, offset]);
        return rows;
    } catch (error) {
        console.error(error); // Registrar el error para depuración
        throw new Error('Error al obtener las semillas paginadas');
    }
};

// Agregar una nueva semilla
exports.agregarSemilla = async (nombre, tipo, stock, fecha_caducidad) => {
    try {
        const [result] = await db.query(
            'INSERT INTO semillas (nombre, tipo, stock, fecha_caducidad) VALUES (?, ?, ?, ?)',
            [nombre, tipo, stock, fecha_caducidad]
        );
        return result.insertId;
    } catch (error) {
        console.error(error); // Registrar el error para depuración
        throw new Error('Error al agregar la semilla');
    }
};
const db = require('../db');

// Obtener todas las semillas
exports.obtenerSemillas = async () => {
    const [rows] = await db.query('SELECT * FROM semillas');
    return rows;
};

// Agregar una nueva semilla
exports.agregarSemilla = async (nombre, tipo, stock, fecha_caducidad) => {
    const [result] = await db.query(
        'INSERT INTO semillas (nombre, tipo, stock, fecha_caducidad) VALUES (?, ?, ?, ?)',
        [nombre, tipo, stock, fecha_caducidad]
    );
    return result.insertId;
};
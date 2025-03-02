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
exports.filtrarSemillas = async (tipo, stockMin, stockMax, fechaCaducidad) => {
    let query = 'SELECT * FROM semillas WHERE 1=1';
    const params = [];

    if (tipo) {
        query += ' AND tipo = ?';
        params.push(tipo);
    }
    if (stockMin !== undefined) {
        query += ' AND stock >= ?';
        params.push(stockMin);
    }
    if (stockMax !== undefined) {
        query += ' AND stock <= ?';
        params.push(stockMax);
    }
    if (fechaCaducidad) {
        query += ' AND fecha_caducidad <= ?';
        params.push(fechaCaducidad);
    }

    const [rows] = await db.query(query, params);
    return rows;
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
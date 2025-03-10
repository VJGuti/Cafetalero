const pool = require('../db');

// Obtener todas las semillas
exports.obtenerSemillas = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM semillas'); // Corregido: pool.query en lugar de db.query
        return rows;
    } catch (error) {
        console.error(error); // Registrar el error para depuración
        throw new Error('Error al obtener las semillas');
    }
};
// Filtrar semillas
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

    try {
        const [rows] = await pool.query(query, params); // Corregido: pool.query en lugar de db.query
        return rows;
    } catch (error) {
        console.error('Error al filtrar semillas:', error.message);
        throw new Error('Error al filtrar semillas');
    }
};

// Obtener semillas paginadas
exports.obtenerSemillasPaginadas = async (pagina, limite) => {
    try {
        const offset = (pagina - 1) * limite;
        const [rows] = await pool.query(
            'SELECT * FROM semillas LIMIT ? OFFSET ?',
            [limite, offset]
        );
        return rows;
    } catch (error) {
        console.error('Error al obtener las semillas paginadas:', error.message);
        throw new Error('Error al obtener las semillas paginadas');
    }
};

// Agregar una nueva semilla
exports.agregarSemilla = async (nombre, tipo, stock, fecha_caducidad) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO semillas (nombre, tipo, stock, fecha_caducidad) VALUES (?, ?, ?, ?)',
            [nombre, tipo, stock, fecha_caducidad]
        );
        return result.insertId;
    } catch (error) {
        console.error(error); // Registrar el error para depuración
        throw new Error('Error al agregar la semilla');
    }
};
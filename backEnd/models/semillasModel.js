const pool = require('../db');

// Obtener todas las semillas
exports.obtenerSemillas = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM semillas');
        return rows;
    } catch (error) {
        console.error('Error en obtenerSemillas:', error.message);
        throw new Error('Error al obtener las semillas. Por favor, inténtalo nuevamente.');
    }
};


exports.filtrarSemillas = async (tipo, stockMin, stockMax, fecha_caducidad) => {
    let query = 'SELECT * FROM semillas WHERE 1=1';
    const params = [];

    
    if (stockMin !== undefined && isNaN(stockMin)) {
        throw new Error('El valor de stockMin debe ser un número.');
    }
    if (stockMax !== undefined && isNaN(stockMax)) {
        throw new Error('El valor de stockMax debe ser un número.');
    }
    if (fecha_caducidad && isNaN(Date.parse(fecha_caducidad))) {
        throw new Error('La fecha de caducidad no es válida.');
    }

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
    if (fecha_caducidad) {
        query += ' AND fecha_caducidad <= ?'; // Coincide exactamente con el nombre en la BD
        params.push(fecha_caducidad);
    }

    try {
        console.log('Parámetros de filtro:', { tipo, stockMin, stockMax, fecha_caducidad });
        const [rows] = await pool.query(query, params);
        return rows;
    } catch (error) {
        console.error('Error en filtrarSemillas:', error.message);
        throw new Error('Error al filtrar las semillas. Por favor, verifica los parámetros.');
    }
};

exports.contarSemillas = async () => {
    try {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM semillas');
        return rows[0].total;
    } catch (error) {
        console.error('Error en contarSemillas:', error.message);
        throw new Error('Error al contar las semillas.');
    }
};

exports.obtenerSemillasPaginadas = async (offset, limit) => {
    try {
        //const offsett = (offset - 1) * limit;
        const [rows] = await pool.query(
            'SELECT *, (SELECT COUNT(*) FROM semillas) as total FROM semillas LIMIT ? OFFSET ?;', 
          [limit, offset]
        );
        return rows;
    } catch (error) {
        console.error('Error en obtenerSemillasPaginadas:', error.message);
        throw new Error('Error al obtener las semillas paginadas.');
    }
};

// Agregar una nueva semilla
exports.agregarSemilla = async (nombre, tipo, stock, fecha_caducidad) => {
    try {
        // Validaciones
        if (!nombre || typeof nombre !== 'string') {
            throw new Error('El nombre de la semilla es obligatorio y debe ser una cadena.');
        }
        if (!tipo || typeof tipo !== 'string') {
            throw new Error('El tipo de semilla es obligatorio y debe ser una cadena.');
        }
        if (isNaN(stock) || stock < 0) {
            throw new Error('El stock debe ser un número positivo.');
        }
        if (!fecha_caducidad || isNaN(Date.parse(fecha_caducidad))) {
            throw new Error('La fecha de caducidad no es válida.');
        }

        console.log('Datos de la nueva semilla:', { nombre, tipo, stock, fecha_caducidad });

        const [result] = await pool.query(
            'INSERT INTO semillas (nombre, tipo, stock, fecha_caducidad) VALUES (?, ?, ?, ?)',
            [nombre, tipo, stock, fecha_caducidad] // Coincide exactamente con el nombre en la BD
        );
        return result.insertId;
    } catch (error) {
        console.error('Error en agregarSemilla:', error.message);
        throw new Error('Error al agregar la semilla. Verifica los datos proporcionados.');
    }
};

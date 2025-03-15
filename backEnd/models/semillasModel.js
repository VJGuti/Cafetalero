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

// Filtrar semillas
exports.filtrarSemillas = async (tipo, stockMin, stockMax, fecha_caducidad) => {
    let query = 'SELECT * FROM semillas WHERE 1=1';
    const params = [];

    // Validaciones previas a construir la consulta
    if (stockMin !== undefined && isNaN(stockMin)) {
        throw new Error('El valor de stockMin debe ser un número.');
    }
    if (stockMax !== undefined && isNaN(stockMax)) {
        throw new Error('El valor de stockMax debe ser un número.');
    }
    if (fecha_caducidad && isNaN(Date.parse(fecha_caducidad))) {
        throw new Error('La fecha de caducidad no es válida.');
    }

    // Construcción dinámica de la consulta
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

// Obtener semillas paginadas
exports.obtenerSemillasPaginadas = async (pagina, limite) => {
    try {
        // Validaciones
        if (isNaN(pagina) || pagina < 1) {
            throw new Error('El número de página debe ser un entero positivo.');
        }
        if (isNaN(limite) || limite < 1) {
            throw new Error('El límite debe ser un entero positivo.');
        }

        const offset = (pagina - 1) * limite;
        console.log('Parámetros de paginación:', { pagina, limite, offset });

        const [rows] = await pool.query(
            'SELECT * FROM semillas LIMIT ? OFFSET ?',
            [limite, offset]
        );
        return rows;
    } catch (error) {
        console.error('Error en obtenerSemillasPaginadas:', error.message);
        throw new Error('Error al obtener las semillas paginadas. Verifica los parámetros.');
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
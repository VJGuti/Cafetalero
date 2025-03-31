const pool = require('../db');

exports.registrarVenta = async (cliente_id, semilla_id, cantidad, fecha_venta) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO ventas (cliente_id, semilla_id, cantidad, fecha_venta) VALUES (?, ?, ?, ?)',
            [cliente_id, semilla_id, cantidad, fecha_venta]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error al registrar la venta:', error.message);
        throw new Error('Error al registrar la venta');
    }
};

exports.obtenerVentas = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT v.id, c.nombre AS cliente, s.nombre AS semilla, v.cantidad, v.fecha_venta 
            FROM ventas v
            JOIN clientes c ON v.cliente_id = c.id
            JOIN semillas s ON v.semilla_id = s.id
            ORDER BY v.fecha_venta DESC
        `);
        return rows;
    } catch (error) {
        console.error('Error al obtener todas las ventas:', error.message);
        throw new Error('Error al obtener todas las ventas');
    }
};

exports.obtenerVentasPorSemilla = async (semilla_id) => {
    try {
        // Validar que semilla_id sea un número
        if (!semilla_id || isNaN(semilla_id)) {
            throw new Error('ID de semilla inválido');
        }

        const [rows] = await pool.query(
            'SELECT * FROM ventas WHERE semilla_id = ?',
            [semilla_id]
        );

        return rows;
    } catch (error) {
        console.error('Error al obtener ventas por semilla:', error.message);
        throw new Error(`Error al obtener ventas por semilla: ${error.message}`);
    }
};

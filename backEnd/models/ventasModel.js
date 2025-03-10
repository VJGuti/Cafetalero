const pool = require('../db');

// Registrar una nueva venta
exports.registrarVenta = async (cliente_id, semilla_id, cantidad, fecha_venta) => {
    const [result] = await db.query(
        'INSERT INTO ventas (cliente_id, semilla_id, cantidad, fecha_venta) VALUES (?, ?, ?, ?)',
        [cliente_id, semilla_id, cantidad, fecha_venta]
    );
    return result.insertId;
};

// Obtener todas las ventas
exports.obtenerVentas = async () => {
    const [rows] = await db.query(`
        SELECT v.id, c.nombre AS cliente, s.nombre AS semilla, v.cantidad, v.fecha_venta 
        FROM ventas v
        JOIN clientes c ON v.cliente_id = c.id
        JOIN semillas s ON v.semilla_id = s.id
        ORDER BY v.fecha_venta DESC
    `);
    return rows;
};
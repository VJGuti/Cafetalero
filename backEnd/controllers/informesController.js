const db = require('../db');

// Generar informe de inventario
exports.generarInformeInventario = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM semillas');
        res.json(rows);
    } catch (error) {
        throw new Error('Error al generar el informe de inventario');
    }
};

// Generar informe de movimientos de inventario
exports.generarInformeMovimientos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM movimientos_inventario ORDER BY fecha_movimiento DESC');
        res.json(rows);
    } catch (error) {
        throw new Error('Error al generar el informe de movimientos');
    }
};

// Generar informe de ventas
exports.generarInformeVentas = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT v.id, c.nombre AS cliente, s.nombre AS semilla, v.cantidad, v.fecha_venta 
            FROM ventas v
            JOIN clientes c ON v.cliente_id = c.id
            JOIN semillas s ON v.semilla_id = s.id
            ORDER BY v.fecha_venta DESC
        `);
        res.json(rows);
    } catch (error) {
        throw new Error('Error al generar el informe de ventas');
    }
};
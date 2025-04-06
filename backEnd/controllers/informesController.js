const pool = require('../db');

exports.generarInformeInventario = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM semillas');
        res.json(rows);
    } catch (error) {
        throw new Error('Error al generar el informe de inventario');
    }
};

exports.generarInformeMovimientos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movimientos_inventario ORDER BY fecha_movimiento DESC');
        res.json(rows);
    } catch (error) {
        throw new Error('Error al generar el informe de movimientos');
    }
};

exports.generarInformeVentas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT v.id, v.cantidad, v.fecha_venta, c.nombre AS cliente_nombre, s.tipo as semilla_tipo FROM ventas v INNER JOIN clientes c ON v.cliente_id = c.id INNER JOIN semillas s ON v.semilla_id = s.id ORDER BY v.fecha_venta ASC;`);
        res.json(rows);
    } catch (error) {
        throw new Error('Error al generar el informe de ventas');
    }
};

exports.obtenerAlertas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM semillas 
            WHERE stock < 50 OR fecha_caducidad <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        `);
        res.json(rows);
    } catch (error) {
        throw new Error('Error al obtener alertas');
    }
};

exports.obtenerVentasPorSemilla = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.nombre AS semilla, SUM(v.cantidad) AS total_vendido
            FROM ventas v
            JOIN semillas s ON v.semilla_id = s.id
            GROUP BY s.nombre
        `);
        res.json(rows);
    } catch (error) {
        throw new Error('Error al obtener ventas por semilla');
    }
};

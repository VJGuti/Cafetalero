const pool = require('../db');

// Registrar una venta
exports.registrarVenta = async (req, res) => {
    const { cliente_id, semilla_id, cantidad_vendida, fecha_venta } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO ventas (cliente_id, semilla_id, cantidad_vendida, fecha_venta) VALUES (?, ?, ?, ?)',
            [cliente_id, semilla_id, cantidad_vendida, fecha_venta]
        );
        res.json({ message: 'Venta registrada exitosamente', ventaId: result.insertId });
    } catch (error) {
        console.error('Error al registrar la venta:', error.message);
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
};
exports.obtenerVentasPorSemilla = async (semillaId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ventas WHERE semilla_id = ?', [semillaId]);
        if (rows.length === 0) {
            throw new Error('No se encontraron ventas para esta semilla.');
        }
        return rows;
    } catch (error) {
        console.error('Error al obtener ventas por semilla:', error.message);
        throw new Error('Error al obtener ventas por semilla.');
    }
};
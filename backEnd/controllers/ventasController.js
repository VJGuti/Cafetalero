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
const db = require('../db');

// Registrar una venta
exports.registrarVenta = async (req, res) => {
    const { cliente_id, semilla_id, cantidad, fecha_venta } = req.body;

    // Validaciones
    if (!cliente_id || !semilla_id || !cantidad || !fecha_venta) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (cantidad <= 0) {
        return res.status(400).json({ error: 'La cantidad debe ser mayor que cero' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO ventas (cliente_id, semilla_id, cantidad, fecha_venta) VALUES (?, ?, ?, ?)',
            [cliente_id, semilla_id, cantidad, fecha_venta]
        );
        res.status(201).json({ id: result.insertId, cliente_id, semilla_id, cantidad, fecha_venta });
    } catch (error) {
        throw new Error('Error al registrar la venta');
    }
};
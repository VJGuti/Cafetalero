const db = require('../db');

exports.filtrarMovimientos = async (tipoMovimiento, fechaInicio, fechaFin, semillaId) => {
    let query = 'SELECT * FROM movimientos_inventario WHERE 1=1';
    const params = [];

    if (tipoMovimiento) {
        query += ' AND tipo_movimiento = ?';
        params.push(tipoMovimiento);
    }
    if (fechaInicio && fechaFin) {
        query += ' AND fecha_movimiento BETWEEN ? AND ?';
        params.push(fechaInicio, fechaFin);
    }
    if (semillaId) {
        query += ' AND semilla_id = ?';
        params.push(semillaId);
    }

    const [rows] = await db.query(query, params);
    return rows;
};
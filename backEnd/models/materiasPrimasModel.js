const pool = require('../db');

// Obtener todas las materias primas
exports.obtenerMateriasPrimas = async () => {
    const [rows] = await db.query('SELECT * FROM materias_primas');
    return rows;
};

// Agregar una nueva materia prima
exports.agregarMateriaPrima = async (nombre, cantidad, unidad_medida) => {
    const [result] = await db.query(
        'INSERT INTO materias_primas (nombre, cantidad, unidad_medida) VALUES (?, ?, ?)',
        [nombre, cantidad, unidad_medida]
    );
    return result.insertId;
};
// Obtener todo el inventario
exports.obtenerInventario = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM inventario');
        return rows;
    } catch (error) {
        console.error('Error al obtener el inventario:', error.message);
        throw new Error('Error al obtener el inventario');
    }
};
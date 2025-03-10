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
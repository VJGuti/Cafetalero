const pool = require('../db');

// Obtener todos los clientes
exports.obtenerClientes = async () => {
    const [rows] = await db.query('SELECT * FROM clientes');
    return rows;
};

// Agregar un nuevo cliente
exports.agregarCliente = async (nombre, email, telefono) => {
    const [result] = await db.query(
        'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
        [nombre, email, telefono]
    );
    return result.insertId;
};
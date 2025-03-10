const pool = require('../db'); // Importa la conexión a la base de datos

// Función para obtener un usuario por su correo electrónico
async function getUserByEmail(email) {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0]; // Devuelve el primer resultado o undefined si no hay coincidencias
    } catch (error) {
        console.error('Error en getUserByEmail:', error.message);
        throw error;
    }
}

// Función para obtener un usuario por su nombre de usuario
async function getUserByUsername(username) {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0]; // Devuelve el primer resultado o undefined si no hay coincidencias
    } catch (error) {
        console.error('Error en getUserByUsername:', error.message);
        throw error;
    }
}

module.exports = { getUserByEmail, getUserByUsername };
const db = require('../db');

// Buscar un usuario por nombre de usuario
async function getUserByUsername(username) {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

module.exports = { getUserByUsername };
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByUsername } = require('../models/userModel');
const logger = require('../logger');

// Inicio de sesión
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      logger.warn(`Intento fallido de inicio de sesión para el usuario: ${username}`);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logger.info(`Inicio de sesión exitoso para el usuario: ${username}`);
    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    logger.error(`Error durante el inicio de sesión: ${error.message}`);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
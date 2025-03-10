const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByUsername } = require('../models/userModel');
const logger = require('../logger');

// Middleware para autenticar el token JWT
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraer el token del encabezado "Bearer <token>"

  if (!token) {
    logger.warn('Acceso denegado. Token no proporcionado.');
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Token inválido o expirado.');
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = user; // Adjuntar los datos del usuario al objeto req
    next();
  });
};

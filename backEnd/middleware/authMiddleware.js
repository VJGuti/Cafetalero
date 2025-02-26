const jwt = require('jsonwebtoken');
const logger = require('../logger');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Acceso denegado: Token no proporcionado');
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Acceso denegado: Token inválido o expirado');
      return res.status(403).json({ error: 'Acceso denegado: Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};
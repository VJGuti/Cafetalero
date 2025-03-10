const jwt = require('jsonwebtoken');
const logger = require('../logger');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Acceso denegado. Token no proporcionado.');
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  logger.info(`Token recibido: ${token}`);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.error(`Error al verificar el token: ${err.message}`);
      logger.error(`Detalles del error: ${JSON.stringify(err)}`);
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }

    const currentTime = Math.floor(Date.now() / 1000); // Hora actual del servidor en segundos
    logger.info(`Hora actual del servidor: ${currentTime}`);
    logger.info(`Token válido. Usuario: ${user.username}, iat: ${user.iat}, exp: ${user.exp}`);

    if (currentTime < user.iat) {
      logger.warn(`La hora del servidor (${currentTime}) es anterior a iat (${user.iat}). Posible desincronización.`);
    }

    if (currentTime > user.exp) {
      logger.warn(`La hora del servidor (${currentTime}) es posterior a exp (${user.exp}). Token expirado.`);
    }

    req.user = user;
    next();
  });
};
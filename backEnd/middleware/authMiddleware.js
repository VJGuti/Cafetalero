const jwt = require('jsonwebtoken');
const logger = require('../logger');
require('dotenv').config();

exports.authenticateToken = (req, res, next) => {

  console.log('Todos los encabezados recibidos:', req.headers);

  const authHeader = req.headers['Authorization'] || req.headers['authorization'];
  console.log('Encabezado Authorization:', authHeader);

  if (!authHeader) {
    logger.warn('Acceso denegado. Encabezado Authorization no encontrado.');
    return res.status(401).json({ error: 'Acceso denegado. Encabezado Authorization no encontrado.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    logger.warn('Acceso denegado. Token no proporcionado.');
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  console.log('Token extraído:', token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.error(`Error al verificar el token: ${err.message}`);
      logger.error(`Detalles del error: ${JSON.stringify(err, null, 2)}`);
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }

    const currentTime = Math.floor(Date.now() / 1000); 
    logger.info(`Hora actual del servidor: ${currentTime}`);
    logger.info(`Token válido. Usuario: ${user.username}, iat: ${user.iat}, exp: ${user.exp}`);

    if (currentTime < user.iat) {
      logger.warn(`La hora del servidor (${currentTime}) es anterior a iat (${user.iat}). Posible desincronización.`);
      return res.status(403).json({ error: 'Token con fecha de emisión futura.' });
    }

    if (currentTime > user.exp) {
      logger.warn(`La hora del servidor (${currentTime}) es posterior a exp (${user.exp}). Token expirado.`);
      return res.status(403).json({ error: 'Token expirado.' });
    }

    if (user.username.toLowerCase() !== 'admin') { 
      logger.warn(`Acceso denegado. El usuario ${user.username} no tiene permisos de administrador.`);
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    req.user = user;
    next();
  });

  console.log('JWT_SECRET (verificación):', process.env.JWT_SECRET);
};

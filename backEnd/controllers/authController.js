const jwt = require('jsonwebtoken');
const logger = require('../logger');
require('dotenv').config();

exports.authenticateToken = (req, res, next) => {
  // Log para mostrar todos los encabezados recibidos
  console.log('Todos los encabezados recibidos:', req.headers);

  // Leer el encabezado "Authorization" (insensible a mayúsculas/minúsculas)
  const authHeader = req.headers['Authorization'] || req.headers['authorization'];
  console.log('Encabezado Authorization:', authHeader);

  // Verificar si el encabezado "Authorization" existe
  if (!authHeader) {
    logger.warn('Acceso denegado. Encabezado Authorization no encontrado.');
    return res.status(401).json({ error: 'Acceso denegado. Encabezado Authorization no encontrado.' });
  }

  // Extraer el token del encabezado "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    logger.warn('Acceso denegado. Token no proporcionado.');
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  // Log para mostrar el token extraído
  console.log('Token extraído:', token);

  // Verificar el token utilizando la clave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.error(`Error al verificar el token: ${err.message}`);
      logger.error(`Detalles del error: ${JSON.stringify(err, null, 2)}`);
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }

    // Log para mostrar la hora actual del servidor
    const currentTime = Math.floor(Date.now() / 1000); // Hora actual del servidor en segundos
    logger.info(`Hora actual del servidor: ${currentTime}`);
    logger.info(`Token válido. Usuario: ${user.username}, iat: ${user.iat}, exp: ${user.exp}`);

    // Validar que la hora actual esté dentro del rango de iat y exp
    if (currentTime < user.iat) {
      logger.warn(`La hora del servidor (${currentTime}) es anterior a iat (${user.iat}). Posible desincronización.`);
      return res.status(403).json({ error: 'Token con fecha de emisión futura.' });
    }

    if (currentTime > user.exp) {
      logger.warn(`La hora del servidor (${currentTime}) es posterior a exp (${user.exp}). Token expirado.`);
      return res.status(403).json({ error: 'Token expirado.' });
    }

    // Verificar si el usuario tiene el rol de "Admin"
    if (user.username.toLowerCase() !== 'admin') { // Comparación insensible a mayúsculas/minúsculas
      logger.warn(`Acceso denegado. El usuario ${user.username} no tiene permisos de administrador.`);
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    // Adjuntar los datos del usuario al objeto req
    req.user = user;
    next();
  });

  // Log para mostrar la clave secreta utilizada en la verificación
  console.log('JWT_SECRET (verificación):', process.env.JWT_SECRET);
};
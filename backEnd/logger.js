const winston = require('winston');

// Función para formatear la fecha y hora
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Configuración del logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Formato personalizado de fecha y hora
    customFormat // Aplicar el formato personalizado
  ),
  transports: [
    new winston.transports.Console(), // Salida a la consola
    new winston.transports.File({ filename: 'app.log' }), // Salida a un archivo
  ],
});

module.exports = logger;
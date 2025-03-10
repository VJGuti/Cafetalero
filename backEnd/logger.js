const winston = require('winston');
const moment = require('moment-timezone'); // Biblioteca para manejar zonas horarias

// Función para formatear la fecha y hora en la zona horaria de Caracas
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${JSON.stringify(message)}`;
});

// Configuración del logger
const logger = winston.createLogger({
  level: 'info', // Nivel mínimo de logs a registrar
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => moment().tz('America/Caracas').format('YYYY-MM-DD HH:mm:ss [UTC-4]') // Formato con zona horaria de Caracas
    }),
    customFormat // Aplicar el formato personalizado
  ),
  transports: [
    new winston.transports.Console({ // Salida a la consola
      format: winston.format.combine(
        winston.format.colorize(), // Agregar colores para mejorar la legibilidad en la consola
        customFormat
      )
    }),
    new winston.transports.File({ filename: 'app.log' }) // Salida a un archivo
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' }) // Archivo separado para excepciones
  ]
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  logger.error(`Excepción no capturada: ${err.message}`);
  process.exit(1); // Detener el servidor en caso de errores críticos
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Rechazo no manejado en la promesa: ${reason}`);
  process.exit(1); // Detener el servidor en caso de errores críticos
});

module.exports = logger;
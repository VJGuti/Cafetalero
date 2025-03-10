require('dotenv').config(); // Carga las variables del archivo .env

const express = require('express');
const cors = require('cors');
const logger = require('./logger'); // Importar Winston para logging
const db = require('../backEnd/db'); // Conexión a MySQL
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const { authenticateToken } = require('./controllers/authController'); // Middleware de autenticación
const inventarioRoutes = require('./routes/inventarioRoutes');
const ventasRoutes = require('./routes/ventasRoutes');
const informesRoutes = require('./routes/informesRoutes');
const errorHandler = require('./middleware/errorMiddleware');

// Acceder a las variables de entorno
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT || 5000;

// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Solo permite solicitudes desde el frontend
  credentials: true, // Habilita el envío de cookies o tokens en las solicitudes
}));
app.use(express.json());

// Logging inicial
logger.info(`Conectando a la base de datos en ${DB_HOST} con el usuario ${DB_USER}`);

// Prueba de conexión a la base de datos
db.query('SELECT 1 + 1 AS result')
  .then(([rows]) => {
    logger.info('Conexión exitosa a la base de datos');
    logger.info(`Resultado de la prueba de conexión: ${rows[0].result}`);
  })
  .catch((err) => {
    logger.error(`Error al conectar a la base de datos: ${err.message}`);
    process.exit(1); // Detener el servidor si no se puede conectar a la base de datos
  });


// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/api/inventario', authenticateToken, inventarioRoutes); // Proteger rutas de inventario
app.use('/api/ventas', authenticateToken, ventasRoutes); // Proteger rutas de ventas
app.use('/api/informes', authenticateToken, informesRoutes); // Proteger rutas de informes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

// Log para verificar la clave secreta JWT (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
}

// Ruta protegida de ejemplo
app.get('/admin', authenticateToken, (req, res) => {
  logger.info(`Acceso concedido a la ruta /admin para el usuario con ID: ${req.user.userId}`);
  res.json({ message: 'Bienvenido, administrador', user: req.user });
});

// Middleware de errores
app.use(errorHandler);

// Manejo de errores no manejados
app.use((err, req, res, next) => {
  logger.error(`Error no manejado: ${err.message}`);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Listeners para errores no capturados
process.on('uncaughtException', (err) => {
  logger.error(`Excepción no capturada: ${err.message}`);
  process.exit(1); // Detener el servidor en caso de errores críticos
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Rechazo no manejado en la promesa: ${reason}`);
  process.exit(1); // Detener el servidor en caso de errores críticos
});

// Iniciar el servidor
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
});

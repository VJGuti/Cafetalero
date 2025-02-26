require('dotenv').config(); // Carga las variables del archivo .env

const express = require('express');
const cors = require('cors');
const logger = require('./backEnd/logger'); // Importar Winston para logging
const db = require('./backEnd/db'); // Conexión a MySQL
const authRoutes = require('./backEnd/routes/authRoutes'); // Rutas de autenticación
const { authenticateToken } = require('./backEnd/middleware/authMiddleware'); // Middleware de autenticación
const inventarioRoutes = require('./backEnd/routes/inventarioRoutes');
const ventasRoutes = require('./backEnd/routes/ventasRoutes');
const informesRoutes = require('./backEnd/routes/informesRoutes');
const errorHandler = require('./backEnd/middleware/errorMiddleware');

// Acceder a las variables de entorno
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT || 3000;

// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging inicial
logger.info(`Conectando a la base de datos en ${DB_HOST} con el usuario ${DB_USER}`);

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/api/inventario', authenticateToken, inventarioRoutes); // Proteger rutas de inventario
app.use('/api/ventas', authenticateToken, ventasRoutes); // Proteger rutas de ventas
app.use('/api/informes', authenticateToken, informesRoutes); // Proteger rutas de informes

// Ruta protegida de ejemplo
app.get('/admin', authenticateToken, (req, res) => {
  logger.info(`Acceso concedido a la ruta /admin para el usuario: ${req.user.username}`);
  res.json({ message: 'Bienvenido, administrador', user: req.user });
});

// Middleware de errores
app.use(errorHandler);

// Manejo de errores no manejados
app.use((err, req, res, next) => {
  logger.error(`Error no manejado: ${err.message}`);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
});
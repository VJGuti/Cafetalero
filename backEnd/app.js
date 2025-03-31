require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const logger = require('./logger'); 
const db = require('../backEnd/db'); 
const authRoutes = require('./routes/authRoutes'); 
const { authenticateToken } = require('./middleware/authMiddleware.js');
const inventarioRoutes = require('./routes/inventarioRoutes');
const ventasRoutes = require('./routes/ventasRoutes');
const informesRoutes = require('./routes/informesRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT || 5000;

const app = express();


app.use(cors(
  {
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
));
app.use(express.json());

logger.info(`Conectando a la base de datos en ${DB_HOST} con el usuario ${DB_USER}`);

db.query('SELECT 1 + 1 AS result')
  .then(([rows]) => {
    logger.info('Conexión exitosa a la base de datos');
    logger.info(`Resultado de la prueba de conexión: ${rows[0].result}`);
  })
  .catch((err) => {
    logger.error(`Error al conectar a la base de datos: ${err.message}`);
    process.exit(1); 
  });

// Rutas
app.use('/auth', authRoutes); 
app.use('/api/inventario', inventarioRoutes); 
app.use('/api/ventas', ventasRoutes); 
app.use('/api/informes',informesRoutes); 
app.use('/api/clientes', clientesRoutes);
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
});

if (process.env.NODE_ENV !== 'production') {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
}

app.get('/admin', authenticateToken, (req, res) => {
  logger.info(`Acceso concedido a la ruta /admin para el usuario con ID: ${req.user.userId}`);
  res.json({ message: 'Bienvenido, administrador', user: req.user });
});

app.use(errorHandler);

app.use((err, req, res, next) => {
  logger.error(`Error no manejado: ${err.message}`);
  res.status(500).json({ error: 'Error interno del servidor' });
});

process.on('uncaughtException', (err) => {
  logger.error(`Excepción no capturada: ${err.message}`);
  process.exit(1); 
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Rechazo no manejado en la promesa: ${reason}`);
  process.exit(1); 
});

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
});

require('dotenv').config();  // Carga las variables del archivo .env

const express = require('express');
const cors = require('cors');

// Acceder a las variables de entorno
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT;

const inventarioRoutes = require('./backEnd/routes/inventarioRoutes');
const ventasRoutes = require('./backEnd/routes/ventasRoutes');
const informesRoutes = require('./backEnd/routes/informesRoutes');
const errorHandler = require('./backEnd/middleware/errorMiddleware');

// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/inventario', inventarioRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/informes', informesRoutes);

// Middleware de errores
app.use(errorHandler);


console.log(`Conectando a la base de datos en ${DB_HOST} con el usuario ${DB_USER}`);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

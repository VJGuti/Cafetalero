require('dotenv').config();  // Carga las variables del archivo .env

const express = require('express');
const cors = require('cors');

// Acceder a las variables de entorno
const PORT = process.env.PORT || 5000; // Usa el puerto definido en .env o un valor por defecto
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;

const inventarioRoutes = require('./routes/inventarioRoutes');
const ventasRoutes = require('./routes/ventasRoutes');
const informesRoutes = require('./routes/informesRoutes');
const errorHandler = require('./middleware/errorMiddleware');

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


console.log(`Conectando a la base de datos en ${dbHost} con el usuario ${dbUser}`);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

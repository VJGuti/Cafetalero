const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/userModel');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Correo electrónico recibido:', email); // Imprime el correo electrónico
        console.log('Contraseña recibida:', password); // Imprime la contraseña

        // Verifica que se proporcionen credenciales
        if (!email || !password) {
            return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
        }

        // Busca al usuario en la base de datos por su correo electrónico
        const user = await getUserByEmail(email);
        console.log('Usuario encontrado en la base de datos:', user); // Imprime el usuario encontrado

        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Prueba de comparación de contraseñas (para depuración)
        const plainPassword = 'mypassword*'; // Contraseña en texto plano
        const storedHash = user.password_hash; // Hash almacenado en la base de datos

        bcrypt.compare(plainPassword, storedHash, (err, isMatch) => {
            if (err) {
                console.error('Error al comparar contraseñas:', err.message);
            } else {
                console.log('Resultado de la comparación (prueba):', isMatch);
            }
        });

        // Compara la contraseña usando await
        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Resultado de la comparación de contraseñas:', isMatch); // Imprime el resultado

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Fechas específicas en segundos
        const iat = 1735689600; // 1 de enero de 2025
        const exp = 1830489600; // 1 de enero de 2028

        // Genera un token JWT con fechas específicas
        const token = jwt.sign(
            { userId: user.id, iat, exp }, // Incluir iat y exp en el payload
            process.env.JWT_SECRET
        );

        console.log('Token generado:', token);

        // Envía el token como respuesta
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error en /auth/login:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
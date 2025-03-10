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

        // Compara la contraseña usando await
        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Resultado de la comparación de contraseñas:', isMatch); // Imprime el resultado

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Genera un token JWT con una duración de 3 años
        const token = jwt.sign(
          { userId: user.id, username: user.username }, // Incluir el ID y nombre de usuario en el payload
          process.env.JWT_SECRET,
          { expiresIn: '3y' } // Duración del token: 3 años
        );

        console.log('JWT_SECRET:', process.env.JWT_SECRET); // Imprime la clave secreta
        console.log('Token generado:', token); // Imprime el token generado

        // Envía el token como respuesta
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error en /auth/login:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

console.log('JWT_SECRET (generación):', process.env.JWT_SECRET);

module.exports = router;
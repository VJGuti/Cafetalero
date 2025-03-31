const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/userModel');
require('dotenv').config();

exports.authLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Correo electrónico recibido:', email);
        console.log('Contraseña recibida:', password); 

        if (!email || !password) {
            return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
        }

        const user = await getUserByEmail(email);
        console.log('Usuario encontrado en la base de datos:', user); 
        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Resultado de la comparación de contraseñas:', isMatch); 

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }


        const token = jwt.sign(
          { userId: user.id, username: user.username }, 
          process.env.JWT_SECRET,
          { expiresIn: '3y' });

        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        console.log('Token generado:', token);

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error en /auth/login:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

console.log('JWT_SECRET (generación):', process.env.JWT_SECRET);

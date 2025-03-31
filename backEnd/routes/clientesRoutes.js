// routes/clientes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware.js');
router.get('/todos', authenticateToken ,async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener clientes:', error.message);
        res.status(500).json({ error: 'Error al obtener los clientes.' });
    }
});

module.exports = router;

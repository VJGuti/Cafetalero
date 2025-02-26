const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log del error en la consola
    res.status(500).json({ error: 'Ocurrió un error en el servidor', details: err.message });
};

module.exports = errorHandler;
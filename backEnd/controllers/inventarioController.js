const semillasModel = require('../models/semillasModel');
const materiasPrimas = require('../models/materiasPrimasModel')
const Joi = require('joi');
const pool = require('../db');

const semillaSchema = Joi.object({
    nombre: Joi.string().required(),
    tipo: Joi.string().valid('Arábica', 'Robusta', 'Liberica', 'Excelsa').required(),
    stock: Joi.number().min(0).required(),
    fecha_caducidad: Joi.date().iso().required()
});

exports.obtenerSemillas = async (req, res) => {
    try {
        const semillas = await semillasModel.obtenerSemillas()
        return res.json(semillas);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Error al obtener las semillas' });
    }
};

exports.editarSemilla = async (req, res) => {
  try {
   const { id } = req.params
   const { error } = semillaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { nombre, tipo, stock, fecha_caducidad } = req.body; 

    const actualizarSemilla = await semillasModel.editarSemillaPorId(id, {nombre, tipo, stock, fecha_caducidad})

    if(actualizarSemilla.success = true) {
      return res.status(200).json({message: 'Se ha actualizado la semilla'})
    }

  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Error al obtener las semillas' });
  }
}

exports.agregarSemilla = async (req, res) => {

    const { error } = semillaSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { nombre, tipo, stock, fecha_caducidad } = req.body;

    try {

        const id = await semillasModel.agregarSemilla(nombre, tipo, stock, fecha_caducidad);
        res.status(201).json({ id, nombre, tipo, stock, fecha_caducidad });
    } catch (error) {
        console.error(error); // Registrar el error para depuración
        res.status(500).json({ error: 'Error al agregar la semilla' });
    }
};


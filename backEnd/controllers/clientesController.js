const clientesModel = require('../models/clientesModel.js')
exports.agregarCliente = async (req, res) => {
    try {
    const { nombre, email, telefono } = req.body;
  
     if(!nombre, !email, !telefono) {
    return res.status(400).json({message: 'Todos los datos deben estar presentes'})
  }
    const agregarCliente = await clientesModel.agregarCliente(nombre, email, telefono);
      if(agregarCliente.success === true) {
        return res.status(200).json({message: agregarCliente.result})
      }
  } catch (error) {
      console.error(error); 
      return res.status(500).json({ error: 'Error al crear el cliente' }); 
  }
}

exports.editarCliente = async (req, res) => {
  try {
   const { id } = req.params
   const { nombre, email, telefono } = req.body;

    if (!nombre || !email || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const actualizarCliente = await clientesModel.editarCliente(id, nombre, email, telefono)

    if(actualizarCliente.success = true) {
      return res.status(200).json({message: 'Se ha actualizado el cliente'})
    } 
  }catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
 }

exports.eliminarCliente = async (req, res) => {
  const { id } = req.params
  const idDelete = await clientesModel.eliminarCliente(id)
  if (idDelete.success === true) {
    return res.status(200).json({message: `${idDelete.message}` })
  } else {
    return res.status(404).json({message: `${idDelete.message}`})
  }  
}










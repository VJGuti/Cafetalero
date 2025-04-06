const pool = require('../db');

// Obtener todos los clientes
exports.obtenerClientes = async () => {
    const [rows] = await pool.query('SELECT * FROM clientes');
    return rows;
};

// Agregar un nuevo cliente
exports.agregarCliente = async (nombre, email, telefono) => {
    const [result] = await pool.query(
        'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
        [nombre, email, telefono]
    );
    return {
    result: result.insertId,
    success: true
    }
};

exports.editarCliente = async (id, nombre, email, telefono) => {
  try {
    const query = `
      UPDATE clientes
      SET nombre = ?, 
          email = ?, 
          telefono = ?
      WHERE id = ?;
    `;
    const values = [nombre, email, telefono, id];
    const [result] = await pool.query(query, values);
    
    if (result.affectedRows > 0) {
      return { 
        success: true, 
        message: 'Cliente actualizado correctamente',
        affectedRows: result.affectedRows
      };
    } else {
      return { 
        success: false, 
        message: 'No se encontró el cliente con el ID especificado'
      };
    } 
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    return {
      success: false,
      message: 'Error al actualizar el cliente',
      error: error.message
    };
  }
}

exports.eliminarCliente = async (id) => {
  try {
    if (!id || typeof id !== 'string') {
      throw new Error('Debe ingresar el Id para eliminar');
    } 

    const [result] = await pool.query('DELETE FROM clientes WHERE id = ? ', [id])
      if (result.affectedRows > 0) {
      return { 
        success: true, 
        message: 'Cliente eliminado correctamente',
        affectedRows: result.affectedRows
      };
    } else {
      return {
        success: false, 
        message: 'No se encontró el cliente con el ID especificado'
      };
    } 
  }catch (error) {
     console.error('Error al eliminar el cliente:', error);
     return {
      success: false,
      message: 'Error al actualizar el cliente',
      error: error.message
    };
  }
}

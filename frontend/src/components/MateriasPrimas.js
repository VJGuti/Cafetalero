import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MateriasPrimas() {
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [nuevaMateria, setNuevaMateria] = useState({ nombre: '', cantidad: '', unidad_medida: '' });

    useEffect(() => {
        axios.get('http://localhost:5000/api/materias-primas')
            .then(response => setMateriasPrimas(response.data))
            .catch(error => console.error('Error al cargar materias primas:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/materias-primas', nuevaMateria);
            setNuevaMateria({ nombre: '', cantidad: '', unidad_medida: '' });
            // Recargar la lista de materias primas
            const response = await axios.get('http://localhost:5000/api/materias-primas');
            setMateriasPrimas(response.data);
        } catch (error) {
            console.error('Error al agregar materia prima:', error);
        }
    };

    return (
        <div>
            <h2>Materias Primas</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nuevaMateria.nombre}
                    onChange={(e) => setNuevaMateria({ ...nuevaMateria, nombre: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Cantidad"
                    value={nuevaMateria.cantidad}
                    onChange={(e) => setNuevaMateria({ ...nuevaMateria, cantidad: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Unidad de Medida"
                    value={nuevaMateria.unidad_medida}
                    onChange={(e) => setNuevaMateria({ ...nuevaMateria, unidad_medida: e.target.value })}
                />
                <button type="submit">Agregar</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Unidad de Medida</th>
                    </tr>
                </thead>
                <tbody>
                    {materiasPrimas.map(mp => (
                        <tr key={mp.id}>
                            <td>{mp.nombre}</td>
                            <td>{mp.cantidad}</td>
                            <td>{mp.unidad_medida}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MateriasPrimas;
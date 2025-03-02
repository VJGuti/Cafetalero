import React from 'react';
import axios from 'axios';

function Factura({ ventaId }) {
    const descargarFactura = async () => {
        try {
            const response = await axios({
                url: `http://localhost:5000/api/ventas/${ventaId}/factura`,
                method: 'GET',
                responseType: 'blob' // Importante para manejar archivos binarios
            });

            // Crear un enlace temporal para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'factura.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error al descargar la factura:', error);
        }
    };

    return (
        <div>
            <button onClick={descargarFactura}>Descargar Factura</button>
        </div>
    );
}

export default Factura;
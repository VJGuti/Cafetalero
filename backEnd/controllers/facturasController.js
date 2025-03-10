const pdfMake = require('pdfmake');
const pool = require('../db');

// Configuración de fuentes para pdfmake
const fonts = {
    Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

const printer = new pdfMake(fonts);

// Generar factura
exports.generarFactura = async (req, res) => {
    const ventaId = req.params.id;

    try {
        // Obtener datos de la venta
        const [venta] = await db.query(`
            SELECT v.id, c.nombre AS cliente, s.nombre AS semilla, v.cantidad, v.fecha_venta 
            FROM ventas v
            JOIN clientes c ON v.cliente_id = c.id
            JOIN semillas s ON v.semilla_id = s.id
            WHERE v.id = ?
        `, [ventaId]);

        if (venta.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const facturaData = venta[0];

        // Definir contenido del PDF
        const documentDefinition = {
            content: [
                { text: 'Factura', style: 'header' },
                { text: `ID de Venta: ${facturaData.id}`, style: 'subheader' },
                { text: `Cliente: ${facturaData.cliente}`, style: 'subheader' },
                { text: `Semilla: ${facturaData.semilla}`, style: 'subheader' },
                { text: `Cantidad: ${facturaData.cantidad}`, style: 'subheader' },
                { text: `Fecha: ${facturaData.fecha_venta}`, style: 'subheader' }
            ],
            styles: {
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
                subheader: { fontSize: 14, margin: [0, 5, 0, 5] }
            }
        };

        // Generar PDF
        const pdfDoc = printer.createPdfKitDocument(documentDefinition);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');
        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar la factura' });
    }
};
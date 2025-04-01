// cypress/e2e/formulario-validacion.spec.js

describe('Test de formulario de inventario', () => {
    beforeEach(() => {
      // Realizar el login antes de cada test
      cy.visit('/login');
      cy.get('input[type="email"]').type('admin@example.com');
      cy.get('input[type="password"]').type('mypassword*');
      cy.get('button[type="submit"]').click();
      
      // Visitar la página con el formulario (por ejemplo, /inventario)
      cy.visit('/inventario');
      
      // Abrir el formulario (si está dentro de una modal)
      cy.contains('button', 'Agregar').click();
    });
  
    it('Debe validar la limitación de tipos de datos de entrada', () => {
      // Intentar ingresar un valor inválido en el campo "Stock"
      cy.get('input[name="stock"]').type('abc');
      cy.get('input[name="stock"]').should('have.value', ''); // El campo debe rechazar caracteres no numéricos
      
      // Intentar ingresar un correo electrónico inválido en un campo hipotético
      cy.get('input[name="correo"]').type('correo-invalido');
      cy.get('input[name="correo"]').then(($input) => {
        expect($input[0].checkValidity()).to.be.false; // El campo debe ser inválido
      });
    });
  
    it('Debe enviar el formulario correctamente', () => {
      // Llenar el formulario con datos válidos
      cy.get('input[name="nombre"]').type('Semilla de Prueba');
      cy.get('select[name="tipo"]').select('arabica'); // Asumiendo un campo <select> para el tipo
      cy.get('input[name="stock"]').type('50');
      cy.get('input[name="fecha_caducidad"]').type('2024-12-31');
      
      // Intercepta la llamada POST al enviar el formulario
      cy.intercept('POST', '/api/inventario/semillas').as('enviarFormulario');
      
      // Enviar el formulario
      cy.contains('button', 'Guardar').click();
      
      // Esperar a que se complete la llamada POST
      cy.wait('@enviarFormulario').then((interception) => {
        // Verificar que la respuesta tiene el estado esperado
        expect(interception.response.statusCode).to.eq(201); // Código de creación exitosa
      });
      
      // Verificar que el formulario se cierra después de enviar
      cy.get('.modal').should('not.exist'); // Ajusta el selector según tu implementación de modal
    });
  });
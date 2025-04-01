describe('Test de navegación interna con ventana modal', () => {
    beforeEach(() => {
      // Realizar el login antes de cada test
      cy.visit('/login');
      cy.get('input[type="email"]').type('admin@example.com');
      cy.get('input[type="password"]').type('mypassword*');
      cy.get('button[type="submit"]').click();
      
      // Visitar la página donde está la modal (por ejemplo, /inventario)
      cy.visit('/inventario');
    });
  
    it('Debe abrir la ventana modal al hacer clic en el botón "Agregar"', () => {
      // Hacer clic en el botón "Agregar"
      cy.contains('button', 'Agregar').click();
      
      // Verificar que la modal está visible
      cy.get('.modal').should('be.visible'); // Ajusta el selector según tu implementación de modal
      cy.contains('h2', 'Agregar Semilla').should('be.visible'); // Ajusta el texto según tu aplicación
    });
  
    it('Debe cerrar la ventana modal al hacer clic en el botón de cierre', () => {
      // Abrir la modal
      cy.contains('button', 'Agregar').click();
      
      // Hacer clic en el botón de cierre (asumiendo que hay un botón con el texto "Cerrar")
      cy.contains('button', 'Cerrar').click(); // Ajusta el texto o selector según tu aplicación
      
      // Verificar que la modal ya no está visible
      cy.get('.modal').should('not.exist'); // Ajusta el selector según tu implementación de modal
    });
  });
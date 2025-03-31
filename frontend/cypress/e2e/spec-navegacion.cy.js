// cypress/e2e/inventario-navegacion.spec.js

describe('Test de navegación de la vista de Inventario', () => {
  beforeEach(() => {
    // Realizar el login antes de cada test
    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('mypassword*');
    cy.get('button[type="submit"]').click();
    
    // Verificar que el login fue exitoso (asumiendo redirección al dashboard o página principal)
    cy.url().should('not.include', '/login');
    
    // Interceptar la llamada a la API
    cy.intercept('GET', '/api/inventario/semillas', { fixture: 'semillas.json' }).as('getSemillas');
    
    // Visitar la página de inventario
    cy.visit('/inventario');
  });

  it('Debe cargar correctamente la página de inventario', () => {
    // Verificar que la página ha cargado correctamente
    cy.contains('h1', 'Inventario de Semillas de Café').should('be.visible');
    
    // Esperar a que se complete la llamada a la API
    cy.wait('@getSemillas');
    
    // Verificar que no hay estado de carga
    cy.contains('Cargando inventario...').should('not.exist');
  });

  it('Debe mostrar todos los elementos de la interfaz', () => {
    // Verificar elementos del encabezado
    cy.get('input[placeholder="Buscar semillas..."]').should('be.visible');
    cy.contains('button', 'Filtrar').should('be.visible');
    cy.get('select').should('be.visible');
    cy.contains('button', 'Agregar').should('be.visible');
    
    // Verificar la tabla
    cy.get('table').within(() => {
      cy.contains('th', 'Nombre').should('be.visible');
      cy.contains('th', 'Tipo').should('be.visible');
      cy.contains('th', 'Stock').should('be.visible');
      cy.contains('th', 'Fecha de Caducidad').should('be.visible');
      cy.contains('th', 'Acciones').should('be.visible');
    });
  });

  it('Debe filtrar por nivel de stock "alto"', () => {
    // Esperar a que los datos se carguen
    cy.wait('@getSemillas');
    
    // Seleccionar la opción "Alto" del filtro de stock
    cy.get('select').select('alto');
    
    // Verificar que solo se muestran semillas con stock > 100
    cy.get('tbody tr').each(($row) => {
      // Extraer el texto de la celda de stock
      const stockText = $row.find('td').eq(2).text();
      
      // Extraer solo el número del texto (ejemplo: "150 unidades" -> 150)
      const stockNumber = parseInt(stockText);
      
      // Verificar que el stock es mayor a 100
      expect(stockNumber).to.be.greaterThan(100);
    });
  });

  it('Debe mostrar los datos correctamente desde la API', () => {
    // Esperar a que los datos se carguen
    cy.wait('@getSemillas');
    
    // Verificar que hay al menos una fila en la tabla
    cy.get('tbody tr').should('have.length.at.least', 1);
    
    // Verificar que cada fila tiene los botones de acción correctos
    cy.get('tbody tr').first().within(() => {
      cy.contains('button', 'Editar').should('be.visible');
      cy.contains('button', 'Eliminar').should('be.visible');
    });
  });
});

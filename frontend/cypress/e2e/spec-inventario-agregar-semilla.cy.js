// cypress/e2e/spec-inventario-agregar-semilla.cy.js

describe('Agregar semillas al inventario', () => {
  // Variables para almacenar datos del test
  const credentials = {
    email: 'admin@example.com',
    password: 'mypassword*'
  };
  
  const newSeedData = {
    nombre: 'Café Robusta Premium',
    tipo: 'Robusta',
    stock: 100,
    fecha_caducidad: '2025-12-31'
  };

  beforeEach(() => {
    // Login antes de cada test
    cy.visit('http://localhost:3000/login');
    cy.get('input[type="email"]').type(credentials.email);
    cy.get('input[type="password"]').type(credentials.password);
    cy.get('button[type="submit"]').click();
    
    // Esperar redirección a la página principal después del login
    cy.url().should('eq', 'http://localhost:3000/');
    
    // Navegar explícitamente a la página de inventario
    cy.visit('http://localhost:3000/inventario');
    
    // Esperar a que los datos se carguen
    //cy.get('table').should('be.visible');
    //cy.get('tbody tr').should('have.length.gt', 0);
  });

  it('Debe abrir el modal para agregar una nueva semilla', () => {
    // Hacer clic en el botón para agregar una semilla
    cy.get('button:contains("Agregar")').click();
    
    // Verificar que el modal está visible
    cy.get('.fixed.inset-0').should('be.visible');
    cy.get('.fixed.inset-0 h2').should('contain', 'Agregar Semilla de Café');
  });

  it('Debe agregar una nueva semilla y actualizar la tabla', () => {
    // Intercept la petición POST para agregar una semilla
    cy.intercept('POST', '/api/inventario/semillas').as('addSemilla');
    
    // Hacer clic en el botón para agregar una semilla
    cy.get('button:contains("Agregar")').click();
    
    // Verificar que el modal está visible
    cy.get('.fixed.inset-0').should('be.visible');
    
    // Completar el formulario con los datos de la nueva semilla
    cy.get('[data-cy="input-nombre"]').type(newSeedData.nombre);
    cy.get('[data-cy="select-tipo"]').select(newSeedData.tipo);
    cy.get('[data-cy="input-stock"]').type(newSeedData.stock);
    cy.get('[data-cy="input-fecha-caducidad"]').type(newSeedData.fecha_caducidad);
    
    // Hacer clic en el botón para agregar la semilla
    cy.get('[data-cy="btn-agregar"]').click();
    
    // Esperar a que se complete la petición de agregar
    cy.wait('@addSemilla').its('response.statusCode').should('eq', 201);
    
    // Verificar que el modal se ha cerrado
    cy.get('.fixed.inset-0').should('not.exist');
    
    // Verificar que la nueva semilla aparece en la tabla
    cy.get('tbody tr').should('contain', newSeedData.nombre);
    cy.get('tbody tr').should('contain', newSeedData.tipo);
    cy.get('tbody tr').should('contain', newSeedData.stock);
  });

  it('Debe mostrar errores de validación cuando faltan campos requeridos', () => {
    // Hacer clic en el botón para agregar una semilla
    cy.get('button:contains("Agregar")').click();
    
    // Verificar que el modal está visible
    cy.get('.fixed.inset-0').should('be.visible');
    
    // No completar ningún campo e intentar enviar el formulario
    cy.get('[data-cy="btn-agregar"]').click();
    
    // Verificar que aparecen mensajes de error
    cy.get('.text-red-500').should('exist');
    cy.get('.text-red-500').should('contain', 'El nombre es obligatorio');
    cy.get('.text-red-500').should('contain', 'El stock debe ser mayor a 0');
    
    // Verificar que el modal sigue abierto
    cy.get('.fixed.inset-0').should('be.visible');
  });

  it('Debe mostrar un mensaje de error si la petición falla', () => {
    // Simular un error en la petición POST
    cy.intercept('POST', '/api/inventario/semillas', {
      statusCode: 500,
      body: { success: false, message: 'Error del servidor' }
    }).as('addSemillaError');
    
    // Hacer clic en el botón para agregar una semilla
    cy.get('button:contains("Agregar")').click();
    
    // Verificar que el modal está visible
    cy.get('.fixed.inset-0').should('be.visible');
    
    // Completar el formulario con los datos de la nueva semilla
    cy.get('[data-cy="input-nombre"]').type(newSeedData.nombre);
    cy.get('[data-cy="select-tipo"]').select(newSeedData.tipo);
    cy.get('[data-cy="input-stock"]').type(newSeedData.stock);
    
    // Hacer clic en el botón para agregar la semilla
    cy.get('[data-cy="btn-agregar"]').click();
    
    // Esperar a que se complete la petición
    cy.wait('@addSemillaError');
    
    // Verificar que aparece un mensaje de error
    cy.get('[role="alert"]').should('be.visible');
    cy.get('[role="alert"]').should('contain', 'Error del servidor');
    
    // Verificar que el modal sigue abierto
    cy.get('.fixed.inset-0').should('be.visible');
  });

  it('Debe poder cancelar la adición sin realizar cambios', () => {
    // Recordar el número de filas antes de abrir el modal
    let rowCountBefore;
    cy.get('tbody tr').then($rows => {
      rowCountBefore = $rows.length;
    });
    
    // Hacer clic en el botón para agregar una semilla
    cy.get('button:contains("Agregar")').click();
    
    // Verificar que el modal está visible
    cy.get('.fixed.inset-0').should('be.visible');
    
    // Completar parcialmente el formulario
    cy.get('[data-cy="input-nombre"]').type('Esta semilla no debería agregarse');
    
    // Hacer clic en el botón para cancelar
    cy.get('[data-cy="btn-cancelar"]').click();
    
    // Verificar que el modal se ha cerrado
    cy.get('.fixed.inset-0').should('not.exist');
    
    // Verificar que el número de filas no ha cambiado
    cy.get('tbody tr').then($rows => {
      expect($rows.length).to.equal(rowCountBefore);
    });
    
    // Verificar que la semilla no aparece en la tabla
    cy.get('tbody').should('not.contain', 'Esta semilla no debería agregarse');
  });
});

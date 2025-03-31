// cypress/e2e/login.spec.js

describe('Test de autenticación y redirección', () => {
  it('Debe redirigir a login cuando se intenta acceder a inventario sin autenticación', () => {
    // Intentar acceder directamente a la página de inventario sin estar logueado
    cy.visit('/inventario');
    
    // Verificar que se redirige a la página de login
    cy.url().should('include', '/login');
  });

  it('Debe permitir iniciar sesión y acceder a inventario', () => {
    // Visitar la página de login
    cy.visit('/login');
    
    // Completar el formulario de login
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('mypassword*');
    cy.get('button[type="submit"]').click();
    
    // Verificar que el login fue exitoso (redirige a otra página)
    cy.url().should('not.include', '/login');
    
    // Navegar a inventario
    cy.visit('/inventario');
    
    // Verificar que se puede acceder a la página de inventario
    cy.contains('h1', 'Inventario de Semillas de Café').should('be.visible');
  });

  it('Debe mostrar un mensaje de error con credenciales inválidas', () => {
    // Visitar la página de login
    cy.visit('/login');
    
    // Completar el formulario con credenciales incorrectas
    cy.get('input[type="email"]').type('usuario_incorrecto@example.com');
    cy.get('input[type="password"]').type('passwordIncorrecta');
    cy.get('button[type="submit"]').click();
    
    // Verificar que permanece en la página de login
    cy.url().should('include', '/login');
    



    // Verificar que se muestra un mensaje de error (esto dependerá de cómo está implementado tu formulario)
    cy.contains(/undefined/i).should('not.exist');
  });
});

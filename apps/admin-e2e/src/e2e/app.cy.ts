describe('base', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr');
  });

  it('should load', () => {
    cy.visit('/');
  });
});

describe('auth', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr');
  });

  it('should login', () => {
    cy.visit('/');

    cy.url().should('include', '/auth');

    // cy.contains('html')
    //   .invoke('innerHTML')
    //   .then((html) => cy.log('html', html));

    cy.get('body');

    cy.get('input[type=email]')
      .type('lucas.deuna@biociencias.es')
      .should('have.value', 'lucas.deuna@biociencias.es');
    cy.get('input[type=password]')
      .type('TestPassword')
      .should('have.value', 'TestPassword');

    cy.contains('Acceder').click();

    cy.url().should('include', 'notifications');
  });
});

describe('navigation', () => {
  beforeEach(() => {
    cy.viewport('iphone-xr');
    cy.visit('/');
    cy.login('lucas.deuna@biociencias.es', 'TestPassword');
  });

  it('should navigate between tabs', () => {
    cy.contains('Users').click();
    cy.url().should('include', 'users');

    cy.contains('Notifications').click();
    cy.url().should('include', 'notifications');

    cy.contains('Attendance').click();
    cy.url().should('include', 'attendance');

    cy.contains('Schedule').click();
    cy.url().should('include', 'schedule');
  });
});

describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('Displays cookie notice', () => {
    cy.wait(1000);
    cy.get('#cookiesNoticeModal');
  });

  it('Clicking \'Accept\' makes notice disappear', () => {
    cy.wait(1000);
    cy.get('#cookiesNoticeModalAcceptButton').click({force: true});
    cy.get('#cookiesNoticeModalAcceptButton').not('visible');
  });
});

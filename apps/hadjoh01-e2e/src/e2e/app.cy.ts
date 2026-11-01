// Спека-шаблон Nx ('should display welcome message' с h1 'Welcome hadjoh01')
// не соответствует реальному приложению: hadjoh01 — SPA на <router-outlet>,
// корневой маршрут перенаправляет на /index. Проверяем "смоук": запустился ли
// дев-сервер, загрузился ли бандл Angular и отработал ли редирект роутера.
describe('hadjoh01-e2e', () => {
  it('приложение запускается и перенаправляет на /index', () => {
    cy.visit('/');
    cy.url({ timeout: 15000 }).should('contain', '/index');
  });
});

// Спека-шаблон Nx ('should display welcome message' с h1 'Welcome xf01')
// не соответствует реальному приложению: xf01 — SPA на <router-outlet>,
// корневой маршрут перенаправляет на /index. Проверяем "смоук": запустился ли
// дев-сервер, загрузился ли бандл Angular и отработал ли редирект роутера.
describe('xf01-e2e', () => {
  it('приложение запускается и перенаправляет на /index', () => {
    cy.visit('/');
    cy.url({ timeout: 15000 }).should('contain', '/index');
  });
});

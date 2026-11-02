// Спека-шаблон Nx ('should display welcome message' с h1 'Welcome presentation01')
// не соответствует реальному приложению: presentation01 — SPA на <router-outlet>,
// коревой маршрут перенаправляет на /index (маршрут 'index' восстановлен по
// эталону x01). Проверяем "смоук": дев-сервер поднялся, бандл Angular
// загрузился и отработал редирект роутера на /index.
describe('presentation01-e2e', () => {
  it('приложение запускается и перенаправляет на /index', () => {
    cy.visit('/');
    cy.url({ timeout: 15000 }).should('contain', '/index');
  });
});

// Спека-шаблон Nx ('should display welcome message' с h1 'Welcome presentation01')
// не соответствует реальному приложению: presentation01 — SPA на <router-outlet>,
// а маршрут 'index' (цель редиректа с '/') закомментирован в app.routes.ts,
// поэтому редирект не завершается. Проверяем "смоук": дев-сервер поднялся,
// бандл Angular загрузился, корневой компонент отрендерился.
describe('presentation01-e2e', () => {
  it('приложение запускается и рендерит router-outlet', () => {
    cy.visit('/');
    cy.get('router-outlet', { timeout: 15000 }).should('exist');
  });
});

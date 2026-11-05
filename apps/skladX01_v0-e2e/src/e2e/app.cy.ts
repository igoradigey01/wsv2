describe('skladX01_v0', () => {
  it('открывает экран «Клиенты»', () => {
    cy.visit('/');
    cy.url({ timeout: 15000 }).should('contain', '/clients');
    cy.contains('h1', 'Клиенты', { timeout: 15000 });
  });

  it('переходит из списка в карточку клиента', () => {
    cy.intercept('GET', '**/api/clients?*', {
      statusCode: 200,
      body: [
        {
          id: 7,
          псевдоним: 'Тестовый клиент',
          фио: 'Иванов',
          телефон: '123',
          город: 'Туапсе',
          пределКредита: 1000,
          активен: true,
        },
      ],
    }).as('clients');

    cy.intercept('GET', '**/api/clients/7/summary', {
      statusCode: 200,
      body: {
        клиентId: 7,
        псевдоним: 'Тестовый клиент',
        пределКредита: 1000,
        активен: true,
        сделок: 1,
        активныхСделок: 1,
        отгружено: 100,
        оплачено: 0,
        долг: 100,
        переплата: 0,
        превышенЛимит: false,
      },
    });

    cy.intercept('GET', '**/api/clients/7/marks', {
      statusCode: 200,
      body: [{ id: 1, номер: 'R-000001', долг: 100 }],
    });

    cy.intercept('GET', '**/api/clients/marks/1/products', {
      statusCode: 200,
      body: [
        {
          id: 10,
          номер: '5',
          дата: '2023-10-23T00:00:00',
          сумма: 100,
          меткаId: 1,
        },
      ],
    });

    cy.intercept('GET', '**/api/clients/marks/1/payments', {
      statusCode: 200,
      body: [{ id: 20, дата: '2024-06-01T00:00:00', сумма: 100, меткаId: 1 }],
    });

    cy.intercept('GET', '**/api/clients/7', {
      statusCode: 200,
      body: {
        id: 7,
        псевдоним: 'Тестовый клиент',
        фио: 'Иванов',
        телефон: '123',
        город: 'Туапсе',
        пределКредита: 1000,
        активен: true,
      },
    });

    cy.visit('/clients');
    cy.contains('td', 'Тестовый клиент', { timeout: 15000 }).click();

    cy.url().should('match', /\/clients\/7$/);
    cy.contains('h1', 'Тестовый клиент');
    cy.contains('h2', 'Метка расчёт (сверка)');
    cy.contains('h2', 'Отпущенный товар');
    cy.contains('h2', 'Принятые деньги');
    cy.contains('23.10.2023');
  });
});

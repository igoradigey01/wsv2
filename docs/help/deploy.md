# Deploy / сборка (актуально после миграции Nx 24 / Angular 22)

## Сервер

  server ip 10.42.0.100 
  ssh ks34@10.42.0.100
  sudo poweroff

## Окружение

- Node v22 (nvm):
  ```bash
  export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
  ```
- Пакетный менеджер — **npm** (не yarn). `.npmrc` **без** `legacy-peer-deps`;
  конфликты пиров решаются точечными `overrides` в `package.json`
  (пример: `@datorama/akita` → `tslib`).
- Nx Cloud отключён: токенов и `tasksRunnerOptions` в `nx.json` нет,
  кэш локальный (`.nx/cache`, игнорируется git). Старый токен в истории
  коммитов (до `a5c0d0e`) — отозвать на стороне Nx Cloud.

## Сборка

Важно: builder — `@angular/build:application` (ESM/vite).
Выходные файлы лежат в каталоге **`browser/`**:

```
dist/apps/<app>/browser      # index.html + main-бандлы
```

```bash
npx nx build skladhs                 # одно приложение (prod по умолчанию)
npx nx run-many -t build -p x01,xf01,xl-01,hadjoh01,shagen01,presentation01
```

`docker-compose.yml` монтирует именно `dist/apps/<app>/browser` —
после пересборки в контейнере ничего дополнительно править не нужно.

### Нюанс prod-сборок
Prod-сборки инлайнят шрифт `fonts.googleapis.com` — интернет должен быть
доступен (минимальная сборка `skladhs` шрифтов не тянет).
Бюджеты бандлов: `initial 500kb/1mb`, `anyComponentStyle 500kb/1mb`
(одинаково у всех приложений).

## Проверки

```bash
npx nx run-many -t lint  --skip-nx-cache   # 32 проекта, зелёный
npx nx run-many -t test  --skip-nx-cache --parallel=1   # юнит (jest)
npx nx run-many -t e2e   -p x01-e2e,xf01-e2e,xl-01-e2e,hadjoh01-e2e,shagen01-e2e,presentation01-e2e --skip-nx-cache --parallel=1
```

- e2e (Cypress 16.2.1, бинарь уже установлен/verified):
  - запускаются headless; в `cypress.config.ts` всех проектов
    `screenshotOnRunFailure: false, video: false` — в контейнере без
    графподсистемы `cy.screenshot()` падает по таймауту;
  - перед каждым e2e-проектом дев-сервер Nx держит порт 4200:
    убивать фоновые процессы:
    ```bash
    ps aux | grep 'conditions development' | grep -v grep | awk '{print $2}' | xargs -r kill
    ```
  - исключение: у **skladhs-e2e** другой target — `npx nx run skladhs-e2e:cypress:e2e`
    (проект в каталоге `apps/skladsh*`, имя проекта `skladhs`).
  - e2e-спеки — смоук: редирект `/` → `/index` или наличие `app-nx-welcome`.

## Структура библиотек

| Лида/библиотека | Роль |
|---|---|
| `@wsv2/xf-shared` (новая) | модели `Article/Brand/KatalogN/...`, TokenService, RouteApiService |
| `@wsv2/app-config` | EnvironmentService, RouteApiAbstract, меню/компания |
| `@wsv2/shop-content` | витрина магазина (IndexShop/SubCatalog/Product) |
| `@wsv2/manage-page` | CRUD-область менеджера (пишет в БД) |
| `presentation01` | демо-витрина: **только чтение/моки**, маршрут `index` восстановлен по эталону `x01` |

Правила зависимостей (eslint `@nx/enforce-module-boundaries`):
либы не импортируют из приложений (`@wsv2/xf-shared` вынесен из `apps/xf01`
именно поэтому).

## Гит

```bash
git switch main && git merge developer   # вливание в main перед деплоем
git push origin developer
git push origin --delete v3              # устаревшая ветка (нужен PAT)
```

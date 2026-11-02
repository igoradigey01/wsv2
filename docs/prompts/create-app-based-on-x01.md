# Промт: создать новое клиентское приложение по эталону `apps/x01`

> Скопируй этот промт агенту целиком, заменив плейсхолдер `<nn01>` на имя нового
> приложения (каталог и имя проекта — lowercase, формат как у эталона: `x01`,
> `xf01`, `xl-01`, `hadjoh01`…). Эталоны `apps/x01`, `apps/xf01`, `apps/xl-01`
> менять запрещено.

---

## Роль и цель

Ты работаешь в Nx-монорепо Angular (Nx 24, Angular 22, standalone API,
npm — не yarn). Создай **клиентское приложение-витрину магазина** `<nn01>`
по точной структуре эталона `apps/x01`, а также его
e2e-проект `<nn01>-e2e`. Приложение должно собираться, проходить lint, юнит-тесты
и e2e-смоук.

## Эталон

Файлы копируй из `apps/x01` (и `apps/x01-e2e`), замещая `x01` → `<nn01>`,
а логические значения (client id, URI, телефоны, меню, логотипы) — на данные
нового клиента.

---

## 1. Каркас приложения `apps/<nn01>/`

Скопируй целиком и актуализируй:

```
apps/<nn01>/
  project.json                  ← шаблон ниже (runner @angular/build:application)
  eslint.config.mjs             ← из x01: baseConfig + nx flat/angular + правила
                                   selector'ов prefix `wsv2` + legacyRuleOverrides
  jest.config.ts                ← из x01 (displayName: '<nn01>')
  tsconfig.json / tsconfig.app.json / tsconfig.spec.json / tsconfig.editor.json
  src/
    main.ts                     ← bootstrapApplication(AppComponent, {providers:
                                   provideZoneChangeDetection(), ...appConfig.providers})
    index.html                  ← <title><NN01></title>, <wsv2-root></wsv2-root>
    favicon.ico, styles.scss    ← styles.scss скопировать как есть: @forward
                                   libs/app-styles variables + mat.elevation-
                                   classes/app-background (цвета брендинга —
                                   при необходимости под нового клиента)
    test-setup.ts               ← setupZoneTestEnv()
    environments/environment.ts      ← { production: 0 }
    environments/environment.prod.ts ← { production: 1 }
    app/app.component.ts|html|scss   ← selector wsv2-root, шаблон <router-outlet>
    app/material.module.ts           ← MatIconModule (как в x01)
    app/app.config.ts                ← 5 × provideAppInitializer (см. п.3)
    app/app.routes.ts                ← маршруты как в apps/x01/src/app/app.routes.ts
    index/index.component.ts|html|scss ← локальная шапка/меню/футер (как в x01)
    assets/...
```

## 2. `project.json` (шаблон)

```json
{
  "name": "<nn01>",
  "$schema": "../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "sourceRoot": "apps/<nn01>/src",
  "prefix": "wsv2",
  "tags": ["scope:<nn01>", "type:app"],
  "targets": {
    "build": {
      "executor": "@angular/build:application",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "dist/apps/<nn01>",
        "index": "apps/<nn01>/src/index.html",
        "polyfills": ["zone.js"],
        "tsConfig": "apps/<nn01>/tsconfig.app.json",
        "inlineStyleLanguage": "scss",
        "assets": ["apps/<nn01>/src/favicon.ico", "apps/<nn01>/src/assets"],
        "styles": ["apps/<nn01>/src/styles.scss"],
        "scripts": [],
        "browser": "apps/<nn01>/src/main.ts"
      },
      "configurations": {
        "production": {
          "fileReplacements": [{
            "replace": "apps/<nn01>/src/environments/environment.ts",
            "with": "apps/<nn01>/src/environments/environment.prod.ts"
          }],
          "budgets": [
            { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" },
            { "type": "anyComponentStyle", "maximumWarning": "500kb", "maximumError": "1mb" }
          ],
          "outputHashing": "all"
        },
        "development": {
          "optimization": false, "extractLicenses": false,
          "sourceMap": true, "namedChunks": true
        }
      }
    },
    "serve": {
      "executor": "@angular/build:dev-server",
      "defaultConfiguration": "development",
      "continuous": true,
      "configurations": {
        "production":  { "buildTarget": "<nn01>:build:production" },
        "development": { "buildTarget": "<nn01>:build:development" }
      },
      "readyWhen": { "signal": true }
    },
    "extract-i18n": {
      "executor": "@angular-devkit/build-angular:extract-i18n",
      "options": { "buildTarget": "<nn01>:build" }
    },
    "test": { "options": { "passWithNoTests": true } }
  }
}
```

## 3. `app.config.ts` — пять `provideAppInitializer`

Скопируй блоки из `apps/x01/src/app/app.config.ts` (в Angular 22 это
`provideAppInitializer`, НЕ `APP_INITIALIZER`): загрузка при старте

1. `index-meny-items.json` → `MenyItemsService.shopMenyItems` (тип `IMenyItem[]`);
2. `manager-meny-items.json` → `managerMenyItems`;
3. `admin-meny-items.json` → `adminMenyItems`;
4. `app_environments/app_environments.<…>.json` → `EnvironmentService`
   (clientId, clientUri, serverUri, serverAuthUri, postavchikIds, vkId, …);
5. `company_information/company_information.json` → `CompanyInformationService`
   (все поля `ICompanyInformation`).

Провайдеры: `provideHttpClient(withXhr())`, `provideAnimations()`,
`provideRouter(appRoutes, withEnabledBlockingInitialNavigation())`.

Типизация: `http.get<IMenyItem[]>('assets/...')`, `tap((data: IMenyItem[]) => …)`
— никаких `any` (правило линта `@typescript-eslint/no-explicit-any`).

## 4. Assets нового клиента

```
src/assets/
  app_environments/app_environments.prod.json    ← serverUri/serverAuthUri/clientId/postavchikIds
  app_environments/app_environments.local.json   ← localhost:5010
  app_environments/app_environments.local_vm.json← localhost:8080
  company_information/company_information.json   ← ICompanyInformation (см. x01)
  company_information/logo.webp, photo_1.webp
  meny_items_assembly/{index,manager,admin}-meny-items.json
  massager_social/{Instagram_icon-icons.com_64.png, Whatsapp_64.png}
  not_found.webp
```

⚠️ Значения окружения нового клиента (`clientId`, серверы) берутся из ТЗ —
не копируй значения x01 (иначе API-запросы пойдут к чужому серверу).

## 5. Маршруты — только точная копия эталона

Взять `apps/x01/src/app/app.routes.ts` как есть (замену `x01` → `<nn01>`
в путях делать не нужно — там только относительные импорты). Запрещено:
комментировать/вырезать маршрут `index`, редирект с `/`, а также делать
статические импорты библиотек, которые этот файл загружает ленивly через
`loadComponent`/`loadChildren` — за этим следит правило
`@nx/enforce-module-boundaries` («Static imports of lazy-loaded libraries are
forbidden»). Inline-исключения в этом файле не добавлять.

## 6. Регистрация в корне монорепо

1. `nx.json` → добавь `apps/<nn01>/**/*` в оба списка `include`:
   плагин `@nx/jest/plugin` и `@nx/eslint/plugin` (targetName `lint`).
2. `docker-compose.yml` → прокси/том для нового клиента
   монтировать `dist/apps/<nn01>/browser` (симметрично x01, xf01, xl-01).
3. `docs/help/deploy.md` — добавить приложение в таблицу/списки, если упомянуты.

## 7. e2e-проект `apps/<nn01>-e2e/`

```
project.json     ← implicitDependencies: ["<nn01>"], target `e2e`
                    (options.config-file: "./cypress.config.ts")
cypress.config.ts ← nxE2EPreset(webServerCommands default/production:
                    npx nx run <nn01>:serve:development|production),
                    injectDocumentDomain: true,
                    screenshotOnRunFailure: false,   // headless-контейнер
                    video: false
eslint.config.mjs ← из apps/x01-e2e
src/e2e/app.cy.ts        ← СМОУК (не Nx-шаблон): cy.visit('/');
                           cy.url({ timeout: 15000 }).should('contain', '/index');
src/support/{app.po.ts,commands.ts,e2e.ts}, src/fixtures/example.json ← из x01-e2e
tsconfig.json ← из x01-e2e
```

Шаблонные Nx-спеки («should display welcome message», h1 «Welcome …»)
заменяются на смоук — в приложении нет такой вёрстки.

## 8. Контрольные проверки (все обязательны)

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; export NX_DAEMON=false
npx nx run <nn01>:lint          --skip-nx-cache   # 0 ошибок
npx nx run <nn01>:build         --skip-nx-cache   # prod: exit=0
npx nx run <nn01>-e2e:e2e       --skip-nx-cache   # 1 passing
```

Прогонять в этом порядке; при падении шага чинить, не откатываясь к отключению
правил. Перед e2e убивать предыдущие дев-серверы:

```bash
ps aux | grep 'conditions development' | grep -v grep | awk '{print $2}' | xargs -r kill
```

## Ограничения

- ❌ Не менять `apps/x01`, `apps/xf01`, `apps/xl-01`, `apps/hadjoh01`, `apps/shagen01`, `apps/presentation01` (эталоны) и `libs/**` без веской причины.
- ❌ Не ослаблять/не выключать правила ESLint. Inline `@nx/enforce-module-boundaries` — только в местах, уже существующих в эталоне (шапка `index.component.ts`).
- ❌ Селекторы: компоненты `wsv2-*` (kebab-case), директивы/атрибуты `wsv2*` (camelCase), `prefix: wsv2` в project.json и eslint-конфиге.
- ❌ Не использовать `any` в новом коде — конкретные типы или `unknown`.
- ❌ Nx Cloud не подключать (токен удалён, runner локальный).
- ✅ Пакеты ставить через `npm` (не yarn/pnpm); при конфликте пиров — точечный `overrides` в `package.json`.

## Что считается «готово»

- [ ] `npx nx show projects` содержит `<nn01>` и `<nn01>-e2e`
- [ ] lint/build/e2e из п.8 зелёные
- [ ] `git status` не содержит изменений в эталонных приложениях
- [ ] В `docker-compose.yml` смонтирован `dist/apps/<nn01>/browser`
- [ ] e2e-спека проходит: переход `/` → `/index` работает в браузере

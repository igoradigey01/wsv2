# Анализ Nx-решения WSV2 и промты миграции

Дата анализа: 2026-10-29  
Репозиторий: `wsv2` (Angular + Nx monorepo)  
Текущая ветка: `developer`

Целевые версии на дату анализа:

| Пакет | Сейчас | Целевое состояние |
|---|---|---|
| Nx | 19.2.3 | Nx 24.x (актуальная стабильная) |
| Angular | 18.0.3 | Angular 22.x (актуальная стабильная) |
| Node.js | не зафиксирован | 22.22.3+ или 24.15+ (требование Angular 22) |
| TypeScript | 5.4.5 (в `package.json` `^5.2.0`) | версия, требуемая Angular 22 |
| Storybook | 7.1.0 | актуальная версия, совместимая с Nx/Angular |
| Cypress | 13.9.0 | актуальная версия |
| Jest | 29.4.3 | актуальная версия |
| ESLint | 8.57.0 (legacy config) | ESLint 9 + flat config |
| Сборщик Angular | `@angular-devkit/build-angular:browser` | `@angular/build:application` |

> Версии Nx/Angular быстро меняются. Перед выполнением промтов агент обязан проверить актуальные версии и матрицу совместимости:
> `npm view nx version`, `npm view @angular/core version`, документация Nx по совместимости с Angular.

---

## 1. Что представляет собой решение сейчас

### 1.1. Стек и организация

- Интегрированный Nx monorepo: приложения в `apps/`, библиотеки в `libs/`.
- 7 приложений и 7 e2e-проектов:
  - `x01`, `xf01`, `xl-01`, `hadjoh01`, `shagen01` — почти клоны одного витринного приложения;
  - `presentation01` — более старая копия с `nx-welcome`;
  - `skladsh` — пустой сгенерированный каркас.
- 17 библиотек:
  - инфраструктура: `app-common`, `app-config`, `app-styles`, `ui`, `app-layout`, `js-pdf`;
  - авторизация: `account`, `account-service`;
  - магазин: `shop-content`, `shop-cart`, `shop-order`, `shop-opt`, `shop-information`;
  - кабинет/управление: `user-order`, `user-profile`, `manage-page`, `admin-page`.
- Алиасы в `tsconfig.base.json`: `@wsv2/*` → `libs/*/src/index.ts`.
- Angular-префикс: `wsv2`; npm-scope: `@wsv2`.
- Состояние: Angular signals + RxJS; Akita в зависимостях, но в коде не используется.
- UI: Angular Material 18, SCSS, Storybook 7 (только `libs/ui`).
- Тесты: Jest (41 spec-файл), Cypress (e2e-каркасы).

### 1.2. Сильные стороны

1. Nx уже даёт project graph, кэш, генераторы, affected-команды и единые алиасы.
2. Библиотеки разделены по предметным областям, а не сложены в один `shared`.
3. Приложения используют lazy loading (`loadComponent`/`loadChildren`) — хорошая основа для дальнейшего дробления.
4. Есть заготовки публикуемых Angular-библиотек (`ng-package.json`, `package.json`, `build`).
5. Есть документация и примеры команд в `docs/`.
6. Конфигурация приложений (окружения, компания, меню) вынесена в JSON-ассеты, а не в код.

### 1.3. Критичные проблемы (P0)

| Проблема | Где | Почему критично |
|---|---|---|
| Секрет Nx Cloud в git | `nx.json` → `nxCloudAccessToken` | Токен с правами read-write закоммичен. Его нужно немедленно отозвать/перевыпустить и убрать из репозитория. |
| Два lock-файла и неопределённый пакетный менеджер | `package-lock.json`, `yarn.lock`, `.yarnrc`, `.yarn/releases` | Невоспроизводимая установка. Непонятно, какой файл главный. `yarn` при этом указан в `dependencies`. |
| Устаревший Angular-сборщик | все `apps/*/project.json` → `@angular-devkit/build-angular:browser` | В Angular 19+ этот executor удаляется/заменяется. Без миграции обновление невозможно. |
| Библиотеки не изолированы | `libs/*/tsconfig.lib.json` | В `include` есть файлы из других библиотек (`../app-common/...`, `../shop-cart/...`, `../shop-opt/...`), причём часть путей уже не существует. Это ломает независимую сборку и публикацию. |
| Жёсткая привязка к `x01` | `libs/account`, `libs/app-layout`, `libs/manage-page` | Селекторы `x01-v1-*`, `wsv2-x01-v1-sidebar`, шаблоны с `<x01-v1-footer>` и т.п. Нельзя переиспользовать в другом проекте без правок. |

### 1.4. Существенные проблемы (P1)

1. **Границы модулей не работают.**
   - Теги приложений: `scope:x01`, `scope:xf01` и т.д.
   - Теги библиотек: `type:01-lib` (и разные варианты `scope:*`).
   - В `.eslintrc.json` правило `@nx/enforce-module-boundaries` разрешает приложению зависеть от любой библиотеки с `type:01-lib`.
   - В коде массово стоят `// eslint-disable-next-line @nx/enforce-module-boundaries`, в `app.routes.ts` — `/* eslint-disable @nx/enforce-module-boundaries */`.
   - Часть тегов не имеет префикса `scope:` или содержит опечатки (`scope:01as-lib`), у e2e-проектов тегов нет.

2. **Дублирование приложений.**
   - `app.config.ts`, `app.routes.ts`, `index.component.*`, `material.module.ts` почти одинаковы в 5 приложениях.
   - JSON-ассеты окружений и компании дублируются, различаются домены, телефоны, `clientId`, `postavchikIds`.
   - `presentation01` и `skladsh` — устаревшие/сгенерированные приложения, которые увеличивают граф и шум.

3. **Устаревшие Angular API.**
   - `APP_INITIALIZER` (deprecated) вместо `provideAppInitializer`.
   - `HttpClientModule` вместо `provideHttpClient`.
   - В `APP_INITIALIZER` есть логическая ошибка: `resolve(true)` вызывается сразу после `subscribe()`, поэтому инициализация фактически не ждёт HTTP-ответ.
   - `environment.production` — число (`0/1/2`), а не boolean; логика выбора JSON запутана.
   - `environment.ts` содержит `production: 1`, а `environment.prod.ts` — `production: 0`; поведение зависит от file replacement.

4. **Публикуемость библиотек.**
   - `libs/ui` не имеет `ng-package.json` и target `build` (только Storybook).
   - `peerDependencies` в `libs/*/package.json` — Angular `^15`/`^16`, хотя workspace на Angular 18.
   - Нет единой версии, changelog, release-процесса.
   - В `libs/account/src/lib/sign-in/sign-in.component.ts` селектор `@wsv2-app-sign-in` — невалидный Angular-селектор; в других местах `@wsv2-*`.

5. **Мусор и артефакты в репозитории.**
   - `documentation.json` (сгенерированный Compodoc), `wsv2 - Ярлык.lnk` (Windows-ярлык), `tmp/`.
   - `docs/` содержит абсолютные Windows-пути, IP сервера, примеры с реальными доменами.
   - `.angular` — 1.6 ГБ, `.nx` — 51 МБ, `node_modules` — 1.4 ГБ. Их нельзя копировать/бэкапить как исходники.

6. **Неиспользуемые/неуместные зависимости.**
   - `react`, `react-dom` — в Angular-проекте не используются.
   - `@datorama/akita` — не используется.
   - `i`, `tsc`, `yarn` — не должны быть runtime-зависимостями.
   - `@nx/angular` находится в `dependencies`, а не в `devDependencies`.
   - `storybook-addon-angular-router` — стоит проверить совместимость с новым Storybook.

7. **Конфигурация.**
   - `nx.json`: `affected.defaultBase: "main"`, `defaultBase: "master"`, фактическая ветка — `developer`.
   - Нет `packageManager`, `engines`, `.nvmrc`.
   - Нет скриптов в `package.json` (всё через `nx`), нет CI-конфигурации в репозитории.
   - Имена разъезжаются: `xl-01` (проект) и `xl01` (outputPath), `skladsh` и `skladhs` в документации.

### 1.5. Граф зависимостей библиотек (фактический, без комментариев)

```text
account          -> account-service, app-common, app-config
account-service  -> app-common, app-config, shop-opt
admin-page       -> app-common, app-config, app-layout, ui
app-common       -> —
app-config       -> —
app-layout       -> account-service, app-common, app-config
app-styles       -> —
js-pdf           -> —
manage-page      -> app-common, app-config, app-layout, shop-content, ui
shop-cart        -> app-common, app-config, shop-order
shop-content     -> account-service, app-common, app-config, shop-cart, ui
shop-information -> app-config, ui
shop-opt         -> —
shop-order       -> app-config
ui               -> app-common, app-config, js-pdf, shop-cart
user-order       -> —
user-profile     -> account-service, app-common, app-config, user-order
```

Циклов нет, но есть нарушения слоёв:

- `account-service` (авторизация) зависит от `shop-opt` (оптовый магазин).
- `ui` (UI-кит) зависит от `shop-cart` (фича магазина).
- `shop-cart` зависит от `shop-order`.
- `manage-page` зависит от `shop-content`.
- `user-profile` зависит от `user-order`.

Для переиспользования это нужно развернуть: `ui` и `app-common` не должны знать о магазине; авторизация не должна знать об опте.

### 1.6. Целевое состояние

1. **Версии:** Nx 24.x, Angular 22.x, Node 22/24, актуальные Storybook/Cypress/Jest/ESLint.
2. **Сборка:** `@angular/build:application`, без legacy `browser` executor.
3. **API:** `provideAppInitializer`, `provideHttpClient`, `provideRouter`; корректное ожидание инициализации.
4. **Границы:** теги `type:app|feature|ui|data-access|util` + `scope:shared|auth|shop|admin|...`; правило `@nx/enforce-module-boundaries` без массовых disable-комментариев.
5. **Переиспользование:** библиотеки собираются и публикуются как `@<scope>/*`; приложение получает конфигурацию через `APP_CONFIG`/runtime JSON, а не через захардкоженные значения.
6. **Чистота:** один lock-файл, один пакетный менеджер, секреты только в env/CI, без сгенерированных артефактов и Windows-ярлыков.
7. **Процессы:** CI, `nx release`, документация для потребителей библиотек и для создания нового приложения.

---

## 2. Как пользоваться промтами

Промты ниже рассчитаны на AI-агента (Claude Code, Cursor, OpenCode, Copilot Workspace и т.п.), который умеет выполнять команды в терминале и редактировать файлы.

Порядок:

1. **Промт 1** — перенос в другую директорию. Сначала стабилизируем рабочую копию.
2. **Промт 2** — обновление Nx/Angular. Делаем на уже перенесённой копии.
3. **Промт 3** — переиспользование в других проектах (публикуемые библиотеки / шаблон).
4. **Промт 4** — создание нового проекта из шаблона (опционально, если нужен именно шаблон, а не пакеты).

Перед запуском любого промта:

- закоммитьте или спрячьте текущие изменения (`git status` сейчас показывает изменённый `apps/xf01/src/environments/environment.ts` и неотслеживаемый `docs/docker-help-2.md`);
- создайте отдельную ветку;
- сделайте резервную копию **исходников** (без `node_modules`, `.angular`, `.nx/cache`, `dist`, `tmp`, `coverage`);
- не запускайте два промта одновременно;
- после каждого крупного шага — отдельный коммит.

Шаблонные значения в промтах:

- `<SOURCE_DIR>` — текущая директория workspace;
- `<TARGET_DIR>` — новая директория;
- `<NEW_SCOPE>` — новый npm-scope, например `@acme`;
- `<NEW_PREFIX>` — новый Angular-префикс, например `acme`;
- `<PROJECT_NAME>` — имя приложения/библиотеки;
- `<PACKAGE_MANAGER>` — `yarn` или `npm` (выбрать один).

---

## 3. Промт 1 — перенос в другую директорию

Скопируйте целиком блок ниже и подставьте значения.

````text
Ты — senior Nx/Angular инженер. Твоя задача — безопасно перенести существующий Nx-workspace в другую директорию, ничего не сломав.

## Контекст

- Исходная директория: <SOURCE_DIR>
- Целевая директория: <TARGET_DIR>
- Режим: <MODE> — один из вариантов:
  - "whole-workspace" — перенести весь workspace целиком в другую папку/репозиторий;
  - "project-inside-workspace" — перенести одно приложение или библиотеку в другую папку внутри того же workspace.
- Нужно ли сохранять git-историю: <KEEP_GIT_HISTORY> (yes/no)
- Пакетный менеджер: <PACKAGE_MANAGER> (yarn/npm)
- Текущий стек: Nx 19.2.3, Angular 18.0.3, TypeScript 5.4.5, Storybook 7.1, Cypress 13.9, Jest 29.4, ESLint 8.57.
- В workspace 7 приложений и 7 e2e-проектов, 17 библиотек, алиасы `@wsv2/*` в `tsconfig.base.json`.
- `node_modules` ~1.4 ГБ, `.angular` ~1.6 ГБ, `.nx` ~51 МБ. Их нельзя копировать как исходники.
- В рабочей копии могут быть незакоммиченные изменения. Их нельзя терять.

## Жёсткие ограничения

1. Не выполняй `rm -rf`, `git reset --hard`, `git clean -fdx` и другие разрушительные команды без явного подтверждения пользователя.
2. Не меняй версии зависимостей в этой задаче — только перенос.
3. Не переформатируй код и не делай косметических правок.
4. Не копируй `node_modules`, `.angular`, `.nx/cache`, `dist`, `tmp`, `coverage`.
5. Не коммить секреты. В `nx.json` сейчас есть `nxCloudAccessToken` — при переносе в другой репозиторий его нужно убрать и заменить на переменную окружения/`nxCloudId`.
6. Если целевой путь содержит пробелы или не-ASCII символы (кириллица), предупреди пользователя: часть инструментов Nx/Angular/CI может работать нестабильно. Рекомендуй ASCII-путь без пробелов.

## Шаг 0. Подготовка и инвентаризация

1. Покажи `pwd`, `git status --short`, `git branch --show-current`, `git log -1 --oneline`.
2. Зафиксируй текущее состояние:
   - `npx nx show projects` (или `yarn nx show projects`);
   - `npx nx graph --file=/tmp/nx-graph-before.json`;
   - `npx nx report` (если Node доступен).
3. Создай ветку `chore/relocate-workspace` (или `chore/move-<PROJECT_NAME>`).
4. Сделай backup исходников:
   - `tar --exclude=node_modules --exclude=.angular --exclude=.nx --exclude=dist --exclude=tmp --exclude=coverage -czf /tmp/wsv2-src-backup-$(date +%Y%m%d-%H%M%S).tgz -C <SOURCE_DIR> .`
   - Проверь, что архив создан и не пустой.
5. Останови все dev-серверы, watch-процессы, Docker-контейнеры и IDE-процессы, которые держат файлы.

## Шаг 1. Выбери сценарий

### Сценарий A. Перенос всего workspace

1. Создай целевую директорию.
2. Перенеси исходники через `rsync` с исключениями:
   ```bash
   mkdir -p <TARGET_DIR>
   rsync -a \
     --exclude node_modules \
     --exclude .angular \
     --exclude .nx \
     --exclude dist \
     --exclude tmp \
     --exclude coverage \
     <SOURCE_DIR>/ <TARGET_DIR>/
   ```
3. Если `KEEP_GIT_HISTORY=yes` и целевая директория — новый самостоятельный репозиторий:
   - перенеси `.git` вместе с исходниками;
   - проверь `git remote -v`, `git status`.
4. Если целевая директория находится внутри другого git-репозитория:
   - не копируй `.git`;
   - объясни пользователю варианты: `git subtree`, `git filter-repo`, обычный коммит без истории;
   - не выполняй переписывание истории без подтверждения.
5. Удали/исправь абсолютные пути:
   - `.vscode/*` — проверь `settings.json`, `launch.json`, `tasks.json`;
   - `wsv2 - Ярлык.lnk` — удалить из репозитория и добавить `*.lnk` в `.gitignore`;
   - `docs/*` — найди старый путь и Windows-пути;
   - CI/Docker/nginx — проверь относительные пути.
6. Проверь, что в исходниках не осталось старого пути:
   ```bash
   grep -R "<SOURCE_DIR>" . \
     --exclude-dir=node_modules --exclude-dir=.git \
     --exclude-dir=.angular --exclude-dir=.nx --exclude-dir=dist
   ```
7. Установи зависимости заново:
   ```bash
   cd <TARGET_DIR>
   rm -rf node_modules
   # выбери один пакетный менеджер:
   yarn install --frozen-lockfile
   # или: npm ci
   ```
8. Сбрось кэши:
   ```bash
   npx nx reset
   ```
9. Проверь:
   ```bash
   npx nx show projects
   npx nx graph --file=/tmp/nx-graph-after.json
   npx nx run-many -t lint,test,build --all
   ```
   Если полный `build` слишком долгий, сначала собери одно приложение:
   ```bash
   npx nx build x01 --configuration=production
   ```
10. Сравни список проектов и граф до/после. В отчёте укажи расхождения.

### Сценарий B. Перенос проекта внутри workspace

1. Сначала выполни dry-run:
   ```bash
   npx nx g @nx/workspace:move \
     --projectName=<PROJECT_NAME> \
     --destination=<apps|libs>/<NEW_PATH> \
     --dry-run
   ```
2. Покажи пользователю план изменений. Только после подтверждения выполни без `--dry-run`.
3. Проверь и обнови вручную, если генератор что-то пропустил:
   - `tsconfig.base.json` — paths;
   - `project.json` — `sourceRoot`, `root`, пути в targets;
   - `tsconfig.*.json` — `extends`, `include`, `references`;
   - `jest.config.ts` — `displayName`, `coverageDirectory`, `rootDir`;
   - `.eslintrc.json` — пути/теги;
   - `apps/*/project.json` — assets, styles, fileReplacements;
   - импорты `@wsv2/<old>` → `@wsv2/<new>`;
   - `docker-compose.yml`, `nginx/nginx.conf`, CI.
4. Удали пустые каталоги только после проверки.
5. Выполни:
   ```bash
   npx nx reset
   npx nx show project <PROJECT_NAME>
   npx nx graph
   npx nx run <PROJECT_NAME>:lint
   npx nx run <PROJECT_NAME>:test
   npx nx run <PROJECT_NAME>:build
   ```
6. Если проект — приложение, проверь `nx serve` и открой его в браузере (или хотя бы `curl` на dev-server).

## Шаг 2. Проверка после переноса

Обязательно проверь:

- `git status` — нет неожиданных удалений/переименований;
- `npx nx show projects` — все проекты на месте;
- `npx nx graph` — нет ошибок и неожиданных зависимостей;
- `npx nx run-many -t lint,test,build --all` — успешно или есть понятный список ошибок;
- приложение запускается и открывается;
- ассеты (favicon, JSON, картинки) доступны по тем же URL;
- Docker/nginx пути указывают на новые `dist/apps/...`;
- в репозитории нет `node_modules`, `.angular`, `.nx/cache`, `dist`, `tmp`.

## Формат отчёта

Верни:

1. Краткое описание выполненного сценария.
2. Таблицу: что перенесено, что исключено, что переустановлено.
3. Список изменённых файлов.
4. Результаты проверок (команды + ключевые строки вывода).
5. Риски и что осталось сделать вручную.
6. Если что-то не удалось — не маскируй, покажи ошибку и предложи следующий шаг.

Не переходи к обновлению версий. Это отдельная задача.
````

---

## 4. Промт 2 — обновление на новую версию Nx/Angular

````text
Ты — senior Nx/Angular инженер. Твоя задача — обновить Nx-workspace с Nx 19.2.3 / Angular 18.0.3 до актуальных стабильных версий (ориентир на дату выполнения: Nx 24.x, Angular 22.x), сохранив работоспособность приложений.

## Контекст

- Workspace: <SOURCE_DIR> (после переноса — <TARGET_DIR>)
- Текущие версии:
  - Nx 19.2.3, Angular 18.0.3, Angular Material/CDK 18.0.3;
  - TypeScript 5.4.5 (в package.json `^5.2.0`);
  - Storybook 7.1.0, Cypress 13.9.0, Jest 29.4.3, ESLint 8.57.0;
  - сборщик `@angular-devkit/build-angular:browser`;
  - `APP_INITIALIZER`, `HttpClientModule`, `RouterModule`.
- 7 приложений, 7 e2e, 17 библиотек.
- В `libs/*/package.json` peerDependencies Angular `^15`/`^16` — их нужно привести к целевой версии.
- `libs/ui` не имеет `ng-package.json` и build-target.
- В `nx.json` есть закоммиченный `nxCloudAccessToken` — его нельзя оставлять.
- В репозитории одновременно `package-lock.json` и `yarn.lock`.
- В рабочей копии могут быть незакоммиченные изменения. Их нельзя терять.

## Жёсткие ограничения

1. Не обновляй всё одним прыжком. Делай поэтапно, по одной мажорной версии, с отдельным коммитом и проверкой после каждого этапа.
2. Не удаляй тесты и не отключай проверки, чтобы «сделать зелёным». Если тест сломался — исправь причину или явно зафиксируй TODO с объяснением.
3. Не меняй бизнес-логику без необходимости. Задача — совместимость, а не рефакторинг.
4. Не выполняй `git reset --hard`, `git clean -fdx`, `rm -rf` без подтверждения.
5. Не коммить секреты. Токен Nx Cloud отозвать/перевыпустить и убрать из `nx.json`.
6. Перед каждым этапом показывай план и жди подтверждения, если этап может изменить много файлов.

## Шаг 0. Подготовка

1. Покажи `git status`, `git branch --show-current`, `node -v`, `npm -v`, `yarn -v`, `npx nx report`.
2. Создай ветку `chore/upgrade-nx-angular`.
3. Закоммить или спрячь текущие изменения.
4. Сделай backup исходников (без node_modules/.angular/.nx/dist/tmp/coverage).
5. Определи пакетный менеджер:
   - если выбран yarn — удали `package-lock.json` и оставь `yarn.lock`;
   - если выбран npm — удали `yarn.lock` и `.yarnrc`, оставь `package-lock.json`;
   - добавь в `package.json` поле `"packageManager"` с точной версией.
6. Добавь `.nvmrc` и `engines` с версией Node, требуемой целевым Angular (для Angular 22 — 22.22.3+ или 24.15+).
7. Убедись, что установлен Node нужной версии. Если нет — остановись и попроси пользователя установить его.
8. Проверь `migrations.json`: там могут быть неприменённые миграции от 19.x. Сначала выполни `npx nx migrate --run-migrations` на отдельной ветке/коммите, затем переходи к обновлению.

## Шаг 1. Стратегия обновления

Используй инкрементальную схему:

```text
Nx:      19 -> 20 -> 21 -> 22 -> 23 -> 24
Angular: 18 -> 19 -> 20 -> 21 -> 22
```

Для каждого мажора:

1. `npx nx migrate <version>` (например, `npx nx migrate 20`).
2. Изучи diff `package.json` и `migrations.json`. Покажи, какие пакеты меняются.
3. Установи зависимости:
   - `yarn install` или `npm install`.
4. Выполни миграции:
   - `npx nx migrate --run-migrations`.
5. Сбрось кэш и почини конфигурацию:
   - `npx nx reset`;
   - `npx nx repair`.
6. Проверь:
   - `npx nx report`;
   - `npx nx show projects`;
   - `npx nx run-many -t lint,test,build --all`;
   - сборка одного приложения в production;
   - `npx nx graph`.
7. Если всё зелёное — коммит `chore: upgrade nx/angular to <version>`.
8. Если нет — исправь или откатись на предыдущий коммит, не тащи поломку дальше.

Если `nx migrate latest` обновляет сразу несколько мажоров, всё равно разбей работу на коммиты/проверки по мажорам. Не принимай «большой взрыв» без проверки.

## Шаг 2. Обязательные миграции Angular

После обновления версий приведи код к актуальным API:

1. **Bootstrap и HTTP**
   - `HttpClientModule` → `provideHttpClient()` (+ `withInterceptorsFromDi()`, если есть interceptors).
   - `APP_INITIALIZER` → `provideAppInitializer(() => ...)`.
   - Исправь ошибку инициализации: фабрика должна возвращать `Promise`/`Observable`, который завершается после фактической загрузки JSON. Сейчас `resolve(true)` вызывается сразу после `subscribe()`, поэтому приложение не ждёт данные.
   - `RouterModule.forRoot` → `provideRouter(routes, ...)`.
   - Проверь `withEnabledBlockingInitialNavigation` и другие router-features на актуальность.

2. **Сборщик**
   - Замени `@angular-devkit/build-angular:browser` на `@angular/build:application` (или актуальный executor, который предложит Nx/Angular).
   - Обнови `project.json`:
     - `main` → `browser` (для application builder);
     - `outputPath` → объект с `base`/`browser` при необходимости;
     - `assets`, `styles`, `polyfills`, `fileReplacements`, `budgets`;
     - `serve` → `buildTarget`/`devServerTarget` согласно новой схеме.
   - Обнови `nx.json` targetDefaults, где указан старый executor.
   - Проверь, что `dist/apps/<app>` сохраняет те же пути, которые ждут Docker/nginx.

3. **Angular Material**
   - Выполни миграцию Material (`ng update @angular/material@<major>` или соответствующую Nx-миграцию).
   - Проверь тему: `mat.m2-define-*` может быть deprecated. Перейди на актуальный M3-подход или оставь M2-совместимость, если M3 требует слишком много правок. Зафиксируй решение.
   - Проверь `@include mat.core()` и `styles.scss` — core должен подключаться один раз.

4. **Standalone/NGModule**
   - Не смешивай массовый перевод на standalone с обновлением версий.
   - Если переводишь — отдельным коммитом, начиная с приложений, затем библиотек.
   - Проверь `@wsv2-*` селекторы: они невалидны, если начинаются с `@`. Исправь на нормальный kebab-case.

5. **ESLint**
   - ESLint 9 требует flat config. Перейди с `.eslintrc.json` на `eslint.config.js` (или актуальный формат Nx).
   - Обнови `@nx/enforce-module-boundaries`.
   - Не оставляй массовые `eslint-disable @nx/enforce-module-boundaries`; если они нужны — вынеси в TODO и объясни.

6. **Storybook**
   - Обнови `@nx/storybook` и `@storybook/*`.
   - Приведи `.storybook/main.js` к актуальному формату (при необходимости `main.ts`).
   - Замени устаревшие опции (`browserTarget` → `buildTarget`, `compodoc` — проверить актуальность).
   - Проверь совместимость `storybook-addon-angular-router`; если несовместим — убери и замени аналогом.
   - `npx nx run ui:build-storybook`.

7. **Cypress/Jest**
   - Обнови `@nx/cypress`, `cypress`, `@nx/jest`, `jest`, `jest-preset-angular`, `ts-jest`.
   - Приведи `cypress.config.ts` и `jest.config.ts` к актуальному формату.
   - Проверь e2e-проекты: у них нет тегов и, возможно, пустые спеки.

8. **TypeScript/tsconfig**
   - Обнови `tsconfig.base.json` под требования Angular: `target`, `module`, `moduleResolution`, `lib`.
   - Проверь strict-флаги. Не отключай `strict`, чтобы скрыть ошибки.
   - Убедись, что `paths` в `tsconfig.base.json` не сломались.

9. **Зависимости**
   - Удали неиспользуемые: `react`, `react-dom`, `@datorama/akita`, `i`, `tsc`, `yarn` (если не нужен как зависимость).
   - Перенеси `@nx/angular` в `devDependencies`.
   - Проверь `storybook-addon-angular-router`.
   - Обнови `peerDependencies` в `libs/*/package.json` до целевой Angular.
   - Не оставляй два lock-файла.

10. **Nx Cloud**
    - Отзови старый токен в Nx Cloud.
    - Удали `nxCloudAccessToken` из `nx.json`.
    - Настрой `NX_CLOUD_ACCESS_TOKEN` в CI/локальном окружении или перейди на `nxCloudId`.
    - Проверь, что токен не попал в git.

## Шаг 3. Проверка после обновления

Выполни и покажи результаты:

```bash
npx nx report
npx nx show projects
npx nx graph
npx nx run-many -t lint,test,build --all
npx nx build x01 --configuration=production
npx nx build xf01 --configuration=production
npx nx build xl-01 --configuration=production
npx nx run ui:build-storybook
```

Дополнительно:

- запусти одно приложение (`npx nx serve x01`) и проверь загрузку главной, каталога, авторизации, корзины;
- проверь, что JSON-конфиги загружаются до старта приложения (инициализация реально ждёт);
- проверь, что production-сборка использует правильные `environment`/JSON;
- проверь, что Docker/nginx пути к `dist` не изменились;
- проверь, что в репозитории нет `node_modules`, `.angular`, `.nx/cache`, `dist`, `tmp`;
- проверь, что нет `APP_INITIALIZER`, `HttpClientModule`, `@angular-devkit/build-angular:browser` (или объясни, почему остались).

## Формат отчёта

Верни таблицу:

| Пакет | Было | Стало | Статус | Примечание |
|---|---|---|---|---|

Плюс:

1. Список выполненных миграций и codemod-ов.
2. Список файлов, которые пришлось править вручную.
3. Результаты проверок.
4. Оставшиеся deprecated-предупреждения и план их устранения.
5. Риски и rollback-план.

Если на каком-то мажоре тупик — остановись, покажи ошибку, предложи варианты. Не имитируй успех.
````

---

## 5. Промт 3 — переиспользование в других проектах

````text
Ты — senior Nx/Angular архитектор. Твоя задача — превратить текущий monorepo в переиспользуемое решение, которое можно подключать к другим проектам без копирования приложений и без ручной правки селекторов/URL.

## Контекст

- Workspace: <SOURCE_DIR>
- 17 библиотек с npm-scope `@wsv2`, Angular-префиксом `wsv2` и большим количеством жёстких привязок к `x01`.
- Приложения: `x01`, `xf01`, `xl-01`, `hadjoh01`, `shagen01` — почти клоны; `presentation01` и `skladsh` — устаревшие/пустые.
- В библиотеках есть:
  - селекторы `x01-v1-footer`, `x01-v1-main`, `x01-v1-VK-login-widget`, `x01-v1-telegram-login-widget`, `wsv2-x01-v1-sidebar`;
  - невалидные селекторы `@wsv2-app-sign-in`, `@wsv2-manager-info`, `@wsv2-version-info`;
  - захардкоженные URL, телефоны, email, домены в JSON-ассетах приложений;
  - кросс-библиотечные `include` в `tsconfig.lib.json` (`../app-common/...`, `../shop-cart/...`, `../shop-opt/...`);
  - peerDependencies Angular `^15`/`^16`;
  - `libs/ui` без `ng-package.json` и build-target.
- Границы модулей настроены неэффективно: приложение может зависеть от любой библиотеки с `type:01-lib`.
- Есть неиспользуемые зависимости: `react`, `react-dom`, `@datorama/akita`, `i`, `tsc`.

## Цель

Сделать так, чтобы библиотеки можно было использовать в другом Angular-проекте одним из двух способов:

- **Вариант A (рекомендуемый): публикуемые пакеты** в приватный npm-registry (Verdaccio, GitHub Packages, Nexus и т.п.). Потребитель ставит `@<scope>/ui`, `@<scope>/shop-content` и т.д.
- **Вариант B: шаблон monorepo** — новый проект создаётся из этого workspace, библиотеки переиспользуются как исходники через Nx-граф.

Сначала предложи оба варианта, опиши плюсы/минусы и попроси пользователя выбрать. Не начинай массовый рефакторинг без подтверждения.

## Жёсткие ограничения

1. Не ломай существующие приложения: после каждого этапа `x01` должен собираться.
2. Не переименовывай всё сразу. Сначала инвентаризация и план, потом codemod, потом проверка.
3. Не удаляй библиотеки/приложения без подтверждения. `presentation01` и `skladsh` — сначала предложи архив/удаление, но не удаляй молча.
4. Не копируй бизнес-данные (телефоны, email, домены, VK ID) в публичные пакеты. Они должны приходить из конфигурации приложения.
5. Не оставляй `eslint-disable @nx/enforce-module-boundaries` как способ обойти архитектуру.
6. Не публикуй пакеты в публичный npm без явного разрешения.

## Шаг 1. Инвентаризация

1. Построй граф: `npx nx graph`.
2. Составь таблицу по каждой библиотеке:
   - имя, путь, теги, build-target, наличие `ng-package.json`;
   - публичный API (`src/index.ts`);
   - зависимости от других `@wsv2/*`;
   - app-specific данные/селекторы/URL;
   - кто использует (приложения и библиотеки).
3. Классифицируй библиотеки:
   - `shared/core` — `app-common`, `app-config` (интерфейсы, токены, API-клиент);
   - `shared/ui` — `ui`, `app-styles`, `app-layout`;
   - `shared/auth` — `account`, `account-service`;
   - `shop/*` — `shop-content`, `shop-cart`, `shop-order`, `shop-opt`, `shop-information`;
   - `account/*` — `user-order`, `user-profile`;
   - `admin/*` — `manage-page`, `admin-page`;
   - `util/*` — `js-pdf`.
4. Отдельно отметь:
   - `ui -> shop-cart` — нарушение слоёв;
   - `account-service -> shop-opt` — нарушение слоёв;
   - `shop-cart -> shop-order`, `manage-page -> shop-content`, `user-profile -> user-order`.
5. Покажи таблицу и план перемещений. Дождись подтверждения.

## Шаг 2. Новый scope и префикс

1. Выбери `<NEW_SCOPE>` и `<NEW_PREFIX>` вместе с пользователем.
2. Замени npm-scope:
   - `@wsv2/` → `<NEW_SCOPE>/` во всех `package.json`, `tsconfig.base.json`, импортах, README, docs.
3. Замени Angular-префикс:
   - `wsv2` → `<NEW_PREFIX>` в селекторах, ESLint-правилах, `index.html`, тестах.
4. Замени `x01-v1-*` на `<NEW_PREFIX>-*` в библиотеках.
5. Исправь невалидные селекторы, начинающиеся с `@`, на нормальный kebab-case.
6. Сделай это codemod-ом, а не ручными правками:
   - `grep -rl` + `sed`/`perl` или TypeScript-codemod;
   - после замены выполни `npx nx run-many -t lint,test,build --all`.
7. Проверь, что не осталось:
   ```bash
   grep -R "@wsv2/\|x01-v1\|wsv2-root\|wsv2-" apps libs --include="*.ts" --include="*.html" --include="*.json"
   ```
   Исключения — только документация/исторические примеры, и они должны быть явно помечены.

## Шаг 3. Вынеси конфигурацию из библиотек

1. Введи контракт конфигурации:
   - `APP_CONFIG` injection token;
   - интерфейс `AppConfig` (окружение, `clientId`, `serverUri`, `serverAuthUri`, `clientUri`, `postavchikIds`, `vkId`, бренд/компания, меню);
   - `provideAppConfig()`/`loadAppConfig()` в `shared/core`.
2. Приложение загружает JSON из `apps/<app>/src/assets/config/*.json` и передаёт его через `APP_CONFIG`.
3. Убери из библиотек:
   - реальные домены, телефоны, email, адреса, VK ID;
   - привязку к `x01`;
   - предположения о конкретном `clientId`.
4. Замени `APP_INITIALIZER` на `provideAppInitializer` (если ещё не сделано в промте 2) и сделай так, чтобы инициализация реально ждала загрузку конфигурации.
5. Проверь, что приложение собирается с конфигурацией по умолчанию и с тестовой конфигурацией.

## Шаг 4. Исправь границы и изоляцию

1. Определи теги:
   - `type:app`, `type:feature`, `type:ui`, `type:data-access`, `type:util`;
   - `scope:shared`, `scope:auth`, `scope:shop`, `scope:admin`, `scope:account`.
2. Обнови `.eslintrc.json`/`eslint.config.js`:
   - `sourceTag: "type:app"` → может зависеть от `type:feature`, `type:ui`, `type:data-access`, `type:util`;
   - `type:feature` → `type:feature`, `type:ui`, `type:data-access`, `type:util`;
   - `type:ui` → `type:ui`, `type:util` (без `feature`/`data-access`);
   - `type:data-access` → `type:data-access`, `type:util`;
   - `scope:shop` → `scope:shop`, `scope:shared`;
   - `scope:auth` → `scope:auth`, `scope:shared`.
3. Убери нарушения:
   - `ui` не должен импортировать `shop-cart`;
   - `account-service` не должен импортировать `shop-opt`;
   - `shop-cart` не должен импортировать `shop-order`;
   - `manage-page` не должен импортировать `shop-content`;
   - `user-profile` не должен импортировать `user-order`.
   Развяжи через:
   - перенос общих интерфейсов в `shared/core`;
   - инверсию зависимостей (токены/абстракции в `shared`, реализации в feature);
   - выделение отдельной `data-access` библиотеки.
4. Удали `include` чужих файлов из `libs/*/tsconfig.lib.json`. Каждая библиотека должна компилировать только свой `src/**/*.ts`.
5. Удали `eslint-disable @nx/enforce-module-boundaries` после исправления нарушений. Если что-то остаётся — оставь TODO с причиной.
6. Проверь `npx nx graph` на циклы и `npx nx run-many -t lint`.

## Шаг 5. Сделай библиотеки публикуемыми (вариант A)

1. Для каждой библиотеки:
   - добавь/обнови `ng-package.json` (включая `libs/ui`);
   - добавь `build` target с `@nx/angular:package` (или актуальным executor);
   - обнови `package.json`: `name`, `version`, `peerDependencies`, `sideEffects`, `exports`;
   - добавь `README.md` с публичным API и примерами;
   - добавь `LICENSE`, если пакет публикуется.
2. Настрой `tsconfig.lib.prod.json` и `tsconfig.lib.json` без чужих `include`.
3. Проверь независимую сборку:
   ```bash
   npx nx run-many -t build --projects=<lib1>,<lib2>
   ```
4. Проверь содержимое пакета:
   ```bash
   cd dist/libs/<lib>
   npm pack --dry-run
   ```
   В пакете не должно быть чужих исходников, тестов, Storybook-конфигов.
5. Проверь потребление в чистом тестовом Angular-приложении:
   - создай временный проект в `/tmp`;
   - установи пакет из `dist` через `npm install <path>/<lib>-<version>.tgz`;
   - импортируй компонент/сервис и собери приложение.
6. Настрой публикацию:
   - приватный registry (Verdaccio/GitHub Packages/Nexus);
   - `npm publish --registry <url>`;
   - CI-джоба публикации по тегу.
7. Настрой версионирование:
   - `nx release` с conventional commits;
   - fixed или independent версии — выбрать и зафиксировать;
   - changelog.

## Шаг 6. Подготовь шаблон для нового проекта (вариант B)

1. Создай `docs/NEW_PROJECT.md`:
   - как создать workspace;
   - как подключить библиотеки (пакеты или исходники);
   - как настроить `APP_CONFIG`;
   - как добавить ассеты;
   - как запустить build/test/lint.
2. Создай генератор `tools/generators/<name>` (если нужен):
   - спрашивает имя приложения, scope, префикс, конфигурацию;
   - создаёт `apps/<name>` с shell, routes, assets, environment;
   - подключает shared-библиотеки;
   - не копирует бизнес-данные.
3. Либо оформи `create-nx-workspace` + `nx g @nx/angular:app` + установка пакетов как основной сценарий.
4. Проверь сценарий на чистой машине/в `/tmp`:
   - новый проект создаётся;
   - библиотеки подключаются;
   - приложение собирается;
   - нет ссылок на `wsv2`/`x01`.

## Шаг 7. Документация и чистота

1. Обнови `README.md`:
   - что это за решение;
   - какие пакеты публикуются;
   - как подключить;
   - как создать новое приложение.
2. Добавь `docs/ARCHITECTURE.md`:
   - слои, теги, правила зависимостей;
   - схема графа;
   - контракт `APP_CONFIG`.
3. Удали/перемести:
   - `documentation.json` (генерируется заново);
   - `wsv2 - Ярлык.lnk`;
   - `tmp/`;
   - абсолютные пути и IP из docs;
   - реальные данные из примеров.
4. Добавь в `.gitignore`:
   - `*.lnk`;
   - `documentation.json` (если это артефакт);
   - `dist`, `.angular`, `.nx/cache`, `tmp`, `coverage`.
5. Проверь, что в репозитории нет секретов:
   ```bash
   grep -R "nxCloudAccessToken\|password\|secret\|token" . \
     --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.angular --exclude-dir=.nx
   ```

## Критерии приёмки

- `npx nx graph` без циклов и ошибок.
- `npx nx run-many -t lint,test,build --all` проходит.
- Каждая библиотека собирается независимо.
- `npm pack --dry-run` не содержит чужих файлов.
- Новое приложение в `/tmp` подключает библиотеки и собирается.
- В коде нет `@wsv2/`, `x01-v1`, `wsv2-root` (кроме явно задокументированных исторических примеров).
- В библиотеках нет реальных телефонов/email/доменов.
- Нет `eslint-disable @nx/enforce-module-boundaries` без обоснования.
- Документация описывает подключение и создание нового проекта.

## Формат отчёта

1. Таблица инвентаризации библиотек.
2. Выбранная стратегия (A/B) и обоснование.
3. План перемещений/переименований.
4. Список breaking changes для потребителей.
5. Результаты проверок.
6. Что осталось сделать и какие риски.

Не начинай массовые перемещения, пока не покажешь план и не получишь подтверждение.
````

---

## 6. Промт 4 — новый проект из шаблона (опционально)

Этот промт нужен, если выбран вариант B (шаблон monorepo), а не публикуемые пакеты.

````text
Ты — senior Nx/Angular инженер. На основе текущего workspace нужно создать новый Angular-проект, который переиспользует общие библиотеки, не копируя бизнес-данные и не ломая существующие приложения.

## Контекст

- Workspace: <SOURCE_DIR>
- Общие библиотеки: `@<NEW_SCOPE>/*` (после промта 3).
- Конфигурация приложения должна приходить из `apps/<NEW_APP>/src/assets/config/*.json` через `APP_CONFIG`.
- Новый проект: `<NEW_APP>`.

## Задача

1. Создай приложение:
   ```bash
   npx nx g @nx/angular:app <NEW_APP> \
     --directory=apps/<NEW_APP> \
     --style=scss \
     --routing \
     --standalone \
     --ssr=false
   ```
2. Настрой `project.json`:
   - `outputPath: dist/apps/<NEW_APP>`;
   - assets: favicon, `src/assets`;
   - styles: `src/styles.scss`;
   - budgets;
   - fileReplacements для production.
3. Создай shell:
   - `app.component` с `<router-outlet>`;
   - routes: главная, каталог, корзина, заказы, профиль, авторизация;
   - lazy loading через `loadComponent`/`loadChildren`.
4. Подключи общие библиотеки:
   - `@<NEW_SCOPE>/ui`;
   - `@<NEW_SCOPE>/app-layout`;
   - `@<NEW_SCOPE>/app-config`;
   - `@<NEW_SCOPE>/shop-content` и т.д. — только нужные.
5. Добавь конфигурацию:
   - `src/assets/config/app.config.json` с плейсхолдерами;
   - `src/assets/config/company.json`;
   - `src/assets/config/menu.json`;
   - загрузку через `provideAppInitializer`/`APP_CONFIG`.
6. Не копируй:
   - реальные телефоны, email, домены, VK ID;
   - `x01`-специфичные селекторы;
   - чужие assets.
7. Проверь:
   ```bash
   npx nx build <NEW_APP> --configuration=production
   npx nx lint <NEW_APP>
   npx nx test <NEW_APP>
   npx nx serve <NEW_APP>
   ```
8. Добавь в `docs/NEW_PROJECT.md` инструкцию по созданию такого приложения.

## Критерии приёмки

- Новое приложение собирается и запускается.
- Оно использует общие библиотеки, а не копии кода.
- Конфигурация вынесена в JSON и не захардкожена.
- Нет ссылок на `x01`/`wsv2`.
- Существующие приложения не сломаны.

## Формат отчёта

1. Команды создания.
2. Список подключённых библиотек.
3. Структура конфигурации.
4. Результаты build/lint/test/serve.
5. Что нужно добавить вручную (брендинг, ассеты, API).
````

---

## 7. Общий чек-лист приёмки

### После переноса

- [ ] `git status` чистый или содержит только ожидаемые изменения.
- [ ] `npx nx show projects` показывает все проекты.
- [ ] `npx nx graph` без ошибок.
- [ ] `npx nx run-many -t lint,test,build --all` проходит.
- [ ] Приложение запускается, ассеты доступны.
- [ ] В репозитории нет `node_modules`, `.angular`, `.nx/cache`, `dist`, `tmp`.
- [ ] Нет ссылок на старый абсолютный путь.

### После обновления

- [ ] `npx nx report` показывает целевые версии.
- [ ] Нет `@angular-devkit/build-angular:browser`.
- [ ] Нет `APP_INITIALIZER` и `HttpClientModule` (или есть обоснованное исключение).
- [ ] Инициализация реально ждёт загрузки конфигурации.
- [ ] Все приложения собираются в production.
- [ ] Storybook собирается.
- [ ] Cypress/Jest конфиги валидны.
- [ ] Нет закоммиченного Nx Cloud token.
- [ ] Один lock-файл, один пакетный менеджер.

### После подготовки к переиспользованию

- [ ] Новый scope/префикс применён везде.
- [ ] Нет `x01-v1-*` и невалидных `@wsv2-*` селекторов.
- [ ] Библиотеки не содержат бизнес-данных.
- [ ] `APP_CONFIG` — единственный контракт конфигурации.
- [ ] Границы модулей работают, disable-комментариев нет.
- [ ] Каждая библиотека собирается независимо.
- [ ] `npm pack --dry-run` чистый.
- [ ] Новое приложение в `/tmp` собирается с пакетами.
- [ ] Документация описывает подключение и создание проекта.

---

## 8. Откат

Если что-то пошло не так:

1. Не пытайся «починить» разрушенную рабочую копию. Переключись на предыдущий коммит/ветку.
2. Для переноса:
   - вернись в `<SOURCE_DIR>`;
   - восстанови исходники из backup-архива;
   - `npx nx reset`;
   - `yarn install --frozen-lockfile` (или `npm ci`).
3. Для обновления:
   - `git reset --hard <commit-before-upgrade>` (только с подтверждением пользователя);
   - удали `node_modules`;
   - `yarn install --frozen-lockfile`;
   - `npx nx reset`.
4. Для переименований:
   - откати коммит с codemod-ом;
   - проверь, что `@wsv2/*` и старые селекторы вернулись;
   - `npx nx run-many -t lint,test,build --all`.

---

## 9. Краткий итог

Решение уже является рабочим Nx-monorepo с хорошей доменной структурой, но пока это **монолитное приложение, разложенное по библиотекам**, а не переиспользуемая платформа:

- версии сильно отстают, сборщик legacy;
- библиотеки не изолированы и не публикуются;
- конфигурация и брендинг захардкожены;
- границы модулей не работают;
- в репозитории есть секрет, два lock-файла и сгенерированный мусор.

Предложенные промты решают задачи последовательно:

1. **Перенос** — безопасно переместить workspace, не потеряв историю и не сломав пути.
2. **Обновление** — пройти Nx 19 → 24 и Angular 18 → 22 пошагово, с проверкой после каждого мажора.
3. **Переиспользование** — вынести конфигурацию, исправить границы, сделать библиотеки публикуемыми и подготовить шаблон/генератор для новых проектов.
4. **Новый проект** — создать приложение на общих библиотеках без копирования кода.

Главное правило: **сначала план и backup, потом изменения; после каждого этапа — проверка и коммит**.

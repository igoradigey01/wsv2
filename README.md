# Wsv2
 - new repository for all fornt prodjects x...01

## Local setup (first run)

The file `apps/xf01/src/environments/environment.ts` is intentionally **not tracked**
(it holds a machine-specific build flag). Create it before the first build:

```ts
export const environment = {
  production: 1
  // 0 - app_environments.prod.json (default)
  // 1 - app_environments.local_vm.json (localhost:8080 / shop:8080)
  // 2 - app_environments.local.json (localhost:5010)
};
```

```bash
npm install
npx nx serve xf01
```

Node.js >= 22.22.3 is required (see `.nvmrc`), package manager is **npm**.

## Выбор API-окружения (app `x01`)

Значение `production` в `apps/x01/src/environments/environment.ts` определяет, какой
файл `apps/x01/src/assets/app_environments/app_environments.*.json` загрузит приложение
(логика выбора — в `provideAppInitializer` в `apps/x01/src/app/app.config.ts`).

| `production` | Файл | `serverUri` (API) | `shopUri` (витрина) | `serverAuthUri` (identity) |
|---|---|---|---|---|
| `0` (default) | `app_environments.prod.json` | `https://s.x-01.ru/` | `http://localhost:5250/` * | `https://s.x-01.ru/` |
| `1` | `app_environments.local_vm.json` | `http://shop:8080/` | `http://localhost:5250/` | `http://shop:8080/` |
| `2` | `app_environments.local.json` | `http://localhost:5250/` | `http://localhost:5250/` | `http://localhost:5250/` |

Ключи:
- `serverUri` — базовый адрес API (`/api/...`);
- `shopUri` — адрес витрины (новый `ShopApi` на SkladDB, `/api/shop/...`);
- `serverAuthUri` — identity / аутентификация.

Текущий режим: **`production: 2`** → `app_environments.local.json` — все запросы идут на
`http://localhost:5250/` (ShopApi).

\* в `prod.json` `shopUri` пока заглушка (`http://localhost:5250/`) — при боевом деплое
заменить на реальный адрес ShopApi.

## документация в папке 'docs'
  - help : go in dir docs

## LICENSE
 - MIT License
 
### Angular && NX
  - Nx  v 16 
  - Angular v 16 
  - [monorepo](https://nx.dev/getting-started/why-nx)

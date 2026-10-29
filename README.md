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

## документация в папке 'docs'
  - help : go in dir docs

## LICENSE
 - MIT License
 
### Angular && NX
  - Nx  v 16 
  - Angular v 16 
  - [monorepo](https://nx.dev/getting-started/why-nx)

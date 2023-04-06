## App Config fom invironment

[help](https://stackoverflow.com/questions/52346969/how-to-use-app-environment-ts-in-libs-in-nrwl-nx-workspace)

### Create app-config\*lib

```
   create : interface  -> environment.model.ts
   create : const APP_CONFIG  -> app-config.module.ts
   create : export * from   -> index.ts
```

### add providers in main.ts app

```
  { provide: APP_CONFIG, useValue: environment}
```

### use providers

```
 create: constructor(@Inject(APP_CONFIG) appConfig: IEnvironment )
 -> libs/account/src/lib/shared/services/route-api.service.ts
```

## APP_INITIALIZER App Config from file.json

### external help and sample

[help](https://github.com/profanis/codeShotsWithProfanis/tree/44/environmental_variables_app_initializer) <br>
[ru help](https://blog.zverit.com/frontend/2017/06/17/app-initializer-bootstrap-service-method/?ysclid=lg0d0lnguq440310501) <br>

### Create app-config\*lib

```
create : interface  ->meny-items.model.ts
create : services -> meny-items.service.ts
create : export * from ''  -> index.ts
```

### add providers in main.ts app

```
  {provide: APP_INITIALIZER,
   useFactory: () => {
     const menyItemsService = inject(MenyItemsService);

     const http = inject(HttpClient);
      return()=>
        new Promise((resolve)=>{
           // load settings for a local app
         //console.log("--promise is ok--")
         http
         .get('assets/meny_items_assembly/index-meny-items.json')
         .pipe(
            tap((data: any) => {
             menyItemsService.shopMenyItems = data;
             console.log("--promise is ok--");
             resolve(true);
              }))
         .subscribe();
          resolve(true)
          });
     }

   ,multi:true},
```

### use providers

```
 create:
  constructor(
    private repozitory:MenyItemsService,
    ) {}
 -> libs/app-layuot/src/lib/header/header.component.ts
```

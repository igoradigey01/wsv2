## App Config fom invironment
 [help](https://stackoverflow.com/questions/52346969/how-to-use-app-environment-ts-in-libs-in-nrwl-nx-workspace)
### Create app-lib
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
[help](https://errorsfixing.com/customer-specific-environment-variables-or-configuration-nx-angular/)
[ru help](https://blog.zverit.com/frontend/2017/06/17/app-initializer-bootstrap-service-method/?ysclid=lg0d0lnguq440310501)

  ### add in Create app-lib
  ```
  create : interface  -> company.model.ts
  ```
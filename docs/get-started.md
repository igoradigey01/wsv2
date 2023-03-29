## добавить app or lib

```
--create emty wokspase
npx create-nx-workspace@latest

--add angular


--create angular app
-init workspase in nx console and create app; 
   or
nx generate @nrwl/angular:application x01
 nx init  // если замена ssd (жесткого диска)
 --monorepo уже создано--
 установить расшиерие 'Nx Console'
 выбрать рабрать dir
 добавить app or lib выбрав меню 'generate' в 'Nx console'
```

## Add License to repo

[gitHub](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)

### Version package

ng version </br>
node -v </br>
npx -v </br>
nx init <br>
[обновить node.js download](https://nodejs.org/en/download/) </br>

### Nx очистить кеш

nx clear-cache  
 npm cache clean --force

## добавить

### angular-material , angular-animations and angular-cdk

yarn add @angular/material @angular/cdk @angular/animations

### External Provider для lib account

yarn add i @abacritt/angularx-social-login <br/>
[help and sample](https://code-maze.com/how-to-sign-in-with-google-angular-aspnet-webapi/)<br/>

### Over External Provider

https://github.com/Mawi137/ngx-image-cropper <br/>
https://github.com/parallax/jsPDF<br/>
https://www.npmjs.com/package/ng-qrcode<br/>
https://material.angular.io/components/categories <br/>

## assets in libs/ui img-render is ok

```
[libs/xl01/ui/src/assets/logo1.jpg]
[libs/xl01/ui/src/lib/img-render.componet.html ]
<img height="60" width="300" src="/assets/ui/logo1.jpg">

[apps/xl01/project.json]

"assets": ["apps/xl01/src/favicon.ico",
           "apps/xl01/src/assets",
         {"input" :"libs/xl01/ui/src/assets",
          "glob":"**/*",
          "output":"assets/ui"
         }]

restart nx server !!!
```
## Enviropment date on developer or deploy
```
 // creat dir apps/xl-01/src/environments  on project !!!

  // в project.json указываем 
   "fileReplacements": [
            {
              "replace": "apps/xl-01/src/environments/environment.ts",
              "with": "apps/xl-01/src/environments/environment.prod.ts"
            }],
```
## Lazy load component or module
```
// Standalone Componet
{
        path: 'manager',              
  //!!!-->      loadComponent: () =>
          import('./manager/manager.component').then((m) => m.ManagerComponent)
 },

 //Module
 {
        path: 'account',              
   //!!!-->      loadChildren: () =>
          import('@wsv2/account').then((m) => m.AccountModule)
}
```
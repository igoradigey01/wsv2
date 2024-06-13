
## ChangeDetectionStrategy.OnPush
  1. doc
    - [help-angular-doc-ru](https://angdev.ru/doc/angular-change-detection/#changedetectionstrategy)
    - [help_ru] (https://habr.com/ru/companies/infopulse/articles/358860/)

  2.  Сервис ChangeDetectorRef  // Ручной запуск обнаружения изменений
    
      - detectChanges()  // говорит Angular запустить обнаружение изменений в компоненте и его потомках.
      -  ApplicationRef.tick()  //говорит Angular запустить обнаружение изменений во всем приложении.
      - markForCheck()    //не триггерит запуск обнаружения изменений. Вместо этого он помечает компонент и всех его родителей, что они должны быть проверены в текущем или следующем цикле обнаружения изменений.

## Angular Signal
 - см sigal-help.md

## Angular Update for 16 vertion
  - https://update.angular.io
  - https://drive.google.com/file/d/1Dk3DFp7jEFEUT_j4xyydha_lDIusXuvt/view

 1. node -v 
 2. tsc -v //TypeScript version
    - yarn  add typescript@latest
 3. npm list zone.js // zone version
    - yarn add zone.js
 4. 
    -yarn  add @angular/cli
 5. 
   - nx migrate  @angular/cli
 6. 
   - nx repair
 7. 
   - nx migrate @angular/core 
   - yarn nx migrate --run-migrations
 8. 
   - yarn add  @angular/material
   - yarn add @angular/cdk
   -// yarn nx migrate --run-migrations
  9. 
   - nx migrate latest

  10.  in cmd admin:
   -   yarn nx migrate --run-migrations
   -  delete migrations.json 
   -   commit 
 * . -------------------------------------------------------------------------  
   ### Edit error 
    - yarn add  angular8-yandex-maps

  ## Angular Update for 17 vertion
  - https://update.angular.io/?v=16.0-17.0
  - 

 1. node -v 
 2. tsc -v //TypeScript version  
   - https://metanit.com/web/typescript/1.2.php
   - yarn  add typescript@latest
   - yarn upgrade typescript //?
   - Version 3.8.3
 3. npm list zone.js // zone version
    - yarn  add zone.js  
    - zone.js@0.14.2
  4. nx migrate latest 
   //  NX   Command failed: npm install @nx/jest@17.1.2  
  - yarn  add @nx/jest@17.1.2 
  -  nx migrate latest  
  //  NX   Command failed: npm install @angular/material@~17.0.0
  -  yarn  add @angular/material@~17.0.0
    -  nx migrate latest  
  5. yarn nx migrate --run-migrations  
   //error An unexpected error occurred: "EPERM: operation not permitted, unlink 'D:\\NXWs_v2\\wsv2\\node_modules\\@nx\\nx-win32-x64-msvc\\nx.win32-x64-msvc.node'".
   - yarn  add @angular/core@17 @angular/cli@17
   // error 
   - yarn global add @angular/core@17
   - yarn global add  @angular/cli@17
    // error
   6. run vs as admin - это ошибочно 
    - yarn nx migrate --run-migrations 
     // error 
    - yarn install
    - npx nx@latest init
   7. 
      // https://stackoverflow.com/questions/47778492/npm-install-error-eperm-operation-not-permitted
      - delete package-locket.json 
       - yarn install
      - yarn nx migrate --run-migrations 
      - yarn add  @angular/cdk

   ## Yarn update
      - yarn set version latest
   ##   Migration w10 to ubuntu
    -  node -v
    -  tsc -v
    -  sudo npm install -g yarn
    -  yarn --v
    ## tsc 
    -  sudo npm uninstall -g typescript@5.4.5 
    -  rm -rf ./node_modules/.cache/nx
         
     

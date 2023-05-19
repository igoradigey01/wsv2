
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
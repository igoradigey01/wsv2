## Angular Signal
- https://github.com/angular/angular/blob/main/packages/core/src/signals/README.md
- https://habr.com/ru/articles/726886/
- !!! https://blog.ninja-squad.com/2023/04/26/angular-signals/
- https://dev.to/this-is-angular/angular-signals-everything-you-need-to-know-2b7g
- https://www.freecodecamp.org/news/angular-signals/

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

   The @angular/cdk and @angular/material packages are ignored as well

 ## vertion nx and vertion angular
 - https://nx.dev/packages/angular/documents/angular-nx-version-matrix#nx-and-angular-versions
import { Route } from '@angular/router';

export const appRoutes: Route[] = [

    {
        path: 'account',              
        loadChildren: () =>
          import('@wsv2/account').then((m) => m.AccountModule),
      }
];


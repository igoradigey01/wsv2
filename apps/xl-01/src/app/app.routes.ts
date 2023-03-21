import { Route } from '@angular/router';

import  {IndexComponent} from './index/index.component';
//import {PageNotFoundComponent} from '@wsv2/app-common'


export const appRoutes: Route[] = [

    {
        path: '',              
       component:IndexComponent,
       pathMatch: 'full'
      },
     
      {
        path: 'manager',              
        loadComponent: () =>
          import('./manager/manager.component').then((m) => m.ManagerComponent)
      },
      
      {
        path: 'admin',              
        loadComponent: () =>
          import('./admin/admin.component').then((m) => m.AdminComponent)
      },
    {
        path: 'account',              
        loadChildren: () =>
          import('@wsv2/account').then((m) => m.AccountModule)
      }
      
      ,
      {
        path: '**',
        loadChildren: () =>
        import('@wsv2/app-common').then((m) => m.App01CommonModule)
      }
];


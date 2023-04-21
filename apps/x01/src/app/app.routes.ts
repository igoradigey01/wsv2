import { Route } from '@angular/router';

import  {IndexComponent} from './index/index.component';
//import {PageNotFoundComponent} from '@wsv2/app-common'


export const appRoutes: Route[] = [
         
  { path: '',   redirectTo: 'index', pathMatch: 'full' },
   
      {
        path: 'index',              
       component:IndexComponent,
       children: [
        {
          path: '',
          loadComponent: () =>
          import('@wsv2/shop-content').then((m) => m.IndexShopComponent)
        },
        {
          path: 'account',              
          loadChildren: () =>
            import('@wsv2/account').then((m) => m.AccountModule)
        },
    
    
        {
          path: 'menu',
          loadChildren: () =>
            import('@wsv2/shop-information').then(
              (m) => m.ShopInformationModule
            ),
        } ,
        // {
        //   path: 'content',
        //   loadChildren: () =>
        //     import('@x01-v1/xl01/content-section').then(
        //       (module) => module.Xl01ContentSectionModule
        //     ),
        // },
        {
          path: '**',
        loadComponent: () =>
        import('@wsv2/app-common').then((c) => c.PageNotFoundComponent)
        }
      ],
       
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
      { path: '**',   redirectTo: 'index/**', pathMatch: 'full' },
      
    
];


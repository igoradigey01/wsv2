import { Route } from '@angular/router';

import { IndexComponent } from './index/index.component';
//import {PageNotFoundComponent} from '@wsv2/app-common'


export const appRoutes: Route[] = [

  { path: '', redirectTo: 'index', pathMatch: 'full' },

  {
    path: 'index',
    component: IndexComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@wsv2/shop-content').then((m) => m.IndexShopComponent)
      },
      {
        path: 'katalogs/:id',
        loadComponent: () =>
          import('@wsv2/shop-sub-content').then((m) => m.SubCatalogComponent),
      },
      {
        path: 'katalogs/:id/products/:id',
        loadComponent: () =>
          import('@wsv2/shop-sub-content').then((m) => m.ProductComponent),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('@wsv2/account').then((m) => m.AccountModule)
      },

      {
        path: 'user-profile',
        loadComponent: () =>
          import('@wsv2/user-profile').then((m) => m.UserProfileShellComponent),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('@wsv2/shop-cart').then((m) => m.CartShellComponent)
      },
      {
        path: 'order',
        loadComponent: () =>
          import('@wsv2/shop-order').then((m) => m.OrdersShellComponent)
      },

      {
        path: 'opt',
        loadComponent: () =>
          import('@wsv2/shop-opt').then((m) => m.OptSignInComponent),
      },


      {
        path: 'menu',
        loadChildren: () =>
          import('@wsv2/shop-information').then(
            (m) => m.ShopInformationModule
          ),
      },

      
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
      import('@wsv2/manage-page').then((m) => m.IndexComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@wsv2/manage-page').then((m) => m.IndexInfoComponent),
      },
      {
        path: 'info',
        loadComponent: () =>
          import('@wsv2/manage-page').then((m) => m.InfoComponent ),
      },

      
      {
        path: '**',
        loadComponent: () =>
          import('@wsv2/app-common').then((c) => c.PageNotFoundComponent),
      },
    ]
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('@wsv2/admin-page').then((m) => m.IndexComponent)
  },
  { path: '**', redirectTo: 'index/**', pathMatch: 'full' },



];


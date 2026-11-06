import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'clients' },
  {
    path: 'clients',
    loadComponent: () =>
      import('./clients/clients-page.component').then(
        (m) => m.ClientsPageComponent,
      ),
  },
  {
    path: 'clients/:id/invoice/new',
    loadComponent: () =>
      import('./invoice/invoice-page.component').then(
        (m) => m.InvoicePageComponent,
      ),
  },
  {
    path: 'clients/:id/payment/new',
    loadComponent: () =>
      import('./coming-soon/coming-soon.component').then(
        (m) => m.ComingSoonComponent,
      ),
    data: { title: 'Приём денег' },
  },
  {
    path: 'clients/:id',
    loadComponent: () =>
      import('./clients/client-detail.component').then(
        (m) => m.ClientDetailComponent,
      ),
  },
  { path: '**', redirectTo: 'clients' },
];

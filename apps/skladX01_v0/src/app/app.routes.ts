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
    path: 'suppliers',
    loadComponent: () =>
      import('./suppliers/suppliers-page.component').then(
        (m) => m.SuppliersPageComponent,
      ),
    data: { title: 'Поставщики' },
  },
  {
    path: 'suppliers/:id/receipt/new',
    loadComponent: () =>
      import('./suppliers/receipt-page.component').then(
        (m) => m.ReceiptPageComponent,
      ),
    data: { title: 'Приход товара' },
  },
  {
    path: 'nomenclature/quick-add',
    loadComponent: () =>
      import('./nomenclature/nomenclature-quick-add.component').then(
        (m) => m.NomenclatureQuickAddComponent,
      ),
    data: { title: 'Быстрый ввод позиции' },
  },
  {
    path: 'nomenclature/card',
    loadComponent: () =>
      import('./nomenclature/item-card.component').then(
        (m) => m.ItemCardComponent,
      ),
    data: { title: 'Карточка товара' },
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

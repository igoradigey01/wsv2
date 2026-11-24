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
    path: 'suppliers/:id',
    loadComponent: () =>
      import('./suppliers/supplier-detail.component').then(
        (m) => m.SupplierDetailComponent,
      ),
    data: { title: 'Поставщик' },
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
      import('./clients/payment-page.component').then(
        (m) => m.PaymentPageComponent,
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
  {
    path: 'admin',
    pathMatch: 'full',
    redirectTo: 'admin/card',
  },
  {
    path: 'admin/card',
    loadComponent: () =>
      import('./nomenclature/admin-item-card.component').then(
        (m) => m.AdminItemCardComponent,
      ),
    data: { title: 'Карточка товара' },
  },
  {
    path: 'admin/types',
    loadComponent: () =>
      import('./nomenclature/reference-admin.component').then(
        (m) => m.ReferenceAdminComponent,
      ),
    data: { title: 'Тип номенклатуры', kind: 'types' },
  },
  {
    path: 'admin/groups',
    loadComponent: () =>
      import('./nomenclature/reference-admin.component').then(
        (m) => m.ReferenceAdminComponent,
      ),
    data: { title: 'Группа номенклатуры', kind: 'groups' },
  },
  {
    path: 'admin/kinds',
    loadComponent: () =>
      import('./nomenclature/reference-admin.component').then(
        (m) => m.ReferenceAdminComponent,
      ),
    data: { title: 'Вид номенклатуры', kind: 'kinds' },
  },
  { path: '**', redirectTo: 'clients' },
];

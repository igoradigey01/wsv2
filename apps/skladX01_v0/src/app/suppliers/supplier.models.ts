// Сырой ответ API. Ключи — camelCase с кириллицей, как отдаёт System.Text.Json.
// В шаблонах Angular такие имена использовать нельзя (NG5002), поэтому
// сервис приводит их к ISupplier / IWarehouse / ISupplierSummary и т. д.
export interface ISupplierApi {
  id: number;
  название: string;
  город?: string | null;
  телефон?: string | null;
}

export interface IWarehouseApi {
  id: number;
  название: string;
  псевдоним: string;
}

export interface ISupplierSummaryApi {
  поставщикId: number;
  название: string;
  город?: string | null;
  телефон?: string | null;
  сделок: number;
  получено: number;
  отдано: number;
  долг: number;
  переплата: number;
}

export interface ISupplierDealApi {
  id: string;
  номер: string;
  долг: number;
  комментарий?: string | null;
}

export interface IReceivedGoodApi {
  id: string;
  номер: string;
  дата: string;
  сумма: number;
  сделкаId: string;
}

export interface ISupplierPaymentApi {
  id: number;
  дата: string;
  сумма: number;
  сделкаId: string;
}

export interface ISupplier {
  id: number;
  name: string;
  city: string;
  phone: string;
}

export interface IWarehouse {
  id: number;
  name: string;
  alias: string;
}

export interface ISupplierSummary {
  supplierId: number;
  name: string;
  city: string;
  phone: string;
  deals: number;
  received: number;
  paid: number;
  debt: number;
  overpayment: number;
}

export interface ISupplierDeal {
  id: string;
  number: string;
  debt: number;
  comment: string | null;
}

export interface IReceivedGood {
  id: string;
  number: string;
  date: string;
  amount: number;
  dealId: string;
}

export interface ISupplierPayment {
  id: number;
  date: string;
  amount: number;
  dealId: string;
}

export type SupplierSortKey = 'id' | 'name' | 'city';
export type SortDirection = 'asc' | 'desc';

export interface ISupplierQuery {
  q?: string;
  sort: SupplierSortKey;
  dir: SortDirection;
}

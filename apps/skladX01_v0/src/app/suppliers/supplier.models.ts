// Сырой ответ API. Ключи — camelCase с кириллицей, как отдаёт System.Text.Json.
// В шаблонах Angular такие имена использовать нельзя (NG5002), поэтому
// сервис приводит их к ISupplier / IWarehouse.
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

export type SupplierSortKey = 'id' | 'name' | 'city';
export type SortDirection = 'asc' | 'desc';

export interface ISupplierQuery {
  q?: string;
  sort: SupplierSortKey;
  dir: SortDirection;
}

// Сырой ответ API. Ключи — camelCase с кириллицей, как отдаёт System.Text.Json.
// В шаблонах Angular такие имена использовать нельзя (NG5002), поэтому
// сервис приводит их к IClient / IClientSummary.
export interface IClientApi {
  id: number;
  псевдоним: string;
  фио: string;
  телефон: string;
  город: string;
  пределКредита: number;
  активен: boolean;
}

export interface IClientSummaryApi {
  клиентId: number;
  псевдоним: string;
  пределКредита: number;
  активен: boolean;
  сделок: number;
  активныхСделок: number;
  отгружено: number;
  оплачено: number;
  долг: number;
  переплата: number;
  превышенЛимит: boolean;
}

export interface IMarkApi {
  id: string;
  номер: string;
  долг: number;
}

export interface IShippedGoodApi {
  id: number;
  номер: string;
  дата: string;
  сумма: number;
  сделкаId: string;
}

export interface IPaymentApi {
  id: number;
  дата: string;
  сумма: number;
  сделкаId: string;
}

export interface IClient {
  id: number;
  alias: string;
  fullName: string;
  phone: string;
  city: string;
  creditLimit: number;
  active: boolean;
}

export interface IMark {
  id: string;
  number: string;
  debt: number;
}

export interface IShippedGood {
  id: number;
  number: string;
  date: string;
  amount: number;
  dealId: string;
}

export interface IPayment {
  id: number;
  date: string;
  amount: number;
  dealId: string;
}

export interface IClientSummary {
  clientId: number;
  alias: string;
  creditLimit: number;
  active: boolean;
  deals: number;
  activeDeals: number;
  shipped: number;
  paid: number;
  debt: number;
  overpayment: number;
  limitExceeded: boolean;
}

export type ClientSortKey = 'id' | 'alias' | 'name' | 'phone' | 'city';
export type SortDirection = 'asc' | 'desc';

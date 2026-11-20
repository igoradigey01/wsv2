import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type {
  ClientSortKey,
  IClient,
  IClientApi,
  IClientSummary,
  IClientSummaryApi,
  IInvoiceRow,
  IInvoiceRowApi,
  IInvoiceRowUpdate,
  IMark,
  IMarkApi,
  IPayment,
  IPaymentApi,
  IShippedGood,
  IShippedGoodApi,
  SortDirection,
} from './client.models';

const API = '/api/clients';

export interface IClientCandidate {
  id: number;
  alias: string;
  fullName: string;
  phone: string;
  city: string;
  score: number;
  matchedField: string;
}

export interface ICreateDealRequest {
  дата?: string;
  комментарий?: string;
}

/** Тело POST: приём денег от клиента по сделке. */
export interface ICreatePaymentRequest {
  дата: string;
  сумма: number;
  способОплаты: number;
  номерДокумента: string | null;
  комментарий: string | null;
}

export interface IClientQuery {
  q?: string;
  sort: ClientSortKey;
  dir: SortDirection;
}

export function mapClient(raw: IClientApi): IClient {
  return {
    id: raw.id,
    alias: raw.псевдоним,
    fullName: raw.фио,
    phone: raw.телефон,
    city: raw.город,
    creditLimit: raw.пределКредита,
    active: raw.активен,
  };
}

export function mapClientSummary(raw: IClientSummaryApi): IClientSummary {
  return {
    clientId: raw.клиентId,
    alias: raw.псевдоним,
    creditLimit: raw.пределКредита,
    active: raw.активен,
    deals: raw.сделок,
    activeDeals: raw.активныхСделок,
    shipped: raw.отгружено,
    paid: raw.оплачено,
    debt: raw.долг,
    overpayment: raw.переплата,
    limitExceeded: raw.превышенЛимит,
  };
}

export function mapMark(raw: IMarkApi): IMark {
  return {
    id: raw.id,
    number: raw.номер,
    debt: raw.долг,
    comment: raw.комментарий ?? null,
  };
}

export function mapShippedGood(raw: IShippedGoodApi): IShippedGood {
  return {
    id: raw.id,
    number: raw.номер,
    date: raw.дата,
    amount: raw.сумма,
    dealId: raw.сделкаId,
    edited: raw.изменялась ?? false,
  };
}

export function mapPayment(raw: IPaymentApi): IPayment {
  return {
    id: raw.id,
    date: raw.дата,
    amount: raw.сумма,
    dealId: raw.сделкаId,
    paymentMethod: raw.способОплаты ?? 1,
    documentNumber: raw.номерДокумента ?? null,
    comment: raw.комментарий ?? null,
    edited: raw.изменялась ?? false,
  };
}

export function mapInvoiceRow(raw: IInvoiceRowApi): IInvoiceRow {
  return {
    id: raw.id,
    nomenclatureId: raw.номенклатураId,
    name: raw.номенклатура,
    quantity: raw.количество,
    price: raw.цена,
    amount: raw.сумма,
  };
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);

  getClients(query: IClientQuery): Observable<IClient[]> {
    let params = new HttpParams()
      .set('sort', query.sort)
      .set('dir', query.dir);

    if (query.q) {
      params = params.set('q', query.q);
    }

    return this.http
      .get<IClientApi[]>(API, { params })
      .pipe(map((clients) => clients.map(mapClient)));
  }

  /** Поиск клиента по продиктованному тексту. */
  voiceSearch(rawText: string): Observable<IClientCandidate[]> {
    return this.http.post<IClientCandidate[]>(`${API}/voice-search`, { rawText });
  }

  getSummary(clientId: number): Observable<IClientSummary> {
    return this.http
      .get<IClientSummaryApi>(`${API}/${clientId}/summary`)
      .pipe(map(mapClientSummary));
  }

  getClient(clientId: number): Observable<IClient> {
    return this.http
      .get<IClientApi>(`${API}/${clientId}`)
      .pipe(map(mapClient));
  }

  createMark(clientId: number, body: ICreateDealRequest): Observable<IMark> {
    return this.http
      .post<IMarkApi>(`${API}/${clientId}/marks`, body)
      .pipe(map(mapMark));
  }

  getMarks(clientId: number): Observable<IMark[]> {
    return this.http
      .get<IMarkApi[]>(`${API}/${clientId}/marks`)
      .pipe(map((marks) => marks.map(mapMark)));
  }

  getProducts(dealId: string): Observable<IShippedGood[]> {
    return this.http
      .get<IShippedGoodApi[]>(`${API}/marks/${dealId}/products`)
      .pipe(map((products) => products.map(mapShippedGood)));
  }

  getPayments(dealId: string): Observable<IPayment[]> {
    return this.http
      .get<IPaymentApi[]>(`${API}/marks/${dealId}/payments`)
      .pipe(map((payments) => payments.map(mapPayment)));
  }

  /** Строки накладной — количество и цена редактируются. */
  getInvoiceRows(dealId: string, invoiceId: number): Observable<IInvoiceRow[]> {
    return this.http
      .get<IInvoiceRowApi[]>(`${API}/marks/${dealId}/products/${invoiceId}/rows`)
      .pipe(map((rows) => rows.map(mapInvoiceRow)));
  }

  updateInvoiceRows(
    dealId: string,
    invoiceId: number,
    rows: IInvoiceRowUpdate[],
  ): Observable<IInvoiceRow[]> {
    const body = {
      строки: rows.map((row) => ({
        id: row.id,
        количество: row.quantity,
        цена: row.price,
      })),
    };

    return this.http
      .put<IInvoiceRowApi[]>(
        `${API}/marks/${dealId}/products/${invoiceId}`,
        body,
      )
      .pipe(map((updated) => updated.map(mapInvoiceRow)));
  }

  /** Меняется только сумма платежа. */
  updatePayment(
    dealId: string,
    paymentId: number,
    amount: number,
  ): Observable<IPayment> {
    return this.http
      .put<IPaymentApi>(`${API}/marks/${dealId}/payments/${paymentId}`, {
        сумма: amount,
      })
      .pipe(map(mapPayment));
  }

  /** Принимает деньги от клиента по сделке. */
  createPayment(
    dealId: string,
    body: ICreatePaymentRequest,
  ): Observable<IPayment> {
    return this.http
      .post<IPaymentApi>(`${API}/marks/${dealId}/payments`, body)
      .pipe(map(mapPayment));
  }
}

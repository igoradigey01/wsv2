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
  IMark,
  IMarkApi,
  IPayment,
  IPaymentApi,
  IShippedGood,
  IShippedGoodApi,
  SortDirection,
} from './client.models';

const API = '/api/clients';

export interface ICreateDealRequest {
  дата?: string;
  комментарий?: string;
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
  };
}

export function mapShippedGood(raw: IShippedGoodApi): IShippedGood {
  return {
    id: raw.id,
    number: raw.номер,
    date: raw.дата,
    amount: raw.сумма,
    markId: raw.меткаId,
  };
}

export function mapPayment(raw: IPaymentApi): IPayment {
  return {
    id: raw.id,
    date: raw.дата,
    amount: raw.сумма,
    markId: raw.меткаId,
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

  getProducts(markId: string): Observable<IShippedGood[]> {
    return this.http
      .get<IShippedGoodApi[]>(`${API}/marks/${markId}/products`)
      .pipe(map((products) => products.map(mapShippedGood)));
  }

  getPayments(markId: string): Observable<IPayment[]> {
    return this.http
      .get<IPaymentApi[]>(`${API}/marks/${markId}/payments`)
      .pipe(map((payments) => payments.map(mapPayment)));
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type {
  IReceivedGood,
  IReceivedGoodApi,
  ISupplier,
  ISupplierApi,
  ISupplierDeal,
  ISupplierDealApi,
  ISupplierPayment,
  ISupplierPaymentApi,
  ISupplierQuery,
  ISupplierSummary,
  ISupplierSummaryApi,
  IWarehouse,
  IWarehouseApi,
} from './supplier.models';

const API = '/api/suppliers';
const WAREHOUSES_API = '/api/warehouses';

export function mapSupplier(raw: ISupplierApi): ISupplier {
  return {
    id: raw.id,
    name: raw.название,
    city: raw.город ?? '',
    phone: raw.телефон ?? '',
  };
}

export function mapWarehouse(raw: IWarehouseApi): IWarehouse {
  return {
    id: raw.id,
    name: raw.название,
    alias: raw.псевдоним,
  };
}

export function mapSupplierSummary(
  raw: ISupplierSummaryApi,
): ISupplierSummary {
  return {
    supplierId: raw.поставщикId,
    name: raw.название,
    city: raw.город ?? '',
    phone: raw.телефон ?? '',
    deals: raw.сделок,
    received: raw.получено,
    paid: raw.отдано,
    debt: raw.долг,
    overpayment: raw.переплата,
  };
}

export function mapSupplierDeal(raw: ISupplierDealApi): ISupplierDeal {
  return {
    id: raw.id,
    number: raw.номер,
    debt: raw.долг,
    comment: raw.комментарий ?? null,
  };
}

export function mapReceivedGood(raw: IReceivedGoodApi): IReceivedGood {
  return {
    id: raw.id,
    number: raw.номер,
    date: raw.дата,
    amount: raw.сумма,
    dealId: raw.сделкаId,
  };
}

export function mapSupplierPayment(
  raw: ISupplierPaymentApi,
): ISupplierPayment {
  return {
    id: raw.id,
    date: raw.дата,
    amount: raw.сумма,
    dealId: raw.сделкаId,
  };
}

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private readonly http = inject(HttpClient);

  getSuppliers(query: ISupplierQuery): Observable<ISupplier[]> {
    let params = new HttpParams()
      .set('sort', query.sort)
      .set('dir', query.dir);

    if (query.q) {
      params = params.set('q', query.q);
    }

    return this.http
      .get<ISupplierApi[]>(API, { params })
      .pipe(map((suppliers) => suppliers.map(mapSupplier)));
  }

  getSupplier(supplierId: number): Observable<ISupplier> {
    return this.http
      .get<ISupplierApi>(`${API}/${supplierId}`)
      .pipe(map(mapSupplier));
  }

  getSummary(supplierId: number): Observable<ISupplierSummary> {
    return this.http
      .get<ISupplierSummaryApi>(`${API}/${supplierId}/summary`)
      .pipe(map(mapSupplierSummary));
  }

  getDeals(supplierId: number): Observable<ISupplierDeal[]> {
    return this.http
      .get<ISupplierDealApi[]>(`${API}/${supplierId}/deals`)
      .pipe(map((deals) => deals.map(mapSupplierDeal)));
  }

  getDealProducts(dealId: string): Observable<IReceivedGood[]> {
    return this.http
      .get<IReceivedGoodApi[]>(`${API}/deals/${dealId}/products`)
      .pipe(map((products) => products.map(mapReceivedGood)));
  }

  getDealPayments(dealId: string): Observable<ISupplierPayment[]> {
    return this.http
      .get<ISupplierPaymentApi[]>(`${API}/deals/${dealId}/payments`)
      .pipe(map((payments) => payments.map(mapSupplierPayment)));
  }

  getWarehouses(): Observable<IWarehouse[]> {
    return this.http
      .get<IWarehouseApi[]>(WAREHOUSES_API)
      .pipe(map((warehouses) => warehouses.map(mapWarehouse)));
  }
}

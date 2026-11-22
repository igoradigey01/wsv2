import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type {
  IReceivedGood,
  IReceivedGoodApi,
  IReceiptRow,
  IReceiptRowApi,
  IReceiptRowUpdate,
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

/** Строка новой приходной накладной для POST /api/suppliers/deals/{dealId}/receipts. */
export interface ICreateReceiptRow {
  номенклатураId: number;
  количество: number;
  цена: number;
}

export interface ICreateReceiptRequest {
  дата: string | null;
  комментарий: string | null;
  строки: ICreateReceiptRow[];
}

/** Ответ POST: созданная приходная накладная (ПолученныйТоварDto). */
export interface ICreatedReceiptApi {
  id: string;
  номер: string;
  дата: string;
  сумма: number;
  сделкаId: string;
  auditId: number;
  изменялась: boolean;
}

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
    auditId: raw.auditId,
    edited: raw.изменялась ?? false,
  };
}

export function mapReceiptRow(raw: IReceiptRowApi): IReceiptRow {
  return {
    id: raw.id,
    nomenclatureId: raw.номенклатураId,
    name: raw.номенклатура,
    quantity: raw.количество,
    price: raw.цена,
    amount: raw.сумма,
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
    edited: raw.изменялась ?? false,
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

  /** Строки приходной накладной для окна редактирования. */
  getReceiptRows(
    dealId: string,
    receiptId: string,
  ): Observable<IReceiptRow[]> {
    return this.http
      .get<IReceiptRowApi[]>(
        `${API}/deals/${dealId}/receipts/${receiptId}/rows`,
      )
      .pipe(map((rows) => rows.map(mapReceiptRow)));
  }

  updateReceiptRows(
    dealId: string,
    receiptId: string,
    rows: IReceiptRowUpdate[],
  ): Observable<IReceiptRow[]> {
    const body = {
      строки: rows.map((row) => ({
        id: row.id,
        количество: row.quantity,
        цена: row.price,
      })),
    };

    return this.http
      .put<IReceiptRowApi[]>(
        `${API}/deals/${dealId}/receipts/${receiptId}`,
        body,
      )
      .pipe(map((result) => result.map(mapReceiptRow)));
  }

  updateSupplierPayment(
    dealId: string,
    paymentId: number,
    amount: number,
  ): Observable<ISupplierPayment> {
    return this.http
      .put<ISupplierPaymentApi>(
        `${API}/deals/${dealId}/payments/${paymentId}`,
        { сумма: amount },
      )
      .pipe(map(mapSupplierPayment));
  }

  /** Создаёт приходную накладную поставщика (строки в dbo.Приход). */
  createReceipt(
    dealId: string,
    body: ICreateReceiptRequest,
  ): Observable<ICreatedReceiptApi> {
    return this.http.post<ICreatedReceiptApi>(
      `${API}/deals/${dealId}/receipts`,
      body,
    );
  }

  getWarehouses(): Observable<IWarehouse[]> {
    return this.http
      .get<IWarehouseApi[]>(WAREHOUSES_API)
      .pipe(map((warehouses) => warehouses.map(mapWarehouse)));
  }
}

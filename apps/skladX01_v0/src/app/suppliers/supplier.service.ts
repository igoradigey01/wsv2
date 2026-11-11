import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type {
  ISupplier,
  ISupplierApi,
  ISupplierQuery,
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

  getWarehouses(): Observable<IWarehouse[]> {
    return this.http
      .get<IWarehouseApi[]>(WAREHOUSES_API)
      .pipe(map((warehouses) => warehouses.map(mapWarehouse)));
  }
}

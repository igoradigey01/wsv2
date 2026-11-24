import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';

export interface IReference {
  id: number;
  name: string;
}

export interface IType {
  id: number;
  name: string;
  description: string;
}

export interface IReferences {
  groups: IReference[];
  kinds: IReference[];
  types: IType[];
  units: IReference[];
}

export interface IAdminItem {
  id: number;
  code: string;
  article: string;
  name: string;
  typeId: number;
  type: string;
  groupId: number | null;
  group: string;
  kindId: number | null;
  kind: string;
  purchasePrice: number | null;
  salePrice: number | null;
  createdAt: string;
}

export interface IAdminFilters {
  q?: string;
  typeId?: number | null;
  groupId?: number | null;
  kindId?: number | null;
  limit?: number;
}

export interface IUpdateNomenclature {
  name?: string;
  shortName?: string;
  article?: string;
  groupId?: number;
  typeId?: number;
  kindId?: number;
  purchasePrice?: number;
  salePrice?: number;
}

export type ReferenceKind = 'types' | 'groups' | 'kinds';

interface IReferenceApi {
  id: number;
  название: string;
}

interface ITypeApi {
  id: number;
  название: string;
  описание?: string | null;
}

interface IReferencesApi {
  группы: IReferenceApi[];
  виды: IReferenceApi[];
  типы: ITypeApi[];
  единицы: IReferenceApi[];
}

interface IAdminItemApi {
  id: number;
  код: string;
  артикул?: string | null;
  название: string;
  типId: number;
  тип?: string | null;
  группаId?: number | null;
  группа?: string | null;
  видId?: number | null;
  вид?: string | null;
  ценаЗакупочная?: number | null;
  ценаПродажная?: number | null;
  датаСоздания: string;
}

function mapRef(raw: IReferenceApi): IReference {
  return { id: raw.id, name: raw.название };
}

@Injectable({ providedIn: 'root' })
export class NomenclatureAdminService {
  private readonly http = inject(HttpClient);

  references(): Observable<IReferences> {
    return this.http.get<IReferencesApi>('/api/nomenclature/references').pipe(
      map((raw) => ({
        groups: raw.группы.map(mapRef),
        kinds: raw.виды.map(mapRef),
        types: raw.типы.map((t) => ({
          id: t.id,
          name: t.название,
          description: t.описание ?? '',
        })),
        units: raw.единицы.map(mapRef),
      })),
    );
  }

  adminSearch(filters: IAdminFilters): Observable<IAdminItem[]> {
    let params = new HttpParams();
    if (filters.q?.trim()) {
      params = params.set('q', filters.q.trim());
    }
    if (filters.typeId) {
      params = params.set('типId', filters.typeId);
    }
    if (filters.groupId) {
      params = params.set('группаId', filters.groupId);
    }
    if (filters.kindId) {
      params = params.set('видId', filters.kindId);
    }
    params = params.set('limit', filters.limit ?? 200);

    return this.http
      .get<IAdminItemApi[]>('/api/nomenclature/admin', { params })
      .pipe(
        map((rows) =>
          rows.map((r) => ({
            id: r.id,
            code: r.код,
            article: r.артикул ?? '',
            name: r.название,
            typeId: r.типId,
            type: r.тип ?? '',
            groupId: r.группаId ?? null,
            group: r.группа ?? '',
            kindId: r.видId ?? null,
            kind: r.вид ?? '',
            purchasePrice: r.ценаЗакупочная ?? null,
            salePrice: r.ценаПродажная ?? null,
            createdAt: r.датаСоздания,
          })),
        ),
      );
  }

  update(id: number, dto: IUpdateNomenclature): Observable<void> {
    const body = {
      название: dto.name ?? null,
      краткоеНазвание: dto.shortName ?? null,
      артикул: dto.article ?? null,
      группаId: dto.groupId ?? null,
      типId: dto.typeId ?? null,
      видНоменклатурыId: dto.kindId ?? null,
      ценаЗакупочная: dto.purchasePrice ?? null,
      ценаПродажная: dto.salePrice ?? null,
    };

    return this.http.patch<void>(`/api/nomenclature/${id}`, body);
  }

  list(kind: ReferenceKind): Observable<IType[]> {
    if (kind === 'types') {
      return this.http
        .get<ITypeApi[]>('/api/references/types')
        .pipe(
          map((rows) =>
            rows.map((r) => ({
              id: r.id,
              name: r.название,
              description: r.описание ?? '',
            })),
          ),
        );
    }

    return this.http
      .get<IReferenceApi[]>(`/api/references/${kind}`)
      .pipe(
        map((rows) =>
          rows.map((r) => ({ id: r.id, name: r.название, description: '' })),
        ),
      );
  }

  create(kind: ReferenceKind, name: string, description?: string): Observable<unknown> {
    const path =
      kind === 'types' ? 'types' : kind === 'groups' ? 'groups' : 'kinds';
    const body =
      kind === 'types'
        ? { название: name, описание: description ?? null }
        : kind === 'groups'
          ? { название: name }
          : { название: name, описание: description ?? null };

    return this.http.post(`/api/references/${path}`, body);
  }

  rename(
    kind: ReferenceKind,
    id: number,
    name: string,
    description?: string,
  ): Observable<unknown> {
    const path =
      kind === 'types' ? 'types' : kind === 'groups' ? 'groups' : 'kinds';
    const body =
      kind === 'types'
        ? { название: name, описание: description ?? null }
        : kind === 'groups'
          ? { название: name }
          : { название: name, описание: description ?? null };

    return this.http.patch(`/api/references/${path}/${id}`, body);
  }

  remove(kind: ReferenceKind, id: number): Observable<unknown> {
    const path =
      kind === 'types' ? 'types' : kind === 'groups' ? 'groups' : 'kinds';

    return this.http.delete(`/api/references/${path}/${id}`);
  }
}

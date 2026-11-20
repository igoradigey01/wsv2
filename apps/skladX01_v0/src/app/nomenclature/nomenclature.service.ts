import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Сырые ответы API — camelCase с кириллицей (System.Text.Json).
// В шаблонах кириллица недопустима (NG5002), сервис приводит к латинице.

export interface INomenclatureQuickApi {
  id: number;
  код: string;
  артикул?: string | null;
  название: string;
  едИзм: string;
  ценаЗакупочная?: number | null;
  ценаПродажная?: number | null;
}

export interface IReferenceApi {
  id: number;
  название: string;
}

export interface IReferencesApi {
  группы: IReferenceApi[];
  виды: IReferenceApi[];
  категории: IReferenceApi[];
  единицы: IReferenceApi[];
}

export interface ICharacteristicApi {
  id: number;
  название: string;
  типЗначения: string;
  обязательный: boolean;
  минимум?: number | null;
  максимум?: number | null;
  максимальнаяДлина?: number | null;
  списокЗначений: string[];
}

export interface INomenclatureQuick {
  id: number;
  code: string;
  article: string;
  name: string;
  unit: string;
  purchasePrice: number | null;
  salePrice: number | null;
}

export interface IReference {
  id: number;
  name: string;
}

export interface INomenclatureReferences {
  groups: IReference[];
  kinds: IReference[];
  categories: IReference[];
  units: IReference[];
}

export interface ICharacteristic {
  id: number;
  name: string;
  valueType: string;
  required: boolean;
  min: number | null;
  max: number | null;
  maxLength: number | null;
  listValues: string[];
}

export interface ICharacteristicValueRequest {
  characteristicId: number;
  value: string;
}

export interface ICreateNomenclatureRequest {
  code: string;
  article: string;
  name: string;
  shortName: string;
  groupId: number | null;
  categoryId: number | null;
  typeId: number;
  kindId: number | null;
  unitId: number;
  purchasePrice: number | null;
  salePrice: number | null;
  characteristics: ICharacteristicValueRequest[];
}

export interface ICreateNomenclatureResult {
  id: number;
  code: string;
  name: string;
}

/** Ответ GET /api/nomenclature/candidates: гибрид косинуса и Левенштейна. */
export interface ICandidate {
  id: number;
  name: string;
  price: number | null;
  score: number;
}

function mapQuick(raw: INomenclatureQuickApi): INomenclatureQuick {
  return {
    id: raw.id,
    code: raw.код,
    article: raw.артикул ?? '',
    name: raw.название,
    unit: raw.едИзм,
    purchasePrice: raw.ценаЗакупочная ?? null,
    salePrice: raw.ценаПродажная ?? null,
  };
}

function mapReference(raw: IReferenceApi): IReference {
  return { id: raw.id, name: raw.название };
}

function mapCharacteristic(raw: ICharacteristicApi): ICharacteristic {
  return {
    id: raw.id,
    name: raw.название,
    valueType: raw.типЗначения,
    required: raw.обязательный,
    min: raw.минимум ?? null,
    max: raw.максимум ?? null,
    maxLength: raw.максимальнаяДлина ?? null,
    listValues: raw.списокЗначений ?? [],
  };
}

/**
 * Два разных способа поиска номенклатуры:
 *  • quickSearch — ввод с клавиатуры: SQL LIKE по Код/Артикул/Название, быстро;
 *  • candidates — распознанный текст/фото: вектор Ollama + Левенштейн.
 */
@Injectable({ providedIn: 'root' })
export class NomenclatureService {
  private readonly http = inject(HttpClient);

  quickSearch(query: string, limit = 15): Observable<INomenclatureQuick[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return this.http
      .get<INomenclatureQuickApi[]>('/api/nomenclature/quick-search', { params })
      .pipe(map((rows) => rows.map(mapQuick)));
  }

  /** Векторные кандидаты для ручного выбора товара. */
  candidates(query: string, limit = 5): Observable<ICandidate[]> {
    const params = new HttpParams().set('q', query).set('limit', limit);

    return this.http.get<ICandidate[]>('/api/nomenclature/candidates', { params });
  }

  /** Следующий свободный код вида НМ-00042. */
  nextCode(): Observable<string> {
    return this.http
      .get<{ код: string }>('/api/nomenclature/next-code')
      .pipe(map((response) => response.код));
  }

  getReferences(): Observable<INomenclatureReferences> {
    return this.http
      .get<IReferencesApi>('/api/nomenclature/references')
      .pipe(
        map((raw) => ({
          groups: raw.группы.map(mapReference),
          kinds: raw.виды.map(mapReference),
          categories: raw.категории.map(mapReference),
          units: raw.единицы.map(mapReference),
        })),
      );
  }

  getCharacteristics(kindId: number): Observable<ICharacteristic[]> {
    return this.http
      .get<ICharacteristicApi[]>(
        `/api/nomenclature/kinds/${kindId}/characteristics`,
      )
      .pipe(map((rows) => rows.map(mapCharacteristic)));
  }

  create(request: ICreateNomenclatureRequest): Observable<ICreateNomenclatureResult> {
    const body = {
      код: request.code,
      артикул: request.article || null,
      название: request.name,
      краткоеНазвание: request.shortName || null,
      группаId: request.groupId,
      категорияId: request.categoryId,
      типId: request.typeId,
      видНоменклатурыId: request.kindId,
      базоваяЕдИзмId: request.unitId,
      ценаЗакупочная: request.purchasePrice,
      ценаПродажная: request.salePrice,
      характеристики: request.characteristics.map((item) => ({
        характеристикаId: item.characteristicId,
        значение: item.value,
      })),
    };

    return this.http
      .post<{ id: number; код: string; название: string }>(
        '/api/nomenclature',
        body,
      )
      .pipe(
        map((raw) => ({
          id: raw.id,
          code: raw.код,
          name: raw.название,
        })),
      );
  }
}

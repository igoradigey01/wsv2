import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// SkladApi помечает несопоставленную позицию этой строкой (InvoiceController.Match).
const NOT_FOUND = 'НЕ НАЙДЕНО В БД';

export interface IParsedVoiceRowApi {
  productId: number | null;
  productSku: string;
  dbName: string;
  voiceName: string;
  quantity: number;
  unit: string | null;
  matchConfidence: number;
}

export interface IMappedVoiceRow {
  productId: number | null;
  sku: string;
  name: string;
  voiceName: string;
  qty: number;
  unit: string | null;
  confidence: number;
  matched: boolean;
}

import type { ICandidate } from '../nomenclature/nomenclature.service';

/** Ответ GET /api/nomenclature/candidates: гибрид косинуса и Левенштейна. */
export type { ICandidate };

/** Строка новой накладной для POST /api/clients/marks/{dealId}/products. */
export interface ICreateInvoiceRow {
  номенклатураId: number;
  количество: number;
  цена: number;
}

export interface ICreateInvoiceRequest {
  дата: string | null;
  комментарий: string | null;
  строки: ICreateInvoiceRow[];
}

/** Ответ POST: созданная шапка накладной (ОтпущенныйТоварDto). */
export interface ICreatedInvoiceApi {
  id: number;
  номер: string;
  дата: string;
  сумма: number;
  сделкаId: string;
  изменялась: boolean;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly http = inject(HttpClient);

  /** Кандидаты номенклатуры для ручного выбора, отсортированные по гибридному скору. */
  candidates(q: string, limit = 5): Observable<ICandidate[]> {
    return this.http.get<ICandidate[]>('/api/nomenclature/candidates', {
      params: { q, limit },
    });
  }

  /** Отправляет продиктованный текст в SkladApi, возвращает позиции с сопоставлением. */
  parseVoice(rawText: string): Observable<IMappedVoiceRow[]> {
    return this.http
      .post<IParsedVoiceRowApi[]>('/api/invoice/parse-voice', { rawText })
      .pipe(
        map((rows) =>
          rows.map((row) => ({
            productId: row.productId,
            sku: row.productSku,
            // Если совпадения нет — показываем то, что было в тексте.
            name: row.dbName === NOT_FOUND ? row.voiceName : row.dbName,
            voiceName: row.voiceName,
            qty: row.quantity,
            unit: row.unit,
            confidence: row.matchConfidence,
            matched: row.productId !== null,
          })),
        ),
      );
  }

  /** Создаёт накладную клиента: шапку и строки на сервере. */
  createInvoice(
    dealId: string,
    body: ICreateInvoiceRequest,
  ): Observable<ICreatedInvoiceApi> {
    return this.http.post<ICreatedInvoiceApi>(
      `/api/clients/marks/${dealId}/products`,
      body,
    );
  }
}

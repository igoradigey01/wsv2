import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IParsedVoiceRowApi {
  productId: number | null;
  productSku: string;
  dbName: string;
  voiceName: string;
  quantity: number;
  unit: string | null;
  matchConfidence: number;
}

export interface IParsedVoiceRow {
  productId: number | null;
  sku: string;
  name: string;
  voiceName: string;
  qty: number;
  unit: string | null;
  confidence: number;
  matched: boolean;
}

const NOT_FOUND = 'НЕ НАЙДЕНО В БД';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly http = inject(HttpClient);

  /** Отправляет продиктованный текст в SkladApi, возвращает позиции с сопоставлением. */
  parseVoice(rawText: string): Observable<IParsedVoiceRow[]> {
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
}

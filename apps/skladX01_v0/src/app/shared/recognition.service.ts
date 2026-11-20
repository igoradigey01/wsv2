import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapRecognizedDocument } from './recognition.models';
import type { IRecognizedDocument, IRecognizedDocumentApi } from './recognition.models';

/**
 * Приёмка накладной по фото и тексту приёмщика.
 * Текст необязателен; устаревший аудиоканал (WAV 16 кГц) API всё ещё принимает.
 */
@Injectable({ providedIn: 'root' })
export class RecognitionService {
  private readonly http = inject(HttpClient);

  parse(image: Blob, text?: string | null): Observable<IRecognizedDocument> {
    const form = new FormData();
    form.append('image', image, fileNameFor(image, 'invoice.jpg'));

    const comment = text?.trim();

    if (comment) {
      form.append('text', comment);
    }

    return this.http
      .post<IRecognizedDocumentApi>('/api/recognition/parse', form)
      .pipe(map(mapRecognizedDocument));
  }
}

function fileNameFor(blob: Blob, fallback: string): string {
  return blob instanceof File && blob.name ? blob.name : fallback;
}

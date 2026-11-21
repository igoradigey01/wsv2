import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapRecognizedDocument } from './recognition.models';
import type { IRecognizedDocument, IRecognizedDocumentApi } from './recognition.models';

/**
 * Приёмка накладной: фото и текст приёмщика отправляются раздельно.
 * Устаревший аудиоканал (WAV 16 кГц) API всё ещё принимает.
 */
@Injectable({ providedIn: 'root' })
export class RecognitionService {
  private readonly http = inject(HttpClient);

  /** Отправляет либо фото накладной, либо текст приёмщика — но не оба сразу. */
  parse(imageOrText: Blob | string): Observable<IRecognizedDocument> {
    const form = new FormData();

    if (typeof imageOrText === 'string') {
      const text = imageOrText.trim();

      if (text) {
        form.append('text', text);
      }
    } else {
      form.append('image', imageOrText, fileNameFor(imageOrText, 'invoice.jpg'));
    }

    return this.http
      .post<IRecognizedDocumentApi>('/api/recognition/parse', form)
      .pipe(map(mapRecognizedDocument));
  }
}

function fileNameFor(blob: Blob, fallback: string): string {
  return blob instanceof File && blob.name ? blob.name : fallback;
}

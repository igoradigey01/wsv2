import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapRecognizedDocument } from './recognition.models';
import type { IRecognizedDocument, IRecognizedDocumentApi } from './recognition.models';

/**
 * Приёмка накладной по фото и голосу.
 * Аудио — WAV 16 кГц, моно, 16 бит (см. wav-encoder.ts): другие форматы API отбивает 415.
 */
@Injectable({ providedIn: 'root' })
export class RecognitionService {
  private readonly http = inject(HttpClient);

  parse(image: Blob, audio: Blob): Observable<IRecognizedDocument> {
    const form = new FormData();
    form.append('image', image, fileNameFor(image, 'invoice.jpg'));
    form.append('audio', audio, fileNameFor(audio, 'voice.wav'));

    return this.http
      .post<IRecognizedDocumentApi>('/api/recognition/parse', form)
      .pipe(map(mapRecognizedDocument));
  }
}

function fileNameFor(blob: Blob, fallback: string): string {
  return blob instanceof File && blob.name ? blob.name : fallback;
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { ParsingHubService } from './parsing-hub.service';
import { mapRecognizedDocument } from './recognition.models';
import type { IRecognizedDocument, IRecognizedDocumentApi } from './recognition.models';
import { RECOGNITION_MODE } from './recognition-mode';

interface IParsingResultDto {
  jobId: string;
  document: IRecognizedDocumentApi | null;
  error: string | null;
}

/**
 * Приёмка накладной: фото и текст приёмщика отправляются раздельно.
 * По умолчанию — синхронный `/api/recognition/parse`; при `RECOGNITION_MODE='async'`
 * фото уходит в очередь (`/parse-async`), а результат приходит по SignalR.
 */
@Injectable({ providedIn: 'root' })
export class RecognitionService {
  private readonly http = inject(HttpClient);
  private readonly hub = inject(ParsingHubService);
  private readonly mode = inject(RECOGNITION_MODE);

  parse(imageOrText: Blob | string): Observable<IRecognizedDocument> {
    if (this.mode === 'async' && typeof imageOrText !== 'string') {
      return this.parseAsync(imageOrText);
    }

    return this.parseSync(imageOrText);
  }

  private parseSync(imageOrText: Blob | string): Observable<IRecognizedDocument> {
    const form = new FormData();

    appendSource(form, imageOrText);

    return this.http
      .post<IRecognizedDocumentApi>('/api/recognition/parse', form)
      .pipe(map(mapRecognizedDocument));
  }

  private parseAsync(image: Blob): Observable<IRecognizedDocument> {
    return from(this.hub.connectionId()).pipe(
      switchMap((connectionId) => {
        const form = new FormData();

        appendSource(form, image);

        if (connectionId) {
          form.append('connectionId', connectionId);
        }

        return this.http.post<{ jobId: string }>(
          '/api/recognition/parse-async',
          form,
        );
      }),
      switchMap(({ jobId }) => this.hub.result<IParsingResultDto>(jobId)),
      map((result) => {
        if (result.error || !result.document) {
          throw new Error(result.error ?? 'Не удалось разобрать накладную.');
        }

        return mapRecognizedDocument(result.document);
      }),
    );
  }
}

/** Общий сбор FormData: текст или фото (пустой текст не отправляется). */
function appendSource(form: FormData, imageOrText: Blob | string): void {
  if (typeof imageOrText === 'string') {
    const text = imageOrText.trim();

    if (text) {
      form.append('text', text);
    }

    return;
  }

  form.append('image', imageOrText, fileNameFor(imageOrText, 'invoice.jpg'));
}

function fileNameFor(blob: Blob, fallback: string): string {
  return blob instanceof File && blob.name ? blob.name : fallback;
}

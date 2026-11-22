import { InjectionToken } from '@angular/core';

export type RecognitionMode = 'sync' | 'async';

/**
 * Способ распознавания фото:
 * - `sync`  — `POST /api/recognition/parse` (HTTP держится до ответа модели);
 * - `async` — `POST /api/recognition/parse-async` + результат по SignalR.
 * По умолчанию синхронный режим; переключается провайдером в bootstrap.
 */
export const RECOGNITION_MODE = new InjectionToken<RecognitionMode>(
  'RECOGNITION_MODE',
  { providedIn: 'root', factory: () => 'sync' },
);

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { HubConnection } from '@microsoft/signalr';

export interface IParsingResult {
  jobId: string;
  document: unknown | null;
  error: string | null;
}

/**
 * SignalR-клиент асинхронного разбора (`/hubs/parsing`).
 * Пакет `@microsoft/signalr` грузится лениво — только когда включён async-режим.
 */
@Injectable({ providedIn: 'root' })
export class ParsingHubService {
  private connection?: Promise<HubConnection>;

  /** Id текущего соединения — его передаём в `POST /api/recognition/parse-async`. */
  async connectionId(): Promise<string | null> {
    const connection = await this.getConnection();

    return connection.connectionId ?? null;
  }

  /** Ждёт результат конкретного jobId и завершается после первого совпадения. */
  result<T>(jobId: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      let disposed = false;
      let detach: (() => void) | undefined;

      void (async () => {
        try {
          const connection = await this.getConnection();
          const handler = (...args: unknown[]) => {
            const payload = args[0] as { jobId?: string } | undefined;

            if (payload?.jobId === jobId) {
              subscriber.next(payload as T);
              subscriber.complete();
            }
          };

          connection.on('parsingResult', handler);
          detach = () => connection.off('parsingResult', handler);

          if (disposed) {
            detach();
          }
        } catch (error) {
          subscriber.error(error);
        }
      })();

      return () => {
        disposed = true;
        detach?.();
      };
    });
  }

  private getConnection(): Promise<HubConnection> {
    if (!this.connection) {
      this.connection = this.connect();
    }

    return this.connection;
  }

  private async connect(): Promise<HubConnection> {
    const { HubConnectionBuilder, LogLevel } = await import('@microsoft/signalr');

    const connection = new HubConnectionBuilder()
      .withUrl('/hubs/parsing')
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    await connection.start();

    return connection;
  }
}

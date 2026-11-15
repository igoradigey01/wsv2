import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error';

export interface IToast {
  message: string;
  kind: ToastKind;
}

const DEFAULT_DURATION_MS = 4000;

/** Единственный тост на приложение: новый заменяет предыдущий. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly current = signal<IToast | null>(null);
  private timer: ReturnType<typeof setTimeout> | null = null;

  readonly toast = this.current.asReadonly();

  show(
    message: string,
    kind: ToastKind = 'success',
    durationMs = DEFAULT_DURATION_MS,
  ): void {
    this.clearTimer();
    this.current.set({ message, kind });
    this.timer = setTimeout(() => this.current.set(null), durationMs);
  }

  dismiss(): void {
    this.clearTimer();
    this.current.set(null);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

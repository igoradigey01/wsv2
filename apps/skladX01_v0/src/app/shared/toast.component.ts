import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastService } from './toast.service';

/** Всплывающее уведомление о результате сохранения. */
@Component({
  selector: 'app-toast',
  template: `
    @if (toast(); as t) {
      <div
        class="toast"
        [class.toast--error]="t.kind === 'error'"
        role="status"
        aria-live="polite"
      >
        <span class="toast__text">{{ t.message }}</span>
        <button
          type="button"
          class="toast__close"
          aria-label="Закрыть"
          (click)="dismiss()"
        >
          ✕
        </button>
      </div>
    }
  `,
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);

  readonly toast = this.toastService.toast;

  dismiss(): void {
    this.toastService.dismiss();
  }
}

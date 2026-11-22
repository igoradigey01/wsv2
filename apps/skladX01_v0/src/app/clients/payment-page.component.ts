import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClientService } from './client.service';
import type { IClient, IMark } from './client.models';
import { ToastService } from '../shared/toast.service';

interface IPaymentMethodOption {
  id: number;
  label: string;
}

const PAYMENT_METHODS: IPaymentMethodOption[] = [
  { id: 1, label: 'Наличные' },
  { id: 2, label: 'Безналичный расчёт' },
  { id: 3, label: 'Банковская карта' },
];

@Component({
  selector: 'app-payment-page',
  imports: [DecimalPipe, RouterModule],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly clientId = signal<number | null>(null);
  readonly client = signal<IClient | null>(null);
  readonly deal = signal<IMark | null>(null);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly date = signal(new Date().toISOString().slice(0, 10));
  readonly amount = signal('');
  readonly paymentMethod = signal(1);
  readonly documentNumber = signal('');
  readonly comment = signal('');

  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);

  readonly methods = PAYMENT_METHODS;

  /** Долг по сделке; отрицательный означает переплату и для кнопки не нужен. */
  readonly debt = computed(() => Math.max(this.deal()?.debt ?? 0, 0));

  readonly amountValue = computed(() => {
    const value = Number(this.amount().replace(',', '.').trim());

    return Number.isFinite(value) ? value : 0;
  });

  ngOnInit(): void {
    const clientId = Number(this.route.snapshot.paramMap.get('id'));
    const dealId = this.route.snapshot.queryParamMap.get('dealId');

    if (!Number.isFinite(clientId)) {
      this.loading.set(false);
      this.error.set('Некорректный клиент.');
      return;
    }

    this.clientId.set(clientId);

    forkJoin({
      client: this.clientService.getClient(clientId),
      marks: this.clientService.getMarks(clientId),
    })
      .pipe(
        map(({ client, marks }) => ({
          client,
          deal: dealId ? marks.find((mark) => mark.id === dealId) ?? null : null,
        })),
        catchError(() => {
          this.loading.set(false);
          this.error.set(
            'Не удалось загрузить данные. Проверьте, что SkladApi запущен на http://localhost:5240.',
          );

          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.loading.set(false);

        if (result) {
          this.client.set(result.client);
          this.deal.set(result.deal);
        }
      });
  }

  setDate(event: Event): void {
    this.date.set((event.target as HTMLInputElement).value);
  }

  setAmount(event: Event): void {
    this.amount.set((event.target as HTMLInputElement).value);
  }

  setPaymentMethod(event: Event): void {
    const method = Number((event.target as HTMLSelectElement).value);

    if (this.methods.some((item) => item.id === method)) {
      this.paymentMethod.set(method);
    }
  }

  setDocumentNumber(event: Event): void {
    this.documentNumber.set((event.target as HTMLInputElement).value);
  }

  setComment(event: Event): void {
    this.comment.set((event.target as HTMLInputElement).value);
  }

  /** Возврат в карточку клиента без сохранения. */
  cancel(): void {
    const clientId = this.clientId();

    if (clientId !== null) {
      void this.router.navigate(['/clients', clientId]);
    }
  }

  /** Подставляет весь долг сделки в сумму платежа. */
  fillDebt(): void {
    if (this.debt() > 0) {
      this.amount.set(this.debt().toFixed(2));
    }
  }

  save(): void {
    const deal = this.deal();
    const clientId = this.clientId();

    if (!deal || clientId === null || this.saving()) {
      return;
    }

    const amount = this.amountValue();

    if (amount <= 0) {
      this.saveError.set('Сумма должна быть больше нуля.');
      return;
    }

    const documentNumber = this.documentNumber().trim();

    if (documentNumber.length > 30) {
      this.saveError.set('Номер документа длиннее 30 символов.');
      return;
    }

    const comment = this.comment().trim();

    if (comment.length > 500) {
      this.saveError.set('Комментарий длиннее 500 символов.');
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    this.clientService
      .createPayment(deal.id, {
        дата: this.date(),
        сумма: amount,
        способОплаты: this.paymentMethod(),
        номерДокумента: documentNumber || null,
        комментарий: comment || null,
      })
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.toast.show('Деньги приняты.');
          void this.router.navigate(['/clients', clientId]);
        },
        error: (error: unknown) => {
          this.saveError.set(this.describeSaveError(error));
        },
      });
  }

  private describeSaveError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (typeof error.error?.error === 'string') {
        return error.error.error;
      }

      if (error.status === 404) {
        return 'Сделка не найдена.';
      }

      if (error.status === 503) {
        return 'База данных недоступна: проверьте SQL Server.';
      }
    }

    return 'Не удалось сохранить платёж. Проверьте SkladApi.';
  }
}

import { DecimalPipe } from '@angular/common';
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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClientService } from '../clients/client.service';
import type { IClient, IMark } from '../clients/client.models';
import { InvoiceService } from './invoice.service';

export interface IInvoiceRow {
  id: number;
  name: string;
  qty: number;
  price: number;
}

@Component({
  selector: 'app-invoice-page',
  imports: [DecimalPipe, RouterModule],
  templateUrl: './invoice-page.component.html',
  styleUrl: './invoice-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly destroyRef = inject(DestroyRef);

  readonly clientId = signal<number | null>(null);
  readonly client = signal<IClient | null>(null);
  readonly deal = signal<IMark | null>(null);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly date = signal(new Date().toISOString().slice(0, 10));
  readonly comment = signal('');
  readonly voiceText = signal('');

  readonly parsing = signal(false);
  readonly parseError = signal<string | null>(null);

  readonly rows = signal<IInvoiceRow[]>([
    { id: 1, name: '', qty: 1, price: 0 },
  ]);
  private readonly lastRowId = signal(1);

  readonly total = computed(() =>
    this.rows().reduce((sum, row) => sum + row.qty * row.price, 0),
  );

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    const clientId = Number(rawId);
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

  parseVoice(): void {
    const text = this.voiceText().trim();

    if (text.length === 0 || this.parsing()) {
      return;
    }

    this.parsing.set(true);
    this.parseError.set(null);

    this.invoiceService
      .parseVoice(text)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (parsed) => {
          this.parsing.set(false);

          if (parsed.length === 0) {
            this.parseError.set('В тексте не нашлось ни одной позиции.');
            return;
          }

          this.rows.set(
            parsed.map((row, index) => ({
              id: index + 1,
              name: row.name,
              qty: row.qty,
              price: 0,
            })),
          );
          this.lastRowId.set(parsed.length);
        },
        error: () => {
          this.parsing.set(false);
          this.parseError.set(
            'Сервис распознавания недоступен. Проверьте Ollama на ks34 и SQL Server.',
          );
        },
      });
  }

  addRow(): void {
    const id = this.lastRowId() + 1;
    this.lastRowId.set(id);
    this.rows.update((rows) => [...rows, { id, name: '', qty: 1, price: 0 }]);
  }

  removeRow(id: number): void {
    if (this.rows().length <= 1) {
      return;
    }

    this.rows.update((rows) => rows.filter((row) => row.id !== id));
  }

  setDate(event: Event): void {
    this.date.set((event.target as HTMLInputElement).value);
  }

  setComment(event: Event): void {
    this.comment.set((event.target as HTMLTextAreaElement).value);
  }

  setVoiceText(event: Event): void {
    this.voiceText.set((event.target as HTMLTextAreaElement).value);
  }

  setRowName(id: number, event: Event): void {
    const name = (event.target as HTMLInputElement).value;
    this.rows.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, name } : row)),
    );
  }

  setRowQty(id: number, event: Event): void {
    const qty = Number((event.target as HTMLInputElement).value);
    if (!Number.isFinite(qty) || qty < 0) {
      return;
    }

    this.rows.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, qty } : row)),
    );
  }

  setRowPrice(id: number, event: Event): void {
    const price = Number((event.target as HTMLInputElement).value);
    if (!Number.isFinite(price) || price < 0) {
      return;
    }

    this.rows.update((rows) =>
      rows.map((row) => (row.id === id ? { ...row, price } : row)),
    );
  }
}

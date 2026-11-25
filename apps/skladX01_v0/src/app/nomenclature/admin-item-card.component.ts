import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { HelpIconComponent } from '../shared/help-icon.component';
import type { IHelpRow } from '../shared/help-icon.component';
import { NomenclatureAdminService } from './nomenclature-admin.service';
import type { IAdminItem, IReferences } from './nomenclature-admin.service';
import {
  NOMENCLATURE_GROUP_HELP,
  NOMENCLATURE_KIND_HELP,
} from './nomenclature-reference-help';

/** «Карточка товара» админки: список с фильтрами и мягким удалением. */
@Component({
  selector: 'app-admin-item-card',
  imports: [HelpIconComponent, DatePipe],
  templateUrl: './admin-item-card.component.html',
  styleUrl: './admin-item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminItemCardComponent implements OnInit, OnDestroy {
  private readonly service = inject(NomenclatureAdminService);
  private readonly router = inject(Router);
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  readonly refs = signal<IReferences | null>(null);
  readonly items = signal<IAdminItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);

  readonly q = signal('');
  readonly typeId = signal<number | null>(null);
  readonly groupId = signal<number | null>(null);
  readonly kindId = signal<number | null>(null);
  readonly dateFrom = signal('');
  readonly dateTo = signal('');

  readonly typeHelpRows = computed<IHelpRow[]>(() =>
    (this.refs()?.types ?? []).map((type) => ({
      label: type.name,
      description: type.description,
    })),
  );

  readonly groupHelpRows = NOMENCLATURE_GROUP_HELP;

  readonly kindHelpRows = NOMENCLATURE_KIND_HELP;

  ngOnInit(): void {
    this.service.references().subscribe({
      next: (refs) => this.refs.set(refs),
      error: () => this.error.set('Не удалось загрузить справочники.'),
    });
    this.search();
  }

  ngOnDestroy(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  }

  search(): void {
    this.loading.set(true);
    this.error.set(null);

    this.service
      .adminSearch({
        q: this.q(),
        typeId: this.typeId(),
        groupId: this.groupId(),
        kindId: this.kindId(),
        датаС: this.dateFrom() || undefined,
        датаПо: this.dateTo() || undefined,
      })
      .subscribe({
        next: (rows) => {
          this.items.set(rows);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Ошибка поиска.');
          this.loading.set(false);
        },
      });
  }

  onQ(event: Event): void {
    this.q.set((event.target as HTMLInputElement).value);
    this.scheduleSearch();
  }

  private scheduleSearch(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => this.search(), 300);
  }

  onFilter(
    field: 'type' | 'group' | 'kind',
    event: Event,
  ): void {
    const raw = (event.target as HTMLSelectElement).value;
    const value = raw === '' ? null : Number(raw);

    if (field === 'type') this.typeId.set(value);
    if (field === 'group') this.groupId.set(value);
    if (field === 'kind') this.kindId.set(value);

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.search();
  }

  onDate(field: 'from' | 'to', event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    if (field === 'from') {
      this.dateFrom.set(value);
    } else {
      this.dateTo.set(value);
    }
  }

  resetFilters(): void {
    this.q.set('');
    this.typeId.set(null);
    this.groupId.set(null);
    this.kindId.set(null);
    this.dateFrom.set('');
    this.dateTo.set('');

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.search();
  }

  /** Открывает старую карточку товара с данными выбранной позиции. */
  edit(item: IAdminItem): void {
    this.service.selectItem(item);
    this.router.navigate(['/nomenclature/card']);
  }

  /** Мягкое удаление: позиция остаётся в базе, но исчезает из выбора. */
  deactivate(item: IAdminItem): void {
    const message =
      `Деактивировать позицию «${item.name}»?\n` +
      'Она пропадёт из выбора, но останется в базе.';

    if (!confirm(message)) {
      return;
    }

    this.service.deactivate(item.id).subscribe({
      next: () => {
        this.notice.set(`Позиция «${item.name}» деактивирована.`);
        this.search();
      },
      error: (err) => this.error.set(this.message(err)),
    });
  }

  private message(err: unknown): string {
    const anyErr = err as {
      error?: { error?: string } | string;
      status?: number;
    };

    if (typeof anyErr?.error === 'string') {
      return anyErr.error;
    }

    if (
      anyErr?.error &&
      typeof anyErr.error === 'object' &&
      anyErr.error.error
    ) {
      return anyErr.error.error;
    }

    return `Ошибка запроса${anyErr?.status ? ` (${anyErr.status})` : ''}.`;
  }
}

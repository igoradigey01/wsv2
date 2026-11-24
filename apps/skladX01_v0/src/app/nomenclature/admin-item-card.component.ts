import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { HelpIconComponent } from '../shared/help-icon.component';
import type { IHelpRow } from '../shared/help-icon.component';
import { NomenclatureAdminService } from './nomenclature-admin.service';
import type { IAdminItem, IReferences } from './nomenclature-admin.service';

/** «Карточка товара» админки: список с фильтрами + редактирование. */
@Component({
  selector: 'app-admin-item-card',
  imports: [HelpIconComponent, DatePipe],
  templateUrl: './admin-item-card.component.html',
  styleUrl: './admin-item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminItemCardComponent implements OnInit {
  private readonly service = inject(NomenclatureAdminService);

  readonly refs = signal<IReferences | null>(null);
  readonly items = signal<IAdminItem[]>([]);
  readonly selected = signal<IAdminItem | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);

  readonly q = signal('');
  readonly typeId = signal<number | null>(null);
  readonly groupId = signal<number | null>(null);
  readonly kindId = signal<number | null>(null);

  readonly editName = signal('');
  readonly editArticle = signal('');
  readonly editTypeId = signal<number | null>(null);
  readonly editGroupId = signal<number | null>(null);
  readonly editKindId = signal<number | null>(null);
  readonly editPurchase = signal<number | null>(null);
  readonly editSale = signal<number | null>(null);

  readonly typeHelpRows = computed<IHelpRow[]>(() =>
    (this.refs()?.types ?? []).map((type) => ({
      label: type.name,
      description: type.description,
    })),
  );

  readonly groupHelp = computed(() =>
    'Группа — иерархия каталога (папки). Позиции раскладываются по группам товара.',
  );

  readonly kindHelp = computed(() =>
    'Вид номенклатуры — из чего сделано изделие (ДСП, ткань, фурнитура) и набор характеристик.',
  );

  ngOnInit(): void {
    this.service.references().subscribe({
      next: (refs) => this.refs.set(refs),
      error: () => this.error.set('Не удалось загрузить справочники.'),
    });
    this.search();
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
  }

  resetFilters(): void {
    this.q.set('');
    this.typeId.set(null);
    this.groupId.set(null);
    this.kindId.set(null);
    this.search();
  }

  select(item: IAdminItem): void {
    this.selected.set(item);
    this.editName.set(item.name);
    this.editArticle.set(item.article);
    this.editTypeId.set(item.typeId);
    this.editGroupId.set(item.groupId);
    this.editKindId.set(item.kindId);
    this.editPurchase.set(item.purchasePrice);
    this.editSale.set(item.salePrice);
    this.notice.set(null);
  }

  close(): void {
    this.selected.set(null);
  }

  onEditText(field: 'name' | 'article', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (field === 'name') this.editName.set(value);
    else this.editArticle.set(value);
  }

  onEditNumber(field: 'purchase' | 'sale', event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    const number = Number.isFinite(value) ? value : null;
    if (field === 'purchase') this.editPurchase.set(number);
    else this.editSale.set(number);
  }

  onEditSelect(field: 'type' | 'group' | 'kind', event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const value = raw === '' ? null : Number(raw);
    if (field === 'type') this.editTypeId.set(value);
    if (field === 'group') this.editGroupId.set(value);
    if (field === 'kind') this.editKindId.set(value);
  }

  save(): void {
    const item = this.selected();

    if (!item) {
      return;
    }

    this.service
      .update(item.id, {
        name: this.editName().trim(),
        article: this.editArticle().trim(),
        typeId: this.editTypeId() ?? undefined,
        groupId: this.editGroupId() ?? undefined,
        kindId: this.editKindId() ?? undefined,
        purchasePrice: this.editPurchase() ?? undefined,
        salePrice: this.editSale() ?? undefined,
      })
      .subscribe({
        next: () => {
          this.notice.set('Сохранено.');
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

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { HelpIconComponent } from '../shared/help-icon.component';
import type { IHelpRow } from '../shared/help-icon.component';
import { NomenclatureAdminService } from './nomenclature-admin.service';
import type { IType, ReferenceKind } from './nomenclature-admin.service';

/**
 * Экран справочника номенклатуры (Тип / Группа / Вид).
 * Один компонент, вид справочника берётся из route data.kind.
 */
@Component({
  selector: 'app-reference-admin',
  imports: [HelpIconComponent, RouterModule],
  templateUrl: './reference-admin.component.html',
  styleUrl: './reference-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceAdminComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(NomenclatureAdminService);

  readonly kind = signal<ReferenceKind>('types');
  readonly items = signal<IType[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly newName = signal('');
  readonly newDescription = signal('');

  readonly editingId = signal<number | null>(null);
  readonly editName = signal('');
  readonly editDescription = signal('');

  readonly title = computed(() => {
    switch (this.kind()) {
      case 'types':
        return 'Тип номенклатуры';
      case 'groups':
        return 'Группа номенклатуры';
      default:
        return 'Вид номенклатуры';
    }
  });

  readonly hasDescription = computed(() => this.kind() !== 'groups');

  readonly helpText = computed(() => {
    switch (this.kind()) {
      case 'groups':
        return 'Группа — иерархия каталога (папки). Позиции раскладываются по группам; у группы может быть родительская.';
      case 'kinds':
        return 'Вид номенклатуры — из чего сделано изделие (ДСП, ткань, фурнитура) и какой набор характеристик к нему применяется.';
      default:
        return '';
    }
  });

  readonly helpRows = computed<IHelpRow[]>(() => {
    if (this.kind() !== 'types') {
      return [];
    }

    return this.items().map((item) => ({
      label: item.name,
      description: item.description,
    }));
  });

  ngOnInit(): void {
    const kind =
      (this.route.snapshot.data['kind'] as ReferenceKind | undefined) ?? 'types';
    this.kind.set(kind);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.service.list(this.kind()).subscribe({
      next: (rows) => {
        this.items.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Не удалось загрузить справочник.');
        this.loading.set(false);
      },
    });
  }

  onNewName(event: Event): void {
    this.newName.set((event.target as HTMLInputElement).value);
  }

  onNewDescription(event: Event): void {
    this.newDescription.set((event.target as HTMLInputElement).value);
  }

  add(): void {
    const name = this.newName().trim();

    if (!name) {
      this.error.set('Введите название.');
      return;
    }

    this.service
      .create(this.kind(), name, this.newDescription().trim() || undefined)
      .subscribe({
        next: () => {
          this.newName.set('');
          this.newDescription.set('');
          this.load();
        },
        error: (err) => this.error.set(this.message(err)),
      });
  }

  startEdit(item: IType): void {
    this.editingId.set(item.id);
    this.editName.set(item.name);
    this.editDescription.set(item.description);
  }

  onEditName(event: Event): void {
    this.editName.set((event.target as HTMLInputElement).value);
  }

  onEditDescription(event: Event): void {
    this.editDescription.set((event.target as HTMLInputElement).value);
  }

  saveEdit(): void {
    const id = this.editingId();
    const name = this.editName().trim();

    if (id === null || !name) {
      return;
    }

    this.service
      .rename(this.kind(), id, name, this.editDescription().trim() || undefined)
      .subscribe({
        next: () => {
          this.editingId.set(null);
          this.load();
        },
        error: (err) => this.error.set(this.message(err)),
      });
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  remove(item: IType): void {
    this.service.remove(this.kind(), item.id).subscribe({
      next: () => this.load(),
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

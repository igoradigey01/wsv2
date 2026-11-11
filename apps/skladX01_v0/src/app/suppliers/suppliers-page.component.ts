import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { SupplierService } from './supplier.service';
import type {
  ISupplier,
  SortDirection,
  SupplierSortKey,
} from './supplier.models';

const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-suppliers-page',
  imports: [FormsModule, RouterModule],
  templateUrl: './suppliers-page.component.html',
  styleUrl: './suppliers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersPageComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly router = inject(Router);

  readonly suppliers = signal<ISupplier[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly sortKey = signal<SupplierSortKey>('name');
  readonly dir = signal<SortDirection>('asc');

  searchTerm = '';

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.load();
  }

  onSearchChange(): void {
    if (this.searchTimer !== null) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => this.load(), SEARCH_DEBOUNCE_MS);
  }

  toggleSort(key: SupplierSortKey): void {
    if (this.sortKey() === key) {
      this.dir.set(this.dir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.dir.set('asc');
    }

    this.load();
  }

  arrow(key: SupplierSortKey): string {
    if (this.sortKey() !== key) {
      return '';
    }

    return this.dir() === 'asc' ? '▲' : '▼';
  }

  ariaSort(key: SupplierSortKey): 'ascending' | 'descending' | 'none' {
    if (this.sortKey() !== key) {
      return 'none';
    }

    return this.dir() === 'asc' ? 'ascending' : 'descending';
  }

  open(supplier: ISupplier): void {
    void this.router.navigate(['/suppliers', supplier.id, 'receipt', 'new']);
  }

  retry(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.supplierService
      .getSuppliers({ q: this.searchTerm, sort: this.sortKey(), dir: this.dir() })
      .subscribe({
        next: (suppliers) => {
          this.suppliers.set(suppliers);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(
            'Не удалось загрузить поставщиков. Проверьте, что SkladApi запущен на http://localhost:5240.',
          );
          this.loading.set(false);
        },
      });
  }
}

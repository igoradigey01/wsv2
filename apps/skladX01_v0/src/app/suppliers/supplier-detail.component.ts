import { NgTemplateOutlet } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';

import { TabsComponent } from '../shared/tabs.component';
import { SupplierService } from './supplier.service';
import type { ISupplier } from './supplier.models';

function statusOf(error: unknown): number | null {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === 'number' ? status : null;
  }

  return null;
}

@Component({
  selector: 'app-supplier-detail',
  imports: [NgTemplateOutlet, RouterModule, TabsComponent],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly supplierService = inject(SupplierService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpoints = inject(BreakpointObserver);

  readonly supplier = signal<ISupplier | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly error = signal<string | null>(null);

  /** Узкий экран: блоки «Полученный товар» и «Отданные деньги» идут вкладками. */
  readonly isNarrow = toSignal(
    this.breakpoints
      .observe('(max-width: 767.98px)')
      .pipe(map((state) => state.matches)),
    { initialValue: false },
  );

  ngOnInit(): void {
    const supplierId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(supplierId)) {
      this.loading.set(false);
      this.notFound.set(true);
      return;
    }

    this.supplierService
      .getSupplier(supplierId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (supplier) => {
          this.supplier.set(supplier);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.loading.set(false);

          if (statusOf(error) === 404) {
            this.notFound.set(true);
          } else {
            this.error.set(
              'Не удалось загрузить поставщика. Проверьте, что SkladApi запущен на http://localhost:5240.',
            );
          }
        },
      });
  }
}

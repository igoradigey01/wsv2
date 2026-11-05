import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ClientService } from './client.service';
import type {
  ClientSortKey,
  IClient,
  SortDirection,
} from './client.models';

const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-clients-page',
  imports: [FormsModule, RouterModule],
  templateUrl: './clients-page.component.html',
  styleUrl: './clients-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPageComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);

  readonly clients = signal<IClient[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly sortKey = signal<ClientSortKey>('alias');
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

  toggleSort(key: ClientSortKey): void {
    if (this.sortKey() === key) {
      this.dir.set(this.dir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.dir.set('asc');
    }

    this.load();
  }

  arrow(key: ClientSortKey): string {
    if (this.sortKey() !== key) {
      return '';
    }

    return this.dir() === 'asc' ? '▲' : '▼';
  }

  ariaSort(key: ClientSortKey): 'ascending' | 'descending' | 'none' {
    if (this.sortKey() !== key) {
      return 'none';
    }

    return this.dir() === 'asc' ? 'ascending' : 'descending';
  }

  open(client: IClient): void {
    void this.router.navigate(['/clients', client.id]);
  }

  retry(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.clientService
      .getClients({ q: this.searchTerm, sort: this.sortKey(), dir: this.dir() })
      .subscribe({
        next: (clients) => {
          this.clients.set(clients);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(
            'Не удалось загрузить клиентов. Проверьте, что SkladApi запущен на http://localhost:5240.',
          );
          this.loading.set(false);
        },
      });
  }
}

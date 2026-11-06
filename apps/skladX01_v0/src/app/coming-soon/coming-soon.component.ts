import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterModule],
  template: `
    <section class="soon">
      <h1>{{ title }}</h1>
      <p>Раздел в разработке. Список и выбор клиента уже работают.</p>
      <a routerLink="/clients">Вернуться к списку клиентов</a>
    </section>
  `,
  styles: [
    `
      .soon {
        padding: 1rem;
        font-family: system-ui, sans-serif;
      }

      a {
        color: var(--c-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = String(this.route.snapshot.data['title'] ?? 'В разработке');
}

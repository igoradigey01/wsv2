import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import type { TemplateRef } from '@angular/core';

/** Одна вкладка: содержимое передаётся шаблоном, поэтому разметка не дублируется. */
export interface ITab {
  id: string;
  label: string;
  template: TemplateRef<unknown>;
}

/**
 * Вкладки без Angular Material: на узких экранах показывают одну панель,
 * на широких компоненты выводят блоки подряд (см. карточки клиента и поставщика).
 */
@Component({
  selector: 'app-tabs',
  imports: [NgTemplateOutlet],
  template: `
    <div class="tabs">
      <div class="tabs__bar" role="tablist">
        @for (tab of tabs(); track tab.id) {
          <button
            type="button"
            role="tab"
            class="tabs__tab"
            [class.is-active]="active()?.id === tab.id"
            [attr.aria-selected]="active()?.id === tab.id"
            (click)="select(tab.id)"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      @if (active(); as tab) {
        <div class="tabs__panel" role="tabpanel">
          <ng-container [ngTemplateOutlet]="tab.template" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  readonly tabs = input.required<ITab[]>();

  /** Пустая строка — активна первая вкладка. */
  readonly activeId = signal('');

  readonly active = computed<ITab | null>(() => {
    const tabs = this.tabs();

    return tabs.find((tab) => tab.id === this.activeId()) ?? tabs[0] ?? null;
  });

  select(id: string): void {
    this.activeId.set(id);
  }
}

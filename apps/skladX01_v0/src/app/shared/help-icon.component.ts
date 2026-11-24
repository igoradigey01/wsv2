import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';

export interface IHelpRow {
  label: string;
  description: string;
}

/**
 * Иконка «?» рядом с заголовком поля. По клику — попап со справкой:
 * либо таблица «значение → что это», либо текстовое описание.
 */
@Component({
  selector: 'app-help-icon',
  template: `
    <span class="help">
      <button
        type="button"
        class="help__btn"
        [attr.aria-label]="title"
        (click)="toggle()"
      >
        ?
      </button>
      @if (open()) {
        <div class="help__popup" role="dialog" [attr.aria-label]="title">
          <div class="help__head">
            <span class="help__title">{{ title }}</span>
            <button type="button" class="help__close" (click)="toggle()">✕</button>
          </div>
          @if (rows.length > 0) {
            <table class="help__table">
              <tbody>
                @for (row of rows; track row.label) {
                  <tr>
                    <td class="help__label">{{ row.label }}</td>
                    <td>{{ row.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          } @else {
            <p class="help__text">{{ text }}</p>
          }
        </div>
      }
    </span>
  `,
  styles: [`
    .help { position: relative; display: inline-flex; vertical-align: middle; }
    .help__btn {
      width: 1.15rem; height: 1.15rem; padding: 0; margin-left: .35rem;
      border-radius: 50%; border: 1px solid #9aa4b2; background: #eef1f5;
      color: #445; font-size: .8rem; line-height: 1; cursor: pointer;
    }
    .help__btn:hover { background: #dfe5ec; }
    .help__popup {
      position: absolute; z-index: 30; top: 1.5rem; left: 0;
      min-width: 18rem; max-width: 28rem; padding: .6rem .7rem;
      background: #fff; border: 1px solid #c7ccd4; border-radius: .4rem;
      box-shadow: 0 6px 20px rgba(0,0,0,.15); font-weight: normal;
    }
    .help__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: .4rem; }
    .help__title { font-weight: 600; }
    .help__close { border: none; background: none; cursor: pointer; color: #667; }
    .help__table { border-collapse: collapse; width: 100%; }
    .help__table td { padding: .2rem .3rem; border-top: 1px solid #eef0f3; vertical-align: top; font-size: .85rem; }
    .help__label { font-weight: 600; white-space: nowrap; }
    .help__text { margin: 0; font-size: .85rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpIconComponent {
  @Input() title = 'Справка';
  @Input() rows: IHelpRow[] = [];
  @Input() text = '';

  readonly open = signal(false);

  toggle(): void {
    this.open.update((value) => !value);
  }
}

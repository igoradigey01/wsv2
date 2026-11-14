import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';

import { TabsComponent } from './tabs.component';

@Component({
  imports: [TabsComponent],
  template: `
    <app-tabs
      [tabs]="[
        { id: 'products', label: 'Отпущенный товар', template: productBlock },
        { id: 'payments', label: 'Принятые деньги', template: paymentBlock }
      ]"
    />

    <ng-template #productBlock>
      <p class="pane-product">товары</p>
    </ng-template>
    <ng-template #paymentBlock>
      <p class="pane-payment">деньги</p>
    </ng-template>
  `,
})
class HostComponent {}

describe('TabsComponent', () => {
  function create(): ComponentFixture<HostComponent> {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    return fixture;
  }

  it('показывает первую вкладку по умолчанию', () => {
    const fixture = create();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('[role="tab"]').length).toBe(2);
    expect(element.querySelector('.pane-product')).toBeTruthy();
    expect(element.querySelector('.pane-payment')).toBeNull();
    expect(
      element.querySelector('[role="tab"]')?.getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('переключает панель по клику на вторую вкладку', () => {
    const fixture = create();
    const element = fixture.nativeElement as HTMLElement;
    const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    tabs[1].click();
    fixture.detectChanges();

    const nextTabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');

    expect(element.querySelector('.pane-product')).toBeNull();
    expect(element.querySelector('.pane-payment')).toBeTruthy();
    expect(nextTabs[1].getAttribute('aria-selected')).toBe('true');
  });
});

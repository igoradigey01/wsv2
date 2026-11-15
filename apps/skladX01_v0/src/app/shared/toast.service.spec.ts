import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({ providers: [ToastService] });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('показывает тост и сам его скрывает', () => {
    service.show('Сохранено');

    expect(service.toast()).toEqual({ message: 'Сохранено', kind: 'success' });

    jest.advanceTimersByTime(4000);

    expect(service.toast()).toBeNull();
  });

  it('новый тост заменяет предыдущий и продлевает таймер', () => {
    service.show('Первое');
    jest.advanceTimersByTime(3000);
    service.show('Второе', 'error');
    jest.advanceTimersByTime(3000);

    expect(service.toast()).toEqual({ message: 'Второе', kind: 'error' });

    jest.advanceTimersByTime(1000);

    expect(service.toast()).toBeNull();
  });

  it('закрывается вручную', () => {
    service.show('Ошибка', 'error');
    service.dismiss();

    expect(service.toast()).toBeNull();
  });
});

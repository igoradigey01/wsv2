import { formatDay } from './date-format';

describe('formatDay', () => {
  it('переводит ISO в dd.MM.yyyy', () => {
    expect(formatDay('2023-10-24T00:00:00')).toBe('24.10.2023');
    expect(formatDay('2024-06-01')).toBe('01.06.2024');
  });

  it('возвращает пустую строку для пустого значения', () => {
    expect(formatDay('')).toBe('');
    expect(formatDay(null)).toBe('');
    expect(formatDay(undefined)).toBe('');
  });

  it('не ломается на некорректной строке', () => {
    expect(formatDay('2023')).toBe('');
  });
});

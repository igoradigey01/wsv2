import type { IReference } from './nomenclature.service';
import { canonicalUnit, normalizeUnit, resolveUnitId } from './unit-matcher';

const UNITS: IReference[] = [
  { id: 1, name: 'бухта' },
  { id: 2, name: 'кг' },
  { id: 3, name: 'м' },
  { id: 4, name: 'пачка' },
  { id: 5, name: 'шт' },
];

describe('unit-matcher', () => {
  it('нормализует регистр, ё, точки и пробелы', () => {
    expect(normalizeUnit('Шт.')).toBe('шт');
    expect(normalizeUnit('ПОГ. М')).toBe('погм');
    expect(normalizeUnit('КГ')).toBe('кг');
  });

  it('приводит синонимы к канонической единице', () => {
    expect(canonicalUnit('штук')).toBe('шт');
    expect(canonicalUnit('килограмм')).toBe('кг');
    expect(canonicalUnit('упаковок')).toBe('пачка');
  });

  it('находит единицу по точному названию и синониму', () => {
    expect(resolveUnitId('шт', UNITS)).toBe(5);
    expect(resolveUnitId('штук', UNITS)).toBe(5);
    expect(resolveUnitId('килограмм', UNITS)).toBe(2);
    expect(resolveUnitId('метров', UNITS)).toBe(3);
    expect(resolveUnitId('упаковка', UNITS)).toBe(4);
  });

  it('сравнивает по корню, если точного совпадения нет', () => {
    expect(resolveUnitId('пачек', UNITS)).toBe(4);
    expect(resolveUnitId('бухточка', UNITS)).toBe(1);
  });

  it('возвращает null для единицы, которой нет в справочнике', () => {
    expect(resolveUnitId('мешков', UNITS)).toBeNull();
    expect(resolveUnitId('рулонов', UNITS)).toBeNull();
    expect(resolveUnitId('', UNITS)).toBeNull();
    expect(resolveUnitId(null, UNITS)).toBeNull();
  });
});

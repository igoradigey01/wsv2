import type { IReference } from './nomenclature.service';

/**
 * Приведение единицы из распознанного текста/фото к справочнику ЕдИзмерения.
 * Порядок: точное совпадение → словарь синонимов → сравнение по корню.
 * Если единицы в справочнике нет (например «мешок»), возвращаем null —
 * человек выберет вручную.
 */
const UNIT_SYNONYMS: Record<string, string> = {
  штук: 'шт',
  штука: 'шт',
  штуки: 'шт',
  штуку: 'шт',
  штукой: 'шт',
  штуками: 'шт',
  штуках: 'шт',
  килограмм: 'кг',
  килограмма: 'кг',
  килограммов: 'кг',
  килограммы: 'кг',
  метр: 'м',
  метра: 'м',
  метров: 'м',
  метры: 'м',
  погонный: 'м',
  погм: 'м',
  пачка: 'пачка',
  пачки: 'пачка',
  пачек: 'пачка',
  пачке: 'пачка',
  упаковка: 'пачка',
  упаковки: 'пачка',
  упаковок: 'пачка',
  уп: 'пачка',
  упак: 'пачка',
  бухта: 'бухта',
  бухты: 'бухта',
  бухт: 'бухта',
};

export function normalizeUnit(value: string): string {
  return value
    .toLocaleLowerCase('ru')
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]/g, '');
}

export function canonicalUnit(value: string): string {
  const normalized = normalizeUnit(value);

  return UNIT_SYNONYMS[normalized] ?? normalized;
}

export function resolveUnitId(
  raw: string | null | undefined,
  units: IReference[],
): number | null {
  const canonical = canonicalUnit(raw ?? '');

  if (canonical.length === 0) {
    return null;
  }

  for (const unit of units) {
    if (canonicalUnit(unit.name) === canonical) {
      return unit.id;
    }
  }

  for (const unit of units) {
    const unitCanonical = canonicalUnit(unit.name);
    const length = Math.min(4, unitCanonical.length, canonical.length);

    if (length >= 3 && unitCanonical.slice(0, length) === canonical.slice(0, length)) {
      return unit.id;
    }
  }

  return null;
}

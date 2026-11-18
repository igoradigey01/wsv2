/**
 * '2023-10-24T00:00:00' → '24.10.2023' — как pipe date:'dd.MM.yyyy'.
 * Берём первые 10 символов ISO, чтобы не сдвигать дату часовым поясом.
 */
export function formatDay(iso: string | null | undefined): string {
  const day = iso?.slice(0, 10);

  if (!day) {
    return '';
  }

  const [year, month, date] = day.split('-');

  return year && month && date ? `${date}.${month}.${year}` : '';
}

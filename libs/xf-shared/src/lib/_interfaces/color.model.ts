// Восстановлено 31.10.2026: файл отсутствовал в репозитории с самого начала,
// импортировался из libs/manage-page. Минимальная модель + индексная сигнатура
// (сервисы сериализуют объекты через Object.entries -> FormData).
export interface Color {
  id: number;
  name: string;
  postavchikId?: number;
  [key: string]: any;
}

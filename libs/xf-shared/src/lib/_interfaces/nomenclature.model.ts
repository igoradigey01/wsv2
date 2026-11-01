// Восстановлено 31.10.2026: файл отсутствовал в репозитории с самого начала,
// импортировался из libs/manage-page (nomenclature.service). Поля собраны по
// фактическому использованию; индексная сигнатура допускает служебные поля,
// arriving с сервера и сериализуемые в FormData.
export interface Nomenclature {
  id: number;
  name: string;
  guid?: string;
  katalogId?: number;
  articleId?: number;
  brandId?: number;
  colorId?: number;
  description?: string;
  hidden?: boolean;
  inStock?: boolean;
  sale?: boolean;
  markup?: number;
  position?: number;
  price?: number;
  postavchikId?: number;
  wwwroot?: string;
  imageWebp?: Blob | File;
  [key: string]: any;
}

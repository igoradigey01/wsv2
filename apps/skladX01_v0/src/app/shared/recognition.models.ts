// Ответ POST /api/recognition/parse (фото накладной + голос приёмщика).
// Ключи — snake_case, как задаёт JSON-схема модели; в шаблоны отдаём camelCase.

export interface IRecognizedItemApi {
  line_number: number | null;
  article: string | null;
  name: string;
  unit: string | null;
  price: number | null;
  qty_doc: number;
  qty_fact: number;
  is_extra: boolean;
  item_comment: string | null;
}

export interface IRecognizedDocumentApi {
  document_number: string | null;
  document_date: string | null;
  supplier_name: string | null;
  general_comment: string | null;
  items: IRecognizedItemApi[];
}

export interface IRecognizedItem {
  lineNumber: number | null;
  article: string | null;
  name: string;
  unit: string | null;
  price: number | null;
  /** Количество по документу. */
  qtyDoc: number;
  /** Фактически принятое количество (из голоса приёмщика). */
  qtyFact: number;
  /** Товар, которого нет в накладной, но он назван в голосе. */
  extra: boolean;
  comment: string | null;
}

export interface IRecognizedDocument {
  number: string | null;
  date: string | null;
  supplier: string | null;
  comment: string | null;
  items: IRecognizedItem[];
}

export function mapRecognizedDocument(
  raw: IRecognizedDocumentApi,
): IRecognizedDocument {
  return {
    number: raw.document_number,
    date: raw.document_date,
    supplier: raw.supplier_name,
    comment: raw.general_comment,
    items: (raw.items ?? []).map((item) => ({
      lineNumber: item.line_number,
      article: item.article,
      name: item.name,
      unit: item.unit,
      price: item.price,
      qtyDoc: item.qty_doc,
      qtyFact: item.qty_fact,
      extra: item.is_extra,
      comment: item.item_comment,
    })),
  };
}

/** Тип сущности в журнале аудита: накладная или платёж клиента/поставщика. */
export type AuditEntityType =
  | 'invoice'
  | 'payment'
  | 'supplier-invoice'
  | 'supplier-payment';

/** Сырой ответ `/api/audit/{entityType}/{entityId}`. */
export interface IAuditEntryApi {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  changedByEmployeeId: number;
  changedByEmployeeName: string;
  timestamp: string;
  oldData: string | null;
  newData: string | null;
}

/** Запись истории для вкладки «История». */
export interface IAuditEntry {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  employeeId: number;
  employeeName: string;
  timestamp: string;
  oldData: string | null;
  newData: string | null;
}

export function mapAuditEntry(raw: IAuditEntryApi): IAuditEntry {
  return {
    id: raw.id,
    entityType: raw.entityType,
    entityId: raw.entityId,
    action: raw.action,
    employeeId: raw.changedByEmployeeId,
    employeeName: raw.changedByEmployeeName,
    timestamp: raw.timestamp,
    oldData: raw.oldData,
    newData: raw.newData,
  };
}

/** Понятная подпись действия; неизвестное значение показываем как есть. */
export function actionLabel(action: string): string {
  switch (action) {
    case 'Update':
      return 'Изменение';
    case 'Create':
      return 'Создание';
    case 'Delete':
      return 'Удаление';
    default:
      return action;
  }
}

function readSum(json: string | null): number | null {
  if (!json) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(json);

    if (typeof parsed !== 'object' || parsed === null || !('sum' in parsed)) {
      return null;
    }

    const sum = (parsed as { sum?: unknown }).sum;

    return typeof sum === 'number' ? sum : null;
  } catch {
    return null;
  }
}

/** Старая и новая сумма платежа из JSON-снимков аудита. */
export function paymentSums(
  oldData: string | null,
  newData: string | null,
): { before: number | null; after: number | null } {
  return { before: readSum(oldData), after: readSum(newData) };
}

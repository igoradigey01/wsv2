import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { AuditEntityType, IAuditEntry, IAuditEntryApi } from './audit.models';
import { mapAuditEntry } from './audit.models';

const API = '/api/audit';

/** История изменений — только чтение. */
@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly http = inject(HttpClient);

  getHistory(
    entityType: AuditEntityType,
    entityId: number,
    limit = 50,
  ): Observable<IAuditEntry[]> {
    const params = new HttpParams().set('limit', limit);

    return this.http
      .get<IAuditEntryApi[]>(`${API}/${entityType}/${entityId}`, { params })
      .pipe(map((entries) => entries.map(mapAuditEntry)));
  }
}

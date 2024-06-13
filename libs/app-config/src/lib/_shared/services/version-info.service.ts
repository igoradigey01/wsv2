import { Injectable, signal, computed } from '@angular/core';

import { catchError, of, tap, Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { VersionInfo } from '../interfaces/vertion-info.model';
import { ApiService } from '../services/route-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EnvironmentService } from '../services/environment.service';

export interface Version {
  server: VersionInfo;
  client: VersionInfo;
}

@Injectable({ providedIn: 'root' })
export class VersionInfoService {
  private state = signal<Version>({
    server: { version: '', description: '' },
    client: { version: '', description: '' },
  });

  public Version = computed(() => this.state());

  constructor(
    private http: HttpClient,
    private url: ApiService,
    appConfig: EnvironmentService
  ) {
    this.loadServerVersion();
    this.state.update((state) => ({
      ...state,client:{
      version:  appConfig.version,
      description:  appConfig.description
      }
    }));
  }
  //----------------------------

  private serverVersion$(): Observable<VersionInfo> {
    this.url.Controller = 'Version';
    this.url.Action = 'info';
    this.url.ID = null;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.get<VersionInfo>(this.url.Url, { headers });
  }

  private loadServerVersion() {
    this.serverVersion$()
      .pipe(
        tap((data) => {
          //  this.state.update(() => data);
          this.state.update((state) => ({
            ...state,server:{
            version: data.version,
            description: data.description
            }
          }));
        }),
        takeUntilDestroyed(),
        catchError(() => of(<VersionInfo>{ version: '', description: '' })) //  on any error, just return an empty array
      )

      .subscribe();
  }
}

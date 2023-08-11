import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiService, SubKatalog } from '@wsv2/app-common';

@Injectable({
  providedIn: 'root',
})
export class SubKatalogService {
  constructor(
    private _http: HttpClient,
    private _url: ApiService
  ) {}

  public SubKatalogs = (categoriaId: number): Observable<SubKatalog[]> => {
    this._url.Controller = 'KatalogN';
    this._url.Action = 'KatalogNs';
    this._url.ID = categoriaId;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + this._token.AccessToken,
    });

    return this._http.get<SubKatalog[]>(this._url.Url, { headers });
  };
}

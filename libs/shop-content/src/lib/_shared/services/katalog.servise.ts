import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiService, } from '@wsv2/app-config';
import { Katalog } from '@wsv2/app-common'

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KatlogService {
  constructor(
    private _http: HttpClient,
    private url: ApiService) {

  }

  public Katalogs = (): Observable<Katalog[]> => {
    // debugger
    this.url.Controller = 'CategoriaN';
    this.url.Action = 'GetPostavchik';
    this.url.ID = 1; //this.url.PostavchikId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });

    return this._http.get<Katalog[]>(this.url.Url, { headers });
  };
}

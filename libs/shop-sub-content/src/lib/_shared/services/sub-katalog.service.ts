import { Injectable , signal} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';

import { ApiService } from '@wsv2/app-config';
import {SubKatalog} from "@wsv2/app-common"

@Injectable({
  providedIn: 'root',
})
export class SubKatalogService {
  
  SubKatalog = signal<SubKatalog[]>([]);
 
  constructor(
    private _http: HttpClient,
    private _url: ApiService
  ) {
    //this.SubKatalog();
  }

  private SubKatalogs$ = (idKatatlog:string):void => {
    this._url.Controller = 'KatalogN';
    this._url.Action = 'KatalogNs';
    this._url.ID = +idKatatlog;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + this._token.AccessToken,
    });

     this._http.get<SubKatalog[]>(this._url.Url, { headers })
     .pipe(
      tap((data) => this.SubKatalog.set(data)),
      takeUntilDestroyed(),
      catchError(() => of([] as SubKatalog[])) //  on any error, just return an empty array
    )
    .subscribe();
     ;
  };

  SubKatalogsSet = (idKatalog:string ):void => {
    this.SubKatalogs$(idKatalog) ;
  }


}

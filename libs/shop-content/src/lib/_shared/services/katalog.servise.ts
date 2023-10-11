import { Injectable, signal } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiService,EnvironmentService } from '@wsv2/app-config';
import { Katalog } from '@wsv2/app-common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap,BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KatlogService {

  private headers = new HttpHeaders({
    Accept: 'application/json',
    //  Authorization: 'Bearer ' + token,
  });

  
  indicatorSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private _http: HttpClient,
     private url: ApiService,
     private repozitory:EnvironmentService,
   
     ) {
    this.LoadKatlogs();
  }

  Katalogs = signal<Katalog[]>([]);

  private LoadKatlogs() {
    
    this.url.Controller = 'Catalog';
    this.url.Action = 'GetAll';
    this.url.ID = this.repozitory.clientId; //this.url.PostavchikId;
    this._http
      .get<Katalog[]>(this.url.Url, { headers: this.headers })
      .pipe(
        tap((data) => {
           this.Katalogs.set(data);
           if( data.length===1)
           this.indicatorSubject.next(true);
            console.log("Catalogs.Length :"+data.length)
          }),
        takeUntilDestroyed(),
        catchError(() => of([] as Katalog[])) //  on any error, just return an empty array
      )
      .subscribe();
  }

  

}

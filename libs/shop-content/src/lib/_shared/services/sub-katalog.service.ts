import { Injectable, signal, computed } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  catchError, of, tap } from 'rxjs';

import { ApiService } from '@wsv2/app-config';
import { SubKatalog, Message, Status } from '@wsv2/app-common';

interface SubCatalogListState {
  allItems: SubKatalog[];
  subCatalogItems:SubKatalog[];

  queryAdd: SubKatalog[];
  queryUpdate: SubKatalog[];
  queryDelete: SubKatalog[];

  state: Status;
}

@Injectable({
  providedIn: 'root',
})
export class SubKatalogService {
  private state = signal<SubCatalogListState>({
    allItems: [],
    subCatalogItems:[],
    queryAdd: [],
    queryUpdate: [],
    queryDelete: [],
    state: Status.empty,
  });
  private error_state = signal<Message>({ message: undefined, error: false });

  readonly SubCatalog = computed(() => this.state().subCatalogItems);
  readonly Message = computed(() => this.error_state());

  constructor(
    private _http: HttpClient,
     private url: ApiService) {
      this.LoadSubCatlaogs();
  
  }

  
  private SubKatalogs$ = () => {
    this.url.Controller = 'SubCatalog';
    this.url.Action = 'GetAll';
    this.url.ID = this.url.ClientId;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + this._token.AccessToken,
    });

  this._http
      .get<SubKatalog[]>(this.url.Url, { headers })
      .pipe(
        tap((data) =>
          this.state.update((state) => ({
            ...state,
            allItems: data,
            state: Status.load,
          }))
        ),
        //https://angularindepth.com/posts/1518/takeuntildestroy-in-angular-v16
        takeUntilDestroyed(),
        catchError(() => of([] as SubKatalog[])) //  on any error, just return an empty array
      )
      .subscribe(
        {
        error: (err: HttpErrorResponse) => {
          console.error(err);
  
          this.error_state.update((m) => ({
            ...m,
            message:
              'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса',
          }));
          return;
        },
      });
      
  }

  private LoadSubCatlaogs() {
    
     this.SubKatalogs$();
  }

  public ReLoadSubCatalogs() {
    this.LoadSubCatlaogs();
  }

  SubKatalogsSet = (idKatalog: string): void => {

    const data=this.state().allItems.filter(d=>d.katalogId===+idKatalog)

    this.state.update((state) => ({
      ...state,
      subCatalogItems: data
    }))
    
  };
}

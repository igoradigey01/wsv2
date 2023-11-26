import { Injectable, signal, computed } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Observable, catchError, of, shareReplay, tap } from 'rxjs';

import { ApiService } from '@wsv2/app-config';
import { SubKatalog, Message, Status } from '@wsv2/app-common';
import { UserManagerService } from '@wsv2/account-service';

interface SubCatalogListState {
  allItems: SubKatalog[];
  subCatalogItems:SubKatalog[];
  idCatalog:number; 
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
    idCatalog:0,
    queryAdd: [],
    queryUpdate: [],
    queryDelete: [],
    state: Status.empty,
  });
  private error_state = signal<Message>({ message: undefined, error: false });

  readonly SubCatalogs = computed(() => this.state().subCatalogItems);
  readonly Message = computed(() => this.error_state());

  constructor(
    private _http: HttpClient,
     private url: ApiService,
     private userManager: UserManagerService 
     ) {
     
     // console.log("subCatalog-load:"+JSON.stringify(this.state().allItems));
     if (this.state().state === Status.empty) {
      this.LoadSubCatlaogs();
     // console.log("subCatalog-load:"+JSON.stringify(this.state().allItems));
    }
  
  }

  
  private SubKatalogs$ = () => {
    //debugger
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
        tap((data) =>{
          if(data){
            const _data=data as SubKatalog[];
          this.state.update((state) => ({
            ...state,
            allItems:_data,
            subCatalogItems:[],
            state: Status.load,
          }));
        // console.log("subCatalog-load:"+JSON.stringify(data) );
        }
        }
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

  public Create = (item: SubKatalog) => {
    this.Create$(item)
      .pipe(
        shareReplay(1),// последнее для всех (один раз!!! )item довавить в state
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tap((data:any) => {
          if (data.body) {
            this.state.update((state) => ({
              ...state,
              catalogItems: [...state.allItems, data.body as SubKatalog],
              state: Status.load,
            }));

            //  console.log('(data-tap -catalog-1)' + JSON.stringify(data.body));
          }
        })
      )
      .subscribe({
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.state.update((d) => ({
            ...d,
            allItems: [...d.allItems],
            queryAdd: [...d.queryAdd, item],
            state: Status.modify,
          }));
          this.error_state.update((m) => ({ ...m, error: true }));
          if (err.status === 401) {
            this.error_state.update((m) => ({
              ...m,
              message: 'пользователь не авторизован,войдите на сайт',
            }));
            return;
          }
          if (err.status == 400) {
            this.error_state.update((m) => ({ ...m, message: err.error }));
            return;
          }

          this.error_state.update((m) => ({
            ...m,
            message:
              'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса',
          }));
          return;
        },
      });
  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private Create$ = (item: SubKatalog): Observable<any> => {
    this.url.Controller = 'SubCatalog';
    this.url.Action = 'Create';
    this.url.ID = null;

    item.ownerId = this.url.ClientId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.userManager.AccessToken(),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._http.post<any>(this.url.Url, item, {
    
      headers,
    });
  };

  public Update = (item: SubKatalog) => {
    // new Error("Протестировать правильность работы метода")
    this.Update$(item).subscribe({
      next: (res) => {
        console.log(res);
        this.state.update((d) => ({
          ...d,
         // allItems: [...d.allItems],
          state: Status.modify,
        }));
        this.error_state.update((m) => ({
          ...m,
          message: 'The status was updated successfully!',
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.state.update((d) => ({
          ...d,
        //  catalogItems: [...d.catalogItems],
          queryUpdate: [...d.queryUpdate, item],
          state: Status.modify,
        }));
        this.error_state.update((m) => ({ ...m, error: true }));
        if (err.status === 401) {
          this.error_state.update((m) => ({
            ...m,
            message: 'пользователь не авторизован,войдите на сайт',
          }));
          return;
        }
        if (err.status == 400) {
          this.error_state.update((m) => ({ ...m, message: err.error }));
          return;
        }

        this.error_state.update((m) => ({
          ...m,
          message:
            'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса',
        }));
        return;
      },
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private Update$ = (item: SubKatalog): Observable<any> => {
    // throw new Error("not implemint exeption");
    this.url.Controller = 'SubCatalog';
    this.url.Action = 'Update';
    this.url.ID = item.id;
    item.ownerId = this.url.ClientId;
    //  debugger
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.userManager.AccessToken(),
    });

    //new Response(fd).text().then(console.log);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._http.put<any>(this.url.Url, item, {
      headers,
    });
  };


  
  public Delete = (item: SubKatalog) => {

    const newCatlogsList = this.state().allItems.filter(
      (d) => d.id !== item.id
    );

    // const delItems = this.state().catalogItems.find(
    //   (todo) => todo.id === item.id
    // );

    this.Delete$(item.id).subscribe({
      next: (res) => {
        console.log(res);
        this.state.update((d) => ({
          ...d,
          catalogItems: newCatlogsList,
          state: Status.modify,
        }));
        this.error_state.update((m) => ({
          ...m,
          message: 'The status was updated successfully!',
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
       
          this.state.update((d) => ({
            ...d,
            catalogItems: newCatlogsList,
            queryDelete: [...d.queryDelete, item],
            state: Status.modify,
          }));
        this.error_state.update((m) => ({ ...m, error: true }));
        if (err.status === 401) {
          this.error_state.update((m) => ({
            ...m,
            message: 'пользователь не авторизован,войдите на сайт',
          }));
          return;
        }
        if (err.status == 400) {
          this.error_state.update((m) => ({ ...m, message: err.error }));
          return;
        }

        this.error_state.update((m) => ({
          ...m,
          message:
            'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса',
        }));
        return;
      },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private Delete$ = (id: number): Observable<any> => {
    this.url.Controller = 'Catalog';
    this.url.Action = 'Delete';
    this.url.ID = id;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.userManager.AccessToken(),
    });
    // let url: string = this._url.Url+'/'+id;
    return this._http.delete(this.url.Url, {
      headers,
    });
  };

  public ClearMessage() {
    this.error_state.update((m) => ({ ...m, message: '', error: false }));
  }

  SubKatalogsSet = (idKatalog: string): void => {
   // console.log("subCatalog-load:"+JSON.stringify(this.state().allItems));
     
    const id=+idKatalog;
    const data=this.state().allItems.filter(d=>d.catalogId===id)

    this.state.update((state) => ({
      ...state,
      subCatalogItems: data,
      idCatalog: id
    }))
    
  };
}

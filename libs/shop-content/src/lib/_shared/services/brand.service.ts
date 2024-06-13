import { Injectable, signal, computed } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiService } from '@wsv2/app-config';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserManagerService } from '@wsv2/account-service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Brand, Message, Status } from '@wsv2/app-common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap, Observable, shareReplay } from 'rxjs';

interface BrandListState {
  brandItems: Brand[];

  queryAdd: Brand[];
  queryUpdate: Brand[];
  queryDelete: Brand[];

  state: Status;
}

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private headers = new HttpHeaders({
    Accept: 'application/json',
    //  Authorization: 'Bearer ' + token,
  });

  private state = signal<BrandListState>({
    brandItems: [],
    queryAdd: [],
    queryUpdate: [],
    queryDelete: [],
    state: Status.empty,
  });

  private error_state = signal<Message>({ message: undefined, error: false });

  readonly Brands = computed(() => this.state().brandItems);
  readonly Message = computed(() => this.error_state());

  constructor(
    private _http: HttpClient,
    private url: ApiService,
    private userManager: UserManagerService //  private repozitory: EnvironmentService
  ) {
    
    if (this.state().state === Status.empty) {
      this.LoadBrands();
    }
  }

  private LoadBrands() {
    this.url.Controller = 'Brand';
    this.url.Action = 'GetAll';
    this.url.ID = this.url.ClientId;
    this._http
      .get<Brand[]>(this.url.Url, { headers: this.headers })
      .pipe(
        tap((data) => {
          //  this.state.update(() => data);
         // console.log("brand-tap-load"+JSON.stringify(data))
          this.state.update((state) => ({
            ...state,
            brandItems: data,
            state: Status.load,
          }));
        }),
        //https://angularindepth.com/posts/1518/takeuntildestroy-in-angular-v16
        takeUntilDestroyed(),
        catchError(() => of([] as Brand[])) //  on any error, just return an empty array
      )
      .subscribe();
  }

  public ReLoadBrands() {
    this.LoadBrands();
  }

  public Create = (item: Brand) => {
    this.Create$(item)
      .pipe(
        shareReplay(1), // последнее для всех (один раз!!! )item довавить в state
        tap((data) => {
          if (data) {
            this.state.update((state) => ({
              ...state,
              brandItems: [...state.brandItems, data as Brand],
              state: Status.load,
            }));

            ;
          }
          console.log(' Create--(data-tap -Brand-1)' + JSON.stringify(data))
        })
      )
      .subscribe({
        error: (err: HttpErrorResponse) => {
          console.error(err.message);
          this.state.update((d) => ({
            ...d,
            brandItems: [...d.brandItems],
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
  private Create$ = (item: Brand): Observable<any> => {
   //debugger
    this.url.Controller = 'Brand';
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

  public Update = (item: Brand) => {
    // new Error("Протестировать правильность работы метода")
    this.Update$(item).subscribe({
      next: (res) => {
        console.log(res);
        this.state.update((d) => ({
          ...d,

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
  private Update$ = (item: Brand): Observable<any> => {
    // throw new Error("not implemint exeption");
    this.url.Controller = 'Brand';
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

  public Delete = (item: Brand) => {
    const newCatlogsList = this.state().brandItems.filter(
      (d) => d.id !== item.id
    );

    this.Delete$(item.id).subscribe({
      next: (res) => {
        console.log(res);
        this.state.update((d) => ({
          ...d,
          BrandItems: newCatlogsList,
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
          brandItems: newCatlogsList,
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
    this.url.Controller = 'Brand';
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
}

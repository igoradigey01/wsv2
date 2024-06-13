import { Injectable, signal, computed } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiService } from '@wsv2/app-config';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserManagerService } from '@wsv2/account-service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Article, Message, Status } from '@wsv2/app-common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap, Observable, shareReplay } from 'rxjs';

interface ArticleListState {
  articleItems: Article[];

  queryAdd: Article[];
  queryUpdate: Article[];
  queryDelete: Article[];

  state: Status;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private headers = new HttpHeaders({
    Accept: 'application/json',
    //  Authorization: 'Bearer ' + token,
  });

  private state = signal<ArticleListState>({
    articleItems: [],
    queryAdd: [],
    queryUpdate: [],
    queryDelete: [],
    state: Status.empty,
  });

  private error_state = signal<Message>({ message: undefined, error: false });

  readonly Articles = computed(() => this.state().articleItems);
  readonly Message = computed(() => this.error_state());

  constructor(
    private _http: HttpClient,
    private url: ApiService,
    private userManager: UserManagerService //  private repozitory: EnvironmentService
  ) {
    if (this.state().state === Status.empty) {
      this.LoadArticles();
    }
  }

  private LoadArticles() {
    this.url.Controller = 'Article';
    this.url.Action = 'GetAll';
    this.url.ID = this.url.ClientId;
    this._http
      .get<Article[]>(this.url.Url, { headers: this.headers })
      .pipe(
        tap((data) => {
          //  this.state.update(() => data);
          this.state.update((state) => ({
            ...state,
            articleItems: data,
            state: Status.load,
          }));
        }),
        //https://angularindepth.com/posts/1518/takeuntildestroy-in-angular-v16
        takeUntilDestroyed(),
        catchError(() => of([] as Article[])) //  on any error, just return an empty array
      )
      .subscribe();
  }

  public ReLoadArticles() {
    this.LoadArticles();
  }

  public Create = (item: Article) => {
    this.Create$(item)
      .pipe(
        shareReplay(1), // последнее для всех (один раз!!! )item довавить в state
        tap((data) => {
          if (data) {
            this.state.update((state) => ({
              ...state,
              articleItems: [...state.articleItems, data as Article],
              state: Status.load,
            }));

            ;
          }
        //  console.log(' Create--(data-tap -article-1)' + JSON.stringify(data))
        })
      )
      .subscribe({
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.state.update((d) => ({
            ...d,
            articleItems: [...d.articleItems],
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
  private Create$ = (item: Article): Observable<any> => {
   //debugger
    this.url.Controller = 'Article';
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

  public Update = (item: Article) => {
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
  private Update$ = (item: Article): Observable<any> => {
    // throw new Error("not implemint exeption");
    this.url.Controller = 'Article';
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

  public Delete = (item: Article) => {
    const newCatlogsList = this.state().articleItems.filter(
      (d) => d.id !== item.id
    );

    this.Delete$(item.id).subscribe({
      next: (res) => {
        console.log(res);
        this.state.update((d) => ({
          ...d,
          articleItems: newCatlogsList,
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
          articleItems: newCatlogsList,
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
    this.url.Controller = 'Article';
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

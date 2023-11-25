import { Injectable, signal, computed } from '@angular/core';

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';

import { ApiService } from '@wsv2/app-config';
import { UserManagerService } from '@wsv2/account-service';
import { Katalog ,Message,Status} from '@wsv2/app-common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  of,
  tap,
  BehaviorSubject,
  Observable,
  shareReplay,
} from 'rxjs';



interface CatalogListState {
  catalogItems: Katalog[];

  queryAdd: Katalog[];
  queryUpdate: Katalog[];
  queryDelete: Katalog[];

  state: Status;
}





@Injectable({
  providedIn: 'root',
})
export class KatlogService {
  private headers = new HttpHeaders({
    Accept: 'application/json',
    //  Authorization: 'Bearer ' + token,
  });

  private state = signal<CatalogListState>({
    catalogItems: [],
    queryAdd: [],
    queryUpdate: [],
    queryDelete: [],
    state: Status.empty,
  });

  private error_state = signal<Message>({ message: undefined, error: false });

  readonly Katalogs = computed(() => this.state().catalogItems);
  readonly Message = computed(() => this.error_state());

  

  public indicatorSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private _http: HttpClient,
    private url: ApiService,
    private userManager: UserManagerService //  private repozitory: EnvironmentService
  ) {
    if (this.state().state === Status.empty) {
      this.LoadCatlaogs();
    }
  }

  // Katalogs = signal<Katalog[]>([]);

  /* ref:EffectRef=effect(()=>{
   console.log("efff serves"+JSON.stringify(this.state()))
 })
*/
  private LoadCatlaogs() {
    this.url.Controller = 'Catalog';
    this.url.Action = 'GetAll';
    this.url.ID = this.url.ClientId; //this.url.PostavchikId;
    this._http
      .get<Katalog[]>(this.url.Url, { headers: this.headers })
      .pipe(
        tap((data) => {
          //  this.state.update(() => data);
          this.state.update((state) => ({
            ...state,
            catalogItems: data,
            state: Status.load,
          }));
          if (data.length === 1) this.indicatorSubject.next(true);
          //   console.log("Catalogs.Length :"+data.length)
        }),
        //https://angularindepth.com/posts/1518/takeuntildestroy-in-angular-v16
        takeUntilDestroyed(),
        catchError(() => of([] as Katalog[])) //  on any error, just return an empty array
      )
      .subscribe();
  }

  public ReLoadCatalogs() {
    this.LoadCatlaogs();
  }

  public Create = (item: Katalog) => {
    this.Create$(item)
      .pipe(
        shareReplay(1),// последнее для всех (один раз!!! )item довавить в state
        tap((data) => {
          if (data.body) {
            this.state.update((state) => ({
              ...state,
              catalogItems: [...state.catalogItems, data.body as Katalog],
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
            catalogItems: [...d.catalogItems],
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

  /*  public Create = (item: Katalog) => {
    this.Create$(item).pipe(
      shareReplay(1)
    )    
    .subscribe({
      next: (res) => {
        console.log('(res)' + JSON.stringify(res));

        this.state.update((d) => ({
          ...d,
          catalogItems: [...d.catalogItems, res],
          state: Status.modify,
        }));
        console.log(
          'public Create = (item: Katalog)-- /n' +
            JSON.stringify(this.state().catalogItems)
        );
        this.error_state.update((m) => ({
          ...m,
          message: 'The status was create successfully!',
        }));
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.state.update((d) => ({
          ...d,
          catalogItems: [...d.catalogItems],
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
  }; */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private Create$ = (item: Katalog): Observable<any> => {
    this.url.Controller = 'Catalog';
    this.url.Action = 'Create';
    this.url.ID = null;

    item.ownerId = this.url.ClientId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.userManager.AccessToken(),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this._http.post<any>(this.url.Url, item, {
      reportProgress: true,
      observe: 'events',
      headers,
    });
  };

  public Update = (item: Katalog) => {
    // new Error("Протестировать правильность работы метода")
    this.Update$(item).subscribe({
      next: (res) => {
        console.log(res);
        this.state.update((d) => ({
          ...d,
          catalogItems: [...d.catalogItems],
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
          catalogItems: [...d.catalogItems],
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
  private Update$ = (item: Katalog): Observable<any> => {
    // throw new Error("not implemint exeption");
    this.url.Controller = 'Catalog';
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

  public Delete = (item: Katalog) => {
    const newCatlogsList = this.state().catalogItems.filter(
      (todo) => todo.id !== item.id
    );

    const delItems = this.state().catalogItems.find(
      (todo) => todo.id === item.id
    );

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
        if (delItems)
          this.state.update((d) => ({
            ...d,
            catalogItems: newCatlogsList,
            queryDelete: [...d.queryDelete, delItems],
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

  /*
  state = signal<TodoListState>({ todoItems: [], state: Status.empty });

  todoItems = computed(() => this.state().todoItems);

  deleteTodo(todoItemId: string) {
    // debugger
    const newTodoList = this.state().todoItems.filter(
      (todo) => todo.id !== todoItemId
    );
   // https://dev.to/sagar/three-dots---in-javascript-26ci
   //Object.assign
   //https://learn.javascript.ru/object-copy
    this.state.update((state) =>Object.assign ({ ...state, todoItems: newTodoList,state:"test-2" }));
   // this.state.update((old)=>Object.assign({...old,state:"test"}))
   
  }

  fetchTodoItems() {
    this.state.update((state) => ({
      ...state,
      todoItems: [
        {
          id: '1',
          name: 'Create YT video',
          isCompleted: false,
        } as TodoItem,
        {
          id: '2',
          name: 'Go to the gym',
          isCompleted: false,
        } as TodoItem,
        {
          id: '3',
          name: 'Buy flowers',
          isCompleted: false,
        } as TodoItem,
      ],
    }));
  }

  saveTodo(todoItemToSave: TodoItem) {
    if (todoItemToSave.id) {
      // update

      const updatedTodoList = this.state().todoItems.map((todoItem) => {
        if (todoItem.id === todoItemToSave.id) {
          return todoItemToSave;
        }
        return todoItem;
      });

      this.state.update((state) => ({
        ...state,
        todoItems: [...updatedTodoList],
      }));
    } else {
      // create
      const newTodoItem = {
        ...todoItemToSave,
        id: crypto.randomUUID(),
      } as TodoItem;
      this.state.update((state) => ({
        ...state,
        todoItems: [...state.todoItems, newTodoItem],
      }));
    }
  }
  */
}

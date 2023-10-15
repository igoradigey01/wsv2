import { Injectable, signal, computed, effect, EffectRef } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ApiService} from '@wsv2/app-config';
import { Katalog } from '@wsv2/app-common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap, BehaviorSubject, Observable } from 'rxjs';

/*
export interface TodoItem {
  id: string;
  name: string;
  isCompleted: boolean;
}

export interface TodoListState {
  todoItems: TodoItem[];
  
  queryAdd:TodoItem[];
  queryUpdate:TodoItem[];
  queryDelete:TodoItem[];

  state: Status;
}
*/

interface CatalogListState {
  catalogItems: Katalog[];

  queryAdd: Katalog[];
  queryUpdate: Katalog[];
  queryDelete: Katalog[];

  state: Status;
}

export interface Message{
  message:string|undefined;
 error:boolean;
  
}

enum Status {
  empty = 0,
  load = 1,
  modify = 2,
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

  public  Katalogs = computed(() => this.state().catalogItems);

  public message =signal<Message>({message:undefined,error:false})

  public indicatorSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private _http: HttpClient,
    private url: ApiService,
  //  private repozitory: EnvironmentService
  ) {
    if(this.state().state===Status.empty){
    this.LoadKatlogs();
    }
  }

 // Katalogs = signal<Katalog[]>([]);

   ref:EffectRef=effect(()=>{
    console.log("efff serves"+JSON.stringify(this.state()))
  })

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
           catalogItems: data,state:Status.load}));
          if (data.length === 1) this.indicatorSubject.next(true);
          //   console.log("Catalogs.Length :"+data.length)
        }),
        takeUntilDestroyed(),
        catchError(() => of([] as Katalog[])) //  on any error, just return an empty array
      )
      .subscribe();
  }

  public ReLoadCatalogs() {
    this.LoadCatlaogs();
  }

  public Create = (item: Katalog)=>{
    this.Create$(item)
    .subscribe({
      
      next: (res) => {
        console.log(res);       
        this.state.update((d)=>({...d,catalogItems: [...d.catalogItems, item],state:Status.modify}))
        this.message.update((m)=>({...m,message:"The status was updated successfully!"})) ;
      },
      error: (err: HttpErrorResponse) =>{
        console.error(err);
        this.state.update((d)=>({...d,catalogItems: [...d.catalogItems, item],queryUpdate:[...d.catalogItems, item],state:Status.modify}));
        this.message.update((m)=>({...m,error:true})) ;
        if (err.status === 401) {         
          this.message.update((m)=>({...m,message:'пользователь не авторизован,войдите на сайт'})) ;
          return;
        }
        if (err.status == 400) {
          this.message.update((m)=>({...m,message:err.error})) ;
          return;
        }
        
        this.message.update((m)=>({...m,message: 'Ошибка {' + err.status + '} -Сообщиете Администаратору Pесурса'})) ;
        return;
      } 
     } );


      

  }

 private Create$ = (item: Katalog): Observable<any> => {

    this.url.Controller = 'Catalog';
    this.url.Action = 'Create';
    this.url.ID=null;

    item.ownerId=this.url.ClientId
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.url.AccessToken,
    });

   

    return this._http.post(this.url.Url, item,{
      reportProgress: true,
      observe: 'events',
      headers,
    });
  }

  //-----------------------------------

 private Update$ = (item: Katalog): Observable<any> => {
   // throw new Error("not implemint exeption");
   this.url.Controller = 'Catalog';
   this.url.Action = 'Update';
   this.url.ID=item.id;
   item.ownerId=this.url.ClientId;
 //  debugger
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.url.AccessToken,
    });
  

    //new Response(fd).text().then(console.log);
    return this._http.put(this.url.Url, item,{
     
      headers,
    });
  }
  //-------------------

  private Delete$ = (id: number): Observable<any> => {
    this.url.Controller = 'Catalog';
    this.url.Action = 'Delete';
    this.url.ID=id


    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.url.AccessToken,
    });
   // let url: string = this._url.Url+'/'+id;
    return this._http.delete(this.url.Url,{
      
      headers,
    });
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

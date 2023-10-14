import { Injectable, signal, computed,effect,EffectRef } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiService, EnvironmentService } from '@wsv2/app-config';
import { Katalog } from '@wsv2/app-common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap, BehaviorSubject } from 'rxjs';

export interface TodoItem {
  id: string;
  name: string;
  isCompleted: boolean;
}

export interface TodoListState {
  todoItems: TodoItem[];
  state: string;
}

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
    private repozitory: EnvironmentService
  ) {
    this.LoadKatlogs();
  }

  Katalogs = signal<Katalog[]>([]);

   ref:EffectRef=effect(()=>{
    console.log("efff serves"+JSON.stringify(this.state()))
  })

  private LoadKatlogs() {
    this.url.Controller = 'Catalog';
    this.url.Action = 'GetAll';
    this.url.ID = this.repozitory.clientId; //this.url.PostavchikId;
    this._http
      .get<Katalog[]>(this.url.Url, { headers: this.headers })
      .pipe(
        tap((data) => {
          this.Katalogs.update(() => data);
          if (data.length === 1) this.indicatorSubject.next(true);
          //   console.log("Catalogs.Length :"+data.length)
        }),
        takeUntilDestroyed(),
        catchError(() => of([] as Katalog[])) //  on any error, just return an empty array
      )
      .subscribe();
  }

  public ReLoadKatalogs() {
    this.LoadKatlogs();
  }

  state = signal<TodoListState>({ todoItems: [], state: 'init' });

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
}

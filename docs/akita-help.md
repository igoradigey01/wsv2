# Akita - state maneger

- yarn add @datorama/akita // run in admin cmd
- yarn cache clean --force

## help
- [api-help-ru] (https://dev-gang.ru/doc/akita/entity-store/api/)
-  [api] (https://opensource.salesforce.com/akita/docs/entities/entity-store)
- https://github.com/salesforce/akita/blob/master/docs/docs/angular/architecture.mdx
- https://www.youtube.com/watch?v=io6BKBzvf0Q&t=411s

## start on componet

- create interface
```   //todo.model.ts
import { guid } from '@datorama/akita';

export type Todo = {
id: string;
title: string;
completed: boolean;
};

export function createTodo(title: string) {
return {
 id: guid(),
 title,
 completed: false
} as Todo;
}
```
- create store
```   //todo.store.ts
import { Todo } from './todo.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { VISIBILITY_FILTER } from '../filter/filter.model';
import { Injectable } from '@angular/core';

export interface TodosState extends EntityState<Todo, string> {
  ui: {
    filter: VISIBILITY_FILTER
  };
}

const initialState = {
  ui: { filter: VISIBILITY_FILTER.SHOW_ALL }
};

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'todos' })
export class TodosStore extends EntityStore<TodosState> {
  constructor() {
    super(initialState);
  }
}

```

 ```  //interface EntityState<T>
  export interface EntityState<T> {
  entities: HashMap<T>;
  ids: ID[];
  loading: boolean;
  error: any;
}
 ```
 
 0. [api] https://dev-gang.ru/doc/akita/entity-store/api/
 1. создать запись 
   - если записи существуют ,то они перезаписывается
   - this.store.set([entiry,entry])
   - this.store.set({1:entiry,2:entry})

 2. добавить запись
   - this.store.add(entity)
   - this.store.add(Entity, { prepend: true }); // как сортировать

 3. обновить запись
   - /** Обновить все */this.store.update(null, {  name: 'New Name'}); 
   - this.store.update(3, {  name: 'New Name'});
 4. Удаляет одну или несколько сущностей из хранилища
   - this.store.remove(5);
   - this.store.remove([1,2,3]);
   - this.store.remove(e => e.name === 'Netanel');
   - this.store.remove(); // all store
 5. Обновляет состояние загрузки хранилища
   - this.store.setLoading(true);
 6. Обновляет состояние ошибки хранилища
  - this.store.setError('Example of error');
 7. Уничтожить хранилище.
  - this.store.destroy()



- create Query //Query — это класс, отвечающий за запросы в хранилище.
   ```  //todos.query.ts
     import { QueryEntity } from '@datorama/akita';

     @Injectable({
        providedIn: 'root'
      })
     export class TodosQuery extends QueryEntity<State, Todo> {
        
     constructor(protected store: TodosStore) {
     super(store);
     }
     }
   ```
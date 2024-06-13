import { Injectable, signal, computed } from '@angular/core';

import { HttpClient, 
// HttpErrorResponse,
HttpHeaders } from '@angular/common/http';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiService } from '@wsv2/app-config';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProductType, Message, Status } from '@wsv2/app-common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';

interface ProductTypeListState {
  productTypeItems: ProductType[];

  queryAdd: ProductType[];
  queryUpdate: ProductType[];
  queryDelete: ProductType[];

  state: Status;
}

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService {
  private headers = new HttpHeaders({
    Accept: 'application/json',
    //  Authorization: 'Bearer ' + token,
  });

  private state = signal<ProductTypeListState>({
    productTypeItems: [],
    queryAdd: [],
    queryUpdate: [],
    queryDelete: [],
    state: Status.empty,
  });

  private error_state = signal<Message>({ message: undefined, error: false });

  readonly ProductTypes = computed(() => this.state().productTypeItems);
  readonly Message = computed(() => this.error_state());

  constructor(private _http: HttpClient, private url: ApiService) {
    if (this.state().state === Status.empty) {
      this.LoadProductTypes();
    }
  }

  private LoadProductTypes() {
    this.url.Controller = 'ProductType';
    this.url.Action = 'GetAll';
    this.url.ID = null;
    this._http
      .get<ProductType[]>(this.url.Url, { headers: this.headers })
      .pipe(
        tap((data) => {
          //  this.state.update(() => data);
          this.state.update((state) => ({
            ...state,
            productTypeItems: data,
            state: Status.load,
          }));
          // console.log("LoadProductTypes--"+JSON.stringify(data))
        }),
        //https://angularindepth.com/posts/1518/takeuntildestroy-in-angular-v16
        takeUntilDestroyed(),
        catchError(() => of([] as ProductType[])) //  on any error, just return an empty array
      )
      .subscribe();
  }

  public ClearMessage() {
    this.error_state.update((m) => ({ ...m, message: '', error: false }));
  }
}

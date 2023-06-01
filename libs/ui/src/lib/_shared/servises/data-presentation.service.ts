import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  catchError,
  filter,
  forkJoin,
  map,
  tap,
  Observable,
  shareReplay,
  switchMap,
  throwError
} from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
//import {katalog_data} from './data-fake'

import { Nomenclature } from '@wsv2/shop-cart';

@Injectable({
  providedIn: 'root'
})
export class CartPresentationService {
  //private url = 'https://s.x-01.ru/api/Nomenclature/NomenclaturePKs/1?postavchikId=1';
  private url = 'http://localhost:8080/api/Nomenclature/NomenclaturePKs/1?postavchikId=1'
  
  private products$ = this.http.get<Nomenclature[]>(this.url).pipe(
    map((data: any) => {
        //  console.log(JSON.stringify(data))
        return data.map((f: any) => {
          return <Nomenclature>{
            id:f.id,
            guid:f.guid,
            name:f.name,
            description:f.description,
            price:f.price,
            markup: f.markup ? f.markup:undefined,
            cost_total:this.get_cost_total(f.price,f.markup),
            inStock:f.inStock ? f.inStock:undefined,
            colorName:this.get_name_or_emptystring(f.color,"color"),
            brandName: this.get_name_or_emptystring(f.brand,"brand"),
            articleName: this.get_name_or_emptystring(f.article,"article"),
            postavchik: "xl-01",
            photo: this.get_photo_url(f.guid)
            
            
          };
        });
      }),
      tap(d=>console.log(d)),
    shareReplay(1),
    catchError(this.handleError)
  );

  // Expose signals from this service
  products = toSignal<Nomenclature[], Nomenclature[]>(this.products$, {initialValue: []});
  selectedProduct = signal<Nomenclature| undefined>(undefined);
  
  

  constructor(private http: HttpClient) {
  }

  productSelected(guid: string|undefined ,id:number|undefined) {
    if(guid){
    const foundProduct = this.products().find((v:Nomenclature) => v.guid === guid);
    this.selectedProduct.set(foundProduct);
    }
   if(id){
    const foundProduct = this.products().find((v:Nomenclature) => v.id === id);
    this.selectedProduct.set(foundProduct);

   }
  }
   private get_photo_url(guid:string){
    return `https://s.x-01.ru/images/L${guid}.webp`
   }
   private get_name_or_emptystring(name:string,katalog:string){
    // if(name){
    //     return //найти по id в color || barand || article;
    // }
    return `имя ${katalog}`;
   }

   private get_cost_total(price:number,markup:number|null|undefined ){
    if(markup){
        return price*(markup /100)+price;//item.price * (nomenclature.markup / 100) + nomenclature.price
    }
    return price

   }
  //изменить функцию handleError. на
  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `Произошла клиентская или сетевая ошибка: ${err.error.message}`;
      //// Произошла клиентская или сетевая ошибка, чтобы напомнить пользователю
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Сервер вернул код ошибки: ${err.status}, error message is: ${err.message
        }`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
    //Произошло что-то плохое; Пожалуйста, повторите попытку позже.-sample message error
  }
}

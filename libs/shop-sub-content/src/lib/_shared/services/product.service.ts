import { Injectable, signal } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';


import { ApiService } from '@wsv2/app-config';
import { Product,Article,Brand,Color } from "@wsv2/app-common"
import { catchError, of, tap,map} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  Article=signal<Article[]>([]);
  Brand=signal <Brand[]>([]);
  Color=signal <Color[]>([]);

  constructor(
    private _http: HttpClient,
    private _url: ApiService
  ) {
    this.Article$();
    this.Brand$();
    this.Color$();
   }



  private Poducts$ = (idKatlaog: number): Observable<Product[]> => {
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'NomenclaturePKs';
    this._url.ID = idKatlaog;
    const postavchikId = 1; //this.url.PostavchikId;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });
    const params: HttpParams = new HttpParams().set('postavchikId', postavchikId)

    const httpOptions = { headers, params }
    return this._http.get<Product[]>(this._url.Url, httpOptions).pipe(
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((data: any) => {
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((f: any) => {
           
          return <Product><unknown>{
            id: f.id,
            guid: f.guid,
            img_guids: undefined,
            name: f.name,
            description: f.description,

            cost_total: undefined,
            price: f.price,
            markup: f.markup,

            inStock: undefined,
            sale: f.sale,

            katalogId: f.katalogId,
            katalogName: undefined,

            colorId: f.colorId,
            colorName: undefined,

            brandId: f.brandId,
            brandName: undefined,

            articleId: f.articleId,
            articleName: undefined,

            hidden: f.hidden,

            postavchikId: f.postavchikId
          };
        });
      }),tap(
        x => console.log(x)
      )
    );
  };


  private ProductItem$ = (idProductItem: number): Observable<Product> => {
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'Item';
    this._url.ID = idProductItem;


    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });
    // let params:HttpParams=new HttpParams().set('postavchikId',this._url.PostavchikId)

    const httpOptions = { headers }
    return this._http.get<Product>(this._url.Url, httpOptions).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((f: any) => {
        //  console.log(JSON.stringify(data))
        return <Product><unknown>{
          id: f.id,
          guid: f.guid,
          img_guids: undefined,
          name: f.name,
          description: f.description,

          cost_total: undefined,
          price: f.price,
          markup: f.markup,

          inStock: undefined,
          sale: f.sale,

          katalogId: f.katalogId,
          katalogName: undefined,

          colorId: f.colorId,
          colorName: this.Color().length>0?this.Color().find(d=>d.id===f.colorId)?.name:undefined,
         // colorName:this.sharedVar.ColorNs.length>0?this.sharedVar.ColorNs.find(d=>d.id===f.articleId)?.name:undefined,
          brandId: f.brandId,
          brandName:  this.Brand().length>0?this.Brand().find(d=>d.id===f.brandId)?.name:undefined,

          articleId: f.articleId,
          articleName: this.Article().length>0?this.Article().find(d=>d.id===f.articleId)?.name:undefined,

          hidden: f.hidden,

          postavchikId: f.postavchikId
        };

      })
      ,tap(
        x => console.log(x)
      )
    );
  };

  ///  for: nomenclatureItem  ___________________

  private Article$ = (): void => {
    this._url.Controller = 'ArticleN';
    this._url.Action = 'getPostavchik';
    const postavchikId = 1; //this.url.PostavchikId;
    this._url.ID = postavchikId;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + this._token.AccessToken,
    });


     this._http.get<Article[]>(this._url.Url, { headers })
     .pipe(
      tap((data) => this.Article.set(data)),
      takeUntilDestroyed(),
      catchError(() => of([] as Article[])) //  on any error, just return an empty array
    )
    .subscribe();
     ;
  };

  private Brand$ = (): void => {
    this._url.Controller = 'BrandN';
    this._url.Action = 'getPostavchik';
    const postavchikId = 1; //this.url.PostavchikId;
    this._url.ID = postavchikId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + this._token.AccessToken,
    });


    this._http.get<Brand[]>(this._url.Url, { headers })
    .pipe(
      tap((data) => this.Brand.set(data)),
      takeUntilDestroyed(),
      catchError(() => of([] as Brand[])) //  on any error, just return an empty array
    )
    .subscribe();
     
  };

  private Color$ = ():void => {
    this._url.Controller = 'ColorN';
    this._url.Action = 'getPostavchik';
    const postavchikId = 1; //this.url.PostavchikId;
    this._url.ID = postavchikId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      // Authorization: 'Bearer ' + this._token.AccessToken,
    });


     this._http.get<Color[]>(this._url.Url, { headers })
     .pipe(
      tap((data) => this.Color.set(data)),
      takeUntilDestroyed(),
      catchError(() => of([] as Color[])) //  on any error, just return an empty array
    )
    .subscribe();;
  };
}
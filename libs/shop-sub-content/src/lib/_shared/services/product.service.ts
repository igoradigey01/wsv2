import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map,tap } from 'rxjs/operators';

import { ApiService } from '@wsv2/app-config';
import { Product,Article,Brand,Color } from "@wsv2/app-common"

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private _http: HttpClient,
    private _url: ApiService
  ) { }



  public Poducts = (idKatlaog: number): Observable<Product[]> => {
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


  public Nomenclature = (idNomenclature: number): Observable<Product> => {
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'Item';
    this._url.ID = idNomenclature;


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
          colorName: undefined,

          brandId: f.brandId,
          brandName: undefined,

          articleId: f.articleId,
          articleName: undefined,

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

  public Article = (): Observable<Article[]> => {
    this._url.Controller = 'ArticleN';
    this._url.Action = 'getPostavchik';
    const postavchikId = 1; //this.url.PostavchikId;
    this._url.ID = postavchikId;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + this._token.AccessToken,
    });


    return this._http.get<Article[]>(this._url.Url, { headers });
  };


  public Brand = (): Observable<Brand[]> => {
    this._url.Controller = 'BrandN';
    this._url.Action = 'getPostavchik';
    const postavchikId = 1; //this.url.PostavchikId;
    this._url.ID = postavchikId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + this._token.AccessToken,
    });


    return this._http.get<Brand[]>(this._url.Url, { headers });
  };

  public Color = (): Observable<Color[]> => {
    this._url.Controller = 'ColorN';
    this._url.Action = 'getPostavchik';
    const postavchikId = 1; //this.url.PostavchikId;
    this._url.ID = postavchikId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      // Authorization: 'Bearer ' + this._token.AccessToken,
    });


    return this._http.get<Color[]>(this._url.Url, { headers });
  };
}
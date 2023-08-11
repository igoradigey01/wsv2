import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoriaN} from '../../../_shared/_interfaces/categoria-n.model';
import { RouteApiService } from 'src/app/_shared/services/route-api.service';
import { Color } from 'src/app/_shared/_interfaces/color.model';
import { Brand } from 'src/app/_shared/_interfaces/brand.model';
import { Article } from 'src/app/_shared/_interfaces/article.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaNService {
  constructor(
    private _http: HttpClient,
    private url: RouteApiService,
    private _url: RouteApiService
  ) {
   // url.Controller = 'Katalog';
   // console.log("test -- Katalog Servises - init ok")
  }

  public CategoriaNs = (): Observable<CategoriaN[]> => {
    this.url.Controller = 'CategoriaN';
    this.url.Action = 'GetPostavchik';
    this.url.ID=this.url.PostavchikId;
    let headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });

    return this._http.get<CategoriaN[]>(this.url.Url, { headers });
  };

  public ArticleNs = (): Observable<Article[]> => {
    this._url.Controller = 'ArticleN';
    this._url.Action = 'getPostavchik';
    this._url.ID=this._url.PostavchikId;

    let headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
     //  Authorization: 'Bearer ' + this._token.AccessToken,
    });


    return this._http.get<Article[]>(this._url.Url, { headers });
  };


  public BrandNs = (): Observable<Brand[]> => {
    this._url.Controller = 'BrandN';
    this._url.Action = 'getPostavchik';
    this._url.ID=this._url.PostavchikId;
    let headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
     //  Authorization: 'Bearer ' + this._token.AccessToken,
    });


    return this._http.get<Brand[]>(this._url.Url, { headers });
  };

  public ColorNs = (): Observable<Color[]> => {
    this._url.Controller = 'ColorN';
    this._url.Action = 'getPostavchik';
    this._url.ID=this._url.PostavchikId;

    let headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      // Authorization: 'Bearer ' + this._token.AccessToken,
    });


    return this._http.get<Color[]>(this._url.Url, { headers });
  };
}

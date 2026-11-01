import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import type { HttpEvent } from '@angular/common/http';
import { Nomenclature} from '@wsv2/xf-shared';
import { KatalogN } from '@wsv2/xf-shared';
import { Article } from '@wsv2/xf-shared';
import {Brand} from '@wsv2/xf-shared'
import {Color} from '@wsv2/xf-shared'
import { HttpClient, HttpHeaders,  HttpParams } from '@angular/common/http';

import { ManagerServiceModule } from './maneger-service.module';
import{CategoriaNService} from './categoria-n.service'
import { KatalogNService} from './katalog-n.service';
import {ArticleNService} from './article-n.service';
import {BrandNService} from './brand-n.service';
import {ColorNService} from './color-n.service'
import { RouteApiService } from '@wsv2/xf-shared';
import { TokenService } from '@wsv2/xf-shared';
import { CategoriaN } from '@wsv2/xf-shared';
import {PriceN} from './../_interfaces/price-n.model'

enum FlagSendData {
  all,
  date,
  img,
}

@Injectable({
  providedIn: ManagerServiceModule,
})
export class NomenclatureService {


  _nameKatalog = '';
  //readonly _url:string="Type";

  get WWWroot(): string {
    // return this.http.get(src,{responseType: 'blob'});

    return this._url.WWWroot; //environment.serverRoot + 'images/';
  }

  constructor(
    private _http: HttpClient,

    private _katalogNServise: KatalogNService,
    private _articleNServise:ArticleNService,
    private _barandNServise:BrandNService,
    private _colorNsevise:ColorNService,
    private _categoriaNServise:CategoriaNService,

    private _token: TokenService,
    private _url: RouteApiService
  ) {}




  public ArticleNs = (): Observable<Article[]> => {

    return this._articleNServise.ArticleNs();
  };

  public BrandNs = (): Observable<Brand[]> => {

    return this._barandNServise.BrandNs();
  };

  public ColorNs = (): Observable<Color[]> => {

    return this._colorNsevise.ColorNs();
  };

  public CategoriaNs = (): Observable<CategoriaN[]> => {

    return this._categoriaNServise.CategoriaNs();
  };

  public KatalogNs = (idCategoria:number): Observable<KatalogN[]> => {
    return this._katalogNServise.KatalogNs(idCategoria);
  };

  /**Postavchik + Katalog get Nomenclature*/
  public NomenclaturePKs = (idKatlaog:number): Observable<Nomenclature[]> => {
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'NomenclaturePKs';
    this._url.ID=idKatlaog;


    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });
    const params:HttpParams=new HttpParams().set('postavchikId',this._url.PostavchikId)

    const httpOptions={headers,params}
    return this._http.get<Nomenclature[]>(this._url.Url, httpOptions) .pipe(
      map((data) => {
        //  console.log(JSON.stringify(data))
        return data.map((f) => {
          return <Nomenclature>{
            id:f.id,
            articleId:f. articleId,
            brandId:f.brandId,
            colorId:f.colorId,
            description:f.description,
            guid:f.guid,
            hidden:f.hidden,
            inStock:f.inStock,
            sale:f.sale,
            katalogId:f.katalogId,
            markup:f.markup,
            postavchikId:f.postavchikId,
            name:f.name,
            position:f.position,
            price:f.price,

            wwwroot: this._url.WWWroot,
          };
        });
      })
    );
  };


         /**data.map((f: any)*/
   /*  this._http.get<Product[]>(url, { headers }).pipe(
      map((data) => {
        //  console.log(JSON.stringify(data))
        return data.map((f) => {
          return <Product>{
            id: f.id,
            name: f.name,
            katalogId: f.katalogId,
            katalogName: nameKatalog,
            materialId: f.typeProductId,
            price: f.price,
            markup: f.markup,
            description: f.description,
            //            -------------
            imgName: f.image,
            rootImgSrc: this._url.RootImage,
          };
        });
      })
    ); */


   /**pastavchik get Nomenclature */
  public NomenclaturePs = (): Observable<Nomenclature[]> => {
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'NomenclaturePs';
    this._url.ID=this._url.PostavchikId;
   // debugger
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });
    return this._http.get<Nomenclature[]>(this._url.Url, { headers })
    .pipe(
      map((data) => {
        //  console.log(JSON.stringify(data))
        return data.map((f) => {
          return <Nomenclature>{
            id:f.id,
            articleId:f. articleId,
            brandId:f.brandId,
            colorId:f.colorId,
            description:f.description,
            guid:f.guid,
            hidden:f.hidden,
            inStock:f.inStokc,
            sale:f.sale,
            katalogId:f.katalogId,
            markup:f.markup,
            postavchikId:f.postavchikId,
            name:f.name,
            position:f.position,
            price:f.price,

            wwwroot: this._url.WWWroot,
          };
        });
      })
    );
  };

  //---------------
  public Create = (item: Nomenclature): Observable<HttpEvent<unknown>> => {
    // debugger
    // throw new Error('not implemint exeption');
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'Create'; //Post
    this._url.ID=null;
    item.postavchikId=this._url.PostavchikId;
    // debugger
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });

    const fd = this.createFormData(item,FlagSendData.all);

    //!!!!!!--  new Response(fd).text().then(console.log);--!!!!!!!!!!!!
    return this._http.post(this._url.Url, fd, {
      reportProgress: true,
      observe: 'events',
      headers,
    })


    // return this._http.post(this._url.Url, fd, { headers },);
  };



  //--------------
  public UpdateAll = (item: Nomenclature): Observable<HttpEvent<unknown>> => {
    // debugger
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'UpdateAll';
    this._url.ID=item.id;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });

    const fd = this.createFormData(item,FlagSendData.all);

  //!!!!  new Response(fd).text().then(console.log);

    return this._http.put(this._url.Url , fd, {
      reportProgress: true,
      observe: 'events',
      headers,
    });
  };

  public UpdatePrice=(items:PriceN[]):Observable<unknown> =>{

      // debugger
      this._url.Controller = 'Nomenclature';
      this._url.Action = 'UpdateDataPrice';
      this._url.ID=null;
      const headers: HttpHeaders = new HttpHeaders({
        Accept: 'application/json',
        Authorization: 'Bearer ' + this._token.AccessToken,
      });

          //  var body=JSON.stringify(items);
         //   console.log(body);
     // let fd = this.createFormData(item,FlagSendData.all);

    //!!!!  new Response(fd).text().then(console.log);

      return this._http.put(this._url.Url , items,{headers});

  }

  public UpdateOnlyImg = (item: Nomenclature): Observable<HttpEvent<unknown>> => {
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'UpdateOnlyImg';
    this._url.ID=null;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });

    const fd = this.createFormData(item,FlagSendData.img);

   new Response(fd).text().then(console.log);

    return this._http.put(this._url.Url + '/' + item.guid, fd, {
      reportProgress: true,
      observe: 'events',
      headers,
    });
  };

  public UpdateIgnoreImg = (item: Nomenclature): Observable<HttpEvent<unknown>> => {
    this._url.Controller = 'Nomenclature';
    this._url.Action = 'UpdateIgnoreImg';
    this._url.ID=item.id;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });
     //   debugger
    const fd = this.createFormData(item,FlagSendData.date);

   // !!! new Response(fd).text().then(console.log);

    return this._http.put(this._url.Url, fd, {
      reportProgress: true,
      observe: 'events',
      headers,
    });
  };
  //--------------------------
  public Delete = (id: number): Observable<HttpEvent<unknown>> => {
    this._url.Controller = 'product';
    this._url.Action = 'Delete';

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });
    return this._http.delete(this._url.Url + '/' + id, {
      reportProgress: true,
      observe: 'events',
      headers,
    });
  };

  public GetFileFromImageController = (name: string): Observable<Blob> => {
    this._url.Controller = 'image';
    this._url.Action = '';
    // return this.http.get(src,{responseType: 'blob'});

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      //  Authorization: 'Bearer ' + token,
    });

    const url: string = this._url.Url + '/' + name;

    return this._http.get<Blob>(url, {
      headers,
      responseType: 'blob' as 'json',
    });
    // return this.http.get<Blob>(url, { headers });
  };

  private createFormData(item: Nomenclature, flag: FlagSendData): FormData {
   const formData = new FormData();

    const entries = Object.entries(item);
    if (flag == FlagSendData.all) {
      // debugger
      entries.forEach(([key, value]) => {
        //  if (key == 'katalogName') return;
       // if (key == 'katalogName') return;-- используется на сервере !!!!!
        if (key == 'categoriaName') return;
        if (key == 'materialName') return;
        // if (key == 'imgName') return;
        if (key == 'rootImgSrc') return;
        if (key == 'imageBase64') return;
        if (key == 'imageWebp') {
          const f = value as File;
          formData.append('file', f, f.name);
          return;
        }

        formData.append(key, value);
        // console.log(`${key}: ${value}`)
      });

      return formData;
    }
    if (flag === FlagSendData.date) {
      entries.forEach(([key, value]) => {
        //  if (key == 'katalogName') return;-- используется на сервере !!!!!
       // if (key == 'categoriaName') return;

        if (key == 'rootImgSrc') return;
        if (key == 'imageBase64') return;
        if (key == 'imageWebp') return;

        formData.append(key, value);
        // console.log(`${key}: ${value}`)
      });

      return formData;
    }

    if (flag === FlagSendData.img) {
      entries.forEach(([key, value]) => {

        if(key=='id'){
          formData.append(key,value);
          return;
        }


        if(key=='guid'){

          formData.append(key, value);
          return;

        }

        if (key == 'imageWebp') {
          const f = value as File;
          formData.append('file', f, f.name);
          return;
        }
      });

    }
    return formData;
  }
}

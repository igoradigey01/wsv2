import { Injectable } from '@angular/core';
import type { HttpEvent } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { environment } from 'apps/xf01/src/environments/environment';
import { ManagerServiceModule } from './maneger-service.module';
import {Color} from '@wsv2/xf-shared';
import { Observable } from 'rxjs';
import {TokenService} from '@wsv2/xf-shared';
import { RouteApiService } from '@wsv2/xf-shared';

@Injectable({
  providedIn: ManagerServiceModule
})
export class ColorNService {




  constructor(
    private _http: HttpClient,
    private _token:TokenService,
    private _url: RouteApiService
    ) {

    }



  public ColorNs = (): Observable<Color[]> => {
    this._url.Controller = 'ColorN';
    this._url.Action = 'getPostavchik';
    this._url.ID=this._url.PostavchikId;

    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
       Authorization: 'Bearer ' + this._token.AccessToken,
    });


    return this._http.get<Color[]>(this._url.Url, { headers });
  };



  //------------------------------------------------

  public Create = (item:Color): Observable<HttpEvent<unknown>> => {
     //  debugger
    this._url.Controller = 'ColorN';
    this._url.Action = 'Create';
    this._url.ID=null;
    item.postavchikId=this._url.PostavchikId;
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });

    const fd = this.createFormData(item);

   // new Response(fd).text().then(console.log);

    return this._http.post(this._url.Url, fd,{
      reportProgress: true,
      observe: 'events',
      headers,
    });
  }

  //-----------------------------------

  public Update = (item: Color): Observable<HttpEvent<unknown>> => {
   // throw new Error("not implemint exeption");
   this._url.Controller = 'ColorN';
   this._url.Action = 'Update';
   this._url.ID=item.id;
   item.postavchikId=this._url.PostavchikId;
 //  debugger
    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });
    const fd = this.createFormData(item);

   // new Response(fd).text().then(console.log);
    return this._http.put(this._url.Url, fd,{
      reportProgress: true,
      observe: 'events',
      headers,
    });
  }
  //-------------------

  public Delete = (id: number): Observable<HttpEvent<unknown>> => {
    this._url.Controller = 'Color';
    this._url.Action = 'delete';
    this._url.ID=id;


    const headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });
  // let url: string = this._url.Url+'/'+id;
    return this._http.delete(this._url.Url,{
      reportProgress: true,
      observe: 'events',
      headers,
    });
  }


  private createFormData(item: Color ): FormData {
    const formData = new FormData();

    const entries = Object.entries(item);

      // debugger
      entries.forEach(([key, value]) => {
         // if (key == 'products') return;

       /*  if (key == 'imageWebp') {
          let f = value as File;
          formData.append('file', f, f.name);
          return;
        } */

        formData.append(key, value);

      });




    return formData;
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { environment } from 'apps/xf01/src/environments/environment';
import { ManagerServiceModule } from './maneger-service.module';
import {Color} from 'apps/xf01/src/app/_shared/_interfaces/color.model';
import { Observable } from 'rxjs';
import {TokenService} from 'apps/xf01/src/app/_shared/services/token.service';
import { RouteApiService } from 'apps/xf01/src/app/_shared/services/route-api.service';

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

    let headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
       Authorization: 'Bearer ' + this._token.AccessToken,
    });


    return this._http.get<Color[]>(this._url.Url, { headers });
  };



  //------------------------------------------------

  public Create = (item:Color): Observable<any> => {
     //  debugger
    this._url.Controller = 'ColorN';
    this._url.Action = 'Create';
    this._url.ID=null;
    item.postavchikId=this._url.PostavchikId;
    let headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });

    let fd = this.createFormData(item);

   // new Response(fd).text().then(console.log);

    return this._http.post(this._url.Url, fd,{
      reportProgress: true,
      observe: 'events',
      headers,
    });
  }

  //-----------------------------------

  public Update = (item: Color): Observable<any> => {
   // throw new Error("not implemint exeption");
   this._url.Controller = 'ColorN';
   this._url.Action = 'Update';
   this._url.ID=item.id;
   item.postavchikId=this._url.PostavchikId;
 //  debugger
    let headers: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      Authorization: 'Bearer ' + this._token.AccessToken,
    });
    let fd = this.createFormData(item);

   // new Response(fd).text().then(console.log);
    return this._http.put(this._url.Url, fd,{
      reportProgress: true,
      observe: 'events',
      headers,
    });
  }
  //-------------------

  public Delete = (id: number): Observable<any> => {
    this._url.Controller = 'Color';
    this._url.Action = 'delete';
    this._url.ID=id;


    let headers: HttpHeaders = new HttpHeaders({
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
    let formData = new FormData();

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

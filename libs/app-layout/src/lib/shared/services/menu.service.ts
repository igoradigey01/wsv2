import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ManagerServiceModule } from './maneger-service.module';


// ------ !!!! -old relize menyItems repozitory -!!!!!!!---

// json https://www.angularjswiki.com/angular/how-to-read-local-json-files-in-angular/
@Injectable({
  providedIn: ManagerServiceModule
})
export class MenuService {
  
  private var_menu: string = 'menu_json';

  constructor(private _http: HttpClient) {
    // url.Controller = 'Katalog';
    // console.log("test -- Katalog Servises - init ok")
  }

  public setMenuFromJSON(jsonMenuURL: string) {
    if (!this.Exists) {
      fetch(jsonMenuURL)
        .then((res) => res.json())
        .then((jsonData) => {
          //this._menuItems =

          sessionStorage.setItem(this.var_menu, JSON.stringify(jsonData));
        });
    }
  }

  public getMenuItems() {
    let obj = sessionStorage.getItem(this.var_menu);
    if (obj) return JSON.parse(obj);
    else return null;
  }

  private get Exists(): boolean {
    let obj = sessionStorage.getItem(this.var_menu);
    // debugger
    if (obj) {
      return true;
    }
    return false;
  }
}

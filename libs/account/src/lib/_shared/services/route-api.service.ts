import { Injectable } from '@angular/core';
import { environment } from 'apps/xl01/src/environments/environment';
import {ManagerServiceModule} from './maneger-service.module'

@Injectable({
  providedIn:  ManagerServiceModule ,
})
export class RouteApiService {
  private _serverAuthority: string | undefined;
  private _controller: string = '';
  private _action: string | null = null;
  private _id: number | null = null;
  private _postavchikId: number | undefined;
  private _clientRootUrl:string='';

  constructor() {
    this._postavchikId = +environment.postavchikId;
    this._serverAuthority = environment.serverAuthority;
    this._clientRootUrl=environment.clientRoot;
  }

  public set Controller(name: string) {
    this._controller = name;
  }

  public set Action(name: string | null) {
    this._action = name;
  }

  public set ID(id: number | null) {
    this._id = id;
  }

  public get PostavchikId(): number {
    if (this._postavchikId) return this._postavchikId;
    else return -1;
  }
  
  public get ClientRootUrl():string{
    return this._clientRootUrl;
  }
  public get Url(): string {
    if (this._serverAuthority)
      return this.createCompleteRoute(
        this._serverAuthority,
        this._controller,
        this._action,
        this._id
      );
    else throw new Error(' environment serverRoot -undefined'); //return 'undefined';
  }

  

  private createCompleteRoute = (
    envAddress: string,
    controller: string,
    action: string | null,
    id: number | null
  ) => {
    //debugger;
    if (id) return `${envAddress}api/${controller}/${action}/${id}`;
    if (action) return `${envAddress}api/${controller}/${action}`;
   // debugger;
    return `${envAddress}api/${controller}`;
  };
}

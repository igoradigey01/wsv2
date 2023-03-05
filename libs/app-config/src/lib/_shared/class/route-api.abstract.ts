

import { IEnvironment } from '../interfaces/environment.model';






export abstract class RouteApiAbstract {
  private _serverAuthority: string | undefined;
  private _serverRoot:string|undefined;
  private _controller: string = '';
  private _action: string | null = null;
  private _id: number | null = null;
  private _postavchikId: number | undefined;
  private _clientRootUrl:string='';

  constructor(
    private appConfig: IEnvironment
  ) {
    this._postavchikId = +appConfig.postavchikId;
    this._serverAuthority = appConfig.serverAuthority;
    this._clientRootUrl= appConfig.clientRoot;
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

  public get ServerRoot():string{
    if(this._serverRoot)
    return this._serverRoot;
    else throw new Error(' Environment : serverRoot -undefined'); //return 'undefined';

  }
  
  public get ClientRoot():string{
    return this._clientRootUrl;
  }
  public get Url(): string {
    //debugger
    if (this._serverRoot)
      return this.createCompleteRoute(
        this._serverRoot,
        this._controller,
        this._action,
        this._id
      );
    else throw new Error(' Environment : serverRoot -undefined'); //return 'undefined';
  }
  public get UrlAuth(): string {
    debugger
    if (this._serverAuthority)
      return this.createCompleteRoute(
        this._serverAuthority,
        this._controller,
        this._action,
        this._id
      );
    else throw new Error(' Environment : serverAuthority -undefined'); //return 'undefined';
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

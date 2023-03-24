import { IEnvironment } from '../interfaces/environment.model';


export abstract class RouteApiAbstract {
  private _serverAuthority: string | undefined;
  private _serverUri:string|undefined;
  private _controller: string = '';
  private _action: string | null = null;
  private _id: number | null = null;
  private _clientId: string | undefined;
  private _clientUrl:string  | undefined;
  private _postavchikIds:string[] |undefined;

  constructor(
    private appConfig: IEnvironment
  ) {
    this._clientId = appConfig.clientId;
    this._serverAuthority = appConfig.serverAuthUri;
    this._clientUrl= appConfig.clientUri;
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

  public get ClientId(): string {
    if (this._clientId) return this._clientId;
    else throw new Error(' Environment :clientId -undefined'); //return 'undefined';
  }

  public get VkId():string{
    if(this.appConfig.vkId) return this.appConfig.vkId;
    else throw new Error(' Environment :VkId -undefined'); //return 'undefined';
  }

  public get PostavchikIds():string[] {
    if(this._postavchikIds) return this._postavchikIds
    else throw new Error(' Environment : postavchikIds - undefined')

  }
     /** sample: https://s.x-01.ru */
  public get ServerUri():string{
    if(this._serverUri)
    return this._serverUri;
    else throw new Error(' Environment : serverUri -undefined'); //return 'undefined';

  }
  /** sample: http://x-01.ru */
  public get ClientUri():string{

    if(this._clientUrl)
    return this._clientUrl;
    else throw new Error(' Environment : clientUri -undefined'); //return 'undefined';
    
  }
  public get Url(): string {
    //debugger
    if (this._serverUri)
      return this.createCompleteRoute(
        this._serverUri,
        this._controller,
        this._action,
        this._id
      );
    else throw new Error(' Environment : serverUri -undefined'); //return 'undefined';
  }
  public get AuthUrl(): string {
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

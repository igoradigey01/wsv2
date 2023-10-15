
import { Injectable } from '@angular/core';
  //APP_CONFIG ,IEnvironment ,
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RouteApiAbstract,} from '../class/route-api.abstract';
import {EnvironmentService} from './environment.service';
import {UserManagerService} from '@wsv2/account-service'




@Injectable({
  providedIn: 'root' ,
})

export class ApiService extends RouteApiAbstract {
 

  constructor(
     appConfig:EnvironmentService,
     private repositoryUser:UserManagerService

     
    //@Inject(APP_CONFIG) appConfig: IEnvironment //05.04.23 init() inject in APP_INITIALIZER
  ) {
    super(appConfig)
  }

  public get AccessToken(): string | null {
    return this.repositoryUser.AccessToken;
  }

   /**get Refresh Token */
   public get RefreshToken(): string | null {
    return this.repositoryUser.RefreshToken;
  }

 
}

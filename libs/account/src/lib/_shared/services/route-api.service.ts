
import { Injectable,Inject } from '@angular/core';
import { APP_CONFIG ,IEnvironment ,RouteApiAbstract} from '@wsv2/app-config';
import {ManagerServiceModule} from './maneger-service.module'



@Injectable({
  providedIn:  ManagerServiceModule ,
})

export class ApiService extends RouteApiAbstract {
 

  constructor(
    @Inject(APP_CONFIG) appConfig: IEnvironment
  ) {
    super(appConfig)
  }

 
}


import { Injectable,Inject } from '@angular/core';
  //APP_CONFIG ,IEnvironment ,
import { RouteApiAbstract,EnvironmentService} from '@wsv2/app-config';
import {ManagerServiceModule} from './maneger-service.module'




@Injectable({
  providedIn:  ManagerServiceModule ,
})

export class ApiService extends RouteApiAbstract {
 

  constructor(
     appConfig:EnvironmentService
     
    //@Inject(APP_CONFIG) appConfig: IEnvironment //05.04.23 init() inject in APP_INITIALIZER
  ) {
    super(appConfig)
  }

 
}

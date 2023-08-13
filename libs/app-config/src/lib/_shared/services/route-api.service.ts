
import { Injectable } from '@angular/core';
  //APP_CONFIG ,IEnvironment ,
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RouteApiAbstract,} from '../class/route-api.abstract';
import {EnvironmentService} from './environment.service'




@Injectable({
  providedIn: 'root' ,
})

export class ApiService extends RouteApiAbstract {
 

  constructor(
     appConfig:EnvironmentService
     
    //@Inject(APP_CONFIG) appConfig: IEnvironment //05.04.23 init() inject in APP_INITIALIZER
  ) {
    super(appConfig)
  }

 
}

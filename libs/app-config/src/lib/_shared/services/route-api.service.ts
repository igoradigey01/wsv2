
import { Injectable } from '@angular/core';
  //APP_CONFIG ,IEnvironment ,
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RouteApiAbstract,EnvironmentService} from '@wsv2/app-config';




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

import { Injectable } from '@angular/core';
import {IEnvironment} from '../interfaces/environment.model'

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService implements IEnvironment {

  
    clientUri='http://localhost:4200/'; //  Host client
    serverUri = 'http://localhost:8080/'; // Host api               //
    serverAuthUri='http://localhost:8080/'; // Host identity server          //
    clientId=''; // spaId ='xl-01';
    postavchikIds: string[]=['xl-01']; //xf-01,xl-01,shagen01
    vkId='';
    version ='b3.22.23'; // 'b2.05.22',
    description="Client shopApi- третья редакция (angular:15.1.0)(22.03.23)"; //"Client shop- вторая редакция (angular:13.1.2)(11.05.22)"
  

}
import { Injectable } from '@angular/core';
import {IEnvironment} from '../interfaces/environment.model'

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService implements IEnvironment {

  
    clientUri: string='http://localhost:4200/'; //  Host client
    serverUri: string = 'http://localhost:8080/'; // Host api               //
    serverAuthUri: string='http://localhost:8080/'; // Host identity server          //
    clientId: string =''; //xf-01.ru='1'
    postavchikIds: string[]=['xl-01']; //xf-01,xl-01,shagen01
    vkId:string='';
    version: string ='b3.22.23'; // 'b2.05.22',
    description: string="Client shopApi- третья редакция (angular:15.1.0)(22.03.23)"; //"Client shop- вторая редакция (angular:13.1.2)(11.05.22)"
  

}
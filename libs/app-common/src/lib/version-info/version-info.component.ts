import { Component } from '@angular/core';


import {VersionInfoService} from '@wsv2/app-config'

@Component({
    selector: '@wsv2-version-info',
    templateUrl: './version-info.component.html',
    styleUrls: ['./version-info.component.scss'],
    imports: []
})
export class VersionInfoComponent {

  


  constructor(public _info:VersionInfoService) { 
 

 

}
}
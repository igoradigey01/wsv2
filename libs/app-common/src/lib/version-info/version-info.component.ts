import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {VersionInfoService} from '../_shared/services/version-info.service'

@Component({
  selector: '@wsv2-version-info',
  templateUrl: './version-info.component.html',
  styleUrls: ['./version-info.component.scss'],standalone: true,
  imports: [CommonModule],
})
export class VersionInfoComponent {

  


  constructor(public _info:VersionInfoService) { 
 

 

}
}

import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
//import {environment} from '../environments/environment'

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'wsv2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'xl-01';
  constructor() {
    // global var create for account lib
   // (<any>window).vkId = environment.vkId;
    
  }
  
}

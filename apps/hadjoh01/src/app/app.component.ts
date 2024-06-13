import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config'

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'wsv2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'hadjoh01';
  constructor(
    private repository:CompanyInformationService
  ) {
    
    // global var create for account lib
   // (<any>window).vkId = environment.vkId;
    
  }
  
}
  

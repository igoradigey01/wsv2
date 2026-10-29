import { RouterModule } from '@angular/router';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config'

@Component({
    imports: [RouterModule],
    selector: 'wsv2-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'x-01';
  constructor(
    private repository:CompanyInformationService
  ) {
    // global var create for account lib
  //  (<any>window).vkId = environment.vkId;
    
  }
  
}

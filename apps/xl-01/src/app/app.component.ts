
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config'
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
  constructor(
    private repository:CompanyInformationService
  ) {
    // global var create for account lib
   // (<any>window).vkId = environment.vkId;

   // global var create for yandex map in company-information lib
   // просто делаем старт загрузки CompanyInformationService 
   // если не зделать здесь то в  yandex map не сможет не расрабатывае нуженa rezolve data
   (<any>window).geoX=repository.yandex_point.x;
   //(<any>window).geoY=repository.yandex_point.y;
  }
  
}

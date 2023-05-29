import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CompanyInformationService} from '@wsv2/app-config'


@Component({
  standalone: true,
  imports: [ RouterModule],
  selector: 'wsv2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'presentation01';
  constructor(
    private repository:CompanyInformationService
  ) {
   
   // просто делаем старт загрузки CompanyInformationService 
   // если не зделать здесь то в  yandex map не сможет не расрабатывае нуженa rezolve data
   (<any>window).geoX=repository.yandex_point.x;
   //(<any>window).geoY=repository.yandex_point.y;
  }
}

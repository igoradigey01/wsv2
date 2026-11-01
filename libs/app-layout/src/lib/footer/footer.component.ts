import { Component, ChangeDetectionStrategy } from '@angular/core';
import {CompanyInformationService} from '@wsv2/app-config'

@Component({
    selector: 'wsv2-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FooterComponent {

  company_activities ='';  //  'ЛДСП && МДФ Ханская';  //виды деятельности компании
  company_time_create= '';  //год создания   new Date(2022,8,14).getFullYear();
  company_copyright=  '';    //" ИП Дячук "; //авторские права

  constructor(
    private repository:CompanyInformationService
  ) {
    this.company_activities=repository.company_activities;
    this.company_time_create=repository.company_time_create;
    this.company_copyright=repository.company_copyright;
  }

}

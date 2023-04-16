import { Component, OnInit } from '@angular/core';
import {CompanyInformationService,EnvironmentService} from '@wsv2/app-config'

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {


  public  Operator: string ;//'XL-01';

  public  Act: string =
    ' Федеральный закон от 30.12.2020 № 519-ФЗ <<О внесении изменений в Федеральный закон <<О персональных данных>>   >>';

  public  Web_Site: string ;// 'XL-01.ru';

  public  Email: string ;

  public  Link_Policy: string ; //this.Web_Site + '/menu/privacy';
   

  constructor(

    private repositoryCompany:CompanyInformationService,
    private repositoryApi:EnvironmentService
  ) {

    if(repositoryCompany.company_email_for_privacy_police){
      this.Email=repositoryCompany.company_email_for_privacy_police;
    }else{
      this.Email='admin@x-01.ru'
    }
    this.Web_Site=repositoryApi.clientUri;
    this.Link_Policy= this.Web_Site + '/menu/privacy';
    this.Operator=repositoryCompany.company_name;

  }

  ngOnInit(): void {

  }
}

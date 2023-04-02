import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {


  public  Operator: string = 'XL-01';

  public  Act: string =
    ' Федеральный закон от 30.12.2020 № 519-ФЗ <<О внесении изменений в Федеральный закон <<О персональных данных>>   >>';

  public  Web_Site: string = 'XL-01.ru';

  public  Email: string = 'admin@xl-01.ru';

  public  Link_Policy: string =
    this.Web_Site + '/menu/privacy';

  constructor() {}

  ngOnInit(): void {

  }
}
